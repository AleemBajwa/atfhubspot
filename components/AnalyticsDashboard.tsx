import React, { useEffect, useState } from 'react';

interface AnalyticsData {
  emailDeliveryRate: number;
  openRate: number;
  clickThroughRate: number;
  responseRate: number;
  qualificationSuccessRate: number;
  campaignROI: number;
  conversionRate: number;
}

const AnalyticsDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchAnalytics = () => {
    setLoading(true);
    fetch('/api/hubspot/analytics')
      .then((res) => res.json())
      .then((data) => {
        setAnalytics(data.analytics);
        setLastUpdated(new Date());
      })
      .catch(() => setError('Failed to fetch analytics'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 10000); // 10 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading && !analytics) return <div>Loading analytics...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!analytics) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-2">Analytics Dashboard</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-gray-100 rounded">
          <div className="font-semibold">Email Delivery Rate</div>
          <div>{analytics.emailDeliveryRate}%</div>
        </div>
        <div className="p-4 bg-gray-100 rounded">
          <div className="font-semibold">Open Rate</div>
          <div>{analytics.openRate}%</div>
        </div>
        <div className="p-4 bg-gray-100 rounded">
          <div className="font-semibold">Click-Through Rate</div>
          <div>{analytics.clickThroughRate}%</div>
        </div>
        <div className="p-4 bg-gray-100 rounded">
          <div className="font-semibold">Response Rate</div>
          <div>{analytics.responseRate}%</div>
        </div>
        <div className="p-4 bg-gray-100 rounded">
          <div className="font-semibold">Qualification Success Rate</div>
          <div>{analytics.qualificationSuccessRate}%</div>
        </div>
        <div className="p-4 bg-gray-100 rounded">
          <div className="font-semibold">Campaign ROI</div>
          <div>{analytics.campaignROI}</div>
        </div>
        <div className="p-4 bg-gray-100 rounded">
          <div className="font-semibold">Conversion Rate</div>
          <div>{analytics.conversionRate}%</div>
        </div>
      </div>
      {lastUpdated && (
        <div className="text-xs text-gray-500">Last updated: {lastUpdated.toLocaleTimeString()}</div>
      )}
    </div>
  );
};

export default AnalyticsDashboard; 