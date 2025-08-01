
import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import { HealthMetric } from '../../types';
import { apiService } from '../../services/apiService';

const SystemHealthPage: React.FC = () => {
  const [metrics, setMetrics] = useState<HealthMetric[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHealth = async () => {
        setIsLoading(true);
        const healthMetrics = await apiService.getSystemHealth();
        setMetrics(healthMetrics);
        setIsLoading(false);
    }
    fetchHealth();
  }, []);

  const HealthMetricDisplay = ({ name, status, value }: HealthMetric) => (
    <div className="flex justify-between items-center p-4 border-b last:border-b-0">
        <div>
            <p className="font-semibold">{name}</p>
            <p className="text-sm text-gray-500">{value}</p>
        </div>
        <div className="flex items-center gap-2">
            <span className={`capitalize text-xs font-medium ${status === 'ok' ? 'text-green-600' : status === 'warn' ? 'text-yellow-600' : 'text-red-600'}`}>{status === 'ok' ? 'Operational' : status}</span>
            <div className={`w-3 h-3 rounded-full ${status === 'ok' ? 'bg-green-500' : status === 'warn' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
        </div>
    </div>
  );

  return (
    <div>
      <h1 className="text-3xl font-bold text-brand-dark mb-6">System Health</h1>
      <Card>
        {isLoading ? (
            <div className="p-4 text-center">Loading system health...</div>
        ) : (
            metrics.map(metric => <HealthMetricDisplay key={metric.name} {...metric} />)
        )}
      </Card>
    </div>
  );
};

export default SystemHealthPage;