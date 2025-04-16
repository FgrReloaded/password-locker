import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { passwordService } from '../services/api';
import { ArrowLeftIcon, KeyIcon } from 'lucide-react';

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
    <div>
      <div className="flex items-center mb-6">
        <Link to="/" className="mr-4 text-gray-600 hover:text-gray-800">
          <ArrowLeftIcon className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Add New Password</h1>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="card">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="website" className="block text-gray-700 mb-2">Website/Service Name*</label>
              <input
                type="text"
                id="website"
                className="input-field"
                placeholder="e.g. Google, Facebook, Twitter"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="username" className="block text-gray-700 mb-2">Username/Email*</label>
              <input
                type="text"
                id="username"
                className="input-field"
                placeholder="e.g. john@example.com"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700 mb-2">Password*</label>
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className="input-field pr-10"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-gray-800"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <span>Hide</span>
                    ) : (
                      <span>Show</span>
                    )}
                  </button>
                </div>
                <button
                  type="button"
                  className="btn-secondary flex items-center"
                  onClick={generateRandomPassword}
                  disabled={isLoading}
                >
                  <KeyIcon className="h-4 w-4 mr-1" />
                  Generate
                </button>
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="notes" className="block text-gray-700 mb-2">Notes</label>
              <textarea
                id="notes"
                className="input-field h-24 resize-none"
                placeholder="Add any additional notes here..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={isLoading}
              ></textarea>
            </div>

            <div className="mb-6 p-4 bg-gray-50 rounded-md border border-gray-200">
              <label htmlFor="masterPassword" className="block text-gray-700 mb-2 font-semibold">
                Enter Your Master Password*
              </label>
              <p className="text-sm text-gray-600 mb-3">
                You need to enter your master password to encrypt this entry
              </p>
              <input
                type="password"
                id="masterPassword"
                className="input-field"
                placeholder="Your master password"
                value={masterPassword}
                onChange={(e) => setMasterPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="flex justify-end space-x-3">
              <Link to="/" className="btn-secondary">
                Cancel
              </Link>
              <button
                type="submit"
                className="btn-primary"
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