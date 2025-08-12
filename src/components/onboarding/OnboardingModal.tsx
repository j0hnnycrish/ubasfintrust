import React, { useState, useEffect } from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { templateAPI, adminAPI } from '@/lib/api';

interface Step { title: string; description: string; icon?: string }

const fallbackSteps: Step[] = [
  { title: 'Welcome to UBAS Financial Trust', description: 'Secure global banking: accounts, transfers, and financial tools in one unified dashboard.' },
  { title: 'Accounts & Balances', description: 'View balances, track available funds, and manage multiple account types.' },
  { title: 'Transfers & Payments', description: 'Internal & international transfers with tracking and smart routing.' },
  { title: 'Security & Controls', description: '2FA, anomaly detection, and audit trails safeguard your account.' },
  { title: 'Notifications & Insights', description: 'Real-time alerts keep you informed and proactive.' }
];

export const OnboardingModal: React.FC = () => {
  const { showOnboarding, completeOnboarding } = useOnboarding();
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [steps, setSteps] = useState<Step[]>(fallbackSteps);
  const [locale, setLocale] = useState('en');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;
    if (showOnboarding) {
      (async () => {
        try {
          const tplResp = await templateAPI.list(locale);
          if (tplResp.success && Array.isArray(tplResp.data)) {
            const dynamicSteps = tplResp.data
              .filter((t: any) => t.type === 'onboarding_step')
              .sort((a: any, b: any) => (a.step_order || 0) - (b.step_order || 0))
              .map((t: any) => ({ title: t.name.replace(/_/g,' '), description: t.body, icon: t.icon }));
            if (dynamicSteps.length) setSteps(dynamicSteps);
          }
        } catch {
          // fallback silently
        } finally {
          if (mounted) setLoading(false);
        }
      })();
    } else {
      setLoading(false);
    }
    return () => { mounted = false; };
  }, [showOnboarding, locale]);
  if (!showOnboarding) return null;
  if (loading) return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"><div className="text-white">Loading onboarding...</div></div>;
  const step = steps[index];
  const isLast = index === steps.length - 1;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-white w-full max-w-lg rounded-lg shadow-xl p-8 animate-in fade-in zoom-in duration-200">
        <div className="mb-6 space-y-4">
          <h2 className="text-2xl font-bold text-brand-700 mb-2">{step.title}</h2>
          <p className="text-sm text-brand-600 leading-relaxed">{step.description}</p>
          <div className="flex items-center gap-2">
            <label className="text-xs text-brand-600">Locale</label>
            <select value={locale} onChange={e=>setLocale(e.target.value)} className="text-xs border border-brand-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-brand-500 bg-white">
              <option value="en">English</option>
              <option value="fr">Français</option>
              <option value="es">Español</option>
            </select>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="flex gap-1">
            {steps.map((_, i) => (
              <span key={i} className={`h-2 w-2 rounded-full ${i === index ? 'bg-brand-600' : 'bg-brand-200'}`}></span>
            ))}
          </div>
          <div className="flex gap-2">
            {index > 0 && (
              <button onClick={() => setIndex(i => i - 1)} className="px-3 py-1.5 text-sm rounded-md bg-brand-100 text-brand-700 hover:bg-brand-200 transition">
                Back
              </button>
            )}
            {!isLast && (
              <button onClick={() => setIndex(i => i + 1)} className="px-4 py-1.5 text-sm rounded-md bg-brand-600 text-white hover:bg-brand-700 transition">
                Next
              </button>
            )}
            {isLast && (
              <button disabled={submitting} onClick={async () => { 
                try { 
                  setSubmitting(true); 
                  await adminAPI.completeOnboarding().catch(()=>{}); 
                } finally { 
                  completeOnboarding(); 
                } 
              }} className="px-4 py-1.5 text-sm rounded-md bg-brand-700 text-white hover:bg-brand-800 transition disabled:opacity-60">
                {submitting ? 'Finishing...' : 'Get Started'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
