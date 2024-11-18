// PopoverComponent.jsx
import React from 'react';
import { Popover, Paper, Button } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DownloadIcon from '@mui/icons-material/Download';


const PopoverComponent = ({ open, anchorEl, onClose, onNavigate }) => {
  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
    >
      <Paper sx={{ p: 2 }}>
        <Button
          startIcon={<UploadFileIcon />}
          fullWidth
          onClick={() => onNavigate('upload')}
          sx={{ mb: 1 }}
        >
          Upload
        </Button>
        <Button
          startIcon={<DownloadIcon />}
          fullWidth
          onClick={() => onNavigate('fetch')}
        >
          Fetch
        </Button>
      </Paper>
    </Popover>
  );
};

export default PopoverComponent;
