import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getProductById } from '../services/ProductApi';
import { useCart } from '../context/CartContext';
import '../styles/products.css';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, getItemQuantity, actionLoading } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cartFeedback, setCartFeedback] = useState({ error: '', success: '' });

  const currentQty = product ? getItemQuantity(product._id) : 0;
  const isAdding = product ? actionLoading[product._id] === 'adding' : false;
  const isOutOfStock = product?.stock <= 0;
  const isMaxStockReached = product && currentQty >= product.stock && product.stock > 0;

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await getProductById(id);
        setProduct(response.data.product);
      } catch {
        setError('Something went wrong while loading the product.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product || isAdding || isOutOfStock || isMaxStockReached) return;

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

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="product-details">
          <div className="loading-state">Loading product details...</div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="product-details">
          <div className="error-state">{error}</div>
        </div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="product-details">
          <div className="empty-state">No product found.</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="product-details">
        <div className="product-detail-card">
          <img src={product.image} alt={product.name} className="product-detail-image" />

          <div className="product-detail-info">
            <p className="product-category">{product.category}</p>
            <h1>{product.name}</h1>

            <div className="product-meta">
              <span className="meta-badge">₹{product.price.toLocaleString()}</span>
              <span className="meta-badge">{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</span>
            </div>

            <p>{product.description}</p>

            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button
                className="add-to-cart-btn"
                onClick={handleAddToCart}
                disabled={isAdding || isOutOfStock || isMaxStockReached}
                style={{ flex: 1 }}
              >
                {isAdding
                  ? '⏳ Adding...'
                  : isOutOfStock
                  ? 'Out of Stock'
                  : isMaxStockReached
                  ? `Max Stock In Cart (${currentQty})`
                  : currentQty > 0
                  ? `+ Add Another (${currentQty})`
                  : '🛒 Add to Cart'}
              </button>

              <button
                className="view-btn"
                onClick={() => navigate('/cart')}
                style={{ width: 'auto', padding: '10px 18px', background: '#3b82f6' }}
              >
                Go to Cart →
              </button>
            </div>

            {cartFeedback.success && <p className="cart-feedback-success">{cartFeedback.success}</p>}
            {cartFeedback.error && <p className="cart-feedback-error">{cartFeedback.error}</p>}
          </div>
        </div>
      </div>
    </>
  );
}
