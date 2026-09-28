import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getWishlist, removeFromWishlist } from '../services/ProductApi';
import { useCart } from '../context/CartContext';
import '../styles/wishlist.css';

export default function Wishlist() {
  const navigate = useNavigate();
  const { addToCart, getItemQuantity, actionLoading } = useCart();

  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cartFeedback, setCartFeedback] = useState({});

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

  const handleAddToCart = async (productId) => {
    setCartFeedback((prev) => ({ ...prev, [productId]: '' }));
    const res = await addToCart(productId);
    if (res.success) {
      setCartFeedback((prev) => ({ ...prev, [productId]: 'Added to cart!' }));
      setTimeout(() => {
        setCartFeedback((prev) => ({ ...prev, [productId]: '' }));
      }, 2500);
    } else {
      setCartFeedback((prev) => ({ ...prev, [productId]: res.message }));
    }
  };

  return (
    <>
      <Navbar />
      <div className="wishlist-page">
        {loading ? (
          <div className="wishlist-state loading-state">
            <div className="spinner-inline" style={{ fontSize: '32px', marginBottom: '12px' }}>⏳</div>
            <p>Loading your saved items...</p>
          </div>
        ) : error ? (
          <div className="wishlist-state error-state">
            <h2>Unable to load wishlist</h2>
            <p>{error}</p>
            <button className="wishlist-action-btn" onClick={fetchWishlist}>Try Again</button>
          </div>
        ) : wishlist.length === 0 ? (
          <div className="wishlist-state empty-state">
            <div className="wishlist-empty-icon">❤️</div>
            <h2>Your wishlist is empty</h2>
            <p>Save items you love so you can easily find and buy them later.</p>
            <button className="wishlist-action-btn" onClick={() => navigate('/products')}>Browse Products</button>
          </div>
        ) : (
          <>
            <div className="wishlist-header">
              <div>
                <h1>My Wishlist</h1>
                <p>{wishlist.length} item{wishlist.length === 1 ? '' : 's'} saved</p>
              </div>
              <button className="continue-shopping-btn" onClick={() => navigate('/products')}>
                + Explore More Products
              </button>
            </div>

            <div className="wishlist-grid">
              {wishlist.map((product) => {
                const currentQty = getItemQuantity(product._id);
                const isAdding = actionLoading[product._id] === 'adding';
                const isOutOfStock = product.stock <= 0;
                const isMaxStock = currentQty >= product.stock && product.stock > 0;

                return (
                  <div key={product._id} className="wishlist-card">
                    <div className="wishlist-image-container" onClick={() => navigate(`/products/${product._id}`)}>
                      <span className="wishlist-category-pill">{product.category}</span>
                      <img src={product.image} alt={product.name} className="wishlist-image" />
                    </div>

                    <div className="wishlist-card-body">
                      <h3 title={product.name} onClick={() => navigate(`/products/${product._id}`)}>
                        {product.name}
                      </h3>

                      <div className="wishlist-price-row">
                        <span className="wishlist-price">₹{product.price.toLocaleString()}</span>
                        <span className={`stock-status-pill ${isOutOfStock ? 'out-of-stock' : product.stock <= 5 ? 'low-stock' : 'in-stock'}`}>
                          {isOutOfStock ? 'Out of stock' : product.stock <= 5 ? `Only ${product.stock} left` : 'In Stock'}
                        </span>
                      </div>

                      <div className="wishlist-actions">
                        <button
                          type="button"
                          className="wishlist-cart-btn"
                          onClick={() => handleAddToCart(product._id)}
                          disabled={isAdding || isOutOfStock || isMaxStock}
                        >
                          {isAdding
                            ? '⏳ Adding...'
                            : isOutOfStock
                            ? 'Out of Stock'
                            : isMaxStock
                            ? `Max In Cart (${currentQty})`
                            : currentQty > 0
                            ? `+ Add Another (${currentQty})`
                            : '🛒 Move to Cart'}
                        </button>

                        <button
                          type="button"
                          className="wishlist-danger-btn"
                          onClick={() => handleRemove(product._id)}
                          title="Remove from wishlist"
                        >
                          🗑
                        </button>
                      </div>

                      {cartFeedback[product._id] && (
                        <p className={cartFeedback[product._id].includes('Added') ? 'cart-feedback-success' : 'cart-feedback-error'}>
                          {cartFeedback[product._id]}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </>
  );
}
