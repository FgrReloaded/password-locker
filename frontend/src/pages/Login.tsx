import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { LockKeyhole } from 'lucide-react';

interface LoginProps {
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

const Login = ({ setIsAuthenticated }: LoginProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      setError('Please fill in all fields');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      await authService.login(username, password);
      setIsAuthenticated(true);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data || 'Failed to login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="card">
        <div className="text-center mb-8">
          <div className="flex justify-center">
            <LockKeyhole className="h-12 w-12 text-primary-500" />
          </div>
          <h1 className="text-2xl font-bold mt-2">Login to Locker</h1>
          <p className="text-gray-600 mt-1">Your secure password manager</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 mb-2">Username</label>
            <input
              type="text"
              id="username"
              className="input-field"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 mb-2">Master Password</label>
            <input
              type="password"
              id="password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className="btn-primary w-full mb-4"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>

          <div className="text-center text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-500 hover:underline">
              Register now
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;