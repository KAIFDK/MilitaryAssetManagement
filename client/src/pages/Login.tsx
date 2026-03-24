import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { api } from '../lib/api';
import { Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await api.post('/auth/login', { email, password });
      login(response.data.user, response.data.token);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to authenticate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-military-900 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-military-500 via-military-900 to-military-900 pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden z-10"
      >
        <div className="bg-military-500 p-8 text-center text-white">
          <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-full mb-4 ring-4 ring-white/20">
            <Shield size={32} className="text-accent-500" />
          </div>
          <h2 className="text-2xl font-bold tracking-wider uppercase">Secure Portal</h2>
          <p className="text-military-100 mt-1 opacity-90">Military Asset Management System</p>
        </div>
        
        <form onSubmit={handleLogin} className="p-8 space-y-6">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-medium text-center">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-semibold text-military-700 mb-1">Service ID / Email</label>
            <input 
              type="email" 
              required
              className="w-full px-4 py-3 bg-military-50 border border-military-100 rounded-xl focus:ring-2 focus:ring-military-500 focus:border-transparent transition-all outline-none"
              placeholder="commander@base.mil"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-military-700 mb-1">Clearance Passcode</label>
            <input 
              type="password" 
              required
              className="w-full px-4 py-3 bg-military-50 border border-military-100 rounded-xl focus:ring-2 focus:ring-military-500 focus:border-transparent transition-all outline-none"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <button 
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-military-900 hover:bg-military-700 text-white rounded-xl font-bold uppercase tracking-wider transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-xl shadow-military-900/20"
          >
            {loading ? 'Authenticating...' : 'Authorize Access'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};
