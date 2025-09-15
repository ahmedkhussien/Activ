import React from 'react';
import { Box, Typography } from '@mui/material';
import { BaseChart } from './BaseChart';
import { ChartConfig, ActivityHeatmapData } from '@/types';

interface HeatmapChartProps {
  data: ActivityHeatmapData[];
  title: string;
  onRefresh?: () => void;
  onFullscreen?: () => void;
  onExport?: () => void;
  loading?: boolean;
  error?: string;
  height?: number;
  className?: string;
  showLabels?: boolean;
  colorScheme?: 'blue' | 'green' | 'red' | 'purple';
}

export const HeatmapChart: React.FC<HeatmapChartProps> = ({
  data,
  title,
  onRefresh,
  onFullscreen,
  onExport,
  loading = false,
  error,
  height = 300,
  className,
  showLabels = true,
  colorScheme = 'blue',
}) => {
  const chartData = React.useMemo(() => {
    if (!data || data.length === 0) {
      return { heatmap: [], maxIntensity: 0 };
    }

    // Create a 7x24 grid (days x hours)
    const heatmap = Array(7).fill(null).map(() => Array(24).fill(0));
    let maxIntensity = 0;

    data.forEach(item => {
      if (item.day >= 0 && item.day < 7 && item.hour >= 0 && item.hour < 24) {
        heatmap[item.day][item.hour] = item.intensity;
        maxIntensity = Math.max(maxIntensity, item.intensity);
      }
    });

    return { heatmap, maxIntensity };
  }, [data]);

  const getColor = (intensity: number, maxIntensity: number) => {
    if (maxIntensity === 0) return '#f5f5f5';
    
    const opacity = intensity / maxIntensity;
    
    switch (colorScheme) {
      case 'blue':
        return `rgba(25, 118, 210, ${opacity})`;
      case 'green':
        return `rgba(56, 142, 60, ${opacity})`;
      case 'red':
        return `rgba(244, 67, 54, ${opacity})`;
      case 'purple':
        return `rgba(123, 31, 162, ${opacity})`;
      default:
        return `rgba(25, 118, 210, ${opacity})`;
    }
  };

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const hourLabels = Array.from({ length: 24 }, (_, i) => i);

  const config: ChartConfig = {
    type: 'heatmap',
    title,
    data: chartData,
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

// Custom heatmap renderer
export const HeatmapChartRenderer: React.FC<{ config: ChartConfig }> = ({ config }) => {
  const { heatmap, maxIntensity } = config.data;
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getColor = (intensity: number) => {
    if (maxIntensity === 0) return '#f5f5f5';
    const opacity = intensity / maxIntensity;
    return `rgba(25, 118, 210, ${opacity})`;
  };

  return (
    <Box sx={{ height: '100%', width: '100%', p: 1 }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(25, 1fr)',
          gap: 0.5,
          height: '100%',
        }}
      >
        {/* Empty cell for alignment */}
        <Box />
        
        {/* Hour labels */}
        {Array.from({ length: 24 }, (_, hour) => (
          <Box
            key={`hour-${hour}`}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.7rem',
              color: 'text.secondary',
              writingMode: 'vertical-rl',
              textOrientation: 'mixed',
            }}
          >
            {hour}
          </Box>
        ))}

        {/* Day rows */}
        {dayLabels.map((day, dayIndex) => (
          <React.Fragment key={day}>
            {/* Day label */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.7rem',
                color: 'text.secondary',
                fontWeight: 'medium',
              }}
            >
              {day}
            </Box>
            
            {/* Hour cells for this day */}
            {Array.from({ length: 24 }, (_, hour) => (
              <Box
                key={`${dayIndex}-${hour}`}
                sx={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: getColor(heatmap[dayIndex]?.[hour] || 0),
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  borderRadius: 0.5,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'scale(1.1)',
                    zIndex: 1,
                    boxShadow: 2,
                  },
                }}
                title={`${day} ${hour}:00 - Intensity: ${(heatmap[dayIndex]?.[hour] || 0).toFixed(2)}`}
              />
            ))}
          </React.Fragment>
        ))}
      </Box>
    </Box>
  );
};

export default HeatmapChart;
