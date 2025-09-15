import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Chip,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Divider,
  Badge,
  Tooltip,
  Alert as MuiAlert,
  Snackbar,
} from '@mui/material';
import {
  Notifications,
  NotificationsActive,
  Close,
  CheckCircle,
  Warning,
  Error,
  Info,
  MarkAsUnread,
  Delete,
} from '@mui/icons-material';
import { useDashboardStore } from '@/store';
import { Alert } from '@/types';

const AlertSystem: React.FC = () => {
  const { alerts, unreadAlerts, markAlertAsRead, markAllAlertsAsRead, removeAlert } = useDashboardStore();
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const getSeverityIcon = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical':
        return <Error color="error" />;
      case 'high':
        return <Error color="error" />;
      case 'medium':
        return <Warning color="warning" />;
      case 'low':
        return <Info color="info" />;
      default:
        return <Info color="info" />;
    }
  };

  const getSeverityColor = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical':
        return 'error';
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'default';
    }
  };

  const handleAlertClick = (alert: Alert) => {
    setSelectedAlert(alert);
    setIsDetailDialogOpen(true);
    if (!alert.isRead) {
      markAlertAsRead(alert.id);
    }
  };

  const handleMarkAllAsRead = () => {
    markAllAlertsAsRead();
    setSnackbarMessage('All alerts marked as read');
    setSnackbarOpen(true);
  };

  const handleDeleteAlert = (alertId: string) => {
    removeAlert(alertId);
    setSnackbarMessage('Alert deleted');
    setSnackbarOpen(true);
  };

  const handleCloseDetailDialog = () => {
    setIsDetailDialogOpen(false);
    setSelectedAlert(null);
  };

  const recentAlerts = alerts.slice(0, 10);
  const criticalAlerts = alerts.filter(alert => alert.severity === 'critical' && !alert.isResolved);

  return (
    <Box>
      {/* Critical Alerts Banner */}
      {criticalAlerts.length > 0 && (
        <MuiAlert severity="error" sx={{ mb: 2 }}>
          <Typography variant="h6">
            {criticalAlerts.length} Critical Alert{criticalAlerts.length > 1 ? 's' : ''} Require Attention
          </Typography>
        </MuiAlert>
      )}

      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Badge badgeContent={unreadAlerts} color="error">
            <NotificationsActive />
          </Badge>
          <Typography variant="h4">
            Alerts & Notifications
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<MarkAsUnread />}
          onClick={handleMarkAllAsRead}
          disabled={unreadAlerts === 0}
        >
          Mark All as Read
        </Button>
      </Box>

      {/* Alerts List */}
      <Card>
        <CardHeader
          title="Recent Alerts"
          subheader={`${alerts.length} total alerts, ${unreadAlerts} unread`}
        />
        <CardContent sx={{ p: 0 }}>
          {recentAlerts.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Notifications sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No alerts
              </Typography>
              <Typography variant="body2" color="text.secondary">
                You're all caught up! New alerts will appear here.
              </Typography>
            </Box>
          ) : (
            <List>
              {recentAlerts.map((alert, index) => (
                <React.Fragment key={alert.id}>
                  <ListItem
                    button
                    onClick={() => handleAlertClick(alert)}
                    sx={{
                      backgroundColor: alert.isRead ? 'transparent' : 'action.hover',
                      '&:hover': {
                        backgroundColor: 'action.selected',
                      },
                    }}
                  >
                    <ListItemIcon>
                      {getSeverityIcon(alert.severity)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle1" noWrap>
                            {alert.title}
                          </Typography>
                          {!alert.isRead && (
                            <Chip
                              label="New"
                              size="small"
                              color="primary"
                              variant="filled"
                            />
                          )}
                          <Chip
                            label={alert.severity}
                            size="small"
                            color={getSeverityColor(alert.severity) as any}
                            variant="outlined"
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary" noWrap>
                            {alert.message}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(alert.timestamp).toLocaleString()}
                          </Typography>
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Tooltip title="Delete alert">
                        <IconButton
                          edge="end"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteAlert(alert.id);
                          }}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </ListItemSecondaryAction>
                  </ListItem>
                  {index < recentAlerts.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      {/* Alert Detail Dialog */}
      <Dialog
        open={isDetailDialogOpen}
        onClose={handleCloseDetailDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {selectedAlert && getSeverityIcon(selectedAlert.severity)}
            <Typography variant="h6">
              {selectedAlert?.title}
            </Typography>
            <Chip
              label={selectedAlert?.severity}
              color={selectedAlert ? getSeverityColor(selectedAlert.severity) as any : 'default'}
              variant="outlined"
            />
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedAlert && (
            <Box>
              <Typography variant="body1" paragraph>
                {selectedAlert.message}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Details:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Type:</strong> {selectedAlert.type}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Timestamp:</strong> {new Date(selectedAlert.timestamp).toLocaleString()}
                </Typography>
                {selectedAlert.hostId && (
                  <Typography variant="body2" color="text.secondary">
                    <strong>Host ID:</strong> {selectedAlert.hostId}
                  </Typography>
                )}
                {selectedAlert.groupId && (
                  <Typography variant="body2" color="text.secondary">
                    <strong>Group ID:</strong> {selectedAlert.groupId}
                  </Typography>
                )}
                <Typography variant="body2" color="text.secondary">
                  <strong>Status:</strong> {selectedAlert.isResolved ? 'Resolved' : 'Active'}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetailDialog}>
            Close
          </Button>
          {selectedAlert && !selectedAlert.isResolved && (
            <Button variant="contained" color="primary">
              Resolve Alert
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default AlertSystem;
