import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MapPin, Plus, Loader2 } from 'lucide-react';
import { api } from '../lib/api';

export const Bases = () => {
  const queryClient = useQueryClient();
  
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: ''
  });

  const { data: bases, isLoading } = useQuery({
    queryKey: ['bases'],
    queryFn: async () => {
      const { data } = await api.get('/auth/bases');
      return data;
    }
  });

  const createMutation = useMutation({
    mutationFn: (newBase: any) => api.post('/auth/bases', newBase),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bases'] });
      setShowModal(false);
      setFormData({ name: '', location: '' });
    },
    onError: (error: any) => {
      console.error('Failed to create base:', error);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.location.trim()) {
      alert('Please fill in all required fields');
      return;
    }
    createMutation.mutate({
      name: formData.name,
      location: formData.location
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-military-900 tracking-tight flex items-center gap-3">
            <MapPin className="text-military-500" size={32} />
            Military Bases
          </h1>
          <p className="text-military-500 font-medium">Establish and manage operational bases for asset transfers.</p>
        </div>
        
        <button 
          onClick={() => setShowModal(true)}
          className="bg-military-500 hover:bg-military-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus size={20} /> Establish Base
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-military-100 overflow-hidden">
        <div className="p-6 border-b border-military-50">
          <h3 className="font-bold text-military-900">Base Network</h3>
          <p className="text-sm text-military-500 mt-1">Total: {bases?.length || 0} operational bases</p>
        </div>
        
        {isLoading ? (
          <div className="p-12 flex justify-center text-military-500"><Loader2 className="animate-spin" /></div>
        ) : bases && bases.length > 0 ? (
          <div className="divide-y divide-military-50">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-military-50 text-military-500 text-sm">
                    <th className="p-4 font-semibold uppercase tracking-wider">Base Name</th>
                    <th className="p-4 font-semibold uppercase tracking-wider">Location</th>
                    <th className="p-4 font-semibold uppercase tracking-wider">Established</th>
                  </tr>
                </thead>
                <tbody>
                  {bases.map((base: any) => (
                    <tr key={base.id} className="hover:bg-military-50/50 transition-colors">
                      <td className="p-4 text-sm font-bold text-military-900">{base.name}</td>
                      <td className="p-4 text-sm text-military-700">{base.location}</td>
                      <td className="p-4 text-sm text-military-500">
                        {new Date(base.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="p-12 text-center text-military-500">
            <MapPin size={40} className="mx-auto mb-3 opacity-50" />
            <p className="font-medium">No bases established yet.</p>
            <p className="text-sm">Click "Establish Base" to create your first operational base.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-military-50 flex justify-between items-center bg-military-50">
              <h2 className="text-xl font-bold text-military-900">Establish New Base</h2>
              <button 
                onClick={() => setShowModal(false)} 
                className="text-military-400 hover:text-military-900 font-bold text-xl"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-military-900">Base Name *</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g., Fort Liberty, Camp Lejeune, Naval Base San Diego"
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  className="w-full p-3 border border-military-200 rounded-xl focus:ring-2 focus:ring-military-500 outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-2 text-military-900">Location *</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g., North Carolina, California, Virginia"
                  value={formData.location} 
                  onChange={e => setFormData({...formData, location: e.target.value})} 
                  className="w-full p-3 border border-military-200 rounded-xl focus:ring-2 focus:ring-military-500 outline-none"
                />
              </div>
              
              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)} 
                  className="px-5 py-2.5 font-bold text-military-500 hover:bg-military-50 rounded-xl"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={createMutation.isPending} 
                  className="px-5 py-2.5 bg-military-500 hover:bg-military-700 disabled:bg-military-300 text-white font-bold rounded-xl flex items-center gap-2 transition-colors"
                >
                  {createMutation.isPending ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus size={18} />
                      Establish Base
                    </>
                  )}
                </button>
              </div>

              {createMutation.isError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {(createMutation.error as any)?.message || 'Failed to create base'}
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
