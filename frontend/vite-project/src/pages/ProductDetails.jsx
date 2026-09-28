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
        <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '14px' }}>
          <button onClick={() => navigate('/products')} style={{ background: 'none', border: 'none', color: '#4f46e5', cursor: 'pointer', fontWeight: 600 }}>
            ← Back to Products
          </button>
          <span>/</span>
          <span>{product.category}</span>
          <span>/</span>
          <span style={{ color: '#0f172a', fontWeight: 600 }}>{product.name}</span>
        </div>

        <div className="product-detail-card">
          <div className="product-detail-image-box">
            <img src={product.image} alt={product.name} className="product-detail-image" />
          </div>

          <div className="product-detail-info">
            <span className="product-category-pill" style={{ position: 'static', display: 'inline-block', marginBottom: '8px' }}>
              {product.category}
            </span>
            <h1>{product.name}</h1>

            <div className="product-meta">
              <span className="meta-badge" style={{ fontSize: '20px', padding: '6px 16px' }}>
                ₹{product.price.toLocaleString()}
              </span>
              <span className={`stock-status-pill ${isOutOfStock ? 'out-of-stock' : product.stock <= 5 ? 'low-stock' : 'in-stock'}`} style={{ fontSize: '14px', padding: '6px 12px' }}>
                {isOutOfStock ? 'Out of Stock' : product.stock <= 5 ? `Only ${product.stock} units left` : `${product.stock} In Stock`}
              </span>
            </div>

            <p className="product-detail-description">{product.description}</p>

            <div style={{ display: 'flex', gap: '14px', marginTop: '24px' }}>
              <button
                className="add-to-cart-btn"
                onClick={handleAddToCart}
                disabled={isAdding || isOutOfStock || isMaxStockReached}
                style={{ flex: 1, padding: '14px 20px', fontSize: '15px' }}
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
                style={{ width: 'auto', padding: '14px 24px', background: '#eef2ff', color: '#4f46e5', borderColor: '#c7d2fe', fontSize: '15px' }}
              >
                View Cart ({currentQty}) →
              </button>
            </div>

            {cartFeedback.success && <p className="cart-feedback-success" style={{ textAlign: 'left', marginTop: '12px' }}>✓ {cartFeedback.success}</p>}
            {cartFeedback.error && <p className="cart-feedback-error" style={{ textAlign: 'left', marginTop: '12px' }}>⚠️ {cartFeedback.error}</p>}
          </div>
        </div>
      </div>
    </>
  );
}
