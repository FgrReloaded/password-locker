import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { passwordService } from '../services/api';
import { EyeIcon, PencilIcon, PlusIcon, SearchIcon, TrashIcon } from 'lucide-react';

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

  // Load all passwords on component mount
  useEffect(() => {
    fetchPasswords();
  }, []);

  // Fetch all passwords from the API
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

  // Handle search functionality
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

  // Handle password deletion
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this password entry?')) {
      return;
    }

    try {
      await passwordService.deletePassword(id);
      // Refresh the password list
      setPasswords(passwords.filter(password => password.id !== id));
    } catch (err) {
      console.error('Error deleting password:', err);
      alert('Failed to delete password. Please try again.');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Your Passwords</h1>
        <Link
          to="/add"
          className="btn-primary flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-1" /> Add New
        </Link>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex">
          <input
            type="text"
            className="input-field rounded-r-none"
            placeholder="Search by website..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            type="submit"
            className="btn-primary rounded-l-none px-4"
          >
            <SearchIcon className="h-5 w-5" />
          </button>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Password List */}
      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading your passwords...</p>
        </div>
      ) : passwords.length === 0 ? (
        <div className="card text-center py-8">
          <p className="text-gray-600 mb-4">You don't have any saved passwords yet.</p>
          <Link to="/add" className="btn-primary inline-flex items-center">
            <PlusIcon className="h-5 w-5 mr-1" /> Add Your First Password
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden shadow">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="py-3 px-4 text-left">Website</th>
                <th className="py-3 px-4 text-left">Username</th>
                <th className="py-3 px-4 text-left">Last Updated</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {passwords.map((password) => (
                <tr key={password.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">{password.website}</td>
                  <td className="py-3 px-4">{password.username}</td>
                  <td className="py-3 px-4">
                    {new Date(password.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex justify-center space-x-2">
                      <Link
                        to={`/view/${password.id}`}
                        className="p-1 rounded hover:bg-gray-200 text-blue-600"
                        title="View"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </Link>
                      <Link
                        to={`/edit/${password.id}`}
                        className="p-1 rounded hover:bg-gray-200 text-yellow-600"
                        title="Edit"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(password.id)}
                        className="p-1 rounded hover:bg-gray-200 text-red-600"
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
      )}
    </div>
  );
};

export default Dashboard;