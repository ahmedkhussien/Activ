import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Paper,
  Chip,
  LinearProgress,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  ArrowBack,
  Computer,
  Refresh,
  TrendingUp,
  TrendingDown,
  AccessTime,
  Notifications,
} from '@mui/icons-material';
import { useDashboardStore } from '@/store';
import { LineChart, BarChart, HeatmapChart, GaugeChart } from '@/components/charts';
import { apiService } from '@/services/api';
import { Host, HostMetrics, TimeRange } from '@/types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`host-tabpanel-${index}`}
      aria-labelledby={`host-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const HostDetail: React.FC = () => {
  const { hostId } = useParams<{ hostId: string }>();
  const navigate = useNavigate();
  const { hosts } = useDashboardStore();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<HostMetrics | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>({
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    end: new Date().toISOString(),
    label: 'Last 7 days',
  });

  const host = hosts.find(h => h.id === hostId);

  useEffect(() => {
    if (hostId) {
      loadHostMetrics();
    }
  }, [hostId, timeRange]);

  const loadHostMetrics = async () => {
    if (!hostId) return;
    
    try {
      setLoading(true);
      const hostMetrics = await apiService.getHostMetrics(hostId, timeRange);
      setMetrics(hostMetrics);
    } catch (error) {
      console.error('Failed to load host metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleRefresh = () => {
    loadHostMetrics();
  };

  if (!host) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4">Host not found</Typography>
        <Button onClick={() => navigate('/')}>
          Back to Dashboard
        </Button>
      </Box>
    );
  }

  // Mock data for charts
  const activityTrendData = [
    { timestamp: '2024-01-01T00:00:00Z', value: 75, active: 6 * 3600, idle: 2 * 3600 },
    { timestamp: '2024-01-02T00:00:00Z', value: 82, active: 7 * 3600, idle: 1 * 3600 },
    { timestamp: '2024-01-03T00:00:00Z', value: 68, active: 5 * 3600, idle: 3 * 3600 },
    { timestamp: '2024-01-04T00:00:00Z', value: 90, active: 8 * 3600, idle: 0 * 3600 },
    { timestamp: '2024-01-05T00:00:00Z', value: 78, active: 6.5 * 3600, idle: 1.5 * 3600 },
  ];

  const heatmapData = Array.from({ length: 168 }, (_, i) => ({
    hour: i % 24,
    day: Math.floor(i / 24),
    intensity: Math.random(),
    activity: Math.random() * 3600,
  }));

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/')}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" gutterBottom>
            {host.name}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {host.hostname} • {host.platform} • {host.version}
          </Typography>
        </Box>
        <Tooltip title="Refresh data">
          <IconButton onClick={handleRefresh} disabled={loading}>
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Host Status Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Computer sx={{ fontSize: 40, color: 'primary.main' }} />
                <Box>
                  <Typography variant="h6">Status</Typography>
                  <Chip
                    label={host.isOnline ? 'Online' : 'Offline'}
                    color={host.isOnline ? 'success' : 'error'}
                    variant="filled"
                  />
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Last Seen
                </Typography>
                <Typography variant="h6">
                  {new Date(host.lastSeen).toLocaleString()}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Timezone
                </Typography>
                <Typography variant="h6">
                  {host.timezone}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Productivity Score
                </Typography>
                <Typography variant="h6">
                  {metrics?.productivityScore ? Math.round(metrics.productivityScore) : 0}%
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Overview" />
          <Tab label="Activity" />
          <Tab label="Applications" />
          <Tab label="Heatmap" />
        </Tabs>
      </Paper>

      {/* Tab Panels */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          {/* Activity Trend */}
          <Grid item xs={12} lg={8}>
            <LineChart
              data={activityTrendData}
              title="Activity Trend"
              timeRange={timeRange.label}
              metrics={['active', 'idle']}
              onRefresh={handleRefresh}
              loading={loading}
              height={400}
              fillArea={true}
            />
          </Grid>

          {/* Productivity Gauge */}
          <Grid item xs={12} lg={4}>
            <GaugeChart
              value={metrics?.productivityScore || 0}
              title="Productivity Score"
              max={100}
              thresholds={{ low: 30, medium: 70, high: 90 }}
              unit="%"
              onRefresh={handleRefresh}
              loading={loading}
              height={400}
            />
          </Grid>

          {/* Metrics Cards */}
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="text.secondary" gutterBottom>
                      Active Time
                    </Typography>
                    <Typography variant="h4">
                      {metrics ? Math.round(metrics.activeTime / 3600) : 0}h
                    </Typography>
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
                      Productive Time
                    </Typography>
                    <Typography variant="h4">
                      {metrics ? Math.round(metrics.productiveTime / 3600) : 0}h
                    </Typography>
                  </Box>
                  <TrendingUp sx={{ fontSize: 40, color: 'success.main' }} />
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
                      Idle Time
                    </Typography>
                    <Typography variant="h4">
                      {metrics ? Math.round(metrics.idleTime / 3600) : 0}h
                    </Typography>
                  </Box>
                  <TrendingDown sx={{ fontSize: 40, color: 'warning.main' }} />
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
                      AFK Time
                    </Typography>
                    <Typography variant="h4">
                      {metrics ? Math.round(metrics.afkTime / 3600) : 0}h
                    </Typography>
                  </Box>
                  <Notifications sx={{ fontSize: 40, color: 'error.main' }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <LineChart
              data={activityTrendData}
              title="Activity Over Time"
              timeRange={timeRange.label}
              metrics={['active', 'idle']}
              onRefresh={handleRefresh}
              loading={loading}
              height={400}
            />
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <BarChart
              data={metrics?.applications || []}
              title="Application Usage"
              showTop={10}
              onRefresh={handleRefresh}
              loading={loading}
              height={400}
              horizontal={true}
              dataKey="time"
              labelKey="name"
            />
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <HeatmapChart
              data={heatmapData}
              title="Activity Heatmap"
              onRefresh={handleRefresh}
              loading={loading}
              height={400}
              showLabels={true}
            />
          </Grid>
        </Grid>
      </TabPanel>
    </Box>
  );
};

export default HostDetail;
