import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, ArrowRightLeft, ClipboardList, Shield, Wrench } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { cn } from '../../lib/utils';

export const Sidebar = () => {
  const role = useAuthStore((state) => state.user?.role);

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard', roles: ['ADMIN', 'COMMANDER', 'LOGISTICS'] },
    { to: '/purchases', icon: ShoppingCart, label: 'Purchases', roles: ['ADMIN', 'LOGISTICS', 'COMMANDER'] },
    { to: '/transfers', icon: ArrowRightLeft, label: 'Transfers', roles: ['ADMIN', 'LOGISTICS', 'COMMANDER'] },
    { to: '/assignments', icon: ClipboardList, label: 'Assignments', roles: ['ADMIN', 'COMMANDER'] },
    { to: '/equipment', icon: Wrench, label: 'Equipment', roles: ['ADMIN'] },
  ];

  return (
    <aside className="w-64 bg-military-900 text-military-50 flex flex-col transition-all duration-300">
      <div className="p-6 pb-2 flex items-center gap-3">
        <div className="bg-military-500 text-white p-2 rounded-lg">
          <Shield size={24} />
        </div>
        <div>
          <h1 className="font-bold text-lg leading-tight uppercase tracking-wider">M-A-M-S</h1>
          <p className="text-xs text-military-100 opacity-70">Asset Management</p>
        </div>
      </div>
      
      <div className="flex-1 mt-8 px-4 flex flex-col gap-2">
        {navItems.filter(item => item.roles.includes(role || '')).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium',
                isActive
                  ? 'bg-military-500 text-white shadow-lg shadow-military-900/50'
                  : 'text-military-100 hover:bg-military-700 hover:text-white'
              )
            }
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </aside>
  );
};
