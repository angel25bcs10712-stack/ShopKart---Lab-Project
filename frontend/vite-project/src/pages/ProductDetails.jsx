import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getProductById } from '../services/ProductApi';
import '../styles/products.css';

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="product-details">
          <div className="loading-state">Loading products...</div>
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
          <div className="empty-state">No products found.</div>
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
            <button className="add-to-cart-btn">Add to Cart</button>
          </div>
        </div>
      </div>
    </>
  );
}
