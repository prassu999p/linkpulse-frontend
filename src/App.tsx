import React from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { theme } from './styles/theme';
import { PostGenerationDemo } from './components/PostGeneration/PostGenerationDemo';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <PostGenerationDemo />
    </ThemeProvider>
  );
}

export default App; 