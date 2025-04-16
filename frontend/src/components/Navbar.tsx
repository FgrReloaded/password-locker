import { LockKeyhole, MenuIcon, XIcon } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  onLogout: () => void;
}

const Navbar = ({ onLogout }: NavbarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const username = localStorage.getItem('username');

  return (
    <nav className="bg-primary-600 text-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-2">
            <LockKeyhole className="h-8 w-8" />
            <span className="text-xl font-bold">Locker</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-primary-200 transition">Dashboard</Link>
            <Link to="/add" className="hover:text-primary-200 transition">Add Password</Link>
            <div className="flex items-center space-x-2 pl-4 border-l border-primary-500">
              <span>Welcome, {username}</span>
              <button
                onClick={onLogout}
                className="ml-4 bg-primary-700 hover:bg-primary-800 px-3 py-1 rounded-md transition"
              >
                Logout
              </button>
            </div>
          </div>

          <button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <XIcon className="h-6 w-6" />
            ) : (
              <MenuIcon className="h-6 w-6" />
            )}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-primary-500 space-y-3">
            <Link
              to="/"
              className="block hover:bg-primary-500 px-3 py-2 rounded-md transition"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/add"
              className="block hover:bg-primary-500 px-3 py-2 rounded-md transition"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Add Password
            </Link>
            <div className="pt-3 border-t border-primary-500">
              <div className="px-3 py-1">Welcome, {username}</div>
              <button
                onClick={onLogout}
                className="w-full mt-2 text-left bg-primary-700 hover:bg-primary-800 px-3 py-2 rounded-md transition"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;