import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { BaseChart } from './BaseChart';
import { ChartConfig, ProductivityMetrics } from '@/types';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DoughnutChartProps {
  data: ProductivityMetrics | { [key: string]: number };
  title: string;
  onRefresh?: () => void;
  onFullscreen?: () => void;
  onExport?: () => void;
  loading?: boolean;
  error?: string;
  height?: number;
  className?: string;
  showPercentage?: boolean;
  centerText?: string;
}

export const DoughnutChart: React.FC<DoughnutChartProps> = ({
  data,
  title,
  onRefresh,
  onFullscreen,
  onExport,
  loading = false,
  error,
  height = 300,
  className,
  showPercentage = true,
  centerText,
}) => {
  const chartData = React.useMemo(() => {
    if (!data) {
      return {
        labels: [],
        datasets: [],
      };
    }

    let labels: string[] = [];
    let values: number[] = [];
    let colors: string[] = [];

    // Handle ProductivityMetrics type
    if ('totalTime' in data) {
      const metrics = data as ProductivityMetrics;
      labels = ['Productive', 'Neutral', 'Distracting', 'Idle'];
      values = [
        metrics.productiveTime,
        metrics.neutralTime,
        metrics.distractingTime,
        metrics.idleTime,
      ];
      colors = ['#4caf50', '#ff9800', '#f44336', '#9e9e9e'];
    } else {
      // Handle generic object
      const entries = Object.entries(data);
      labels = entries.map(([key]) => key.charAt(0).toUpperCase() + key.slice(1));
      values = entries.map(([, value]) => value);
      
      // Generate colors based on number of entries
      const colorPalette = [
        '#1976d2', '#388e3c', '#f57c00', '#d32f2f', '#7b1fa2',
        '#00796b', '#5d4037', '#455a64', '#e91e63', '#ff9800',
      ];
      colors = colorPalette.slice(0, entries.length);
    }

    // Filter out zero values
    const filteredData = labels.map((label, index) => ({
      label,
      value: values[index],
      color: colors[index],
    })).filter(item => item.value > 0);

    const total = filteredData.reduce((sum, item) => sum + item.value, 0);

    return {
      labels: filteredData.map(item => item.label),
      datasets: [{
        data: filteredData.map(item => item.value),
        backgroundColor: filteredData.map(item => item.color),
        borderColor: filteredData.map(item => item.color),
        borderWidth: 2,
        hoverOffset: 4,
      }],
      total,
    };
  }, [data]);

  const options = React.useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    cutout: '60%',
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.parsed;
            const total = chartData.total;
            const percentage = ((value / total) * 100).toFixed(1);
            const hours = Math.floor(value / 3600);
            const minutes = Math.floor((value % 3600) / 60);
            
            return [
              `${context.label}: ${hours}h ${minutes}m`,
              showPercentage ? `(${percentage}%)` : '',
            ].filter(Boolean);
          },
        },
      },
    },
  }), [chartData.total, showPercentage]);

  const config: ChartConfig = {
    type: 'doughnut',
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
export const DoughnutChartRenderer: React.FC<{ config: ChartConfig }> = ({ config }) => {
  return (
    <Doughnut 
      data={config.data} 
      options={config.options} 
      style={{ height: '100%', width: '100%' }}
    />
  );
};

export default DoughnutChart;
