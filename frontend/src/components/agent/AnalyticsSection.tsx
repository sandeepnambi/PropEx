import { useEffect, useState, type FC } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { Loader2, TrendingUp, IndianRupee, Home, Users } from 'lucide-react';

interface AnalyticsData {
  totalCollected: number;
  totalPending: number;
  vacancyRate: number;
  totalProperties: number;
  activeTenants: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const AnalyticsSection: FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api'}/analytics/management`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.ok) {
          const result = await response.json();
          setData(result.data);
        }
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12 text-gray-400">
        No analytics data available yet.
      </div>
    );
  }

  // Mock data for trends (since backend only provides current snapshot)
  const rentTrendData = [
    { name: 'Jan', amount: data.totalCollected * 0.8 },
    { name: 'Feb', amount: data.totalCollected * 0.85 },
    { name: 'Mar', amount: data.totalCollected * 0.9 },
    { name: 'Apr', amount: data.totalCollected },
  ];

  const occupancyData = [
    { name: 'Occupied', value: data.activeTenants },
    { name: 'Vacant', value: data.totalProperties - data.activeTenants },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Revenue Card */}
        <div className="bg-[#1a1d24] p-6 rounded-2xl border border-gray-800 shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-green-500/10 rounded-xl">
              <IndianRupee className="w-6 h-6 text-green-500" />
            </div>
            <div className="flex items-center text-green-500 text-sm font-medium">
              <TrendingUp className="w-4 h-4 mr-1" />
              +12.5%
            </div>
          </div>
          <p className="text-gray-400 text-sm mb-1">Total Revenue Collected</p>
          <h3 className="text-3xl font-bold text-white">₹{data.totalCollected.toLocaleString()}</h3>
        </div>

        {/* Occupancy Card */}
        <div className="bg-[#1a1d24] p-6 rounded-2xl border border-gray-800 shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Home className="w-6 h-6 text-primary" />
            </div>
            <div className="flex items-center text-primary text-sm font-medium">
              <TrendingUp className="w-4 h-4 mr-1" />
              Stable
            </div>
          </div>
          <p className="text-gray-400 text-sm mb-1">Occupancy Rate</p>
          <h3 className="text-3xl font-bold text-white">{100 - data.vacancyRate}%</h3>
        </div>

        {/* Active Tenants Card */}
        <div className="bg-[#1a1d24] p-6 rounded-2xl border border-gray-800 shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-secondary/10 rounded-xl">
              <Users className="w-6 h-6 text-secondary" />
            </div>
            <div className="flex items-center text-secondary text-sm font-medium">
              <TrendingUp className="w-4 h-4 mr-1" />
              +2
            </div>
          </div>
          <p className="text-gray-400 text-sm mb-1">Active Tenants</p>
          <h3 className="text-3xl font-bold text-white">{data.activeTenants}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Rent Collection Chart */}
        <div className="bg-[#1a1d24] p-6 rounded-2xl border border-gray-800 shadow-lg">
          <h4 className="text-lg font-bold text-white mb-6">Rent Collection Trend</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rentTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
                <XAxis dataKey="name" stroke="#718096" />
                <YAxis stroke="#718096" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1d24', border: '1px solid #2d3748' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Occupancy Pie Chart */}
        <div className="bg-[#1a1d24] p-6 rounded-2xl border border-gray-800 shadow-lg">
          <h4 className="text-lg font-bold text-white mb-6">Property Occupancy</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={occupancyData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {occupancyData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1d24', border: '1px solid #2d3748' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsSection;
