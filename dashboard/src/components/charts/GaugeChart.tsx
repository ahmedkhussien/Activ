import React from 'react';
import { Box, Typography, LinearProgress, Chip } from '@mui/material';
import { BaseChart } from './BaseChart';
import { ChartConfig } from '@/types';

interface GaugeChartProps {
  value: number;
  title: string;
  max?: number;
  thresholds?: {
    low: number;
    medium: number;
    high: number;
  };
  unit?: string;
  onRefresh?: () => void;
  onFullscreen?: () => void;
  onExport?: () => void;
  loading?: boolean;
  error?: string;
  height?: number;
  className?: string;
  showValue?: boolean;
  showThresholds?: boolean;
  colorScheme?: 'blue' | 'green' | 'red' | 'purple';
}

export const GaugeChart: React.FC<GaugeChartProps> = ({
  value,
  title,
  max = 100,
  thresholds = { low: 30, medium: 70, high: 90 },
  unit = '%',
  onRefresh,
  onFullscreen,
  onExport,
  loading = false,
  error,
  height = 300,
  className,
  showValue = true,
  showThresholds = true,
  colorScheme = 'blue',
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  const getColor = (val: number) => {
    if (val < thresholds.low) return '#f44336'; // Red
    if (val < thresholds.medium) return '#ff9800'; // Orange
    if (val < thresholds.high) return '#4caf50'; // Green
    return '#1976d2'; // Blue
  };

  const getStatus = (val: number) => {
    if (val < thresholds.low) return 'Low';
    if (val < thresholds.medium) return 'Medium';
    if (val < thresholds.high) return 'Good';
    return 'Excellent';
  };

  const config: ChartConfig = {
    type: 'gauge',
    title,
    data: { value, max, percentage, color: getColor(percentage) },
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

// Custom gauge renderer
export const GaugeChartRenderer: React.FC<{ config: ChartConfig }> = ({ config }) => {
  const { value, max, percentage, color } = config.data;
  
  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      {/* Circular Progress */}
      <Box
        sx={{
          position: 'relative',
          width: 120,
          height: 120,
          mb: 2,
        }}
      >
        <svg
          width="120"
          height="120"
          style={{ transform: 'rotate(-90deg)' }}
        >
          {/* Background circle */}
          <circle
            cx="60"
            cy="60"
            r="50"
            fill="none"
            stroke="#e0e0e0"
            strokeWidth="8"
          />
          {/* Progress circle */}
          <circle
            cx="60"
            cy="60"
            r="50"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 50}`}
            strokeDashoffset={`${2 * Math.PI * 50 * (1 - percentage / 100)}`}
            style={{
              transition: 'stroke-dashoffset 0.5s ease-in-out',
            }}
          />
        </svg>
        
        {/* Center text */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
          }}
        >
          <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color }}>
            {value.toFixed(0)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {config.data.unit || '%'}
          </Typography>
        </Box>
      </Box>

      {/* Status indicator */}
      <Chip
        label={getStatus(percentage)}
        color={getStatusColor(percentage)}
        size="small"
        sx={{ mb: 1 }}
      />

      {/* Additional info */}
      <Typography variant="body2" color="text.secondary" textAlign="center">
        Max: {max}
      </Typography>
    </Box>
  );
};

const getStatus = (percentage: number) => {
  if (percentage < 30) return 'Low';
  if (percentage < 70) return 'Medium';
  if (percentage < 90) return 'Good';
  return 'Excellent';
};

const getStatusColor = (percentage: number): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
  if (percentage < 30) return 'error';
  if (percentage < 70) return 'warning';
  if (percentage < 90) return 'success';
  return 'primary';
};

export default GaugeChart;
