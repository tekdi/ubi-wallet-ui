import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  Box,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const ShareConfirmationDialog = ({ open, onClose, documentType }) => {
  const [checked, setChecked] = useState(false); // Track checkbox state
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAccept = () => {
    setShowSuccess(true);
  };

  const handleClose = () => {
    setChecked(false);
    setShowSuccess(false);
    onClose();
  };

  const handleCheckboxChange = (e) => {
    setChecked(e.target.checked);
  };

  const ConfirmationContent = () => (
    <>
      <DialogTitle sx={{ pb: 1, pr: 6 }}>
        <Typography variant="h5" component="div" sx={{ fontFamily: 'Poppins, sans-serif' }}>
          Share Information
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1, fontFamily: 'Poppins, sans-serif' }}>
          Confirmation
        </Typography>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Typography variant="h6" sx={{ mb: 3, fontFamily: 'Poppins, sans-serif' }}>
          Please provide your consent to share the selected document with your E-Wallet
        </Typography>

        {/* Document Type with Checkbox */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {/* <Typography variant="subtitle1" sx={{ fontFamily: 'Poppins, sans-serif', mr: 2 }}>
            Document Type: 
          </Typography> */}
          <FormControlLabel
            control={
              <Checkbox
                checked={checked}
                onChange={handleCheckboxChange}
                sx={{ color: 'primary.main' ,fontFamily: 'Poppins, sans-serif' }}
              />
            }
            label={documentType}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 1, pt: 0 }}>
        <Button
          variant="outlined"
          fullWidth
          onClick={handleClose}
          sx={{ mr: 1, fontFamily: 'Poppins, sans-serif', borderRadius: 7 }}
        >
          Deny
        </Button>

        <Button
          variant="contained"
          fullWidth
          onClick={handleAccept}
          disabled={!checked} // Disable the button if checkbox is not checked
          sx={{ fontFamily: 'Poppins, sans-serif', borderRadius: 7 }}
        >
          Accept & Import
        </Button>
      </DialogActions>
    </>
  );

  const SuccessContent = () => (
    <DialogContent>
      <Box sx={{
        textAlign: 'center',
        py: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <Typography variant="h6" sx={{ mb: 3, fontFamily: 'Poppins, sans-serif' }}>
          Your <Typography component="span" color="primary" variant="h6" sx={{ fontFamily: 'Poppins, sans-serif' }}>
            {documentType}
          </Typography> has been added to your documents set in the E-Wallet!
        </Typography>

        <Box sx={{
          my: 4,
          position: 'relative',
          width: 80,
          height: 80
        }}>
          <Box sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            bgcolor: 'primary.light',
            opacity: 0.1,
            borderRadius: '50%'
          }} />
          <CheckCircleOutlineIcon
            color="primary"
            sx={{
              fontSize: 80,
              position: 'relative',
              zIndex: 1
            }}
          />
        </Box>

        <Button
          variant="contained"
          fullWidth
          onClick={handleClose}
          sx={{ mt: 2, borderRadius: 7 }}
        >
          Okay
        </Button>
      </Box>
    </DialogContent>
  );

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          m: 2
        }
      }}
    >
      {showSuccess ? <SuccessContent /> : <ConfirmationContent />}
    </Dialog>
  );
};

export default ShareConfirmationDialog;
