import React from 'react';
import { Box, Typography } from '@mui/material';
import AlertSystem from '@/components/alerts/AlertSystem';

const Notifications: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <AlertSystem />
    </Box>
  );
};

export default Notifications;
