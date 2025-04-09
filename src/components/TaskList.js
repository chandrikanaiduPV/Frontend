import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { useMediaQuery, Grid, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography, Card, CardContent, CardActions, Checkbox, FormControlLabel } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material'; // Import icons
import AddBoxIcon from '@mui/icons-material/AddBox';

const TaskList = () => {

  const isMobile = useMediaQuery('(max-width:600px)');
  const [tasks, setTasks] = useState([]);
  const [open, setOpen] = useState(false); // State for dialog visibility
  const [editMode, setEditMode] = useState(false); // Flag to check if it's an edit mode
  const [isDeadlineChanged, setIsDeadlineChanged] = useState(false); // Track if deadline is changed
  const [currentTask, setCurrentTask] = useState({
    _id: '',
    title: '',
    description: '',
    deadline: '',
    completed: false,
  });

  // Validation errors
  const [errors, setErrors] = useState({
    title: '',
    description: '',
    deadline: '',
  });

  // States for delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); // For delete dialog visibility
  const [taskToDelete, setTaskToDelete] = useState(null); // Track the task to be deleted

  // Fetch tasks on component mount
  useEffect(() => {
    axios.get(`http://localhost:5000/tasks`)
      .then((response) => {
        console.log(response);
        const sortedTasks = response.data.sort((a, b) => {
          const deadlineA = new Date(a.deadline);
          const deadlineB = new Date(b.deadline);
          return deadlineA - deadlineB;
        });
        setTasks(sortedTasks);
      })
      .catch((error) => {
        console.error('Error fetching tasks:', error);
      });
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'deadline') {
      setIsDeadlineChanged(true); // Mark that the deadline has been edited
    }

    setCurrentTask({
      ...currentTask,
      [name]: value,
    });
  };

  // Handle Completed checkbox change (Only in Edit mode)
  const handleCompletedChange = (e) => {
    setCurrentTask({ ...currentTask, completed: e.target.checked });
  };

  // Validate the title, description, and deadline
  const validateFields = () => {
    const { title, description, deadline } = currentTask;
    let formValid = true;
    const newErrors = { title: '', description: '', deadline: '' };

    // Title validation
    if (!title) {
      newErrors.title = 'Title is required';
      formValid = false;
    } else if (title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
      formValid = false;
    } else if (title.length > 25) {
      newErrors.title = 'Title must not exceed 25 characters';
      formValid = false;
    } else if (title.trim() !== title) {
      newErrors.title = 'Title must not start or end with spaces';
      formValid = false;
    }

    // Description validation (optional)
    if (description && description.length > 200) {
      newErrors.description = 'Description can be at most 200 characters';
      formValid = false;
    }

    // Deadline validation (only if the deadline was changed)
    if (isDeadlineChanged && !deadline) {
      newErrors.deadline = 'Deadline is required';
      formValid = false;
    } else if (isDeadlineChanged) {
      const currentDate = new Date();
      const taskDeadline = new Date(deadline);
      if (taskDeadline <= currentDate) {
        newErrors.deadline = 'Deadline must be in the future';
        formValid = false;
      }
    }

    setErrors(newErrors);
    return formValid;
  };

  // Handle opening the dialog for adding a new task
  const handleOpenDialog = () => {
    setOpen(true);
    setEditMode(false); // Open in add mode
    setCurrentTask({
      _id: '',  
      title: '',
      description: '',
      deadline: '',
      completed: false,
    });
    setErrors({ title: '', description: '', deadline: '' });
  };

  // Handle opening the dialog for editing a task
  const handleOpenEditDialog = (task) => {
    setOpen(true);
    setEditMode(true); // Open in edit mode

    // Format the deadline for 'datetime-local' input (YYYY-MM-DDTHH:mm)
    const formattedDeadline = task.deadline
      ? moment(task.deadline).format('YYYY-MM-DDTHH:mm')
      : '';

    setCurrentTask({
      _id: task._id,
      title: task.title,
      description: task.description,
      deadline: formattedDeadline,
      completed: task.completed,
    });
    setErrors({ title: '', description: '', deadline: '' });
    setIsDeadlineChanged(false); // Reset deadline change state when editing
  };

  const formatDate = (dateString) => {
    return moment(dateString).format('MM/DD/YYYY HH:mm');
  };

  // Handle closing the dialog
  const handleCloseDialog = () => {
    setOpen(false);
    setErrors({ title: '', description: '', deadline: '' }); // Reset errors
  };

  // Handle adding or editing a task
  const handleSubmit = (e) => {
    e.preventDefault();
    // Only validate if the deadline has been changed
    if (isDeadlineChanged) {
      const currentDate = new Date();
      const taskDeadline = new Date(currentTask.deadline);

      if (taskDeadline < currentDate) {
        setErrors({
          ...errors,
          deadline: 'Deadline must be in the future',
        });
        return;
      }
    }

    // Proceed with saving the task
    if (validateFields()) {
      const taskData = {
        title: currentTask.title,
        description: currentTask.description,
        deadline: currentTask.deadline,
        completed: currentTask.completed,
      };

      if (editMode) {
        // Update task
        axios
          .put(`http://localhost:5000/tasks/${currentTask._id}`, taskData)
          .then((response) => {
            setTasks(
              tasks.map((task) =>
                task._id === currentTask._id ? { ...task, ...response.data } : task
              )
            );
            handleCloseDialog();
          })
          .catch((error) => {
            console.error('Error editing task:', error);
            alert('Failed to edit task');
          });
      } else {
        // Add new task
        axios
          .post(`http://localhost:5000/tasks`, taskData)
          .then((response) => {
            console.log(response)
            setTasks([...tasks, response.data]);
            handleCloseDialog();
          })
          .catch((error) => {
            console.error('Error adding task:', error);
            alert('Failed to add task');
          });
      }
    }
  };

  // Handle task deletion
  const handleDelete = (taskId) => {
    axios
      .delete(`http://localhost:5000/tasks/${taskId}`)
      .then(() => {
        setTasks(tasks.filter((task) => task._id !== taskId));
        setDeleteDialogOpen(false); // Close the delete confirmation dialog
      })
      .catch((error) => {
        console.error('Error deleting task:', error);
        alert('Failed to delete task');
        setDeleteDialogOpen(false); // Close the dialog in case of error
      });
  };

  // Open delete confirmation dialog
  const openDeleteDialog = (task) => {
    setTaskToDelete(task);
    setDeleteDialogOpen(true);
  };

  // Close delete confirmation dialog
  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setTaskToDelete(null); // Reset task to delete
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: "2px solid grey" , paddingBottom: '10px'}}>
        <Typography variant="h6" gutterBottom>
          Tasks
        </Typography>

        {/* Button to open the "Add Task" dialog */}
        <Button variant="contained" color="primary" endIcon={<AddBoxIcon />} onClick={handleOpenDialog}>
          Add Task
        </Button>
      </Box>

      {/* Task Cards */}
      <Box sx={{ marginTop: '20px' }}>
        <Grid container spacing={2}>
          {tasks.length === 0 ? (
            <Typography>No tasks available</Typography>
          ) : (
            tasks.map((task) => (
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={task._id}>
                <Card sx={{ width: 250, boxShadow: 3, height: 170, display: 'flex', flexDirection: 'column', borderRadius: '8px', backgroundColor : task.completed ? '#d4edda' : '#fff3cd' }}>
                  <CardContent sx={{ flex: 1 }}>
                    <Typography
                      variant="h6"
                      style={{
                        textDecoration: task.completed ? 'line-through' : 'none',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                      title={task.title}
                    >
                      {task.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                      title={task.description}
                    >
                      {task.description}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(task.deadline)}
                    </Typography>
                    <Typography variant="body2" color={task.completed ? 'green' : 'red'}>
                      {task.completed ? 'Completed' : 'Pending'}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'flex-end', margin: '4 0px' }}>
                    <Edit onClick={() => handleOpenEditDialog(task)} sx={{ color: 'primary.main', fontSize : isMobile? 'large' : 'large' }} />
                    <Delete ontSize='small' onClick={() => openDeleteDialog(task)} sx={{ fontSize : isMobile? 'large' : 'large', color : 'red' }} />
                  </CardActions>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </Box>

      {/* Dialog for adding or editing a task */}
      <Dialog open={open} onClose={handleCloseDialog} sx={{ borderRadius: '8px' }}>
  <DialogTitle
    sx={{
      backgroundColor: '#1976d2', // Blue background for the title bar
      color: '#fff',
      fontWeight: 600,
      fontSize: '18px',
      textAlign: 'center',
      borderRadius: '15px',
      border: '10px solid white',
      padding: '8px 24px',
    }}
  >
    {editMode ? 'Edit Task' : 'Add New Task'}
  </DialogTitle>
  <DialogContent sx={{ padding: '20px' }}>
    <form onSubmit={handleSubmit}>
      <TextField
        label="Title"
        name="title"
        value={currentTask.title}
        onChange={handleInputChange}
        fullWidth
        required
        margin="normal"
        size='small'
        variant="outlined"
        error={!!errors.title}
        helperText={errors.title}
        sx={{
          '& .MuiInputBase-root': {
            borderRadius: '8px',
            backgroundColor: '#f5f5f5',
          },
        }}
      />
      <TextField
        label="Description"
        name="description"
        value={currentTask.description}
        onChange={handleInputChange}
        fullWidth
        size='small'
        margin="normal"
        variant="outlined"
        error={!!errors.description}
        helperText={errors.description}
        sx={{
          '& .MuiInputBase-root': {
            borderRadius: '8px',
            backgroundColor: '#f5f5f5',
          },
        }}
      />
      <TextField
        label="Deadline"
        name="deadline"
        type="datetime-local"
        size='small'
        value={currentTask.deadline}
        onChange={handleInputChange}
        fullWidth
        required
        margin="normal"
        InputLabelProps={{
          shrink: true,
        }}
        variant="outlined"
        error={!!errors.deadline}
        helperText={errors.deadline}
        sx={{
          '& .MuiInputBase-root': {
            borderRadius: '8px',
            backgroundColor: '#f5f5f5',
          },
        }}
      />
      {editMode && (
        <FormControlLabel
          control={
            <Checkbox
              checked={currentTask.completed}
              onChange={handleCompletedChange}
              name="completed"
              color="primary"
            />
          }
          label="Completed"
          sx={{ marginTop: '10px' }}
        />
      )}
       <DialogActions
    sx={{
      justifyContent: 'space-between',
      // padding: '20px',
    }}
  >
    <Button
      onClick={handleCloseDialog}
      color="secondary"
      variant="contained"
      size="small"
      sx={{
        padding: '8px 20px',
        fontWeight: 600,
        textTransform: 'none',
        backgroundColor: '#f44336', // Red color for cancel action
        '&:hover': {
          backgroundColor: '#d32f2f',
        },
      }}
    >
      Cancel
    </Button>
    <Button
      type="submit"
      color="primary"
      variant="contained"
      size="small"
      sx={{
        padding: '8px 20px',
        fontWeight: 600,
        textTransform: 'none',
        backgroundColor: '#1976d2', // Blue color for submit action
        '&:hover': {
          backgroundColor: '#1565c0',
        },
      }}
    >
      {editMode ? 'Update Task' : 'Add Task'}
    </Button>
  </DialogActions>
  </form>
    
  </DialogContent>
 
</Dialog>


      {/* Delete Confirmation Dialog */}
<Dialog open={deleteDialogOpen} onClose={closeDeleteDialog} sx={{ borderRadius: '8px' }}>
  <DialogTitle
    sx={{
      backgroundColor: '#f44336', // Red background for delete action
      color: '#fff', 
      fontWeight: 600,
      textAlign: 'center',
      borderRadius: '15px',
      border: '10px solid white',
      padding: '8px 24px',
      fontSize: '18px'
    }}
  >
    Confirm Deletion
  </DialogTitle>
  <DialogContent sx={{ padding: '20px' }}>
    <Typography variant="body1" sx={{ fontSize: '16px', fontWeight: 400 }}>
      Are you sure you want to delete this task? This action cannot be undone.
    </Typography>
  </DialogContent>
  <DialogActions sx={{ justifyContent: 'space-between', padding: '20px' }}>
    <Button
      onClick={closeDeleteDialog}
      variant="outlined"
      color="secondary"
      size="small"
      sx={{
        padding: '6px 12px',
        fontWeight: 600,
        textTransform: 'none',
        borderColor: '#ccc', // Soft border color for the cancel button
      }}
    >
      Cancel
    </Button>
    <Button
      variant="contained"
      color="error"
      size="small"
      onClick={() => {
        if (taskToDelete) handleDelete(taskToDelete._id);
      }}
      sx={{
        padding: '6px 12px',
        fontWeight: 600,
        textTransform: 'none',
        backgroundColor: '#f44336', // Red background for the delete button
        '&:hover': {
          backgroundColor: '#d32f2f', // Darker red on hover
        },
      }}
    >
      Delete
    </Button>
  </DialogActions>
</Dialog>

    </Box>
  );
};

export default TaskList;
