import Handlebars from 'handlebars';
import sanitizeHtml from 'sanitize-html';

export interface RenderOptions {
  allowSafeHtml?: boolean;
  partials?: Record<string, string>;
  layout?: string; // optional layout string with {{{body}}}
  helpers?: Record<string, (...args: any[]) => any>;
  globals?: Record<string, any>;
}

const DEFAULT_ALLOWED_TAGS = [
  'html','body','main','section','div',
  'b','i','em','strong','a','p','br','ul','ol','li','span'
];
const DEFAULT_ALLOWED_ATTR = {
  'a': ['href','name','target','rel'],
  '*': ['style']
};

// Basic helpers
const baseHelpers: Record<string, (...args: any[]) => any> = {
  upper: (v: any) => String(v ?? '').toUpperCase(),
  lower: (v: any) => String(v ?? '').toLowerCase(),
  capitalize: (v: any) => String(v ?? '').replace(/\b\w/g, (m) => m.toUpperCase()),
  formatCurrency: (v: any, currency = 'USD', locale = 'en-US') => {
    const num = Number(v) || 0;
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(num);
  },
  date: (v: any, locale = 'en-US', opts: Intl.DateTimeFormatOptions = {}) => {
    const d = v instanceof Date ? v : new Date(v);
    return isNaN(d.getTime()) ? '' : new Intl.DateTimeFormat(locale, opts || { dateStyle: 'medium' }).format(d);
  },
  safeHtml: (html: string) => new Handlebars.SafeString(sanitizeHtml(html, { allowedTags: DEFAULT_ALLOWED_TAGS, allowedAttributes: DEFAULT_ALLOWED_ATTR }))
};

const tokenRegex = /\{\{\s*([a-zA-Z0-9_\.]+)\s*\}\}/g;

export function findMissingTokens(tpl: string, data: Record<string, any>): string[] {
  const keys = new Set<string>();
  let m: RegExpExecArray | null;
  while ((m = tokenRegex.exec(tpl))) {
    keys.add(m[1]);
  }
  const missing: string[] = [];
  keys.forEach((k) => {
    const v = (data as any)[k];
    if (v === undefined || v === null || v === '') missing.push(k);
  });
  return missing;
}

export function renderTemplate(template: string, data: Record<string, any> = {}, options: RenderOptions = {}) {
  const { allowSafeHtml = false, partials = {}, layout, helpers = {}, globals = {} } = options;

  // Register partials for this render
  Object.keys(partials).forEach((name) => Handlebars.registerPartial(name, partials[name]));

  // Register helpers (base + custom)
  const mergedHelpers = { ...baseHelpers, ...helpers };
  Object.keys(mergedHelpers).forEach((name) => Handlebars.registerHelper(name, mergedHelpers[name]));

  const context = { ...globals, ...data };
  const compiled = Handlebars.compile(template, { noEscape: !allowSafeHtml });
  let body = compiled(context);

  // Apply layout if provided
  if (layout) {
    const compiledLayout = Handlebars.compile(layout, { noEscape: !allowSafeHtml });
    body = compiledLayout({ ...context, body });
  }

  // Final sanitization step. If allowSafeHtml=false, strip tags except layout skeleton; else allow a safe subset
  const sanitized = sanitizeHtml(body, allowSafeHtml ? { allowedTags: DEFAULT_ALLOWED_TAGS, allowedAttributes: DEFAULT_ALLOWED_ATTR } : { allowedTags: [], allowedAttributes: {} });

  const missing = findMissingTokens(template, context);
  return { html: sanitized, missing };
}

