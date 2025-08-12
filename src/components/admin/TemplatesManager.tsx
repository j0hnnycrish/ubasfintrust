import React, { useEffect, useState } from 'react';
import { templateAPI, providerAPI } from '@/lib/api';
import { adminAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Plus, Save, Trash2, RefreshCw } from 'lucide-react';

interface TemplateRecord {
  id: string;
  type: string;
  channel: string;
  locale: string;
  name: string;
  subject?: string;
  body: string;
  step_order?: number;
  icon?: string;
  is_default?: boolean;
  version?: number;
}

export const TemplatesManager: React.FC = () => {
  const [templates, setTemplates] = useState<TemplateRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<TemplateRecord | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [providerHealth, setProviderHealth] = useState<any>(null);
  const [testEmail, setTestEmail] = useState({ to: '', subject: 'Conversational Test', message: 'Just checking in – does this reach you clearly?' });
  const [sendingTest, setSendingTest] = useState(false);
  const [testResult, setTestResult] = useState<{ provider?: string; messageId?: string; error?: string }|null>(null);

  // Preview data and substitution helpers (Step 1)
  const [previewData, setPreviewData] = useState<{ firstName?: string; email?: string; accountNumber?: string; [k:string]: any}>({});
  const [useServerPreview, setUseServerPreview] = useState(false);
  const [serverPreviewResult, setServerPreviewResult] = useState<{ html: string; missing: string[]; cached?: boolean } | null>(null);
  const globalTokens: Record<string,string> = {
    bankName: 'UBAS Financial Trust',
    supportEmail: 'info@ubasfintrust.com',
  };
  const tokenRegex = /\{\{\s*([a-zA-Z0-9_\.]+)\s*\}\}/g;
  const escapeHtml = (s: string) => s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
  const renderWithTokens = (tpl: string, data: Record<string, any>) => {
    const merged = { ...globalTokens, ...data };
    const missing = new Set<string>();
    const out = tpl.replace(tokenRegex, (_, key) => {
      const val = merged[key];
      if (val === undefined || val === null || val === '') { missing.add(key); return `{{${key}}}`; }
      return String(val);
    });
    return { out, missing: Array.from(missing) };
  };
  const fetchServerPreview = async () => {
    if (!editing?.body) return;
    try {
      const resp = await templateAPI.render(editing.body, previewData, { allowSafeHtml: true });
      if (resp.success) setServerPreviewResult(resp.data);
      else setError(resp.message || 'Server preview failed');
    } catch (e: any) {
      setError(e.message);
    }
  };

  const loadHealth = async () => {
    try {
      const health = await providerAPI.health();
      if (health.success) setProviderHealth(health.data);
    } catch {}
  };
  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await templateAPI.list();
      if (resp.success) setTemplates(resp.data || []);
      else setError(resp.message || 'Failed to load templates');
      await loadHealth();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);
  useEffect(()=>{ const id = setInterval(()=>loadHealth(), 45000); return ()=> clearInterval(id); }, []);

  const startCreate = () => {
    setCreating(true);
    setEditing({ id: '', type: 'onboarding_step', channel: 'in_app', locale: 'en', name: '', body: '', subject: '' });
  };

  const cancel = () => { setEditing(null); setCreating(false); };

  const save = async () => {
    if (!editing) return;
    try {
      if (creating) {
        const { id, ...payload } = editing as any;
        const resp = await templateAPI.create({
          type: payload.type,
          channel: payload.channel,
          name: payload.name,
          body: payload.body,
          subject: payload.subject,
          locale: payload.locale,
          stepOrder: payload.step_order,
          icon: payload.icon
        });
        if (resp.success) {
          await load();
          cancel();
        }
      } else {
        const resp = await templateAPI.update(editing.id, {
          name: editing.name,
          body: editing.body,
          subject: editing.subject,
          locale: editing.locale,
          icon: editing.icon,
          step_order: editing.step_order
        });
        if (resp.success) {
          await load();
          setEditing(null);
        }
      }
    } catch (e: any) {
      setError(e.message);
    }
  };

  const remove = async (tpl: TemplateRecord) => {
    if (!window.confirm('Delete this template?')) return;
    await templateAPI.delete(tpl.id);
    await load();
  };

  const group = templates.reduce<Record<string, TemplateRecord[]>>((acc, t) => {
    acc[t.type] = acc[t.type] || [];
    acc[t.type].push(t);
    return acc;
  }, {});

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Message & Onboarding Templates</CardTitle>
          <p className="text-xs text-gray-500">Customize onboarding steps and welcome messages (email/SMS).</p>
      {providerHealth && (
            <div className="mt-2 flex flex-wrap gap-2 text-[10px]">
              {providerHealth.email && Object.keys(providerHealth.email).map(k => (
                <span key={k} className={`px-2 py-0.5 rounded-full font-medium ${providerHealth.email[k].ok ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {k}: {providerHealth.email[k].ok ? 'UP' : 'DOWN'}
                </span>
              ))}
              {providerHealth.sms && Object.keys(providerHealth.sms).map(k => (
                <span key={k} className={`px-2 py-0.5 rounded-full font-medium ${providerHealth.sms[k].configured ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                  {k}: {providerHealth.sms[k].configured ? 'CFG' : '—'}
                </span>
              ))}
        <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{loading? 'Refreshing...' : 'Auto 45s'}</span>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={load} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-1 ${loading && 'animate-spin'}`} /> Refresh
          </Button>
          <Button size="sm" onClick={startCreate}>
            <Plus className="h-4 w-4 mr-1" /> New Template
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}
        {loading && <div className="flex items-center text-sm text-gray-600"><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Loading templates...</div>}
        {!loading && !editing && (
          <div className="space-y-8">
            <div className="p-4 border rounded-md bg-white/60">
              <h3 className="text-sm font-semibold mb-2">Send Test Email (Conversational)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                <Input placeholder="Recipient email" value={testEmail.to} onChange={e=>setTestEmail({...testEmail,to:e.target.value})} />
                <Input placeholder="Subject" value={testEmail.subject} onChange={e=>setTestEmail({...testEmail,subject:e.target.value})} />
                <Input placeholder="Message" value={testEmail.message} onChange={e=>setTestEmail({...testEmail,message:e.target.value})} />
              </div>
              <div className="flex items-center gap-3">
                <Button size="sm" disabled={sendingTest || !testEmail.to} onClick={async()=>{
                  setSendingTest(true); setTestResult(null); setError(null);
                  try {
                    const resp = await adminAPI.testEmail(testEmail);
                    if (resp.success) setTestResult({ provider: resp.data?.provider, messageId: resp.data?.messageId });
                    else setTestResult({ error: resp.message });
                  } catch (e:any) { setTestResult({ error: e.message }); }
                  finally { setSendingTest(false); }
                }}>
                  {sendingTest && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}Send Test
                </Button>
                {testResult && (
                  <div className="text-[11px]">
                    {testResult.error ? (
                      <span className="text-red-600">Error: {testResult.error}</span>
                    ) : (
                      <span className="text-green-700">Sent via {testResult.provider} • {testResult.messageId}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
            {Object.keys(group).sort().map(type => (
              <div key={type}>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-2">{type}</h3>
                <div className="border rounded-md divide-y">
                  {group[type].sort((a,b)=>(a.step_order||0)-(b.step_order||0)).map(t => (
                    <div key={t.id} className="p-3 flex items-start justify-between gap-4 bg-white hover:bg-red-50/40 transition">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-800">{t.name}</span>
                          {t.is_default && <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-200 text-gray-700">default</span>}
                          {t.channel && <span className="text-[10px] px-1 py-0.5 rounded bg-red-100 text-red-700">{t.channel}</span>}
                          {t.locale && <span className="text-[10px] px-1 py-0.5 rounded bg-gray-100 text-gray-600">{t.locale}</span>}
                        </div>
                        {t.subject && <p className="text-xs text-gray-500 mt-0.5">{t.subject}</p>}
                        <p className="text-xs text-gray-600 mt-1 whitespace-pre-line">{t.body.slice(0,300)}</p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button size="sm" variant="outline" onClick={()=>setEditing(t)}>Edit</Button>
                        {!t.is_default && <Button size="sm" variant="ghost" className="text-red-600" onClick={()=>remove(t)}><Trash2 className="h-4 w-4" /></Button>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {!Object.keys(group).length && <div className="text-sm text-gray-500">No templates yet.</div>}
          </div>
        )}
        {editing && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-600">Type</label>
                <Input value={editing.type} onChange={e=>setEditing({...editing,type:e.target.value})} disabled={!creating} />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Channel</label>
                <Input value={editing.channel} onChange={e=>setEditing({...editing,channel:e.target.value})} disabled={!creating} />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Locale</label>
                <Input value={editing.locale} onChange={e=>setEditing({...editing,locale:e.target.value})} />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Name</label>
                <Input value={editing.name} onChange={e=>setEditing({...editing,name:e.target.value})} />
              </div>
              {/* Live Preview with tokens */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <div className="text-xs font-semibold text-gray-700 mb-2">Preview Data</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {['firstName','email','accountNumber'].map(k => (
                      <div key={k}>
                        <label className="text-[11px] text-gray-500">{k}</label>
                        <Input value={(previewData as any)[k]||''} onChange={e=>setPreviewData({...previewData,[k]:e.target.value})} placeholder={`Enter ${k}`} />
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 text-[11px] text-gray-500">
                    Global tokens available: {Object.keys(globalTokens).map(k=>`{{${k}}}`).join(', ')}
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs font-semibold text-gray-700">Rendered Preview</div>
                    <label className="flex items-center text-xs text-gray-600">
                      <input type="checkbox" checked={useServerPreview} onChange={e => setUseServerPreview(e.target.checked)} className="mr-1" />
                      Server render
                    </label>
                  </div>
                  {useServerPreview && (
                    <div className="mb-2">
                      <button onClick={fetchServerPreview} className="text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700">
                        Fetch Server Preview
                      </button>
                    </div>
                  )}
                  <div className="p-3 rounded border bg-red-50/40 text-sm text-gray-800 whitespace-pre-wrap">
                    {useServerPreview && serverPreviewResult ? (
                      <>
                        <div dangerouslySetInnerHTML={{ __html: serverPreviewResult.html }} />
                        {serverPreviewResult.missing.length > 0 && (
                          <div className="mt-2 text-[11px] text-red-700">
                            Missing tokens: {serverPreviewResult.missing.map(m=>`{{${m}}}`).join(', ')}
                          </div>
                        )}
                        {serverPreviewResult.cached && (
                          <div className="mt-1 text-[10px] text-green-600">✓ Cached result</div>
                        )}
                      </>
                    ) : (
                      (() => {
                        const { out, missing } = renderWithTokens(editing.body || '', previewData);
                        return (
                          <>
                            <div>{out}</div>
                            {missing.length > 0 && (
                              <div className="mt-2 text-[11px] text-red-700">
                                Missing tokens: {missing.map(m=>`{{${m}}}`).join(', ')}
                              </div>
                            )}
                          </>
                        );
                      })()
                    )}
                  </div>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Subject (email)</label>
                <Input value={editing.subject||''} onChange={e=>setEditing({...editing,subject:e.target.value})} />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Step Order (onboarding)</label>
                <Input type="number" value={editing.step_order||''} onChange={e=>setEditing({...editing,step_order: parseInt(e.target.value)||undefined})} />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Icon</label>
                <Input value={editing.icon||''} onChange={e=>setEditing({...editing,icon:e.target.value})} />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600">Body (supports {'{{firstName}}'}, {'{{email}}'}, {'{{accountNumber}}'})</label>
              <Textarea rows={8} value={editing.body} onChange={e=>setEditing({...editing,body:e.target.value})} />
            </div>
            <div className="flex gap-2">
              <Button onClick={save} disabled={!editing.name || !editing.body}>
                <Save className="h-4 w-4 mr-1" /> {creating ? 'Create' : 'Save'}
              </Button>
              <Button variant="outline" onClick={cancel}>Cancel</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
