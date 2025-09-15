import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Grid, Paper } from '@mui/material';
import { ArrowBack, Add } from '@mui/icons-material';
import { useDashboardStore } from '@/store';
import GroupManager from '@/components/groups/GroupManager';
import GroupCard from '@/components/groups/GroupCard';

const Groups: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const { hostGroups, hosts } = useDashboardStore();

  if (groupId === 'new') {
    return <GroupManager />;
  }

  if (groupId) {
    const group = hostGroups.find(g => g.id === groupId);
    if (!group) {
      return (
        <Box sx={{ p: 3 }}>
          <Typography variant="h4">Group not found</Typography>
          <Button onClick={() => navigate('/groups')}>
            Back to Groups
          </Button>
        </Box>
      );
    }

    return (
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/groups')}
            sx={{ mr: 2 }}
          >
            Back
          </Button>
          <Typography variant="h4">
            {group.name}
          </Typography>
        </Box>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Group Details
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {group.description}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Created: {new Date(group.createdAt).toLocaleDateString()}
          </Typography>
        </Paper>

        <Typography variant="h5" gutterBottom>
          Hosts in this Group
        </Typography>
        <Grid container spacing={2}>
          {hosts
            .filter(host => group.hosts.includes(host.id))
            .map(host => (
              <Grid item xs={12} sm={6} md={4} key={host.id}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6">{host.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {host.hostname}
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mt: 1,
                    }}
                  >
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: host.isOnline ? 'success.main' : 'error.main',
                        mr: 1,
                      }}
                    />
                    <Typography variant="caption">
                      {host.isOnline ? 'Online' : 'Offline'}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
        </Grid>
      </Box>
    );
  }

  return <GroupManager />;
};

export default Groups;
