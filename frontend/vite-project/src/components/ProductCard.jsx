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

  const handleWishlistClick = async () => {
    if (savingWishlist || savedWishlist) return;

    setSavingWishlist(true);
    setWishlistError('');

    try {
      await addToWishlist(product._id);
      setSavedWishlist(true);
      window.dispatchEvent(new CustomEvent('wishlist:update'));
    } catch (err) {
      const message = err?.response?.data?.message || 'Unable to save product. Please try again.';
      setWishlistError(message);
    } finally {
      setSavingWishlist(false);
    }
  };

  const handleAddToCart = async () => {
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
    <div className="product-card">
      <img src={product.image} alt={product.name} className="product-image" />

      <div className="product-body">
        <p className="product-category">{product.category}</p>
        <h3>{product.name}</h3>
        <p className="product-price">₹{product.price.toLocaleString()}</p>
        <p className="product-stock">
          {product.stock > 0 ? `${product.stock} units left` : 'Out of stock'}
        </p>

        <div className="product-actions">
          {/* Add to Cart button */}
          <button
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

          <button className="view-btn" onClick={() => navigate(`/products/${product._id}`)}>
            View Details
          </button>

          <button
            className={`wishlist-btn ${savedWishlist ? 'saved' : ''}`}
            onClick={handleWishlistClick}
            disabled={savingWishlist || savedWishlist}
          >
            {savingWishlist
              ? '⏳ Saving...'
              : savedWishlist
              ? '♥ In Wishlist'
              : '♡ Add to Wishlist'}
          </button>
        </div>

        {cartFeedback.success && <p className="cart-feedback-success">{cartFeedback.success}</p>}
        {cartFeedback.error && <p className="cart-feedback-error">{cartFeedback.error}</p>}
        {wishlistError && <p className="wishlist-error">{wishlistError}</p>}
      </div>
    </div>
  );
}
