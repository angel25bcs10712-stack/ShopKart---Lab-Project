import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../services/ProductApi';
import '../styles/home.css';

export default function Home() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await getProducts();
        setProducts(response.data.products || []);
      } catch {
        setError('Something went wrong while loading products.');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      <Navbar />
      <main className="home-container">
        {/* Hero Section */}
        <section className="hero-banner">
          <div className="hero-content">
            <span className="hero-badge">✨ Next-Gen Shopping Experience</span>
            <h1 className="hero-title">
              Elevate Your Everyday Style & <span className="gradient-text">Tech Lifestyle</span>
            </h1>
            <p className="hero-description">
              Explore our curated selection of high-performance electronics, trendy fashion, and daily essentials — engineered for quality and convenience.
            </p>

            <div className="hero-actions">
              <button className="primary-hero-btn" onClick={() => navigate('/products')}>
                Explore Catalog ➔
              </button>
              <button className="secondary-hero-btn" onClick={() => navigate('/cart')}>
                View My Cart 🛒
              </button>
            </div>

            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">10k+</span>
                <span className="stat-label">Happy Shoppers</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-number">100%</span>
                <span className="stat-label">Authentic Goods</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-number">24/7</span>
                <span className="stat-label">Instant Support</span>
              </div>
            </div>
          </div>
        </section>

        {/* Value Propositions / Trust Bar */}
        <section className="features-bar">
          <div className="features-container">
            <div className="feature-card">
              <div className="feature-icon">🚀</div>
              <div className="feature-text">
                <h4>Free Fast Delivery</h4>
                <p>On all prepaid orders nationwide</p>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <div className="feature-text">
                <h4>Secure Payments</h4>
                <p>256-bit encrypted checkout</p>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🔄</div>
              <div className="feature-text">
                <h4>30-Day Easy Returns</h4>
                <p>Hassle-free replacement policy</p>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">⭐</div>
              <div className="feature-text">
                <h4>Best Price Guarantee</h4>
                <p>Unmatched value on top brands</p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products Showcase */}
        <section className="home-products-section">
          <div className="home-products-header">
            <div>
              <h2>Featured Products</h2>
              <p className="section-subtitle">Hand-picked bestsellers ready for your cart</p>
            </div>
            <button className="view-all-link" onClick={() => navigate('/products')}>
              Browse All Products ({products.length}) →
            </button>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="spinner-inline" style={{ fontSize: '32px', marginBottom: '12px' }}>⏳</div>
              <p>Discovering trending products...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <p>{error}</p>
            </div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <p>No products currently available.</p>
            </div>
          ) : (
            <div className="product-grid home-product-grid">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
