import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addToWishlist } from '../services/ProductApi';

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const handleWishlistClick = async () => {
    if (saving || saved) return;

    setSaving(true);
    setError('');

    try {
      await addToWishlist(product._id);
      setSaved(true);
      window.dispatchEvent(new CustomEvent('wishlist:update'));
    } catch (err) {
      const message = err?.response?.data?.message || 'Unable to save product. Please try again.';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} className="product-image" />

      <div className="product-body">
        <p className="product-category">{product.category}</p>
        <h3>{product.name}</h3>
        <p className="product-price">₹{product.price.toLocaleString()}</p>
        <p className="product-stock">{product.stock > 0 ? `${product.stock} units left` : 'Out of stock'}</p>

        <div className="product-actions">
          <button className="view-btn" onClick={() => navigate(`/products/${product._id}`)}>
            View Details
          </button>

          <button
            className={`wishlist-btn ${saved ? 'saved' : ''}`}
            onClick={handleWishlistClick}
            disabled={saving || saved}
          >
            {saving ? '⏳ Saving...' : saved ? '♥ Added to Wishlist' : '♡ Add to Wishlist'}
          </button>
        </div>

        {error && <p className="wishlist-error">{error}</p>}
      </div>
    </div>
  );
}
