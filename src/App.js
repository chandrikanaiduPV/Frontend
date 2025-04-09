import React, { useState, useEffect } from 'react';
import './App.css';
import { Container, Typography, Box, Button, useMediaQuery, AppBar, Toolbar } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { lightTheme, darkTheme } from './theme'; // Import both themes
import { Brightness4, Brightness7 } from '@mui/icons-material'; // Import Material UI icons
import TaskList from './components/TaskList';
import OnboardingGuide from './components/OnboardingGuide';
import AssignmentIcon from '@mui/icons-material/Assignment';

function App() {
  const savedTheme = localStorage.getItem('theme');
  const [isDarkMode, setIsDarkMode] = useState(savedTheme === 'dark');
  const isMobile = useMediaQuery('(max-width:600px)'); // Media query for mobile screens

  useEffect(() => {
    // Save theme preference in localStorage when it changes
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      {/* AppBar Section */}
      <AppBar position="fixed" sx={{ backgroundColor: isDarkMode ? '#0D47A1' : '#2196F3', top: 0 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Title aligned to the left */}
          <div style={{ display : 'flex', flexDirection : 'row', alignItems: 'center'}}>
          <AssignmentIcon sx={{ fontSize : isMobile? 'large' : 'x-large' }} />
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontFamily: '"Roboto", sans-serif', // Using the Roboto font
              fontStyle: 'italic',
              fontWeight: 600,
              color: '#FFFFFF', // Text color is always white on AppBar
              fontSize: '1.5rem',
              marginLeft: isMobile ? 0 : 2, // Adjust left margin based on screen size
            }}
          >
           Your Task Manager
          </Typography>
          </div>
          {isDarkMode ? <Brightness7 ssx={{ fontSize : isMobile? 'large' : 'x-large' }} onClick={toggleTheme} /> : <Brightness4 sx={{ fontSize : isMobile? 'large' : 'x-large' }} onClick={toggleTheme}/>}
        </Toolbar>
      </AppBar>

      {/* Main Content Container with top padding to account for the fixed AppBar */}
      <Container
        maxWidth={false} // No max-width to avoid default margin
        sx={{
          paddingTop: '30px',paddingBottom: '30px', // Adding padding to prevent content from being hidden behind the AppBar
          paddingLeft: isMobile ? 2 : 2, // Adjust left padding based on screen size
          paddingRight: isMobile ? 2 : 2, // Adjust right padding based on screen size
          width: '100%', // Make sure the container spans full width
        }}
      >
        {/* Onboarding Guide and Task List */}
        <OnboardingGuide />
        <TaskList />
      </Container>
    </ThemeProvider>
  );
}

export default App;
