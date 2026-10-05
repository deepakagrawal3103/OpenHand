import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  ShoppingBag,
  Plus,
  Heart,
  Wrench,
  Radio,
  User,
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    {
      label: 'Home',
      path: '/',
      icon: Home,
      isActive: currentPath === '/',
    },
    {
      label: 'Market',
      path: '/marketplace',
      icon: ShoppingBag,
      isActive: currentPath === '/marketplace',
    },
    {
      label: 'Post',
      path: '/app/create',
      isCenter: true,
      icon: Plus,
      isActive: currentPath.startsWith('/app/create'),
    },
    {
      label: 'Donate',
      path: '/donate',
      icon: Heart,
      badge: 'Food',
      isActive: currentPath === '/donate',
    },
    {
      label: 'Services',
      path: '/services',
      icon: Wrench,
      isActive: currentPath === '/services',
    },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200/90 shadow-[0_-4px_25px_rgba(0,0,0,0.07)] transition-all select-none"
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 6px)' }}
    >
      <div className="max-w-md mx-auto px-2 py-1.5 flex items-center justify-around relative">
        {navItems.map((item) => {
          const Icon = item.icon;

          if (item.isCenter) {
            return (
              <Link
                key={item.label}
                to={item.path}
                className="relative -top-5 flex flex-col items-center group focus:outline-none"
                title="Post Request or Need"
              >
                <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-700 to-teal-600 text-white flex items-center justify-center shadow-[0_8px_20px_rgba(4,120,87,0.38)] border-4 border-white active:scale-90 transition-transform duration-150">
                  <Icon className="w-6 h-6 stroke-[3]" />
                </div>
                <span className="text-[10px] font-extrabold text-emerald-800 -mt-0.5 tracking-tight">
                  Post Need
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.label}
              to={item.path}
              className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-150 active:scale-95 relative ${
                item.isActive
                  ? 'text-emerald-800 font-bold'
                  : 'text-slate-500 hover:text-slate-900 font-medium'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-150 ${
                    item.isActive ? 'scale-110 text-emerald-700' : 'text-slate-500'
                  }`}
                />
                {item.badge && (
                  <span className="absolute -top-1 -right-3.5 px-1 py-0.2 bg-amber-500 text-slate-950 font-black text-[8px] rounded-full uppercase tracking-tighter animate-pulse shadow-xs">
                    {item.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] mt-1 tracking-tight leading-none ${
                  item.isActive ? 'font-extrabold text-emerald-800' : 'text-slate-500'
                }`}
              >
                {item.label}
              </span>
              {item.isActive && (
                <span className="w-1 h-1 rounded-full bg-emerald-600 mt-0.5" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
