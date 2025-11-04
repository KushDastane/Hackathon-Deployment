import React from 'react';
import { useAuth } from '../context/AuthContext';

const Header = ({ onMenuClick }) => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <h1 className="ml-2 md:ml-0 text-xl font-semibold text-gray-800">
            Secure Real-Time Ambulance Data Transmission
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600 hidden md:block">
            Welcome, <span className="font-medium">{user?.name}</span>
          </div>
          
          <button
            onClick={logout}
            className="px-4 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;