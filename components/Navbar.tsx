import React from 'react';
import { ShieldCheck, LayoutDashboard, ScanLine, Truck, Link } from 'lucide-react';
import { UserRole } from '../types';

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  currentUserRole: UserRole;
  setCurrentUserRole: (role: UserRole) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, setCurrentView, currentUserRole, setCurrentUserRole }) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: LayoutDashboard },
    { id: 'verify', label: 'Verify Product', icon: ScanLine },
    { id: 'supply-chain', label: 'Supply Chain', icon: Truck },
    { id: 'ledger', label: 'Ledger', icon: Link },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center cursor-pointer" onClick={() => setCurrentView('home')}>
            <ShieldCheck className="h-8 w-8 text-indigo-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">TrueChain<span className="text-indigo-600">India</span></span>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
                  currentView === item.id
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon className="h-4 w-4 mr-2" />
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center">
            <select
              value={currentUserRole}
              onChange={(e) => setCurrentUserRole(e.target.value as UserRole)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-gray-50"
            >
              {Object.values(UserRole).map((role) => (
                <option key={role} value={role}>
                  View as: {role}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Mobile menu (simplified) */}
      <div className="md:hidden flex justify-around border-t border-gray-200 bg-gray-50 py-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`p-2 rounded-full ${currentView === item.id ? 'bg-indigo-100 text-indigo-600' : 'text-gray-500'}`}
          >
            <item.icon className="h-6 w-6" />
          </button>
        ))}
      </div>
    </nav>
  );
};