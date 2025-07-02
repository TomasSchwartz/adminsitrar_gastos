import React, {createContext, useEffect, useState} from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({children}) => {
    const [dark, setDark] = useState(() => {
        const saved = localStorage.getItem('theme');
        return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
    });

    useEffect(() => {
        if (dark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [dark]);

    return (
        <ThemeContext.Provider value={{dark, toggle: () => setDark(prev => !prev)}}>
            {children}
        </ThemeContext.Provider>
    );
};
