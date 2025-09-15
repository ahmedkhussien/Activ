import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Chip,
  IconButton,
  Avatar,
  LinearProgress,
  Tooltip,
} from '@mui/material';
import {
  MoreVert,
  Computer,
  TrendingUp,
  TrendingDown,
  AccessTime,
  Group,
} from '@mui/icons-material';
import { HostGroup, Host } from '@/types';
import { useDashboardStore } from '@/store';

interface GroupCardProps {
  group: HostGroup;
  hosts: Host[];
  onEdit?: (group: HostGroup) => void;
  onDelete?: (groupId: string) => void;
  onClick?: (group: HostGroup) => void;
  className?: string;
}

export const GroupCard: React.FC<GroupCardProps> = ({
  group,
  hosts,
  onEdit,
  onDelete,
  onClick,
  className,
}) => {
  const { selectedGroupId } = useDashboardStore();
  const isSelected = selectedGroupId === group.id;

  const groupHosts = hosts.filter(host => group.hosts.includes(host.id));
  const onlineHosts = groupHosts.filter(host => host.isOnline);
  const onlinePercentage = groupHosts.length > 0 ? (onlineHosts.length / groupHosts.length) * 100 : 0;

  // Calculate group metrics (mock data for now)
  const totalActiveTime = groupHosts.reduce((sum, host) => sum + (host.metadata?.activeTime || 0), 0);
  const avgProductivity = groupHosts.length > 0 
    ? groupHosts.reduce((sum, host) => sum + (host.metadata?.productivityScore || 0), 0) / groupHosts.length 
    : 0;

  const handleCardClick = () => {
    if (onClick) {
      onClick(group);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(group);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(group.id);
    }
  };

  return (
    <Card
      className={className}
      onClick={handleCardClick}
      sx={{
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        border: isSelected ? 2 : 1,
        borderColor: isSelected ? 'primary.main' : 'divider',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 4,
        },
      }}
    >
      <CardHeader
        avatar={
          <Avatar
            sx={{
              backgroundColor: group.color,
              width: 48,
              height: 48,
            }}
          >
            <Group />
          </Avatar>
        }
        title={
          <Typography variant="h6" component="h2" noWrap>
            {group.name}
          </Typography>
        }
        subheader={
          <Typography variant="body2" color="text.secondary" noWrap>
            {group.description}
          </Typography>
        }
        action={
          <Box>
            <IconButton size="small" onClick={handleEdit}>
              <MoreVert />
            </IconButton>
          </Box>
        }
      />
      
      <CardContent>
        {/* Host Status */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Computer sx={{ mr: 1, fontSize: 16 }} />
            <Typography variant="body2" color="text.secondary">
              Hosts ({onlineHosts.length}/{groupHosts.length})
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={onlinePercentage}
            sx={{
              height: 6,
              borderRadius: 3,
              backgroundColor: 'grey.200',
              '& .MuiLinearProgress-bar': {
                backgroundColor: onlinePercentage > 80 ? 'success.main' : 
                               onlinePercentage > 50 ? 'warning.main' : 'error.main',
              },
            }}
          />
        </Box>

        {/* Metrics */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Chip
            icon={<AccessTime />}
            label={`${Math.round(totalActiveTime / 3600)}h`}
            size="small"
            variant="outlined"
            color="primary"
          />
          <Chip
            icon={avgProductivity > 70 ? <TrendingUp /> : <TrendingDown />}
            label={`${Math.round(avgProductivity)}%`}
            size="small"
            variant="outlined"
            color={avgProductivity > 70 ? 'success' : 'warning'}
          />
        </Box>

        {/* Host List Preview */}
        <Box>
          <Typography variant="caption" color="text.secondary" display="block" mb={1}>
            Hosts:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {groupHosts.slice(0, 3).map((host) => (
              <Tooltip key={host.id} title={`${host.name} (${host.isOnline ? 'Online' : 'Offline'})`}>
                <Chip
                  label={host.name}
                  size="small"
                  color={host.isOnline ? 'success' : 'default'}
                  variant={host.isOnline ? 'filled' : 'outlined'}
                />
              </Tooltip>
            ))}
            {groupHosts.length > 3 && (
              <Chip
                label={`+${groupHosts.length - 3} more`}
                size="small"
                variant="outlined"
                color="default"
              />
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default GroupCard;
