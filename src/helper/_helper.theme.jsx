import { createTheme, useMediaQuery } from '@suid/material';

const LIGHT_THEME = {
    info: {
        main: '#ccc',
        contrastText: '#000',
    },
    primary: {
        main: '#444',
        contrastText: '#222',
    },
    secondary: {
        main: '#efefef',
        contrastText: '#222',
    }
};

const DARK_THEME = {
    info: {
        main: '#fff',
        contrastText: '#000',
    },
    primary: {
        main: '#ccc',
        contrastText: '#fff',
    },
    secondary: {
        main: '#222',
        contrastText: '#fff',
    }
};


export const mode = () => {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    return prefersDarkMode() ? "dark" : "light";
};

const theme = createTheme({

    palette: {
        ...(mode() === 'light' ? LIGHT_THEME : DARK_THEME)
    },
    typography: {
        fontFamily: 'Rajdhani',
    },
});

export default theme;
