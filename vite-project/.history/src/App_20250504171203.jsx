import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Admin from './pages/Admin';
import Home from './pages/Home';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
     
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
