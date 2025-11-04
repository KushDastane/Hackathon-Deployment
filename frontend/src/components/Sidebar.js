import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ open, setOpen }) => {
  const location = useLocation();
  const { user } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: '📊' },
    { name: 'Alerts', href: '/alerts', icon: '🚨' },
    { name: 'Map View', href: '/map', icon: '🗺️' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {open && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:inset-0
      `}>
        <div className="flex items-center justify-center h-16 bg-medical-blue text-white">
          <h1 className="text-xl font-bold">Ambulance Data System</h1>
        </div>
        
        <nav className="mt-8 px-4">
          <div className="space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setOpen(false)}
                className={`
                  flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors
                  ${isActive(item.href)
                    ? 'bg-medical-lightblue text-medical-blue border border-medical-blue'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }
                `}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </div>
          
          {/* User info */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-medical-blue rounded-full flex items-center justify-center text-white font-semibold">
                  {user?.name?.charAt(0) || 'U'}
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role?.replace('_', ' ')}</p>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;