// src/theme.js
import { createTheme } from '@mui/material/styles';

// Updated GeeksforGeeks Color Palette
const geeksforGeeksGreen = '#308d46'; // New Green
const geeksforGeeksBlue = '#171b1d'; // GeeksforGeeks Blue
const geeksforGeeksBackground = '#f4f4f4'; // Light gray background
const geeksforGeeksTextPrimary = '#333333'; // Dark Gray for text

const lightTheme = createTheme({
  palette: {
    mode: 'light', // Light mode
    primary: {
      main: geeksforGeeksGreen, // Updated GeeksforGeeks Green
    },
    secondary: {
      main: geeksforGeeksBlue, // GeeksforGeeks Blue
    },
    background: {
      default: geeksforGeeksBackground, // Light gray background
    },
    text: {
      primary: geeksforGeeksTextPrimary, // Dark text
    },
  },
  typography: {
    fontFamily: '"Roboto", sans-serif', // Use Roboto font
    h1: {
      fontWeight: 600,
      fontSize: '2.5rem',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark', // Dark mode
    primary: {
      main: geeksforGeeksGreen, // Updated GeeksforGeeks Green
    },
    secondary: {
      main: geeksforGeeksBlue, // GeeksforGeeks Blue
    },
    background: {
      default: '#121212', // Dark background for dark mode
    },
    text: {
      primary: '#e0e0e0', // Light text for dark mode
    },
  },
  typography: {
    fontFamily: '"Roboto", sans-serif', // Use Roboto font
    h1: {
      fontWeight: 600,
      fontSize: '2.5rem',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
  },
});

export { lightTheme, darkTheme };
