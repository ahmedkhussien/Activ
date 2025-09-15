import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  LinearProgress,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Refresh,
  Info,
} from '@mui/icons-material';
import { ProductivityMetrics } from '@/types';

interface ProductivityWidgetProps {
  metrics: ProductivityMetrics;
  title?: string;
  onRefresh?: () => void;
  loading?: boolean;
  className?: string;
}

export const ProductivityWidget: React.FC<ProductivityWidgetProps> = ({
  metrics,
  title = 'Productivity Overview',
  onRefresh,
  loading = false,
  className,
}) => {
  const productivityScore = metrics.productivityScore;
  const totalTime = metrics.totalTime;
  const productiveTime = metrics.productiveTime;
  const neutralTime = metrics.neutralTime;
  const distractingTime = metrics.distractingTime;

  const productivePercentage = totalTime > 0 ? (productiveTime / totalTime) * 100 : 0;
  const neutralPercentage = totalTime > 0 ? (neutralTime / totalTime) * 100 : 0;
  const distractingPercentage = totalTime > 0 ? (distractingTime / totalTime) * 100 : 0;

  const getProductivityColor = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  const getProductivityLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <Card className={className}>
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">{title}</Typography>
            {onRefresh && (
              <Tooltip title="Refresh">
                <IconButton size="small" onClick={onRefresh} disabled={loading}>
                  <Refresh />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        }
        action={
          <Tooltip title="Productivity score based on time spent in productive vs distracting applications">
            <IconButton size="small">
              <Info />
            </IconButton>
          </Tooltip>
        }
      />
      <CardContent>
        {/* Productivity Score */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Productivity Score
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                label={getProductivityLabel(productivityScore)}
                color={getProductivityColor(productivityScore) as any}
                size="small"
              />
              <Typography variant="h4" color={`${getProductivityColor(productivityScore)}.main`}>
                {Math.round(productivityScore)}%
              </Typography>
            </Box>
          </Box>
          <LinearProgress
            variant="determinate"
            value={productivityScore}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: 'grey.200',
              '& .MuiLinearProgress-bar': {
                backgroundColor: `${getProductivityColor(productivityScore)}.main`,
              },
            }}
          />
        </Box>

        {/* Time Breakdown */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Time Distribution
          </Typography>
          
          {/* Productive Time */}
          <Box sx={{ mb: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2" color="success.main">
                Productive
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formatTime(productiveTime)} ({productivePercentage.toFixed(1)}%)
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={productivePercentage}
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: 'grey.100',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: 'success.main',
                },
              }}
            />
          </Box>

          {/* Neutral Time */}
          <Box sx={{ mb: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2" color="warning.main">
                Neutral
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formatTime(neutralTime)} ({neutralPercentage.toFixed(1)}%)
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={neutralPercentage}
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: 'grey.100',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: 'warning.main',
                },
              }}
            />
          </Box>

          {/* Distracting Time */}
          <Box sx={{ mb: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2" color="error.main">
                Distracting
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formatTime(distractingTime)} ({distractingPercentage.toFixed(1)}%)
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={distractingPercentage}
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: 'grey.100',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: 'error.main',
                },
              }}
            />
          </Box>
        </Box>

        {/* Summary Stats */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 2, borderTop: 1, borderColor: 'divider' }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" color="primary.main">
              {formatTime(totalTime)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Total Time
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" color="success.main">
              {formatTime(productiveTime)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Productive
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" color="error.main">
              {formatTime(metrics.overtime)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Overtime
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductivityWidget;
