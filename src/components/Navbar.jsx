import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function Navbar({ isAuthenticated, onLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to={isAuthenticated ? "/admin/dashboard" : "/"} className="flex items-center">
            <img 
              src="/Frame 3.png" 
              alt="Lovosis Technology Logo" 
              className="h-8 w-auto mr-2 sm:h-10 sm:mr-3" 
            />
            <div>
              <span className="text-lg font-bold block leading-tight sm:text-xl">Lovosis Technology</span>
              <span className="text-xs text-blue-200 block leading-tight">Private Limited</span>
            </div>
          </Link>
          
          {/* Mobile menu button */}
          <div className="sm:hidden">
            <button 
              type="button" 
              className="text-white focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                )}
              </svg>
            </button>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden sm:flex space-x-4">
            {!isAuthenticated && (
              <Link to="/" className="hover:text-blue-200">
                Home
              </Link>
            )}
            
            {isAuthenticated ? (
              <>
                <Link to="/admin/dashboard" className="hover:text-blue-200">
                  Dashboard
                </Link>
                <button 
                  onClick={onLogout} 
                  className="hover:text-blue-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/admin/login" className="hover:text-blue-200">
                Admin Login
              </Link>
            )}
          </div>
        </div>
        
        {/* Mobile navigation */}
        {isMenuOpen && (
          <div className="sm:hidden mt-2 pt-2 pb-4 border-t border-blue-400">
            {!isAuthenticated && (
              <Link to="/" className="block px-2 py-2 hover:bg-blue-700 rounded">
                Home
              </Link>
            )}
            
            {isAuthenticated ? (
              <>
                <Link to="/admin/dashboard" className="block px-2 py-2 hover:bg-blue-700 rounded">
                  Dashboard
                </Link>
                <button 
                  onClick={onLogout} 
                  className="block w-full text-left px-2 py-2 hover:bg-blue-700 rounded"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/admin/login" className="block px-2 py-2 hover:bg-blue-700 rounded">
                Admin Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}