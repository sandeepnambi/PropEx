// frontend/src/pages/admin/Analytics.tsx

import React from 'react';
import {
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import {
  Users, Home, Key, IndianRupee, Activity,
  ArrowUpRight, ArrowDownRight, Briefcase, Calendar
} from 'lucide-react';

const data = [
  { name: 'Jan', sold: 45, leased: 32, total: 77 },
  { name: 'Feb', sold: 52, leased: 45, total: 97 },
  { name: 'Mar', sold: 48, leased: 55, total: 103 },
  { name: 'Apr', sold: 61, leased: 48, total: 109 },
  { name: 'May', sold: 55, leased: 62, total: 117 },
  { name: 'Jun', sold: 67, leased: 58, total: 125 },
];

const pieData = [
  { name: 'Residential', value: 400 },
  { name: 'Commercial', value: 300 },
  { name: 'Industrial', value: 200 },
  { name: 'Land', value: 100 },
];

const COLORS = ['#DFA659', '#3b82f6', '#10b981', '#f59e0b'];

const StatCard: React.FC<{ title: string, value: string, change: string, isPositive: boolean, icon: React.ReactNode }> = ({ title, value, change, isPositive, icon }) => (
  <div className="bg-surface border border-white/5 p-6 rounded-2xl shadow-xl hover:border-primary/30 transition-all duration-300 group">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-primary/10 rounded-xl text-primary group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div className={`flex items-center text-sm font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
        {isPositive ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
        {change}
      </div>
    </div>
    <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
    <p className="text-2xl font-bold text-white mt-1">{value}</p>
  </div>
);

const Analytics: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Platform Analytics</h1>
          <p className="text-gray-400 mt-1">Real-time performance metrics and usage statistics.</p>
        </div>
        <div className="flex items-center space-x-3 bg-surface border border-white/5 p-1 rounded-xl">
          {['24h', '7d', '30d', '90d'].map((period) => (
            <button
              key={period}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                period === '30d' ? 'bg-primary text-gray-900 shadow-lg shadow-primary/20' : 'text-gray-400 hover:text-white'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Sold" value="1,284" change="+12.5%" isPositive={true} icon={<Home className="w-6 h-6" />} />
        <StatCard title="Total Leased" value="856" change="+8.2%" isPositive={true} icon={<Key className="w-6 h-6" />} />
        <StatCard title="Platform Revenue" value="₹42.5M" change="+15.3%" isPositive={true} icon={<IndianRupee className="w-6 h-6" />} />
        <StatCard title="Active Users" value="12.4K" change="-2.1%" isPositive={false} icon={<Users className="w-6 h-6" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Growth Chart */}
        <div className="bg-surface border border-white/5 p-8 rounded-3xl shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-white">Growth Overview</h2>
              <p className="text-gray-400 text-sm">Monthly comparison of sold vs leased properties</p>
            </div>
            <Activity className="text-primary w-6 h-6" />
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorSold" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#DFA659" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#DFA659" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorLeased" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1E1E1E', border: '1px solid #ffffff10', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="sold" stroke="#DFA659" strokeWidth={3} fillOpacity={1} fill="url(#colorSold)" />
                <Area type="monotone" dataKey="leased" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorLeased)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Property Type Distribution */}
        <div className="bg-surface border border-white/5 p-8 rounded-3xl shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-white">Property Types</h2>
              <p className="text-gray-400 text-sm">Distribution of listing categories</p>
            </div>
            <Briefcase className="text-primary w-6 h-6" />
          </div>
          <div className="h-[300px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1E1E1E', border: '1px solid #ffffff10', borderRadius: '12px' }}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Activity Table Mock */}
      <div className="bg-surface border border-white/5 rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Recent Website Activity</h2>
            <p className="text-gray-400 text-sm">Latest transactions and status changes</p>
          </div>
          <Calendar className="text-primary w-6 h-6" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider">
                <th className="px-8 py-4">Transaction ID</th>
                <th className="px-8 py-4">Property</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4">Value</th>
                <th className="px-8 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                { id: '#TRX-9821', property: 'Oak Ridge Villa', status: 'Sold', value: '₹850,000', date: 'Oct 24, 2023' },
                { id: '#TRX-9820', property: 'Skyline Penthouse', status: 'Leased', value: '₹4,500/mo', date: 'Oct 23, 2023' },
                { id: '#TRX-9819', property: 'Lakefront Cabin', status: 'Sold', value: '₹1,200,000', date: 'Oct 22, 2023' },
                { id: '#TRX-9818', property: 'Urban Loft', status: 'Pending', value: '₹3,200/mo', date: 'Oct 21, 2023' },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors group">
                  <td className="px-8 py-4 font-mono text-sm text-primary">{row.id}</td>
                  <td className="px-8 py-4 text-white font-medium">{row.property}</td>
                  <td className="px-8 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      row.status === 'Sold' ? 'bg-green-900/30 text-green-400' : 
                      row.status === 'Leased' ? 'bg-blue-900/30 text-blue-400' : 'bg-yellow-900/30 text-yellow-400'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-8 py-4 text-gray-300">{row.value}</td>
                  <td className="px-8 py-4 text-gray-400 text-sm">{row.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
