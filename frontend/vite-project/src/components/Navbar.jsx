import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getWishlist, logoutCustomer } from '../services/ProductApi';
import '../styles/navbar.css';

export default function Navbar() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    const fetchWishlistCount = async () => {
      try {
        const response = await getWishlist();
        setWishlistCount(response.data.count || 0);
      } catch {
        setWishlistCount(0);
      }
    };

    fetchWishlistCount();

    const handleWishlistUpdate = () => {
      fetchWishlistCount();
    };

    window.addEventListener('wishlist:update', handleWishlistUpdate);

    return () => {
      window.removeEventListener('wishlist:update', handleWishlistUpdate);
    };
  }, []);

  const handleLogout = async () => {
    setLoading(true);

    try {
      await logoutCustomer();
      navigate('/login');
    } catch {
      alert('Error logging out. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h1 className="navbar-logo">🛒 ShopKart</h1>

        <ul className="nav-menu">
          <li>
            <Link to="/home" className="nav-link">Home</Link>
          </li>
          <li>
            <Link to="/products" className="nav-link">Products</Link>
          </li>
          <li>
            <Link to="/wishlist" className="nav-link" aria-label="Wishlist">
              ♥ Wishlist{wishlistCount > 0 ? ` (${wishlistCount})` : ''}
            </Link>
          </li>
          <li>
            <button onClick={handleLogout} className="logout-btn" disabled={loading}>
              {loading ? 'Logging out...' : 'Logout'}
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
