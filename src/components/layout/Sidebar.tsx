import {
  LayoutDashboard,
  Users,
  Briefcase,
  FileText,
  Settings,
  BarChart,
  LifeBuoy,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/clients', label: 'Clients', icon: Users },
  { href: '/projects', label: 'Projects', icon: Briefcase },
  { href: '/invoices', label: 'Invoices', icon: FileText },
  { href: '/reports', label: 'Reports', icon: BarChart },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const location = useLocation();

  const isActive = (href: string) => location.pathname === href;

  return (
    <aside className="hidden md:flex md:flex-col md:w-64 bg-gray-800 text-gray-300">
      <div className="h-16 flex items-center justify-center text-white text-xl font-bold border-b border-gray-700">
        Cliento
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.label}
            to={item.href}
            className={`flex items-center px-3 py-2 rounded-md text-sm font-medium
              ${
                isActive(item.href)
                  ? 'bg-gray-900 text-white'
                  : 'hover:bg-gray-700 hover:text-white'
              }`}
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="px-2 py-4 border-t border-gray-700">
        <Link
          to="/help"
          className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 hover:text-white"
        >
          <LifeBuoy className="w-5 h-5 mr-3" />
          Help & Support
        </Link>
      </div>
    </aside>
  );
}
