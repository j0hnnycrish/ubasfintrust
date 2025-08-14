import request from 'supertest';
import express from 'express';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { AuthMiddleware } from '../middleware/auth';

// Mock notifications to no-op
jest.mock('../services/notificationService', () => ({
  notificationService: { sendNotification: jest.fn().mockResolvedValue({ success: true }) }
}));

// In-memory fake DB store and minimal query builder
type Row = Record<string, any>;
// Use var to avoid TDZ with jest.mock hoisting
var dbStore: { users: Row[]; kyc_applications: Row[]; kyc_documents: Row[] };

function matchesWhere(row: Row, where: Row) {
  return Object.keys(where).every(k => row[k] === where[k]);
}

function tableApi(table: keyof typeof dbStore) {
  let _where: Row | undefined;
  let _orderBy: [string, 'asc' | 'desc'] | undefined;
  return {
    where(whereObj: Row) { _where = whereObj; return this; },
    orderBy(col: string, dir: 'asc' | 'desc') { _orderBy = [col, dir]; return this; },
    join() { return this; }, // not used in tests
    first(): Promise<Row | undefined> {
      const rows = _where ? dbStore[table].filter(r => matchesWhere(r, _where!)) : dbStore[table];
      const sorted = _orderBy ? rows.slice().sort((a, b) => {
        const av = a[_orderBy![0]]; const bv = b[_orderBy![0]];
        return (_orderBy![1] === 'desc' ? (bv as any) - (av as any) : (av as any) - (bv as any));
      }) : rows;
      return Promise.resolve(sorted[0]);
    },
    select<T = Row[]>(..._cols: string[]): Promise<T> {
      let rows = _where ? dbStore[table].filter(r => matchesWhere(r, _where!)) : dbStore[table];
      return Promise.resolve(rows as unknown as T);
    },
    insert(obj: Row | Row[]): Promise<void> {
      const arr = Array.isArray(obj) ? obj : [obj];
      dbStore[table].push(...arr);
      return Promise.resolve();
    },
    update(_obj: Row): Promise<void> { return Promise.resolve(); },
    raw(): Promise<void> { return Promise.resolve(); }
  } as any;
}

jest.mock('../config/db', () => {
  // Initialize lazily to avoid TDZ
  if (!dbStore) {
    dbStore = { users: [], kyc_applications: [], kyc_documents: [] };
  }
  return {
    db: ((name: keyof typeof dbStore) => tableApi(name)) as any,
    __store: dbStore
  };
});

// Import after mocks
import kycRouter from '../routes/kyc';
import { v4 as uuidv4 } from 'uuid';

describe('KYC routes (upload/read)', () => {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use('/kyc', kycRouter);

  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'kyc-test-'));
  const UPLOAD_PATH = path.join(tempDir, 'uploads');

  beforeAll(() => {
    // Set upload path to temp dir
    process.env.UPLOAD_PATH = UPLOAD_PATH;
    if (!fs.existsSync(UPLOAD_PATH)) fs.mkdirSync(UPLOAD_PATH, { recursive: true });

    // Seed a test user
    const userId = uuidv4();
  dbStore.users.push({ id: userId, email: 'u@test.com', is_active: true, account_type: 'customer', first_name: 'T', last_name: 'User' });

    // Bypass auth: inject req.user and call next
    jest.spyOn(AuthMiddleware, 'verifyToken').mockImplementation(async (req: any, _res: any, next: any) => {
      req.user = dbStore.users[0];
      next();
    });
  });

  afterAll(() => {
    try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch {}
  });

  it('submits KYC with a primaryId and then can read document locally', async () => {
    const buf = Buffer.from('hello');
    const res = await request(app)
      .post('/kyc/submit')
      .field('personal_firstName', 'Ada')
      .field('personal_lastName', 'Lovelace')
      .field('personal_dateOfBirth', '1990-01-01')
      .field('personal_nationality', 'GB')
      .field('address_street', '1 Main')
      .field('address_city', 'London')
      .field('address_state', 'LN')
      .field('address_country', 'GB')
      .field('employment_status', 'employed')
      .field('employment_monthlyIncome', '1000')
      .field('agreement_terms', 'true')
      .field('agreement_privacy', 'true')
      .attach('document_primaryId', buf, { filename: 'id.pdf', contentType: 'application/pdf' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.documentsUploaded).toBeGreaterThanOrEqual(1);

    // Find the inserted document
  const doc = dbStore.kyc_documents.find(d => d.document_type === 'primaryId');
    expect(doc).toBeTruthy();
    expect(fs.existsSync(doc!.file_path)).toBe(true);

    // Request the document, should stream local file
    const read = await request(app).get(`/kyc/document/${doc!.id}`);
    expect(read.status).toBe(200);
    expect(read.headers['content-type']).toBe(doc!.mime_type);
  });
});
