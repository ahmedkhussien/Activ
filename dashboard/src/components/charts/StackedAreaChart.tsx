import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { BaseChart } from './BaseChart';
import { ChartConfig, TrendData } from '@/types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface StackedAreaChartProps {
  data: TrendData[];
  title: string;
  timeRange?: string;
  metrics?: string[];
  onRefresh?: () => void;
  onFullscreen?: () => void;
  onExport?: () => void;
  loading?: boolean;
  error?: string;
  height?: number;
  className?: string;
  showLegend?: boolean;
  smooth?: boolean;
}

export const StackedAreaChart: React.FC<StackedAreaChartProps> = ({
  data,
  title,
  timeRange,
  metrics = ['productive', 'neutral', 'distracting'],
  onRefresh,
  onFullscreen,
  onExport,
  loading = false,
  error,
  height = 300,
  className,
  showLegend = true,
  smooth = true,
}) => {
  const chartData = React.useMemo(() => {
    if (!data || data.length === 0) {
      return {
        labels: [],
        datasets: [],
      };
    }

    const labels = data.map(item => {
      const date = new Date(item.timestamp);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    });

    const colors = [
      { bg: 'rgba(76, 175, 80, 0.6)', border: 'rgba(76, 175, 80, 1)' }, // Green - Productive
      { bg: 'rgba(255, 152, 0, 0.6)', border: 'rgba(255, 152, 0, 1)' }, // Orange - Neutral
      { bg: 'rgba(244, 67, 54, 0.6)', border: 'rgba(244, 67, 54, 1)' }, // Red - Distracting
      { bg: 'rgba(158, 158, 158, 0.6)', border: 'rgba(158, 158, 158, 1)' }, // Grey - Idle
    ];

    const datasets = metrics.map((metric, index) => {
      const values = data.map(item => {
        if (metric === 'value') return item.value;
        return (item as any)[metric] || 0;
      });

      return {
        label: metric.charAt(0).toUpperCase() + metric.slice(1).replace(/_/g, ' '),
        data: values,
        backgroundColor: colors[index % colors.length].bg,
        borderColor: colors[index % colors.length].border,
        borderWidth: 2,
        fill: true,
        tension: smooth ? 0.4 : 0,
        pointRadius: 0,
        pointHoverRadius: 4,
      };
    });

    return {
      labels,
      datasets,
    };
  }, [data, metrics, smooth]);

  const options = React.useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: showLegend,
        position: 'top' as const,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        callbacks: {
          title: (context: any) => {
            const index = context[0].dataIndex;
            const item = data[index];
            return new Date(item.timestamp).toLocaleString();
          },
          label: (context: any) => {
            const value = context.parsed.y;
            const label = context.dataset.label;
            const hours = Math.floor(value / 3600);
            const minutes = Math.floor((value % 3600) / 60);
            return `${label}: ${hours}h ${minutes}m`;
          },
          footer: (context: any) => {
            const total = context.reduce((sum: number, item: any) => sum + item.parsed.y, 0);
            const totalHours = Math.floor(total / 3600);
            const totalMinutes = Math.floor((total % 3600) / 60);
            return `Total: ${totalHours}h ${totalMinutes}m`;
          },
        },
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Time',
        },
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Time (seconds)',
        },
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)',
        },
        beginAtZero: true,
        stacked: true,
        ticks: {
          callback: function(value: any) {
            const hours = Math.floor(value / 3600);
            const minutes = Math.floor((value % 3600) / 60);
            return `${hours}h ${minutes}m`;
          },
        },
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
  }), [data, showLegend]);

  const config: ChartConfig = {
    type: 'stacked_area',
    title,
    data: chartData,
    options,
    timeRange: timeRange ? { start: '', end: '', label: timeRange } : undefined,
  };

  return (
    <BaseChart
      config={config}
      onRefresh={onRefresh}
      onFullscreen={onFullscreen}
      onExport={onExport}
      loading={loading}
      error={error}
      height={height}
      className={className}
    />
  );
};

// Custom chart renderer for BaseChart
export const StackedAreaChartRenderer: React.FC<{ config: ChartConfig }> = ({ config }) => {
  return (
    <Line 
      data={config.data} 
      options={config.options} 
      style={{ height: '100%', width: '100%' }}
    />
  );
};

export default StackedAreaChart;
