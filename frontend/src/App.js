import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import AddStudentPage from './pages/AddStudentPage';
import EditStudentPage from './pages/EditStudentPage';

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Navbar />
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        <Routes>
          <Route path="/"            element={<HomePage />} />
          <Route path="/add"         element={<AddStudentPage />} />
          <Route path="/edit/:id"    element={<EditStudentPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;