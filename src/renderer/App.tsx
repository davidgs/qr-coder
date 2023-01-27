import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';
import QCode from './QRCode';
import { Form, FloatingLabel } from 'react-bootstrap';
import MainPage from './MainPage';

function Hello() {
  return (
  <div className="link-form">
      <MainPage />
  </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
