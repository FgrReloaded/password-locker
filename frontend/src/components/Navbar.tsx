import { LockKeyhole, MenuIcon, XIcon, Shield, User, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavbarProps {
  onLogout: () => void;
}

const Navbar = ({ onLogout }: NavbarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const username = localStorage.getItem('username');
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-md ${scrolled
        ? 'bg-indigo-900/90 shadow-lg'
        : 'bg-indigo-800/80'
      }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link
            to="/"
            className="flex items-center space-x-3 group"
          >
            <div className="flex items-center justify-center h-11 w-11 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-xl shadow-md group-hover:shadow-indigo-500/30 group-hover:scale-105 transition-all duration-300">
              <LockKeyhole className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200">Locker</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 ${isActive('/')
                  ? 'bg-white/10 text-white'
                  : 'hover:bg-white/5 hover:text-indigo-200'
                }`}
            >
              <Shield className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>

            <Link
              to="/add"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 ${isActive('/add')
                  ? 'bg-white/10 text-white'
                  : 'hover:bg-white/5 hover:text-indigo-200'
                }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span>Add Password</span>
            </Link>

            <div className="flex items-center space-x-4 pl-6 border-l border-indigo-400/30">
              <div className="flex items-center space-x-2 bg-white/5 px-3 py-2 rounded-lg">
                <User className="h-4 w-4 text-indigo-200" />
                <div className="text-sm">
                  <span className="block text-indigo-200/70">Welcome,</span>
                  <span className="font-semibold text-white">{username}</span>
                </div>
              </div>

              <button
                onClick={onLogout}
                className="flex items-center space-x-2 bg-gradient-to-r from-indigo-400 to-indigo-600 hover:from-indigo-500 hover:to-indigo-700 px-4 py-2 rounded-lg font-medium text-white transition-all duration-300 shadow-md hover:shadow-indigo-500/30"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          <button
            className="md:hidden p-2 bg-white/10 backdrop-blur-md rounded-lg hover:bg-white/20 transition-all duration-200"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? (
              <XIcon className="h-6 w-6" />
            ) : (
              <MenuIcon className="h-6 w-6" />
            )}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-indigo-400/20 space-y-3 animate-fadeIn">
            <Link
              to="/"
              className={`flex items-center space-x-2 ${isActive('/')
                  ? 'bg-white/10 text-white'
                  : 'hover:bg-white/5'
                } px-4 py-3 rounded-lg transition-all duration-200`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Shield className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>

            <Link
              to="/add"
              className={`flex items-center space-x-2 ${isActive('/add')
                  ? 'bg-white/10 text-white'
                  : 'hover:bg-white/5'
                } px-4 py-3 rounded-lg transition-all duration-200`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span>Add Password</span>
            </Link>

            <div className="pt-3 border-t border-indigo-400/20">
              <div className="flex items-center space-x-2 px-4 py-3 bg-white/5 rounded-lg">
                <User className="h-5 w-5 text-indigo-200" />
                <div>
                  <div className="text-sm text-indigo-200/70">Welcome,</div>
                  <div className="font-semibold text-white">{username}</div>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onLogout();
                }}
                className="w-full mt-3 flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-400 to-indigo-600 px-4 py-3 rounded-lg font-medium text-white transition-all duration-300"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;