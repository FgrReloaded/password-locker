import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { LockKeyhole } from 'lucide-react';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validatePassword = () => {
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    if (!/[A-Z]/.test(password)) {
      setError('Password must contain at least one uppercase letter');
      return false;
    }
    if (!/[a-z]/.test(password)) {
      setError('Password must contain at least one lowercase letter');
      return false;
    }
    if (!/[0-9]/.test(password)) {
      setError('Password must contain at least one number');
      return false;
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      setError('Password must contain at least one special character');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (!validatePassword()) {
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      await authService.register(username, email, password);
      navigate('/login', { state: { message: 'Registration successful! Please login with your credentials.' } });
    } catch (err: any) {
      setError(err.response?.data || 'Registration failed. Please try again.');
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
          <h1 className="text-2xl font-bold mt-2">Create an Account</h1>
          <p className="text-gray-600 mt-1">Join Locker - Your secure password manager</p>
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

          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              id="email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 mb-2">Master Password</label>
            <input
              type="password"
              id="password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
            <p className="text-sm text-gray-500 mt-1">
              Your master password must be at least 8 characters long, include an uppercase letter,
              a lowercase letter, a number, and a special character.
            </p>
          </div>

          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-gray-700 mb-2">Confirm Master Password</label>
            <input
              type="password"
              id="confirmPassword"
              className="input-field"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className="btn-primary w-full mb-4"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Register'}
          </button>

          <div className="text-center text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-500 hover:underline">
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;