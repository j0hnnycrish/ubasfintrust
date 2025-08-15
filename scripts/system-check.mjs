#!/usr/bin/env node
/**
 * UBAS Financial Trust – System Integration Check
 * Sequential diagnostic script to exercise key backend features.
 *
 * Env Vars (optional):
 *  API_BASE (default http://localhost:5000/api/v1)
 *    Aliases: api_url, VITE_API_URL (first non-empty is used)
 *  ADMIN_EMAIL / ADMIN_PASSWORD (required for admin feature tests)
 *  TEST_RECIPIENT (email to receive test message for /admin/email/test)
 *  DIAGNOSTICS_TOKEN (if server requires x-diagnostics-token header)
 */

import axios from 'axios';
import crypto from 'crypto';
import FormData from 'form-data';
import fs from 'fs';
import os from 'os';
import path from 'path';

const API_BASE = process.env.API_BASE || process.env.api_url || process.env.VITE_API_URL || 'http://localhost:5000/api/v1';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || '';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';
const TEST_RECIPIENT = process.env.TEST_RECIPIENT || ADMIN_EMAIL;
const DIAG_TOKEN = process.env.DIAGNOSTICS_TOKEN;

// Axios instance
const api = axios.create({ baseURL: API_BASE, timeout: 20000 });
let accessToken = null;

function setAuth(token){ accessToken = token; api.defaults.headers.common['Authorization'] = `Bearer ${token}`; }

const results = []; // { step, ok, info, error, durationMs }
const scriptStart = Date.now();
const log = (step, ok, info, error, durationMs) => { const entry={ step, ok, info, error: error && (''+error).slice(0,500), durationMs }; results.push(entry); const tag = ok? '✅':'❌'; const dur = durationMs!=null? ` (${durationMs}ms)` : ''; console.log(`${tag} ${step}${dur}${info? ' – '+info:''}${error? ' – '+error:''}`); };

const BACKOFF_BASE_MS = parseInt(process.env.BACKOFF_BASE_MS || '700');
const RETRY_MAX = parseInt(process.env.RETRY_MAX || '2');

async function step(name, fn, { retries=RETRY_MAX, delayMs=BACKOFF_BASE_MS } = {}){
  let lastErr; const start = Date.now();
  for (let attempt=1; attempt<=retries; attempt++){
    try {
      const info = await fn();
      return log(name, true, typeof info==='string'? info : (info && JSON.stringify(info)), null, Date.now()-start);
    } catch(e){
      lastErr = e;
      if (attempt < retries) {
        const backoff = delayMs * Math.pow(2, attempt-1);
        await new Promise(r=>setTimeout(r, backoff));
        continue;
      }
      return log(name,false,null,e.response?.data?.message||e.message, Date.now()-start);
    }
  }
}

async function parallel(steps){
  await Promise.all(steps.map(s=> step(s.name, s.fn, s.options||{})));
}

(async()=>{
  console.log('--- UBAS System Check Starting ---');
  console.log('API_BASE:', API_BASE);

  await parallel([
    { name: 'Health Check /health', fn: async()=>{ const r = await axios.get(API_BASE.replace(/\/api\/v1$/,'')+'/health'); return r.data.status || 'ok'; }},
    { name: 'Diagnostics /_diagnostics', fn: async()=>{ const r = await api.get('/_diagnostics', { headers: DIAG_TOKEN ? { 'x-diagnostics-token': DIAG_TOKEN } : {} }); return { overall: r.data.data?.overall, db: r.data.data?.db, redis: r.data.data?.redis }; }}
  ]);

  if(!ADMIN_EMAIL || !ADMIN_PASSWORD){ log('Admin Credentials Provided', false, null, 'Set ADMIN_EMAIL & ADMIN_PASSWORD env to run admin tests'); return finish(); }

  await step('Admin Login', async()=>{ const r = await api.post('/auth/login', { email: ADMIN_EMAIL, password: ADMIN_PASSWORD }); if(!r.data.success) throw new Error(r.data.message); setAuth(r.data.data.accessToken); return r.data.data.user.accountType; });

  const userSuffix = crypto.randomBytes(3).toString('hex');
  const testUser = { email: `test_${userSuffix}@example.com`, password: 'TempPass#123', firstName: 'Test', lastName: 'User', phone:'+1000000'+Date.now().toString().slice(-6), dateOfBirth:'1990-01-01', accountType:'personal' };

  await step('Admin Create User', async()=>{ const r = await api.post('/admin/users', testUser); if(!r.data.success) throw new Error(r.data.message); testUser.id = r.data.data.userId; testUser.accountNumber = r.data.data.accountNumber; return testUser.id; });

  await step('List Users (page 1)', async()=>{ const r = await api.get('/admin/users',{ params:{ page:1, limit:5 }}); return { count: r.data.data.length, total: r.data.pagination?.total }; });

  let extraAccountId; await step('Create Extra Account', async()=>{ const r = await api.post(`/admin/users/${testUser.id}/accounts`, { accountType:'savings', currency:'USD', initialBalance:100 }); extraAccountId = r.data.data.accountId; return extraAccountId; });

  await step('List User Accounts', async()=>{ const r = await api.get(`/admin/users/${testUser.id}/accounts`); return { accounts: r.data.data.length }; });

  await step('Seed Transactions', async()=>{ const r = await api.post(`/admin/accounts/${extraAccountId}/transactions/seed`, { count: 5 }); return r.data.data; });

  await step('List Account Transactions', async()=>{ const r = await api.get(`/admin/accounts/${extraAccountId}/transactions`, { params: { page:1, limit:10 }}); return { tx: r.data.data.length }; });

  let grantId; await step('Grant Credit', async()=>{ const r = await api.post(`/admin/accounts/${extraAccountId}/grants`, { amount: 250, purpose: 'SystemTest', currency:'USD' }); grantId = r.data.data.grantId; return grantId; });

  await step('Templates List', async()=>{ const r = await api.get('/templates'); return { templates: r.data.data.length, cached: r.data.cached }; });

  await step('Provider Health', async()=>{ const r = await api.get('/templates/_health/providers'); return { email: !!r.data.data.email, smsProviders: r.data.data.sms?.length }; });

  // Simulate user KYC submit path (simplified: will likely 400 if duplicate) – we first register a fresh user directly as end user
  const endUserEmail = `enduser_${crypto.randomBytes(3).toString('hex')}@example.com`;
  let endUserAccess;
  await step('User Register (KYC Path)', async()=>{ const r = await api.post('/auth/register',{ email: endUserEmail, password:'UserPass#123', firstName:'End', lastName:'User', phone:'+1999'+Date.now().toString().slice(-6), dateOfBirth:'1992-02-02', accountType:'personal' }); return r.data.data.userId; });
  await step('User Login (KYC Path)', async()=>{ const r = await api.post('/auth/login',{ email: endUserEmail, password:'UserPass#123' }); if(!r.data.success) throw new Error(r.data.message); endUserAccess = r.data.data.accessToken; return 'ok'; });
  const userApi = axios.create({ baseURL: API_BASE, timeout: 20000, headers:{ Authorization: `Bearer ${endUserAccess}` }});
  await step('KYC Status (initial)', async()=>{ const r = await userApi.get('/kyc/status'); return r.data.data.status; });
  // Prepare minimal dummy files for KYC (text placeholders saved as .pdf)
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'kyc-')); const makeFile = (name)=>{ const p = path.join(tmpDir, name); fs.writeFileSync(p, 'DUMMY'); return p; };
  const kycFiles = {
    document_primaryId: makeFile('primaryId.pdf'),
    document_proofOfAddress: makeFile('proofOfAddress.pdf'),
    document_incomeProof: makeFile('incomeProof.pdf'),
    document_bankStatement: makeFile('bankStatement.pdf'),
    document_selfie: makeFile('selfie.pdf')
  };
  const kycForm = new FormData();
  kycForm.append('personal_firstName','End');
  kycForm.append('personal_lastName','User');
  kycForm.append('personal_dateOfBirth','1992-02-02');
  kycForm.append('personal_nationality','GLOBAL');
  kycForm.append('address_street','123 Test');
  kycForm.append('address_city','Metropolis');
  kycForm.append('address_state','State');
  kycForm.append('address_country','Country');
  kycForm.append('employment_status','employed');
  kycForm.append('employment_monthlyIncome','150000');
  kycForm.append('agreement_terms','true');
  kycForm.append('agreement_privacy','true');
  for (const key of Object.keys(kycFiles)) { kycForm.append(key, fs.createReadStream(kycFiles[key])); }
  await step('KYC Submit', async()=>{ const r = await userApi.post('/kyc/submit', kycForm, { headers: { ...kycForm.getHeaders() }}); return r.data.data.status; });
  await step('KYC Status (post-submit)', async()=>{ const r = await userApi.get('/kyc/status'); return r.data.data.status; });

  // Admin approves KYC
  await step('Admin Approve KYC (user)', async()=>{ const r = await api.patch(`/admin/users/${testUser.id}/kyc`, { status:'approved' }); return r.data.message; });
  await step('Admin Approve KYC (end user)', async()=>{ // fetch end user id via search
    const sr = await api.get('/admin/users', { params:{ search: endUserEmail, limit:1 }}); const target = sr.data.data[0]; if(!target) throw new Error('End user not found in admin list'); await api.patch(`/admin/users/${target.id}/kyc`, { status:'approved' }); return 'approved'; });
  await step('KYC Status (after admin approval)', async()=>{ const r = await userApi.get('/kyc/status'); return r.data.data.status; });

  // Loan apply again (should succeed now)
  let loanId;
  await step('Loan Apply (post-KYC)', async()=>{ const r = await userApi.post('/loans/apply',{ loanType:'personal', principalAmount:20000, termMonths:12, purpose:'System check loan', monthlyIncome:150000 }); loanId = r.data.data.loanId; return { loanId, status: r.data.data.status }; });
  // Admin approve loan
  await step('Admin Approve Loan', async()=>{ if(!loanId) throw new Error('No loanId'); await api.patch(`/admin/loans/${loanId}/status`, { status:'approved' }); return 'approved'; });
  // Refresh user loan list
  await step('User Loans List', async()=>{ const r = await userApi.get('/loans'); return { loans: r.data.data.length }; });
  // Create a payment account for end user (admin) with balance to pay loan
  let endUserId;
  await step('Lookup End User ID', async()=>{ const r = await api.get('/admin/users', { params:{ search: endUserEmail, limit:1 }}); if(!r.data.data[0]) throw new Error('End user missing'); endUserId = r.data.data[0].id; return endUserId; });
  let payAccountId;
  await step('Admin Create Loan Payment Account', async()=>{ const r = await api.post(`/admin/users/${endUserId}/accounts`, { accountType:'checking', currency:'USD', initialBalance:50000 }); payAccountId = r.data.data.accountId; return payAccountId; });
  // Seed transactions to raise available balance (already initialBalance set)
  await step('Loan Payment Attempt', async()=>{ const r = await userApi.post(`/loans/${loanId}/payment`, { amount: 5000, accountId: payAccountId }); return r.data.data.remainingBalance; });
  // Final remaining loan fetch
  await step('Loan Details Post-Payment', async()=>{ const r = await userApi.get(`/loans/${loanId}`); return { status: r.data.data.status, balance: r.data.data.outstanding_balance }; });

  // Clean temp files
  try { fs.rmSync(tmpDir, { recursive:true, force:true }); } catch {}

  if(TEST_RECIPIENT){ await step('Test Email Dispatch', async()=>{ const r = await api.post('/admin/email/test', { to: TEST_RECIPIENT, subject:'System Check', message:'Hello from automated system check.'}); return { provider: r.data.provider }; }); }

  await step('Diagnostics (Post Ops)', async()=>{ const r = await api.get('/_diagnostics'); return { db: r.data.data.db, redis: r.data.data.redis }; });

  finish();

  function finish(){
    console.log('\n--- SUMMARY ---');
  const totalDuration = Date.now() - scriptStart;
  const slow = [...results].sort((a,b)=>b.durationMs - a.durationMs).slice(0,5).map(r=>({ step:r.step, ms:r.durationMs }));
  const summary = { pass: results.filter(r=>r.ok).length, fail: results.filter(r=>!r.ok).length, totalDurationMs: totalDuration, slowest: slow, steps: results };
    console.log(JSON.stringify(summary,null,2));
    process.exit(summary.fail? 1:0);
  }
})();
