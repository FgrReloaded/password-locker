import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';


import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import AddPassword from './pages/AddPassword';
import EditPassword from './pages/EditPassword';
import ViewPassword from './pages/ViewPassword';
import Register from './pages/Register';
import Login from './pages/Login';


const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {isAuthenticated && <Navbar onLogout={handleLogout} />}

      <main className="flex-1 container mx-auto px-4 py-8">
        <Routes>
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/" /> : <Login setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route
            path="/register"
            element={isAuthenticated ? <Navigate to="/" /> : <Register />}
          />

          <Route
            path="/"
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/add"
            element={isAuthenticated ? <AddPassword /> : <Navigate to="/login" />}
          />
          <Route
            path="/edit/:id"
            element={isAuthenticated ? <EditPassword /> : <Navigate to="/login" />}
          />
          <Route
            path="/view/:id"
            element={isAuthenticated ? <ViewPassword /> : <Navigate to="/login" />}
          />
        </Routes>
      </main>

      <footer className="bg-gray-100 border-t py-4">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© {new Date().getFullYear()} Locker - Secure Password Manager</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
