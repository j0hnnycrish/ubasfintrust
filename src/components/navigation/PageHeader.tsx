import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PageHeaderProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

export default function PageHeader({ title, subtitle, className = '' }: PageHeaderProps) {
  const navigate = useNavigate();
  return (
    <div className={`w-full bg-white/70 backdrop-blur border-b sticky top-0 z-40 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}> 
            <Home className="h-4 w-4 mr-1" /> Home
          </Button>
        </div>
        {(title || subtitle) && (
          <div className="text-right">
            {title && <div className="text-sm font-semibold text-gray-900">{title}</div>}
            {subtitle && <div className="text-xs text-gray-500">{subtitle}</div>}
          </div>
        )}
      </div>
    </div>
  );
}
