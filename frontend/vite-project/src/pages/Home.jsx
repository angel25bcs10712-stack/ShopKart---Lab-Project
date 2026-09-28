import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../services/ProductApi';
import '../styles/home.css';

export default function Home() {
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
        <section className="hero-section">
          <img
            src="https://cdn-na.mynilead.com/1bfa3120d5534256b3bf17c37565c435/assets/img/famms-1_1702887442_large.png"
            alt="ShopKart welcome"
            className="hero-image"
          />
        </section>

        <section className="home-products-section">
          <div className="home-products-header">
            <h2>Featured Products</h2>
          </div>

          {loading ? (
            <div className="loading-state">Loading products...</div>
          ) : error ? (
            <div className="error-state">{error}</div>
          ) : products.length === 0 ? (
            <div className="empty-state">No products found.</div>
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







