import { Link, useLocation } from 'react-router-dom';

export function Breadcrumbs() {
  const location = useLocation();
  const parts = location.pathname.split('/').filter(Boolean);

  const crumbs = parts.map((part, idx) => {
    const href = '/' + parts.slice(0, idx + 1).join('/');
    const label = part
      .split('-')
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(' ');
    const isLast = idx === parts.length - 1;
    return (
      <span key={href} className="text-sm">
        {!isLast ? (
          <Link to={href} className="text-gray-600 hover:text-red-700">
            {label}
          </Link>
        ) : (
          <span className="text-gray-900">{label}</span>
        )}
      </span>
    );
  });

  if (parts.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="bg-gray-50 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center space-x-2">
        <Link to="/" className="text-sm text-gray-600 hover:text-red-700">
          Home
        </Link>
        <span className="text-gray-400">/</span>
        {crumbs.length > 0 && (
          <div className="flex items-center space-x-2">
            {crumbs.flatMap((c, i) => [c, i < crumbs.length - 1 ? <span key={`sep-${i}`} className="text-gray-400">/</span> : null])}
          </div>
        )}
      </div>
    </nav>
  );
}
