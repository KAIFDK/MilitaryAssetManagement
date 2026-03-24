import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Sidebar } from './Sidebar.tsx';
import { Topbar } from './Topbar.tsx';

export const ProtectedLayout = () => {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-military-50 overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 w-full relative">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6 relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
