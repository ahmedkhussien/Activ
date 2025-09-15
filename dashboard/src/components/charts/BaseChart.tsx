import React from 'react';
import { Card, CardContent, CardHeader, Typography, Box, IconButton, Tooltip } from '@mui/material';
import { Refresh, Fullscreen, Download } from '@mui/icons-material';
import { Chart as ChartJS, ChartOptions, ChartData } from 'chart.js';
import { ChartConfig } from '@/types';

interface BaseChartProps {
  config: ChartConfig;
  onRefresh?: () => void;
  onFullscreen?: () => void;
  onExport?: () => void;
  loading?: boolean;
  error?: string;
  height?: number;
  className?: string;
}

export const BaseChart: React.FC<BaseChartProps> = ({
  config,
  onRefresh,
  onFullscreen,
  onExport,
  loading = false,
  error,
  height = 300,
  className,
}) => {
  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  const handleFullscreen = () => {
    if (onFullscreen) {
      onFullscreen();
    }
  };

  const handleExport = () => {
    if (onExport) {
      onExport();
    }
  };

  return (
    <Card className={className} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardHeader
        title={
          <Typography variant="h6" component="h2" noWrap>
            {config.title}
          </Typography>
        }
        action={
          <Box>
            {onRefresh && (
              <Tooltip title="Refresh">
                <IconButton size="small" onClick={handleRefresh} disabled={loading}>
                  <Refresh />
                </IconButton>
              </Tooltip>
            )}
            {onFullscreen && (
              <Tooltip title="Fullscreen">
                <IconButton size="small" onClick={handleFullscreen}>
                  <Fullscreen />
                </IconButton>
              </Tooltip>
            )}
            {onExport && (
              <Tooltip title="Export">
                <IconButton size="small" onClick={handleExport}>
                  <Download />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        }
        sx={{ pb: 1 }}
      />
      <CardContent sx={{ flex: 1, pt: 0, pb: 2 }}>
        {error ? (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            height={height}
            color="error.main"
          >
            <Typography variant="body2" color="error">
              {error}
            </Typography>
          </Box>
        ) : loading ? (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            height={height}
          >
            <Typography variant="body2" color="text.secondary">
              Loading...
            </Typography>
          </Box>
        ) : (
          <Box height={height}>
            {config.timeRange && (
              <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                {config.timeRange.label}
              </Typography>
            )}
            <ChartRenderer config={config} />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

// Chart renderer component that will be implemented by specific chart types
const ChartRenderer: React.FC<{ config: ChartConfig }> = ({ config }) => {
  // Import chart renderers dynamically based on type
  switch (config.type) {
    case 'line':
      const { LineChartRenderer } = require('./LineChart');
      return <LineChartRenderer config={config} />;
    case 'bar':
      const { BarChartRenderer } = require('./BarChart');
      return <BarChartRenderer config={config} />;
    case 'doughnut':
    case 'pie':
      const { DoughnutChartRenderer } = require('./DoughnutChart');
      return <DoughnutChartRenderer config={config} />;
    case 'heatmap':
      const { HeatmapChartRenderer } = require('./HeatmapChart');
      return <HeatmapChartRenderer config={config} />;
    case 'gauge':
      const { GaugeChartRenderer } = require('./GaugeChart');
      return <GaugeChartRenderer config={config} />;
    case 'stacked_area':
      const { StackedAreaChartRenderer } = require('./StackedAreaChart');
      return <StackedAreaChartRenderer config={config} />;
    default:
      return (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          height="100%"
          color="text.secondary"
        >
          <Typography variant="body2">
            Chart component for {config.type} not implemented
          </Typography>
        </Box>
      );
  }
};

export default BaseChart;
