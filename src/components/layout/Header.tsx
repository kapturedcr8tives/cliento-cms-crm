import { Search, Bell, UserCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export function Header() {
  return (
    <header className="flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200">
      {/* Search Bar */}
      <div className="relative flex-1 max-w-xs">
        <Input type="search" placeholder="Search..." className="pl-10" />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="w-5 h-5 text-gray-400" />
        </div>
      </div>

      {/* Right side actions */}
      <div className="flex items-center space-x-4">
        <button className="p-2 text-gray-500 rounded-full hover:bg-gray-100 hover:text-gray-700">
          <Bell className="w-6 h-6" />
        </button>
        <button className="p-2 text-gray-500 rounded-full hover:bg-gray-100 hover:text-gray-700">
          <UserCircle className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
}
