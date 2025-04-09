import React from 'react';
import { Card, CardContent, Typography, Box, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const TaskItem = ({ task }) => {
  return (
    <Box sx={{ marginBottom: 2 }}>
      <Card sx={{ display: 'flex', flexDirection: 'column', padding: 2 }}>
        <CardContent>
          <Typography
            variant="h6"
            component="h3"
            sx={{
              textDecoration: task.completed ? 'line-through' : 'none',
              fontWeight: 'bold',
            }}
          >
            {task.title}
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            {task.description}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Deadline: {task.deadline}
          </Typography>
        </CardContent>
        <IconButton
          color="error"
          aria-label="delete task"
          onClick={() => alert(`Delete task ${task._id}`)}
        >
          <DeleteIcon />
        </IconButton>
      </Card>
    </Box>
  );
};

export default TaskItem;
