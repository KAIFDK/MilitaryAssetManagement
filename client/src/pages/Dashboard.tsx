import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PackageOpen, ArrowRightLeft, ArrowDownToLine, ArrowUpFromLine, Layers } from 'lucide-react';
import { api } from '../lib/api';
import { useAuthStore } from '../store/authStore';

const fetchMetrics = async (params: any) => {
  const { data } = await api.get('/dashboard/metrics', { params });
  return data;
};

const fetchEquipment = async () => {
  const { data } = await api.get('/auth/equipment-types');
  return data;
};

export const Dashboard = () => {
  const user = useAuthStore(s => s.user);
  const [equipmentFilter, setEquipmentFilter] = useState('');
  
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['metrics', equipmentFilter],
    queryFn: () => fetchMetrics({ equipmentTypeId: equipmentFilter || undefined }),
  });

  const { data: equipmentTypes } = useQuery({
    queryKey: ['equipment-types'],
    queryFn: fetchEquipment,
  });

  const stats = [
    { label: 'Opening Balance', value: metrics?.openingBalance || 0, icon: Layers, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Purchases', value: metrics?.purchases || 0, icon: ArrowDownToLine, color: 'text-green-500', bg: 'bg-green-50' },
    { label: 'Transfers In', value: metrics?.transfersIn || 0, icon: ArrowDownToLine, color: 'text-teal-500', bg: 'bg-teal-50' },
    { label: 'Transfers Out', value: metrics?.transfersOut || 0, icon: ArrowUpFromLine, color: 'text-orange-500', bg: 'bg-orange-50' },
    { label: 'Net Movement', value: metrics?.netMovement || 0, icon: ArrowRightLeft, color: 'text-purple-500', bg: 'bg-purple-50' },
    { label: 'Assignments', value: metrics?.assignments || 0, icon: PackageOpen, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { label: 'Expended', value: metrics?.expenditures || 0, icon: PackageOpen, color: 'text-red-500', bg: 'bg-red-50' },
    { label: 'Closing Balance', value: metrics?.closingBalance || 0, icon: Layers, color: 'text-military-900', bg: 'bg-military-100' },
  ];

  // Mock data for the chart to show historical visualization if we had a time-series endpoint
  const chartData = [
    { name: 'Jan', balance: 4000 },
    { name: 'Feb', balance: 3000 },
    { name: 'Mar', balance: 2000 },
    { name: 'Apr', balance: 2780 },
    { name: 'May', balance: 1890 },
    { name: 'Jun', balance: 2390 },
    { name: 'Jul', balance: 3490 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black text-military-900 tracking-tight">Command Dashboard</h1>
          <p className="text-military-500 font-medium mt-1">Operational view of {user?.baseId ? 'Base' : 'Global'} Assets</p>
        </div>
        
        <div className="flex items-center gap-3">
          <select 
            className="px-4 py-2 bg-white border border-military-100 rounded-xl text-sm font-semibold outline-none focus:ring-2 ring-military-500 shadow-sm"
            value={equipmentFilter}
            onChange={e => setEquipmentFilter(e.target.value)}
          >
            <option value="">All Equipment</option>
            {equipmentTypes?.map((e: any) => (
              <option key={e.id} value={e.id}>{e.name} ({e.category})</option>
            ))}
          </select>
        </div>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-military-100 h-28 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-military-100 flex items-center justify-between group hover:shadow-md transition-all">
              <div>
                <p className="text-xs font-bold text-military-500 uppercase tracking-wider mb-1">{stat.label}</p>
                <p className="text-3xl font-black text-military-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon size={24} />
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-military-100 h-[400px] flex flex-col">
        <h3 className="text-lg font-bold text-military-900 mb-6">Asset Trend (6 Months Projection)</h3>
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#436d58" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#436d58" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dx={-10} />
              <CartesianGrid vertical={false} stroke="#f1f5f9" />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Area type="monotone" dataKey="balance" stroke="#436d58" strokeWidth={3} fillOpacity={1} fill="url(#colorBalance)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
