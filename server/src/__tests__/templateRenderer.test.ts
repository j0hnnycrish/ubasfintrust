import { renderTemplate, findMissingTokens } from '../services/templateRenderer';

describe('templateRenderer', () => {
  it('renders with tokens and finds missing', () => {
    const tpl = 'Hello {{firstName}}, your acct {{accountNumber}} at {{bankName}}';
    const data = { firstName: 'Ada', accountNumber: '1234567890' };
    const { html, missing } = renderTemplate(tpl, data, { globals: { bankName: 'UBAS Financial Trust' } });
    expect(html).toContain('Hello Ada, your acct 1234567890 at UBAS Financial Trust');
    expect(missing).toEqual([]);
  });

  it('reports missing tokens', () => {
    const tpl = 'Hello {{firstName}}, contact {{supportEmail}}';
    const { missing } = renderTemplate(tpl, {}, { globals: { supportEmail: 'info@ubasfintrust.com' } });
    expect(missing).toEqual(['firstName']);
  });

  it('sanitizes by default (no HTML allowed)', () => {
    const tpl = 'Welcome <b>{{firstName}}</b> <script>alert(1)</script>';
    const { html } = renderTemplate(tpl, { firstName: 'Ada' });
    // script content is stripped entirely by sanitize-html when tags are not allowed
    expect(html).toBe('Welcome Ada ');
  });

  it('allows safe subset when allowSafeHtml=true', () => {
    const tpl = 'Welcome <b>{{firstName}}</b> <i>to bank</i>';
    const { html } = renderTemplate(tpl, { firstName: 'Ada' }, { allowSafeHtml: true });
    expect(html).toBe('Welcome <b>Ada</b> <i>to bank</i>');
  });

  it('supports layouts (injects body)', () => {
    const tpl = 'Body {{firstName}}';
    const layout = '<html><body><main>{{{body}}}</main></body></html>';
    const { html } = renderTemplate(tpl, { firstName: 'Ada' }, { layout, allowSafeHtml: true });
    expect(html).toContain('<main>Body Ada</main>');
  });
});

