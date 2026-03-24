import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedLayout } from './components/layout/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Purchases } from './pages/Purchases';
import { Transfers } from './pages/Transfers';
import { Assignments } from './pages/Assignments';
import { Equipment } from './pages/Equipment';
import { Bases } from './pages/Bases';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedLayout />}>
        <Route path="/" element={<Dashboard />} />
        {/* Inner pages */}
        <Route path="/purchases" element={<Purchases />} />
        <Route path="/transfers" element={<Transfers />} />
        <Route path="/assignments" element={<Assignments />} />
        <Route path="/equipment" element={<Equipment />} />
        <Route path="/bases" element={<Bases />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
