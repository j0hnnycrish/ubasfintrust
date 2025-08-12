import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Reusable home navigation button to ensure every page has a consistent return path
export function HomeLink({ className = '' }: { className?: string }) {
  const navigate = useNavigate();
  return (
    <Button
      onClick={() => navigate('/')}
      variant="outline"
      className={`group flex items-center gap-2 border-brand-300 text-brand-700 hover:bg-brand-100 hover:text-brand-800 transition-colors ${className}`}
    >
      <Home className="h-4 w-4 text-brand-600 group-hover:text-brand-700" />
      <span className="font-medium">Home</span>
    </Button>
  );
}
