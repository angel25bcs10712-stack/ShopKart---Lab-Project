import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getMyProfile } from '../services/ProductApi';


export default function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await getMyProfile();
        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return <div className="loading-container">Verifying authentication...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}
