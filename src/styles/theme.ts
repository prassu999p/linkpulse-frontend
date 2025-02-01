import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#0A66C2', // LinkedIn blue
    },
    secondary: {
      main: '#057642', // Professional green
    },
    background: {
      default: '#f3f2ef', // LinkedIn background color
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Prevents all-caps button text
          borderRadius: '28px', // LinkedIn's rounded button style
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '8px', // Consistent border radius
        },
      },
    },
  },
});
