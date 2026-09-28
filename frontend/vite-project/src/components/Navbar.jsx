import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getWishlist, logoutCustomer } from '../services/ProductApi';
import { useCart } from '../context/CartContext';
import '../styles/navbar.css';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const { cartCount, clearCart } = useCart();

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
      clearCart();
      navigate('/login');
    } catch {
      alert('Error logging out. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="navbar-header">
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/home" className="navbar-brand">
            <span className="brand-icon">🛒</span>
            <span className="brand-text">Shop<span className="brand-highlight">Kart</span></span>
          </Link>

          <ul className="nav-menu">
            <li>
              <Link to="/home" className={`nav-link ${isActive('/home') ? 'active' : ''}`}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/products" className={`nav-link ${isActive('/products') ? 'active' : ''}`}>
                Products
              </Link>
            </li>
            <li>
              <Link to="/wishlist" className={`nav-link ${isActive('/wishlist') ? 'active' : ''}`} aria-label="Wishlist">
                <span>♥ Wishlist</span>
                {wishlistCount > 0 && <span className="nav-badge wishlist-badge">{wishlistCount}</span>}
              </Link>
            </li>
            <li>
              <Link to="/cart" className={`nav-link cart-link ${isActive('/cart') ? 'active' : ''}`} aria-label="Shopping Cart">
                <span>🛒 Cart</span>
                {cartCount > 0 && <span className="nav-badge cart-badge">{cartCount}</span>}
              </Link>
            </li>
            <li>
              <button onClick={handleLogout} className="logout-btn" disabled={loading} title="Sign Out">
                {loading ? 'Logging out...' : 'Logout'}
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
