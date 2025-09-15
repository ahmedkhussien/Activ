import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Fab,
  Paper,
  InputAdornment,
  Alert,
} from '@mui/material';
import {
  Add,
  Search,
  Edit,
  Delete,
  Save,
  Cancel,
  ColorLens,
} from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { HostGroup, Host } from '@/types';
import { useDashboardStore } from '@/store';
import GroupCard from './GroupCard';
import { apiService } from '@/services/api';

const GroupManager: React.FC = () => {
  const { hostGroups, hosts, addHostGroup, updateHostGroup, removeHostGroup } = useDashboardStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<HostGroup | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#1976d2',
    hosts: [] as string[],
  });

  const filteredGroups = hostGroups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateGroup = () => {
    setFormData({
      name: '',
      description: '',
      color: '#1976d2',
      hosts: [],
    });
    setIsCreateDialogOpen(true);
  };

  const handleEditGroup = (group: HostGroup) => {
    setEditingGroup(group);
    setFormData({
      name: group.name,
      description: group.description,
      color: group.color,
      hosts: group.hosts,
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteGroup = async (groupId: string) => {
    if (window.confirm('Are you sure you want to delete this group?')) {
      try {
        setLoading(true);
        await apiService.deleteHostGroup(groupId);
        removeHostGroup(groupId);
      } catch (err) {
        setError('Failed to delete group');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSaveGroup = async () => {
    try {
      setLoading(true);
      setError(null);

      const groupData = {
        name: formData.name,
        description: formData.description,
        color: formData.color,
        hosts: formData.hosts,
        settings: {
          workingHours: {
            start: '09:00',
            end: '17:00',
            timezone: 'UTC',
            workdays: [1, 2, 3, 4, 5], // Monday to Friday
          },
          productivityCategories: {
            productive: ['code', 'design', 'meeting'],
            neutral: ['email', 'documentation'],
            distracting: ['social', 'entertainment'],
          },
          alerts: {
            overtime: true,
            downtime: true,
            lowActivity: true,
          },
        },
      };

      if (editingGroup) {
        const updatedGroup = await apiService.updateHostGroup(editingGroup.id, groupData);
        updateHostGroup(editingGroup.id, updatedGroup);
        setIsEditDialogOpen(false);
      } else {
        const newGroup = await apiService.createHostGroup(groupData);
        addHostGroup(newGroup);
        setIsCreateDialogOpen(false);
      }

      setEditingGroup(null);
    } catch (err) {
      setError('Failed to save group');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsCreateDialogOpen(false);
    setIsEditDialogOpen(false);
    setEditingGroup(null);
    setFormData({
      name: '',
      description: '',
      color: '#1976d2',
      hosts: [],
    });
  };

  const handleHostSelection = (hostId: string) => {
    setFormData(prev => ({
      ...prev,
      hosts: prev.hosts.includes(hostId)
        ? prev.hosts.filter(id => id !== hostId)
        : [...prev.hosts, hostId],
    }));
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    // Handle reordering of groups
    const items = Array.from(hostGroups);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update the order in the store
    // Note: This would need to be implemented in the store
  };

  const availableHosts = hosts.filter(host => !formData.hosts.includes(host.id));

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Host Groups
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreateGroup}
        >
          Create Group
        </Button>
      </Box>

      {/* Search */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search groups..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Groups Grid */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="groups" direction="horizontal">
          {(provided) => (
            <Grid
              container
              spacing={3}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {filteredGroups.map((group, index) => (
                <Draggable key={group.id} draggableId={group.id} index={index}>
                  {(provided, snapshot) => (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      lg={3}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <GroupCard
                        group={group}
                        hosts={hosts}
                        onEdit={handleEditGroup}
                        onDelete={handleDeleteGroup}
                      />
                    </Grid>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Grid>
          )}
        </Droppable>
      </DragDropContext>

      {/* Empty State */}
      {filteredGroups.length === 0 && (
        <Paper
          sx={{
            p: 4,
            textAlign: 'center',
            backgroundColor: 'grey.50',
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {searchTerm ? 'No groups found' : 'No groups created yet'}
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            {searchTerm 
              ? 'Try adjusting your search terms'
              : 'Create your first host group to organize your ActivityWatch hosts'
            }
          </Typography>
          {!searchTerm && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleCreateGroup}
            >
              Create First Group
            </Button>
          )}
        </Paper>
      )}

      {/* Create/Edit Dialog */}
      <Dialog
        open={isCreateDialogOpen || isEditDialogOpen}
        onClose={handleCancel}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingGroup ? 'Edit Group' : 'Create New Group'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Group Name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              fullWidth
              required
            />
            
            <TextField
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              fullWidth
              multiline
              rows={3}
            />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <TextField
                label="Color"
                value={formData.color}
                onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                type="color"
                sx={{ width: 100 }}
              />
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  backgroundColor: formData.color,
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              />
            </Box>

            <FormControl fullWidth>
              <InputLabel>Available Hosts</InputLabel>
              <Select
                multiple
                value={formData.hosts}
                onChange={(e) => setFormData(prev => ({ ...prev, hosts: e.target.value as string[] }))}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((hostId) => {
                      const host = hosts.find(h => h.id === hostId);
                      return (
                        <Chip
                          key={hostId}
                          label={host?.name || hostId}
                          size="small"
                          onDelete={() => handleHostSelection(hostId)}
                        />
                      );
                    })}
                  </Box>
                )}
              >
                {availableHosts.map((host) => (
                  <MenuItem key={host.id} value={host.id}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: host.isOnline ? 'success.main' : 'error.main',
                        }}
                      />
                      {host.name} ({host.hostname})
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveGroup}
            variant="contained"
            disabled={loading || !formData.name}
            startIcon={<Save />}
          >
            {loading ? 'Saving...' : editingGroup ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GroupManager;
