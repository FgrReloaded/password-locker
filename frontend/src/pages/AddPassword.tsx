import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { passwordService } from '../services/api';
import { ArrowLeftIcon, KeyIcon, EyeIcon, EyeOffIcon } from 'lucide-react';

const AddPassword = () => {
  const [website, setWebsite] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [notes, setNotes] = useState('');
  const [masterPassword, setMasterPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!website || !username || !password || !masterPassword) {
      setError('Please fill in all required fields');
      return;
    }

    setError('');
    setIsLoading(true);
    console.log('Adding password:', { website, username, password, notes }, masterPassword);
    try {
      await passwordService.addPassword(
        { website, username, password, notes },
        masterPassword
      );
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data || 'Failed to add password. Please try again.');
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
        <h1 className="text-2xl font-bold text-gray-900">Add New Password</h1>
      </div>

      <div className="bg-white shadow-lg rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-6">
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
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
                  <p className="text-xs text-gray-500">Required to encrypt your password entry</p>
                </div>
              </div>
              <div>
                <input
                  type="password"
                  id="masterPassword"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter your master password"
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
                {isLoading ? 'Saving...' : 'Save Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPassword;