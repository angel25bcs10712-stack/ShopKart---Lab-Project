import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import CartItem from '../components/CartItem';
import { useCart } from '../context/CartContext';
import '../styles/cart.css';

export default function Cart() {
  const navigate = useNavigate();
  const {
    cartItems,
    loading,
    error,
    actionLoading,
    cartCount,
    subtotal,
    updateQuantity,
    removeFromCart,
    fetchCart
  } = useCart();

  return (
    <>
      <Navbar />
      <div className="cart-page">
        {loading ? (
          <div className="cart-state loading-state">
            <div className="spinner-inline" style={{ fontSize: '32px', marginBottom: '12px' }}>⏳</div>
            <p>Loading your cart...</p>
          </div>
        ) : error ? (
          <div className="cart-state error-state">
            <h2>Something went wrong</h2>
            <p>{error}</p>
            <button className="cart-action-btn" onClick={fetchCart}>
              Try Again
            </button>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="cart-state empty-state">
            <div className="cart-empty-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added anything yet.</p>
            <button className="cart-action-btn" onClick={() => navigate('/products')}>
              Browse Products
            </button>
          </div>
        ) : (
          <>
            <div className="cart-header">
              <h1>My Cart</h1>
              <p>
                {cartCount} item{cartCount === 1 ? '' : 's'} across {cartItems.length} unique product{cartItems.length === 1 ? '' : 's'}
              </p>
            </div>

            <div className="cart-layout">
              {/* Left Column: List of items */}
              <div className="cart-items-list">
                {cartItems.map((item) => {
                  const pId = item.product?._id;
                  const isUpdating = actionLoading[pId] === 'updating';
                  const isRemoving = actionLoading[pId] === 'removing';

                  return (
                    <CartItem
                      key={pId || item._id}
                      item={item}
                      onUpdateQuantity={updateQuantity}
                      onRemove={removeFromCart}
                      isUpdating={isUpdating}
                      isRemoving={isRemoving}
                    />
                  );
                })}
              </div>

              {/* Right Column: Order Summary */}
              <div className="order-summary-card">
                <h2>Order Summary</h2>

                <div className="summary-row">
                  <span>Total Items</span>
                  <span className="summary-value">{cartCount}</span>
                </div>

                <div className="summary-row">
                  <span>Subtotal</span>
                  <span className="summary-value">₹{subtotal.toLocaleString()}</span>
                </div>

                <div className="summary-row">
                  <span>Shipping</span>
                  <span className="free-badge">FREE</span>
                </div>

                <div className="summary-divider"></div>

                <div className="summary-row total-row">
                  <span>Total Amount</span>
                  <span className="total-amount">₹{subtotal.toLocaleString()}</span>
                </div>

                <button
                  type="button"
                  className="checkout-btn"
                  onClick={() => navigate('/checkout')}
                >
                  Proceed to Checkout →
                </button>

                <Link to="/products" className="continue-shopping-link">
                  ← Continue Shopping
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
