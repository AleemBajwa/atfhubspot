import React, { useEffect, useState } from 'react';
import { FiRefreshCw, FiTrendingUp, FiMail, FiMousePointer, FiMessageSquare, FiCheckCircle, FiDollarSign, FiUsers, FiArrowUp, FiArrowDown, FiAlertCircle } from 'react-icons/fi';

interface AnalyticsData {
  emailDeliveryRate: number;
  openRate: number;
  clickThroughRate: number;
  responseRate: number;
  qualificationSuccessRate: number;
  campaignROI: number;
  conversionRate: number;
}

const metrics = [
  {
    key: 'emailDeliveryRate',
    title: 'Email Delivery Rate',
    icon: <FiMail className="w-6 h-6" />,
    suffix: '%',
    description: 'Emails successfully delivered',
    trend: 2.5,
    accent: 'bg-[#00b8ff]',
  },
  {
    key: 'openRate',
    title: 'Open Rate',
    icon: <FiTrendingUp className="w-6 h-6" />,
    suffix: '%',
    description: 'Delivered emails opened',
    trend: 1.8,
    accent: 'bg-[#1a2b49]',
  },
  {
    key: 'clickThroughRate',
    title: 'Click-Through Rate',
    icon: <FiMousePointer className="w-6 h-6" />,
    suffix: '%',
    description: 'Opens that resulted in clicks',
    trend: -0.5,
    accent: 'bg-[#00b8ff]',
  },
  {
    key: 'responseRate',
    title: 'Response Rate',
    icon: <FiMessageSquare className="w-6 h-6" />,
    suffix: '%',
    description: 'Leads who responded',
    trend: 3.2,
    accent: 'bg-[#1a2b49]',
  },
  {
    key: 'qualificationSuccessRate',
    title: 'Qualification Success',
    icon: <FiCheckCircle className="w-6 h-6" />,
    suffix: '%',
    description: 'Leads meeting qualification',
    trend: 1.2,
    accent: 'bg-[#00b8ff]',
  },
  {
    key: 'campaignROI',
    title: 'Campaign ROI',
    icon: <FiDollarSign className="w-6 h-6" />,
    suffix: 'x',
    description: 'Return on investment',
    trend: 5.4,
    accent: 'bg-[#1a2b49]',
  },
  {
    key: 'conversionRate',
    title: 'Conversion Rate',
    icon: <FiUsers className="w-6 h-6" />,
    suffix: '%',
    description: 'Leads converted to opportunities',
    trend: 2.1,
    accent: 'bg-[#00b8ff]',
  },
];

const MetricCard = ({ title, value, icon, suffix, description, trend, accent }: any) => (
  <div className="relative group bg-white rounded-2xl shadow-soft border border-gray-100 p-6 flex flex-col gap-2 min-h-[170px] h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover cursor-pointer">
    <span className={`absolute left-0 top-6 h-8 w-1.5 rounded-full ${accent} group-hover:scale-y-110 transition-transform`} />
    <div className="flex items-center gap-3 mb-2">
      <div className={`p-2 rounded-full ${accent} bg-opacity-10 text-[#00b8ff] group-hover:bg-opacity-20 transition-all`}>{icon}</div>
      <span className="text-lg font-bold text-gray-900">{title}</span>
    </div>
    <div className="flex items-end gap-2">
      <span className="text-4xl font-extrabold text-[#1a2b49]">{value}{suffix}</span>
      {trend !== undefined && (
        <span className={`flex items-center text-sm font-semibold ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}> 
          {trend >= 0 ? <FiArrowUp className="w-4 h-4 mr-0.5" /> : <FiArrowDown className="w-4 h-4 mr-0.5" />} 
          {Math.abs(trend)}%
        </span>
      )}
    </div>
    <span className="text-xs text-gray-400 mt-1">{description}</span>
  </div>
);

const AnalyticsDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAnalytics = async () => {
    setLoading(true);
    setRefreshing(true);
    try {
      const res = await fetch('/api/hubspot/analytics');
      const data = await res.json();
      setAnalytics(data.analytics);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError('Failed to fetch analytics');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-white border border-gray-100 rounded-2xl shadow-soft p-4">
      <div className="max-w-7xl mx-auto relative">
        <button
          onClick={fetchAnalytics}
          disabled={refreshing}
          className="absolute top-0 right-0 m-2 p-2 bg-[#f5f7fa] rounded-full shadow hover:bg-[#e6f7ff] transition disabled:opacity-50 disabled:cursor-not-allowed"
          title="Refresh"
        >
          <FiRefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''} text-[#00b8ff]`} />
        </button>
        {loading && (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="w-10 h-10 border-4 border-[#e6f7ff] border-t-[#00b8ff] rounded-full animate-spin" />
          </div>
        )}
        {error && (
          <div className="flex flex-col items-center justify-center bg-red-50 border border-red-200 rounded-xl p-6 my-6">
            <FiAlertCircle className="w-8 h-8 text-red-600 mb-2" />
            <span className="text-red-700 font-semibold mb-2">{error}</span>
            <button onClick={fetchAnalytics} className="mt-2 px-4 py-2 bg-[#00b8ff] text-white rounded-lg font-bold hover:bg-[#0099cc] transition">Retry</button>
          </div>
        )}
        {analytics && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {metrics.map((m) => (
              <MetricCard
                key={m.key}
                title={m.title}
                value={analytics[m.key as keyof AnalyticsData]}
                icon={m.icon}
                suffix={m.suffix}
                description={m.description}
                trend={m.trend}
                accent={m.accent}
              />
            ))}
          </div>
        )}
        {lastUpdated && (
          <div className="flex justify-end mt-6 text-xs text-gray-400">
            <span className="ml-3 flex items-center"><FiRefreshCw className="w-4 h-4 mr-1" />Last updated: {lastUpdated.toLocaleTimeString()}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboard; 