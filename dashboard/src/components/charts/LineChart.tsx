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

interface LineChartProps {
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
  fillArea?: boolean;
  smooth?: boolean;
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  title,
  timeRange,
  metrics = ['value'],
  onRefresh,
  onFullscreen,
  onExport,
  loading = false,
  error,
  height = 300,
  className,
  showLegend = true,
  fillArea = false,
  smooth = false,
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
      '#1976d2', // Blue
      '#388e3c', // Green
      '#f57c00', // Orange
      '#d32f2f', // Red
      '#7b1fa2', // Purple
      '#00796b', // Teal
      '#5d4037', // Brown
      '#455a64', // Blue Grey
    ];

    const datasets = metrics.map((metric, index) => {
      const values = data.map(item => {
        if (metric === 'value') return item.value;
        return (item as any)[metric] || 0;
      });

      return {
        label: metric.charAt(0).toUpperCase() + metric.slice(1).replace(/_/g, ' '),
        data: values,
        borderColor: colors[index % colors.length],
        backgroundColor: fillArea 
          ? `${colors[index % colors.length]}20` 
          : 'transparent',
        borderWidth: 2,
        fill: fillArea,
        tension: smooth ? 0.4 : 0,
        pointRadius: 3,
        pointHoverRadius: 5,
        pointBackgroundColor: colors[index % colors.length],
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      };
    });

    return {
      labels,
      datasets,
    };
  }, [data, metrics, fillArea, smooth]);

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
            return `${label}: ${value.toFixed(2)}`;
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
          text: 'Value',
        },
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)',
        },
        beginAtZero: true,
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
  }), [data, showLegend]);

  const config: ChartConfig = {
    type: 'line',
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
export const LineChartRenderer: React.FC<{ config: ChartConfig }> = ({ config }) => {
  return (
    <Line 
      data={config.data} 
      options={config.options} 
      style={{ height: '100%', width: '100%' }}
    />
  );
};

export default LineChart;
