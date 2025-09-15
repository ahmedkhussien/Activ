import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Paper,
  Chip,
  LinearProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Computer,
  Group,
  AccessTime,
  Notifications,
  Refresh,
} from '@mui/icons-material';
import { useDashboardStore } from '@/store';
import { LineChart, BarChart, DoughnutChart, GaugeChart } from '@/components/charts';
import { apiService } from '@/services/api';
import { HostMetrics, GroupAnalytics, TimeRange } from '@/types';

const Dashboard: React.FC = () => {
  const { hosts, hostGroups, selectedGroupId } = useDashboardStore();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<HostMetrics[]>([]);
  const [groupAnalytics, setGroupAnalytics] = useState<GroupAnalytics | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>({
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    end: new Date().toISOString(),
    label: 'Last 7 days',
  });

  useEffect(() => {
    loadDashboardData();
  }, [selectedGroupId, timeRange]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      if (selectedGroupId) {
        const analytics = await apiService.getGroupAnalytics(selectedGroupId, timeRange);
        setGroupAnalytics(analytics);
      } else {
        // Load metrics for all hosts
        const hostMetrics = await Promise.all(
          hosts.map(host => apiService.getHostMetrics(host.id, timeRange))
        );
        setMetrics(hostMetrics);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadDashboardData();
  };

  // Calculate summary statistics
  const totalHosts = hosts.length;
  const onlineHosts = hosts.filter(host => host.isOnline).length;
  const totalGroups = hostGroups.length;
  
  const totalActiveTime = metrics.reduce((sum, metric) => sum + metric.activeTime, 0);
  const totalProductiveTime = metrics.reduce((sum, metric) => sum + metric.productiveTime, 0);
  const avgProductivity = metrics.length > 0 
    ? metrics.reduce((sum, metric) => sum + metric.productivityScore, 0) / metrics.length 
    : 0;

  // Mock data for charts
  const productivityTrendData = [
    { timestamp: '2024-01-01T00:00:00Z', value: 75, productive: 6 * 3600, neutral: 2 * 3600, distracting: 1 * 3600 },
    { timestamp: '2024-01-02T00:00:00Z', value: 82, productive: 7 * 3600, neutral: 1.5 * 3600, distracting: 0.5 * 3600 },
    { timestamp: '2024-01-03T00:00:00Z', value: 68, productive: 5 * 3600, neutral: 2.5 * 3600, distracting: 1.5 * 3600 },
    { timestamp: '2024-01-04T00:00:00Z', value: 90, productive: 8 * 3600, neutral: 1 * 3600, distracting: 0 * 3600 },
    { timestamp: '2024-01-05T00:00:00Z', value: 78, productive: 6.5 * 3600, neutral: 2 * 3600, distracting: 0.5 * 3600 },
  ];

  const topApplications = [
    { name: 'Visual Studio Code', time: 8 * 3600, category: 'productive' as const, sessions: 12, avgSessionDuration: 2400 },
    { name: 'Chrome', time: 6 * 3600, category: 'neutral' as const, sessions: 25, avgSessionDuration: 864 },
    { name: 'Slack', time: 3 * 3600, category: 'productive' as const, sessions: 8, avgSessionDuration: 1350 },
    { name: 'Spotify', time: 2 * 3600, category: 'distracting' as const, sessions: 1, avgSessionDuration: 7200 },
  ];

  const productivityMetrics = {
    totalTime: totalActiveTime,
    activeTime: totalActiveTime,
    idleTime: 0,
    productiveTime: totalProductiveTime,
    neutralTime: totalActiveTime - totalProductiveTime,
    distractingTime: 0,
    afkTime: 0,
    workingHours: 8 * 3600,
    overtime: Math.max(0, totalActiveTime - 8 * 3600),
    productivityScore: avgProductivity,
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Dashboard
        </Typography>
        <Tooltip title="Refresh data">
          <IconButton onClick={handleRefresh} disabled={loading}>
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Total Hosts
                  </Typography>
                  <Typography variant="h4">
                    {totalHosts}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: 'success.main',
                        mr: 1,
                      }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {onlineHosts} online
                    </Typography>
                  </Box>
                </Box>
                <Computer sx={{ fontSize: 40, color: 'primary.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Host Groups
                  </Typography>
                  <Typography variant="h4">
                    {totalGroups}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Group sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {hostGroups.length} groups
                    </Typography>
                  </Box>
                </Box>
                <Group sx={{ fontSize: 40, color: 'primary.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Active Time
                  </Typography>
                  <Typography variant="h4">
                    {Math.round(totalActiveTime / 3600)}h
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <AccessTime sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      Today
                    </Typography>
                  </Box>
                </Box>
                <AccessTime sx={{ fontSize: 40, color: 'primary.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Productivity
                  </Typography>
                  <Typography variant="h4">
                    {Math.round(avgProductivity)}%
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    {avgProductivity > 70 ? (
                      <TrendingUp sx={{ fontSize: 16, mr: 1, color: 'success.main' }} />
                    ) : (
                      <TrendingDown sx={{ fontSize: 16, mr: 1, color: 'error.main' }} />
                    )}
                    <Typography variant="body2" color="text.secondary">
                      Average
                    </Typography>
                  </Box>
                </Box>
                <TrendingUp sx={{ fontSize: 40, color: 'primary.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Grid */}
      <Grid container spacing={3}>
        {/* Productivity Trends */}
        <Grid item xs={12} lg={8}>
          <LineChart
            data={productivityTrendData}
            title="Productivity Trends"
            timeRange={timeRange.label}
            metrics={['productive', 'neutral', 'distracting']}
            onRefresh={handleRefresh}
            loading={loading}
            height={400}
            fillArea={true}
            smooth={true}
          />
        </Grid>

        {/* Productivity Gauge */}
        <Grid item xs={12} lg={4}>
          <GaugeChart
            value={avgProductivity}
            title="Overall Productivity"
            max={100}
            thresholds={{ low: 30, medium: 70, high: 90 }}
            unit="%"
            onRefresh={handleRefresh}
            loading={loading}
            height={400}
          />
        </Grid>

        {/* Time Distribution */}
        <Grid item xs={12} md={6}>
          <DoughnutChart
            data={productivityMetrics}
            title="Time Distribution"
            onRefresh={handleRefresh}
            loading={loading}
            height={300}
            showPercentage={true}
          />
        </Grid>

        {/* Top Applications */}
        <Grid item xs={12} md={6}>
          <BarChart
            data={topApplications}
            title="Top Applications"
            showTop={5}
            onRefresh={handleRefresh}
            loading={loading}
            height={300}
            horizontal={true}
            dataKey="time"
            labelKey="name"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
