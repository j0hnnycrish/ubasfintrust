import React, { useEffect, useState } from 'react';
import { authAPI } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function Security2FA() {
  const [qr, setQr] = useState<string>('');
  const [secret, setSecret] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [enabled, setEnabled] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // Try setup and load QR
    (async () => {
      setLoading(true);
      try {
        const resp = await authAPI.setup2FA();
        if (resp.success && resp.data) {
          setQr(resp.data.qrCode);
          setSecret(resp.data.secret);
        }
      } catch (e) {}
      setLoading(false);
    })();
  }, []);

  const onVerify = async () => {
    setLoading(true);
    try {
      const resp = await authAPI.verify2FA(token);
      if (resp.success) {
        setEnabled(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-red-700">Two-Factor Authentication (2FA)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {enabled ? (
              <div className="text-green-700">2FA enabled successfully.</div>
            ) : (
              <>
                <p className="text-sm text-gray-600">Scan the QR code with Google Authenticator, 1Password, or Authy and enter the 6-digit code.</p>
                {qr && (
                  <img src={qr} alt="2FA QR" className="w-56 h-56 border rounded" />
                )}
                {secret && (
                  <p className="text-xs text-gray-500">Secret: {secret}</p>
                )}
                <div className="flex gap-2 items-center">
                  <Input
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Enter 6-digit code"
                    className="max-w-xs"
                  />
                  <Button onClick={onVerify} disabled={loading} className="bg-red-600 hover:bg-red-700">Verify & Enable</Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

