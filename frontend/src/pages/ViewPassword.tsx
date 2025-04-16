import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { passwordService } from '../services/api';
import { ArrowLeftIcon, CircleAlert, ClipboardCopyIcon, LockKeyhole } from 'lucide-react';

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
  const [copied, setCopied] = useState(false);

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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <Link to="/" className="mr-4 text-gray-600 hover:text-gray-800">
          <ArrowLeftIcon className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">View Password</h1>
      </div>

      <div className="max-w-2xl mx-auto">
        {!isAuthenticated ? (
          <div className="card">
            <div className="flex justify-center mb-4">
              <LockKeyhole className="h-12 w-12 text-primary-500" />
            </div>
            <h2 className="text-xl font-bold text-center mb-4">Authenticate to View Password</h2>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-start">
                <CircleAlert className="h-5 w-5 mr-2 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleAuthenticate}>
              <div className="mb-4">
                <label htmlFor="masterPassword" className="block text-gray-700 mb-2">
                  Enter your master password to decrypt
                </label>
                <input
                  type="password"
                  id="masterPassword"
                  className="input-field"
                  value={masterPassword}
                  onChange={(e) => setMasterPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                className="btn-primary w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Authenticating...' : 'Authenticate'}
              </button>
            </form>
          </div>
        ) : (
          passwordData && (
            <div className="card">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <h2 className="text-sm font-semibold text-gray-500 uppercase mb-1">Website</h2>
                  <p className="text-lg">{passwordData.website}</p>
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-gray-500 uppercase mb-1">Username</h2>
                  <div className="flex items-center">
                    <p className="text-lg mr-2">{passwordData.username}</p>
                    <button
                      onClick={() => copyToClipboard(passwordData.username)}
                      className="text-gray-500 hover:text-gray-700"
                      title="Copy username"
                    >
                      <ClipboardCopyIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-gray-500 uppercase mb-1">Created</h2>
                  <p className="text-lg">
                    {new Date(passwordData.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="mb-6 p-4 bg-gray-50 rounded-md border border-gray-200">
                <h2 className="text-sm font-semibold text-gray-500 uppercase mb-2">Password</h2>
                <div className="flex items-center">
                  <div className="relative flex-1">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="input-field pr-24"
                      value={passwordData.password}
                      readOnly
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-600 hover:text-gray-800 mr-2"
                      >
                        {showPassword ? 'Hide' : 'Show'}
                      </button>
                      <button
                        onClick={() => copyToClipboard(passwordData.password)}
                        className="text-gray-600 hover:text-gray-800"
                        title="Copy password"
                      >
                        <ClipboardCopyIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
                {copied && (
                  <div className="mt-2 text-green-600 text-sm">
                    Copied to clipboard!
                  </div>
                )}
              </div>

              {passwordData.notes && (
                <div className="mb-6">
                  <h2 className="text-sm font-semibold text-gray-500 uppercase mb-2">Notes</h2>
                  <div className="p-3 bg-gray-50 rounded-md border border-gray-200 min-h-[80px]">
                    <p className="whitespace-pre-wrap">{passwordData.notes}</p>
                  </div>
                </div>
              )}

              <div className="flex justify-between">
                <Link to="/" className="btn-secondary">
                  Back to Dashboard
                </Link>
                <Link to={`/edit/${id}`} className="btn-primary">
                  Edit
                </Link>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ViewPassword;