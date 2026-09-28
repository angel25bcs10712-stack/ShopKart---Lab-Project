import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addToWishlist } from '../services/ProductApi';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart, getItemQuantity, actionLoading } = useCart();

  const [savingWishlist, setSavingWishlist] = useState(false);
  const [savedWishlist, setSavedWishlist] = useState(false);
  const [wishlistError, setWishlistError] = useState('');
  const [cartFeedback, setCartFeedback] = useState({ error: '', success: '' });

  const currentQty = getItemQuantity(product._id);
  const isAdding = actionLoading[product._id] === 'adding';
  const isOutOfStock = product.stock <= 0;
  const isMaxStockReached = currentQty >= product.stock && product.stock > 0;

  const handleWishlistClick = async (e) => {
    e.stopPropagation();
    if (savingWishlist || savedWishlist) return;

    setSavingWishlist(true);
    setWishlistError('');

    try {
      await addToWishlist(product._id);
      setSavedWishlist(true);
      window.dispatchEvent(new CustomEvent('wishlist:update'));
    } catch (err) {
      const message = err?.response?.data?.message || 'Unable to save to wishlist.';
      setWishlistError(message);
    } finally {
      setSavingWishlist(false);
    }
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (isAdding || isOutOfStock || isMaxStockReached) return;

    setCartFeedback({ error: '', success: '' });
    const res = await addToCart(product._id);

    if (res.success) {
      setCartFeedback({ error: '', success: 'Added to cart!' });
      setTimeout(() => {
        setCartFeedback((prev) => ({ ...prev, success: '' }));
      }, 2500);
    } else {
      setCartFeedback({ error: res.message, success: '' });
    }
  };

  return (
    <div className="product-card" onClick={() => navigate(`/products/${product._id}`)}>
      {/* Top Image Box */}
      <div className="product-image-container">
        <span className="product-category-pill">{product.category}</span>

        <button
          type="button"
          className={`quick-wishlist-btn ${savedWishlist ? 'active' : ''}`}
          onClick={handleWishlistClick}
          disabled={savingWishlist || savedWishlist}
          title={savedWishlist ? 'In your wishlist' : 'Add to wishlist'}
        >
          {savingWishlist ? '⌛' : savedWishlist ? '❤️' : '🤍'}
        </button>

        <img src={product.image} alt={product.name} className="product-image" loading="lazy" />
      </div>

      {/* Card Content */}
      <div className="product-body">
        <h3 className="product-title" title={product.name}>
          {product.name}
        </h3>

        <div className="product-price-row">
          <span className="product-price">₹{product.price.toLocaleString()}</span>
          <span className={`stock-status-pill ${isOutOfStock ? 'out-of-stock' : product.stock <= 5 ? 'low-stock' : 'in-stock'}`}>
            {isOutOfStock ? 'Out of Stock' : product.stock <= 5 ? `Only ${product.stock} left` : 'In Stock'}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="product-card-footer">
          <button
            type="button"
            className={`wishlist-btn-card ${savedWishlist ? 'saved' : ''}`}
            onClick={handleWishlistClick}
            disabled={savingWishlist || savedWishlist}
            title={savedWishlist ? 'Already in wishlist' : 'Save to wishlist'}
          >
            {savingWishlist ? '⌛' : savedWishlist ? '❤️ In Wishlist' : '♡ Add to Wishlist'}
          </button>

          <button
            type="button"
            className={`add-to-cart-btn ${currentQty > 0 ? 'in-cart' : ''}`}
            onClick={handleAddToCart}
            disabled={isAdding || isOutOfStock || isMaxStockReached}
          >
            {isAdding
              ? '⏳ Adding...'
              : isOutOfStock
              ? 'Out of Stock'
              : isMaxStockReached
              ? `Max In Cart (${currentQty})`
              : currentQty > 0
              ? `+ Add Another (${currentQty})`
              : '🛒 Add to Cart'}
          </button>
        </div>

        {cartFeedback.success && <p className="cart-feedback-success">✓ {cartFeedback.success}</p>}
        {cartFeedback.error && <p className="cart-feedback-error">⚠️ {cartFeedback.error}</p>}
        {wishlistError && <p className="wishlist-error">⚠️ {wishlistError}</p>}
      </div>
    </div>
  );
}
