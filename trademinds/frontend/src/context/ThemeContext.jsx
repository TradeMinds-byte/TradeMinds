import { createContext, useContext, useState, useEffect } from 'react';



const ThemeContext = createContext();



export function ThemeProvider({ children }) {

  // Get saved theme or default to dark

  const [theme, setTheme] = useState(localStorage.getItem('tm-theme') || 'light');



  useEffect(() => {

    const root = document.documentElement;

   

    // The Color Palettes

    const themes = {

      dark: {

        '--bg-main': '#000000',

        '--bg-card': '#0a0a0a',

        '--text-main': '#ffffff',

        '--text-muted': '#888888',

        '--border-color': '#1a1a1a',

        '--nav-bg': 'rgba(0, 0, 0, 0.8)',

      },

      light: {

        '--bg-main': '#ffffff',

        '--bg-card': '#f9f9fb',

        '--text-main': '#000000',

        '--text-muted': '#666666',

        '--border-color': '#eeeeee',

        '--nav-bg': 'rgba(255, 255, 255, 0.8)',

      }

    };



    // Apply colors to the CSS variables globally

    const selection = themes[theme];

    Object.entries(selection).forEach(([key, value]) => {

      root.style.setProperty(key, value);

    });

   

    localStorage.setItem('tm-theme', theme);

  }, [theme]);



  const toggleTheme = (newTheme) => setTheme(newTheme);



  return (

    <ThemeContext.Provider value={{ theme, toggleTheme }}>

      {children}

    </ThemeContext.Provider>

  );

}



export const useTheme = () => useContext(ThemeContext);