import { Link } from 'react-router-dom';

export default function Navbar({ isAuthenticated, onLogout }) {
  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link to={isAuthenticated ? "/admin/dashboard" : "/"} className="flex items-center">
          <img 
            src="/Frame 3.png" 
            alt="Lovosis Technology Logo" 
            className="h-10 w-auto mr-3" 
          />
          <div>
            <span className="text-xl font-bold block leading-tight">Lovosis Technology</span>
            <span className="text-xs text-blue-200 block leading-tight">Private Limited</span>
          </div>
        </Link>
        
        <div className="flex space-x-4">
          {/* Only show Home link when not authenticated */}
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
    </nav>
  );
}