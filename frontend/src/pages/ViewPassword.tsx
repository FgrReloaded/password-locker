import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { passwordService } from '../services/api';
import { ArrowLeftIcon, AlertCircle, ClipboardCopy, LockKeyhole, EyeIcon, EyeOffIcon, PencilIcon } from 'lucide-react';

interface PasswordDetails {
  id: string;
  website: string;
  username: string;
  password: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

const ViewPassword = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [passwordData, setPasswordData] = useState<PasswordDetails | null>(null);
  const [masterPassword, setMasterPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const fetchPasswordDetails = async () => {
    if (!id || !masterPassword) return;

    setIsLoading(true);
    try {
      const response = await passwordService.getPassword(id, masterPassword);
      setPasswordData(response.data);
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

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
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
        <h1 className="text-2xl font-bold text-gray-900">View Password</h1>
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
                <label htmlFor="masterPassword" className="block text-sm font-medium text-gray-700">
                  Enter your master password to decrypt
                </label>
                <div className="mt-1">
                  <input
                    type="password"
                    id="masterPassword"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Your master password"
                    value={masterPassword}
                    onChange={(e) => setMasterPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <button
                type="submit"
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? 'Authenticating...' : 'View Password'}
              </button>
            </form>
          </div>
        </div>
      ) : (
        passwordData && (
          <div className="bg-white shadow-lg rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <div className="mb-6">
                    <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Website / Service</h2>
                    <p className="text-lg font-medium text-gray-900">{passwordData.website}</p>
                  </div>

                  <div className="mb-6">
                    <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Username / Email</h2>
                    <div className="flex items-center">
                      <p className="text-md text-gray-900 mr-2 flex-grow">{passwordData.username}</p>
                      <button
                        onClick={() => copyToClipboard(passwordData.username, 'username')}
                        className="p-1.5 rounded-full text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                        title="Copy username"
                      >
                        <ClipboardCopy className="h-5 w-5" />
                      </button>
                      {copied === 'username' && (
                        <span className="text-xs text-indigo-600 ml-2 animate-fadeIn">Copied!</span>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="mb-6">
                    <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Created</h2>
                    <p className="text-md text-gray-600">
                      {new Date(passwordData.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>

                  <div className="mb-6">
                    <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Last Updated</h2>
                    <p className="text-md text-gray-600">
                      {new Date(passwordData.updatedAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Password</h2>
                <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center">
                    <div className="relative flex-grow">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="appearance-none block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 bg-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={passwordData.password}
                        readOnly
                      />
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 transition-colors"
                        type="button"
                      >
                        {showPassword ? (
                          <EyeOffIcon className="h-5 w-5" />
                        ) : (
                          <EyeIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    <button
                      onClick={() => copyToClipboard(passwordData.password, 'password')}
                      className="ml-3 p-2 rounded-md text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                      title="Copy password"
                    >
                      <ClipboardCopy className="h-5 w-5" />
                    </button>
                  </div>
                  {copied === 'password' && (
                    <div className="mt-2 text-sm text-indigo-600 flex items-center">
                      <span className="bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-md">Password copied to clipboard</span>
                    </div>
                  )}
                </div>
              </div>

              {passwordData.notes && (
                <div className="mb-8">
                  <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Notes</h2>
                  <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 min-h-[100px]">
                    <p className="text-gray-700 whitespace-pre-wrap">{passwordData.notes}</p>
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-4 border-t border-gray-200">
                <Link
                  to="/"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                >
                  Back to Dashboard
                </Link>
                <Link
                  to={`/edit/${id}`}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                >
                  <PencilIcon className="h-4 w-4 mr-2" />
                  Edit Password
                </Link>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default ViewPassword;