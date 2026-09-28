import { useEffect, useMemo, useState } from 'react';
import { getProducts } from '../services/ProductApi';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import '../styles/products.css';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('newest');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const categories = useMemo(() => {
    const unique = [...new Set(products.map((product) => product.category))];
    return ['All', ...unique];
  }, [products]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');

      try {
        const sortValue = sort === 'price_asc' || sort === 'price_desc' ? sort : '';
        const response = await getProducts({
          search,
          category: category === 'All' ? '' : category,
          sort: sortValue
        });
        setProducts(response.data.products || []);
      } catch {
        setError('Something went wrong while loading products.');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [search, category, sort]);

  return (
    <>
      <Navbar />
      <div className="products-page">
        <div className="products-toolbar">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>

          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="newest">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>

        {loading ? (
          <div className="loading-state">Loading products...</div>
        ) : error ? (
          <div className="error-state">{error}</div>
        ) : products.length === 0 ? (
          <div className="empty-state">No products found.</div>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
