import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './styles/theme';
import CreditCounter from './components/CreditCounter/CreditCounter';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div style={{ padding: '20px' }}>
        <CreditCounter />
      </div>
    </ThemeProvider>
  );
};

export default App; 