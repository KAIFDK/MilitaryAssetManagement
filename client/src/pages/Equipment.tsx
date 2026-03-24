import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Wrench, Plus, Loader2, Trash2 } from 'lucide-react';
import { api } from '../lib/api';

export const Equipment = () => {
  const queryClient = useQueryClient();
  
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Vehicle' as 'Vehicle' | 'Weapon' | 'Ammunition',
    description: ''
  });

  const { data: equipment, isLoading } = useQuery({
    queryKey: ['equipment-types'],
    queryFn: async () => {
      const { data } = await api.get('/auth/equipment-types');
      return data;
    }
  });

  const createMutation = useMutation({
    mutationFn: (newEquipment: any) => api.post('/auth/equipment-types', newEquipment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipment-types'] });
      setShowModal(false);
      setFormData({ name: '', category: 'Vehicle', description: '' });
    },
    onError: (error: any) => {
      console.error('Failed to create equipment:', error);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Please enter equipment name');
      return;
    }
    createMutation.mutate({
      name: formData.name,
      category: formData.category,
      description: formData.description
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Vehicle': 'bg-blue-100 text-blue-800 border-blue-300',
      'Weapon': 'bg-red-100 text-red-800 border-red-300',
      'Ammunition': 'bg-yellow-100 text-yellow-800 border-yellow-300'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-military-900 tracking-tight flex items-center gap-3">
            <Wrench className="text-military-500" size={32} />
            Equipment Catalog
          </h1>
          <p className="text-military-500 font-medium">Define and manage available asset types.</p>
        </div>
        
        <button 
          onClick={() => setShowModal(true)}
          className="bg-military-500 hover:bg-military-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus size={20} /> Add Asset Type
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-military-100 overflow-hidden">
        <div className="p-6 border-b border-military-50">
          <h3 className="font-bold text-military-900">Asset Inventory</h3>
          <p className="text-sm text-military-500 mt-1">Total: {equipment?.length || 0} equipment types</p>
        </div>
        
        {isLoading ? (
          <div className="p-12 flex justify-center text-military-500"><Loader2 className="animate-spin" /></div>
        ) : equipment && equipment.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
            {equipment.map((item: any) => (
              <div key={item.id} className="border border-military-100 rounded-xl p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-bold text-military-900 text-lg">{item.name}</h4>
                    <span className={`inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full border ${getCategoryColor(item.category)}`}>
                      {item.category}
                    </span>
                  </div>
                </div>
                {item.description && (
                  <p className="text-sm text-military-600 mt-3 line-clamp-2">{item.description}</p>
                )}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-military-50 text-xs text-military-500">
                  <span>Created: {new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-military-500">
            <Wrench size={40} className="mx-auto mb-3 opacity-50" />
            <p className="font-medium">No equipment types configured yet.</p>
            <p className="text-sm">Click "Add Asset Type" to get started.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-military-50 flex justify-between items-center bg-military-50">
              <h2 className="text-xl font-bold text-military-900">Add New Asset Type</h2>
              <button 
                onClick={() => setShowModal(false)} 
                className="text-military-400 hover:text-military-900 font-bold text-xl"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-military-900">Equipment Name *</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g., M16 Rifle, Humvee, 5.56mm Rounds"
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  className="w-full p-3 border border-military-200 rounded-xl focus:ring-2 focus:ring-military-500 outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-2 text-military-900">Category *</label>
                <select 
                  required 
                  value={formData.category} 
                  onChange={e => setFormData({...formData, category: e.target.value as any})} 
                  className="w-full p-3 border border-military-200 rounded-xl focus:ring-2 focus:ring-military-500 outline-none"
                >
                  <option value="Vehicle">Vehicle</option>
                  <option value="Weapon">Weapon</option>
                  <option value="Ammunition">Ammunition</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-2 text-military-900">Description</label>
                <textarea 
                  placeholder="Brief description of this asset type (optional)"
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                  className="w-full p-3 border border-military-200 rounded-xl focus:ring-2 focus:ring-military-500 outline-none resize-none"
                  rows={3}
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
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus size={18} />
                      Add Asset Type
                    </>
                  )}
                </button>
              </div>

              {createMutation.isError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {(createMutation.error as any)?.message || 'Failed to create equipment type'}
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
