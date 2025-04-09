import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, Box, useTheme } from '@mui/material';
import { Tooltip } from 'react-tooltip';

const OnboardingGuide = () => {
  const [open, setOpen] = useState(false); // Controls onboarding modal visibility
  const [step, setStep] = useState(0); // Step for the onboarding guide
  const [showTooltip, setShowTooltip] = useState(false); // Show tooltip for "Add Task" button

  const theme = useTheme();

  useEffect(() => {
    const onboardingStatus = localStorage.getItem('onboardingStatus');
    if (!onboardingStatus) {
      // Show onboarding guide only if the user hasn't completed it before
      setOpen(true);
    }
  }, []);

  const handleClose = () => {
    setOpen(false);
    localStorage.setItem('onboardingStatus', 'completed');
  };

  const handleNextStep = () => {
    setStep(step + 1);
    if (step === 2) {
      handleClose();
    } else if (step === 1) {
      setShowTooltip(true);
    }
  };

  const handleSkip = () => {
    setOpen(false);
    localStorage.setItem('onboardingStatus', 'completed');
  };

  return (
    <Box sx={{ padding: '20px' }}>
      {/* Tooltip for Add Task Button */}
      <Tooltip
        title="Click to add a new task"
        placement="right"
        open={showTooltip}
      >
        <Button
          variant="contained"
          size="large"
          color="primary"
          sx={{
            padding: '10px 20px',
            fontSize: '16px',
            fontWeight: 600,
            textTransform: 'none',
            boxShadow: 3,
            '&:hover': {
              boxShadow: 6,
            },
          }}
          onClick={() => console.log("Add Task clicked!")}
        >
          Add Task
        </Button>
      </Tooltip>

      {/* Onboarding Dialog */}
      <Dialog open={open} onClose={handleClose} sx={{ borderRadius: '25px' }}>
        <DialogTitle
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: '#fff',
            fontWeight: 600,
            textAlign: 'center',
            borderRadius: '15px',
            border: '10px solid white',
            padding: '8px 24px',
            fontSize: '18px'
          }}
        >
          Welcome to Your Task Manager!
        </DialogTitle>
        <DialogContent sx={{ padding: '10px 20px' }}>
          {step === 0 && (
            <>
              <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '16px' }}>
                Step 1: Introduction
              </Typography>
              <Typography variant="body1" sx={{ marginTop: '10px', fontSize: '14px'  }}>
                This app helps you manage your tasks and stay organized. You can add, edit, and delete tasks here.
              </Typography>
            </>
          )}
          {step === 1 && (
            <>
              <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '16px' }}>
                Step 2: Adding a Task
              </Typography>
              <Typography variant="body1" sx={{ marginTop: '10px', fontSize: '14px' }}>
                Click the "Add Task" button to create a new task. You can set a title, description, and deadline.
              </Typography>
            </>
          )}
          {step === 2 && (
            <>
              <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '16px' }}>
                Step 3: Edit and Delete Tasks
              </Typography>
              <Typography variant="body1" sx={{ marginTop: '10px', fontSize: '14px' }}>
                You can edit or delete tasks. Editing allows you to update the title, description, and deadline.
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between', padding: '20px' }}>
          <Button
            onClick={handleSkip}
            variant="outlined"
            size="small"
            color="secondary"
            sx={{
              padding: '6px 12px',
              fontWeight: 600,
              textTransform: 'none',
            }}
          >
            Skip
          </Button>
          <Button
            onClick={handleNextStep}
            variant="contained"
            size="small"
            color="primary"
            sx={{
              padding: '6px 12px',
              fontWeight: 600,
              textTransform: 'none',
            }}
          >
            {step === 2 ? 'Finish' : 'Next'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
  
};

export default OnboardingGuide;
