import '@testing-library/jest-dom';

// Mock the Material-UI theme provider
jest.mock('@mui/material', () => ({
    ...jest.requireActual('@mui/material'),
    useTheme: () => ({
        palette: {
            primary: { main: '#0A66C2' },
            secondary: { main: '#057642' },
        },
    }),
})); 