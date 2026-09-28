import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getWishlist, removeFromWishlist } from '../services/ProductApi';
import '../styles/wishlist.css';

export default function Wishlist() {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchWishlist = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await getWishlist();
      setWishlist(response.data.wishlist || []);
    } catch {
      setError('Unable to load wishlist.');
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemove = async (productId) => {
    try {
      await removeFromWishlist(productId);
      setWishlist((currentWishlist) => currentWishlist.filter((item) => item._id !== productId));
      window.dispatchEvent(new CustomEvent('wishlist:update'));
    } catch {
      setError('Unable to remove product from wishlist.');
    }
  };

  return (
    <>
      <Navbar />
      <div className="wishlist-page">
        {loading ? (
          <div className="wishlist-state loading-state">Loading your wishlist...</div>
        ) : error ? (
          <div className="wishlist-state error-state">
            <p>Unable to load wishlist.</p>
            <button className="wishlist-action-btn" onClick={fetchWishlist}>Try Again</button>
          </div>
        ) : wishlist.length === 0 ? (
          <div className="wishlist-state empty-state">
            <div className="wishlist-empty-icon">❤️</div>
            <h2>Your wishlist is empty</h2>
            <p>Start saving products you love.</p>
            <button className="wishlist-action-btn" onClick={() => navigate('/products')}>Browse Products</button>
          </div>
        ) : (
          <>
            <div className="wishlist-header">
              <h1>My Wishlist</h1>
              <p>{wishlist.length} product{wishlist.length === 1 ? '' : 's'} saved</p>
            </div>

            <div className="wishlist-grid">
              {wishlist.map((product) => (
                <div key={product._id} className="wishlist-card">
                  <img src={product.image} alt={product.name} className="wishlist-image" />

                  <div className="wishlist-card-body">
                    <h3>{product.name}</h3>
                    <p className="wishlist-category">{product.category}</p>
                    <p className="wishlist-price">₹{product.price.toLocaleString()}</p>
                    <p className="wishlist-stock">{product.stock > 0 ? `${product.stock} units left` : 'Out of stock'}</p>

                    <div className="wishlist-actions">
                      <button className="wishlist-secondary-btn" onClick={() => navigate(`/products/${product._id}`)}>
                        View Details
                      </button>
                      <button className="wishlist-danger-btn" onClick={() => handleRemove(product._id)}>
                        Remove from Wishlist
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
