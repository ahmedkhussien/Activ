import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { BaseChart } from './BaseChart';
import { ChartConfig, ApplicationUsage, WebsiteUsage } from '@/types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BarChartProps {
  data: ApplicationUsage[] | WebsiteUsage[] | any[];
  title: string;
  groupBy?: 'daily' | 'weekly' | 'monthly';
  showTop?: number;
  onRefresh?: () => void;
  onFullscreen?: () => void;
  onExport?: () => void;
  loading?: boolean;
  error?: string;
  height?: number;
  className?: string;
  horizontal?: boolean;
  stacked?: boolean;
  dataKey?: string;
  labelKey?: string;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  title,
  groupBy = 'daily',
  showTop = 10,
  onRefresh,
  onFullscreen,
  onExport,
  loading = false,
  error,
  height = 300,
  className,
  horizontal = false,
  stacked = false,
  dataKey = 'time',
  labelKey = 'name',
}) => {
  const chartData = React.useMemo(() => {
    if (!data || data.length === 0) {
      return {
        labels: [],
        datasets: [],
      };
    }

    // Sort data by the specified key and take top N items
    const sortedData = [...data]
      .sort((a, b) => (b[dataKey] || 0) - (a[dataKey] || 0))
      .slice(0, showTop);

    const labels = sortedData.map(item => {
      const label = item[labelKey] || item.name || item.domain || 'Unknown';
      return label.length > 20 ? label.substring(0, 20) + '...' : label;
    });

    const values = sortedData.map(item => item[dataKey] || 0);

    // Convert seconds to hours for better readability
    const hoursValues = values.map(seconds => Math.round((seconds / 3600) * 100) / 100);

    const colors = [
      '#1976d2', '#388e3c', '#f57c00', '#d32f2f', '#7b1fa2',
      '#00796b', '#5d4037', '#455a64', '#e91e63', '#ff9800',
    ];

    const datasets = [{
      label: 'Time (hours)',
      data: hoursValues,
      backgroundColor: colors.slice(0, hoursValues.length).map(color => `${color}80`),
      borderColor: colors.slice(0, hoursValues.length),
      borderWidth: 1,
      borderRadius: 4,
      borderSkipped: false,
    }];

    return {
      labels,
      datasets,
    };
  }, [data, showTop, dataKey, labelKey]);

  const options = React.useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: horizontal ? 'y' as const : 'x' as const,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          title: (context: any) => {
            const index = context[0].dataIndex;
            return data[index]?.[labelKey] || data[index]?.name || data[index]?.domain || 'Unknown';
          },
          label: (context: any) => {
            const hours = context.parsed[horizontal ? 'x' : 'y'];
            const seconds = data[context.dataIndex]?.[dataKey] || 0;
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            return [
              `Time: ${hours.toFixed(2)} hours`,
              `Duration: ${minutes}m ${remainingSeconds}s`,
            ];
          },
        },
      },
    },
    scales: {
      x: {
        display: !horizontal,
        title: {
          display: !horizontal,
          text: 'Time (hours)',
        },
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)',
        },
        stacked,
        beginAtZero: true,
      },
      y: {
        display: horizontal,
        title: {
          display: horizontal,
          text: 'Time (hours)',
        },
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)',
        },
        stacked,
        beginAtZero: true,
      },
    },
  }), [data, horizontal, stacked, dataKey, labelKey]);

  const config: ChartConfig = {
    type: 'bar',
    title,
    data: chartData,
    options,
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
export const BarChartRenderer: React.FC<{ config: ChartConfig }> = ({ config }) => {
  return (
    <Bar 
      data={config.data} 
      options={config.options} 
      style={{ height: '100%', width: '100%' }}
    />
  );
};

export default BarChart;
