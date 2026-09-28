import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function CartItem({ item, onUpdateQuantity, onRemove, isUpdating, isRemoving }) {
  const { product, quantity } = item;
  const [errorMsg, setErrorMsg] = useState('');

  if (!product) return null;

  const isMaxStock = quantity >= product.stock;
  const isMinQuantity = quantity <= 1;

  const handleDecrease = async () => {
    if (isMinQuantity || isUpdating || isRemoving) return;
    setErrorMsg('');
    const res = await onUpdateQuantity(product._id, quantity - 1);
    if (!res.success) {
      setErrorMsg(res.message);
    }
  };

  const handleIncrease = async () => {
    if (isMaxStock || isUpdating || isRemoving) return;
    setErrorMsg('');
    const res = await onUpdateQuantity(product._id, quantity + 1);
    if (!res.success) {
      setErrorMsg(res.message);
    }
  };

  const handleRemove = async () => {
    if (isRemoving || isUpdating) return;
    setErrorMsg('');
    const res = await onRemove(product._id);
    if (!res.success) {
      setErrorMsg(res.message);
    }
  };

  const itemTotal = (product.price || 0) * quantity;

  return (
    <div className={`cart-item-card ${isRemoving ? 'removing' : ''}`}>
      <div className="cart-item-media">
        <Link to={`/products/${product._id}`}>
          <img src={product.image} alt={product.name} className="cart-item-image" />
        </Link>
      </div>

      <div className="cart-item-details">
        <div className="cart-item-header">
          <Link to={`/products/${product._id}`} className="cart-item-name">
            {product.name}
          </Link>
          <span className="cart-item-category">{product.category}</span>
        </div>

        <div className="cart-item-pricing">
          <span className="unit-price">₹{product.price.toLocaleString()}</span>
          <span className="price-multiplier">× {quantity}</span>
          <span className="item-total-price">₹{itemTotal.toLocaleString()}</span>
        </div>

        <div className="cart-item-stock-info">
          {product.stock <= 5 ? (
            <span className="stock-warning">Only {product.stock} left in stock!</span>
          ) : (
            <span className="stock-available">{product.stock} available</span>
          )}
        </div>

        {errorMsg && <p className="cart-item-error">{errorMsg}</p>}

        <div className="cart-item-actions">
          <div className="quantity-controls" aria-label="Quantity Controls">
            <button
              type="button"
              className="qty-btn qty-minus"
              onClick={handleDecrease}
              disabled={isMinQuantity || isUpdating || isRemoving}
              title={isMinQuantity ? 'Minimum quantity is 1' : 'Decrease quantity'}
            >
              −
            </button>
            <span className="qty-value">
              {isUpdating ? <span className="spinner-inline">...</span> : quantity}
            </span>
            <button
              type="button"
              className="qty-btn qty-plus"
              onClick={handleIncrease}
              disabled={isMaxStock || isUpdating || isRemoving}
              title={isMaxStock ? 'Maximum available stock reached' : 'Increase quantity'}
            >
              +
            </button>
          </div>

          <button
            type="button"
            className="cart-remove-btn"
            onClick={handleRemove}
            disabled={isRemoving || isUpdating}
          >
            {isRemoving ? 'Removing...' : '🗑 Remove'}
          </button>
        </div>
      </div>
    </div>
  );
}
