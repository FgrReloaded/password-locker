import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { passwordService } from '../services/api';
import { EyeIcon, PencilIcon, PlusIcon, SearchIcon, TrashIcon, XIcon, LockKeyhole } from 'lucide-react';

interface PasswordItem {
  id: string;
  website: string;
  username: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

const Dashboard = () => {
  const [passwords, setPasswords] = useState<PasswordItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPasswords();
  }, []);

  const fetchPasswords = async () => {
    setIsLoading(true);
    try {
      const response = await passwordService.getAllPasswords();
      setPasswords(response.data);
      setError('');
    } catch (err: any) {
      console.error('Error fetching passwords:', err);
      setError('Failed to load passwords. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchPasswords();
      return;
    }

    setIsLoading(true);
    try {
      const response = await passwordService.searchPasswords(searchQuery);
      setPasswords(response.data);
    } catch (err) {
      console.error('Error searching passwords:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this password entry?')) {
      return;
    }

    try {
      await passwordService.deletePassword(id);
      setPasswords(passwords.filter(password => password.id !== id));
    } catch (err) {
      console.error('Error deleting password:', err);
      alert('Failed to delete password. Please try again.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Your Passwords</h1>
        <Link
          to="/add"
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 shadow-sm"
        >
          <PlusIcon className="h-5 w-5" /> Add New Password
        </Link>
      </div>

      <div className="mb-8">
        <form onSubmit={handleSearch} className="flex w-full max-w-md">
          <div className="relative flex-grow">
            <input
              type="text"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-l-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200"
              placeholder="Search by website or username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => {
                  setSearchQuery('');
                  fetchPasswords();
                }}
              >
                <XIcon className="h-5 w-5" />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-5 rounded-r-lg transition-colors duration-200"
            aria-label="Search"
          >
            <SearchIcon className="h-5 w-5" />
          </button>
        </form>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-md shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0 text-red-500">
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading your passwords...</p>
        </div>
      ) : passwords.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <LockKeyhole className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No passwords found</h3>
          <p className="text-gray-600 mb-6">You don't have any saved passwords yet.</p>
          <Link
            to="/add"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 shadow-sm"
          >
            <PlusIcon className="h-5 w-5" /> Add Your First Password
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Website
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Username
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {passwords.map((password) => (
                  <tr key={password.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{password.website}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{password.username}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(password.updatedAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex justify-center space-x-3">
                        <Link
                          to={`/view/${password.id}`}
                          className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-50 transition-colors duration-150"
                          title="View"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </Link>
                        <Link
                          to={`/edit/${password.id}`}
                          className="text-amber-600 hover:text-amber-900 p-1 rounded-full hover:bg-amber-50 transition-colors duration-150"
                          title="Edit"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(password.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50 transition-colors duration-150"
                          title="Delete"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;