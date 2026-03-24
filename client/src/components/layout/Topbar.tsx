import { useAuthStore } from '../../store/authStore';
import { LogOut, User as UserIcon } from 'lucide-react';

export const Topbar = () => {
  const { user, logout } = useAuthStore();

  return (
    <header className="h-16 bg-white border-b border-military-100 flex items-center justify-between px-6 shadow-sm z-10">
      <div className="text-sm font-semibold text-military-500">
        {user?.baseId ? `Base Assignment: ${user.baseId.substring(0, 8)}` : 'Global Command'}
      </div>
      
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-military-100 flex items-center justify-center text-military-700">
            <UserIcon size={20} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-military-900 leading-tight">{user?.name}</span>
            <span className="text-xs font-semibold text-accent-500">{user?.role}</span>
          </div>
        </div>
        
        <button 
          onClick={logout}
          className="p-2 text-military-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
          title="Sign out"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
};
