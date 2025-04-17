import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { passwordService } from '../services/api';
import { ArrowLeftIcon, AlertCircle, KeyIcon, LockKeyhole, EyeIcon, EyeOffIcon } from 'lucide-react';

interface PasswordDetails {
  id: string;
  website: string;
  username: string;
  password: string;
  notes: string;
}

const EditPassword = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [passwordData, setPasswordData] = useState<PasswordDetails | null>(null);
  const [website, setWebsite] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [notes, setNotes] = useState('');
  const [masterPassword, setMasterPassword] = useState('');
  const [authMasterPassword, setAuthMasterPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const fetchPasswordDetails = async () => {
    if (!id || !authMasterPassword) return;

    setIsLoading(true);
    try {
      const response = await passwordService.getPassword(id, authMasterPassword);
      const data = response.data;

      setPasswordData(data);
      setWebsite(data.website);
      setUsername(data.username);
      setPassword(data.password);
      setNotes(data.notes || '');
      setMasterPassword(authMasterPassword);

      setIsAuthenticated(true);
      setError('');
    } catch (err: any) {
      console.error('Error fetching password:', err);
      setError(err.response?.data || 'Failed to retrieve password. Please check your master password and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthenticate = async (e: React.FormEvent) => {
    e.preventDefault();
    fetchPasswordDetails();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id || !website || !username || !password || !masterPassword) {
      setError('Please fill in all required fields');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      await passwordService.updatePassword(
        id,
        { website, username, password, notes },
        masterPassword
      );
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data || 'Failed to update password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=';
    let generatedPassword = '';
    for (let i = 0; i < 16; i++) {
      generatedPassword += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(generatedPassword);
    setShowPassword(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Link
          to="/"
          className="mr-4 text-gray-600 hover:text-indigo-600 transition-colors duration-200 flex items-center"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          <span className="ml-1">Back to Dashboard</span>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Password</h1>
      </div>

      {!isAuthenticated ? (
        <div className="bg-white shadow-lg rounded-lg border border-gray-200 overflow-hidden max-w-md mx-auto">
          <div className="p-6">
            <div className="flex justify-center my-6">
              <div className="h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center">
                <LockKeyhole className="h-8 w-8 text-indigo-600" />
              </div>
            </div>

            <h2 className="text-xl font-bold text-center text-gray-900 mb-6">Authentication Required</h2>

            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleAuthenticate} className="space-y-6">
              <div>
                <label htmlFor="authMasterPassword" className="block text-sm font-medium text-gray-700">
                  Enter your master password to decrypt and edit
                </label>
                <div className="mt-1">
                  <input
                    type="password"
                    id="authMasterPassword"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Your master password"
                    value={authMasterPassword}
                    onChange={(e) => setAuthMasterPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <button
                type="submit"
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? 'Authenticating...' : 'Authenticate'}
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow-lg rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-6">
            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                    Website/Service Name*
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="website"
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="e.g. Google, Facebook, Twitter"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                    Username/Email*
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="username"
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="e.g. john@example.com"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password*
                </label>
                <div className="mt-1 flex space-x-3">
                  <div className="relative flex-grow">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      className="appearance-none block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOffIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                    onClick={generateRandomPassword}
                    disabled={isLoading}
                  >
                    <KeyIcon className="h-4 w-4 mr-2" />
                    Generate Strong Password
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                  Notes
                </label>
                <div className="mt-1">
                  <textarea
                    id="notes"
                    rows={4}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Add any additional notes here..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    disabled={isLoading}
                  ></textarea>
                </div>
              </div>

              <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                <div className="flex items-center mb-3">
                  <div className="flex-shrink-0">
                    <KeyIcon className="h-5 w-5 text-indigo-500" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-700">Master Password Verification</h3>
                    <p className="text-xs text-gray-500">Required to update your password entry</p>
                  </div>
                </div>
                <div>
                  <input
                    type="password"
                    id="masterPassword"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Confirm your master password"
                    value={masterPassword}
                    onChange={(e) => setMasterPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <Link
                  to="/"
                  className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                  disabled={isLoading}
                >
                  {isLoading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditPassword;