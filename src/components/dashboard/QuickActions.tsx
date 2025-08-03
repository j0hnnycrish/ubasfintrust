import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeftRight, Download, CreditCard, MessageSquare, Plus, Send, Receipt, Wallet, TrendingUp } from 'lucide-react';

interface QuickActionsProps {
  onTransfer: () => void;
  onViewTransactions: () => void;
  onAIChat: () => void;
  onBillPay: () => void;
  onDeposit: () => void;
  onInvest: () => void;
}

export function QuickActions({ onTransfer, onViewTransactions, onAIChat, onBillPay, onDeposit, onInvest }: QuickActionsProps) {
  const actions = [
    {
      icon: <Send className="h-5 w-5" />,
      label: 'Transfer',
      description: 'Send money to another account',
      onClick: onTransfer,
      variant: 'banking' as const,
    },
    {
      icon: <Receipt className="h-5 w-5" />,
      label: 'Pay Bills',
      description: 'Pay utilities and other bills',
      onClick: onBillPay,
      variant: 'banking-outline' as const,
    },
    {
      icon: <Wallet className="h-5 w-5" />,
      label: 'Deposit',
      description: 'Deposit checks or transfer money',
      onClick: onDeposit,
      variant: 'banking-outline' as const,
    },
    {
      icon: <TrendingUp className="h-5 w-5" />,
      label: 'Invest',
      description: 'Start investing for your future',
      onClick: onInvest,
      variant: 'banking-outline' as const,
    },
    {
      icon: <Download className="h-5 w-5" />,
      label: 'Download Statement',
      description: 'Get your account statement',
      onClick: () => {},
      variant: 'secondary' as const,
    },
    {
      icon: <CreditCard className="h-5 w-5" />,
      label: 'Request Card',
      description: 'Apply for a new debit card',
      onClick: () => {},
      variant: 'secondary' as const,
    },
    {
      icon: <Plus className="h-5 w-5" />,
      label: 'Open Account',
      description: 'Open a new account',
      onClick: () => window.open('/open-account', '_blank'),
      variant: 'secondary' as const,
    },
  ];

  return (
    <Card className="shadow-card-banking bg-gradient-card border-banking-gold/20">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-banking-dark">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant}
              className="h-auto p-4 flex-col items-start space-y-2 text-left"
              onClick={action.onClick}
            >
              <div className="flex items-center space-x-2 w-full">
                {action.icon}
                <span className="font-medium">{action.label}</span>
              </div>
              <span className="text-xs opacity-70 w-full">{action.description}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}