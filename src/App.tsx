import React, { useState, useEffect } from "react";
import AppRouter from "./routes";
import { Toaster } from "./components/ui/toaster";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [currentTheme, setCurrentTheme] = useState('family-tree');

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('family-tree-theme');
    if (savedTheme) {
      setCurrentTheme(savedTheme);
    }
  }, []);



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
      <Toaster />
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 999999 }}
      />
    </div>
  );
}

export default App;
