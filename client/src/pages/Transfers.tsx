import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowRightLeft, Send, Loader2 } from 'lucide-react';
import { api } from '../lib/api';
import { useAuthStore } from '../store/authStore';

export const Transfers = () => {
  const queryClient = useQueryClient();
  const user = useAuthStore(s => s.user);
  
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ equipmentTypeId: '', sourceBaseId: user?.baseId || '', destinationBaseId: '', quantity: 1, notes: '' });

  const { data: history, isLoading } = useQuery({
    queryKey: ['transactions', 'TRANSFER_OUT'], // We'll query TRANSFER_OUT to represent the transfer event
    queryFn: async () => {
      const { data } = await api.get('/transactions/history', { params: { type: 'TRANSFER_OUT' } });
      return data;
    }
  });

  const { data: equipment } = useQuery({ queryKey: ['equipment-types'], queryFn: async () => (await api.get('/auth/equipment-types')).data });
  const { data: bases } = useQuery({ queryKey: ['bases'], queryFn: async () => (await api.get('/auth/bases')).data });

  const transferMutation = useMutation({
    mutationFn: (newTransfer: any) => api.post('/transactions/transfer', newTransfer),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions', 'TRANSFER_OUT'] });
      setShowModal(false);
      setFormData({ equipmentTypeId: '', sourceBaseId: user?.baseId || '', destinationBaseId: '', quantity: 1, notes: '' });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    transferMutation.mutate({ ...formData, quantity: Number(formData.quantity) });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-military-900 tracking-tight flex items-center gap-3">
            <ArrowRightLeft className="text-military-500" size={32} />Inter-Base Transfers
          </h1>
          <p className="text-military-500 font-medium">Coordinate logistics routes and reposition inventory securely.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-military-500 hover:bg-military-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-sm transition-all hover:shadow-lg hover:-translate-y-0.5"><Send size={20} /> Deploy Transfer</button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-military-100 overflow-hidden">
        <div className="p-6 border-b border-military-50"><h3 className="font-bold text-military-900">Transfer Manifests</h3></div>
        
        {isLoading ? <div className="p-12 flex justify-center text-military-500"><Loader2 className="animate-spin" /></div> : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-military-50 text-military-500 text-sm">
                  <th className="p-4 font-semibold uppercase tracking-wider">Date</th>
                  <th className="p-4 font-semibold uppercase tracking-wider">Equipment</th>
                  <th className="p-4 font-semibold uppercase tracking-wider">Quantity</th>
                  <th className="p-4 font-semibold uppercase tracking-wider">Route</th>
                  <th className="p-4 font-semibold uppercase tracking-wider">Dispatcher</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-military-50">
                {history?.map((tx: any) => {
                  const destBase = bases?.find((b: any) => b.id === tx.referenceId);
                  return (
                    <tr key={tx.id} className="hover:bg-military-50/50">
                      <td className="p-4 text-sm font-medium text-military-700">{new Date(tx.date).toLocaleDateString()}</td>
                      <td className="p-4 text-sm font-bold text-military-900">{tx.equipmentType?.name}</td>
                      <td className="p-4 text-sm font-black text-orange-600">{tx.quantity} units</td>
                      <td className="p-4 text-sm font-medium text-military-700 flex items-center gap-2">
                        <span className="bg-military-100 px-2 pl-3 py-1 rounded-l-full">{tx.base?.name}</span>
                        <ArrowRightLeft size={14} className="text-military-400" />
                        <span className="bg-military-900 text-white px-2 pr-3 py-1 rounded-r-full">{destBase?.name || 'Unknown'}</span>
                      </td>
                      <td className="p-4 text-sm font-medium text-military-500">{tx.user?.name}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-military-50 flex justify-between items-center bg-military-50">
              <h2 className="text-xl font-bold text-military-900">Deploy Assets</h2>
              <button onClick={() => setShowModal(false)} className="text-military-400 hover:text-military-900">&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Equipment Payload</label>
                <select required value={formData.equipmentTypeId} onChange={e => setFormData({...formData, equipmentTypeId: e.target.value})} className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-military-500 outline-none">
                  <option value="">Select Equipment</option>
                  {equipment?.map((e: any) => <option key={e.id} value={e.id}>{e.name}</option>)}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Source Base</label>
                  <select required disabled={user?.role === 'COMMANDER'} value={formData.sourceBaseId} onChange={e => setFormData({...formData, sourceBaseId: e.target.value})} className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-military-500 outline-none disabled:bg-gray-100">
                    <option value="">Select Location</option>
                    {bases?.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Destination Base</label>
                  <select required value={formData.destinationBaseId} onChange={e => setFormData({...formData, destinationBaseId: e.target.value})} className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-military-500 outline-none">
                    <option value="">Select Destination</option>
                    {bases?.filter((b: any) => b.id !== formData.sourceBaseId).map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-1">Quantity</label>
                <input type="number" min="1" required value={formData.quantity} onChange={e => setFormData({...formData, quantity: parseInt(e.target.value) || 0})} className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-military-500 outline-none" />
              </div>
              
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 font-bold text-military-500 hover:bg-military-50 rounded-xl">Cancel</button>
                <button type="submit" disabled={transferMutation.isPending} className="px-5 py-2.5 bg-military-900 hover:bg-military-700 text-white font-bold rounded-xl flex items-center gap-2">
                  {transferMutation.isPending ? <Loader2 className="animate-spin" /> : 'Confirm Deploy'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
