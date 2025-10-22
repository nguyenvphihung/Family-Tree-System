import React, { useState, useEffect } from "react";
import AppRouter from "./routes";

function App() {
  const [currentTheme, setCurrentTheme] = useState('family-tree');

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('family-tree-theme');
    if (savedTheme) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  // Save theme to localStorage when it changes
  const handleThemeChange = (theme: string) => {
    setCurrentTheme(theme);
    localStorage.setItem('family-tree-theme', theme);
  };

  // Apply theme to body
  useEffect(() => {
    // Remove all existing theme classes
    document.body.classList.remove(
      'bg-family-tree',
      'bg-family-tree-light',
      'bg-family-tree-overlay',
      'bg-family-tree-warm',
      'bg-family-tree-nature',
      'bg-family-tree-elegant',
      'bg-family-tree-romantic',
      'bg-family-tree-ocean',
      'bg-family-tree-sunset',
      'bg-gradient-animated'
    );

    // Add current theme class
    document.body.classList.add(`bg-${currentTheme}`);
  }, [currentTheme]);

  return (
    <div className={`min-h-screen ${currentTheme === 'gradient-animated' ? 'bg-gradient-animated' : `bg-${currentTheme}`}`}>
      <AppRouter />
    </div>
  );
}

export default App;
