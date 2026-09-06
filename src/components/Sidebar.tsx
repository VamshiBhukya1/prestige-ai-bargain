import React from 'react';
import {
  LayoutDashboard,
  Zap,
  Package,
  TrendingUp,
  Receipt,
  ShieldCheck,
  Sliders,
  Settings as SettingsIcon,
  LogOut,
  User,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenSettings: () => void;
  onOpenAuth: () => void;
  user: {
    name: string;
    email: string;
    role: 'BUYER' | 'MERCHANT';
    company?: string;
  } | null;
  onSwitchRole: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPath,
  onNavigate,
  onOpenSettings,
  onOpenAuth,
  user,
  onSwitchRole,
}) => {
  // STRICTLY the items requested by the user:
  // Dashboard, AI Deal Room, Catalog, Revenue, Transactions, Audit Trail, Policies
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    {
      path: '/deal-room',
      label: 'AI Deal Room',
      icon: Zap,
      highlight: true,
      badge: 'Main',
    },
    { path: '/catalog', label: 'Catalog', icon: Package },
    { path: '/revenue', label: 'Revenue', icon: TrendingUp },
    { path: '/transactions', label: 'Transactions', icon: Receipt },
    { path: '/audit', label: 'Audit Trail', icon: ShieldCheck },
    { path: '/policies', label: 'Policies', icon: Sliders },
  ];

  const isCurrent = (path: string) => {
    if (path === '/dashboard' && (currentPath === '/' || currentPath === '/dashboard')) return true;
    return currentPath === path;
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 select-none min-h-screen">
      {/* Top Branding */}
      <div>
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div
            onClick={() => onNavigate('/deal-room')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-sm shadow-xs group-hover:scale-105 transition-transform">
              AD
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-slate-900 text-sm tracking-tight">
                  AI DEAL ROOM
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium leading-none mt-0.5">
                Agent-to-Agent Commerce
              </p>
            </div>
          </div>
        </div>

        {/* User Role Indicator Pill */}
        <div className="px-4 pt-4 pb-2">
          <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-hidden">
              <div
                className={`w-2 h-2 rounded-full ${
                  user?.role === 'MERCHANT' ? 'bg-indigo-600' : 'bg-blue-600'
                }`}
              />
              <div className="truncate">
                <p className="text-xs font-semibold text-slate-800 truncate">
                  {user?.name || 'Guest User'}
                </p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Role: {user?.role || 'BUYER'}
                </p>
              </div>
            </div>
            <button
              onClick={onSwitchRole}
              title="Quickly toggle between Buyer and Merchant roles"
              className="text-[10px] font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded transition-colors cursor-pointer shrink-0"
            >
              Switch
            </button>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-3 space-y-1">
          <p className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Navigation
          </p>
          {navItems.map((item) => {
            const active = isCurrent(item.path);
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => onNavigate(item.path)}
                id={`sidebar-link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  active
                    ? item.highlight
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-900 text-white shadow-xs'
                    : item.highlight
                    ? 'text-blue-700 bg-blue-50/70 hover:bg-blue-100/70 border border-blue-200/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 ${
                      active ? 'text-white' : item.highlight ? 'text-blue-600' : 'text-slate-500'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      active
                        ? 'bg-white/20 text-white'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Settings & Logout */}
      <div className="p-3 border-t border-slate-200/80 bg-slate-50/50 space-y-1">
        <button
          onClick={onOpenSettings}
          id="sidebar-settings-btn"
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <SettingsIcon className="w-4 h-4 text-slate-500" />
          <span>Settings</span>
        </button>

        <button
          onClick={onOpenAuth}
          id="sidebar-logout-btn"
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-slate-500" />
          <span>{user ? 'Account / Logout' : 'Sign In'}</span>
        </button>

        <div className="pt-2 px-3">
          <p className="text-[10px] text-slate-400 font-medium">
            Razorpay Test Mode • v1.0
          </p>
        </div>
      </div>
    </aside>
  );
};
