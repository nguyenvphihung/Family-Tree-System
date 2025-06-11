import TestPersonPage from "./TestPersonPage";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<div>Trang chủ (Home)</div>} />
        <Route path="/family-tree" element={<div>Family Tree View</div>} />
        <Route path="/profile/:id" element={<div>Profile Page</div>} />
        <Route path="/discoveries" element={<div>Discoveries / Matches</div>} />
        <Route path="/photos" element={<div>Photos Page</div>} />
        <Route path="/search" element={<div>Search Page</div>} />
        <Route path="/login" element={<div>Login Page</div>} />
        <Route path="/register" element={<div>Register Page</div>} />
        <Route path="/test-person" element={<TestPersonPage />} />
      </Routes>
    </Router>
  );
}

export default App;
