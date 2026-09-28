import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const getProduct = () => {
  return axios.get("https://fakestoreapi.com/products");
}

export const registerCustomer = (data) => api.post('/customers/register', data);
export const loginCustomer = (data) => api.post('/customers/login', data);
export const getMyProfile = () => api.get('/customers/me');
export const logoutCustomer = () => api.post('/customers/logout');
export const getProducts = (params = {}) => api.get('/products', { params });
export const getProductById = (id) => api.get(`/products/${id}`);
export const addToWishlist = (productId) => api.post(`/wishlist/${productId}`);
export const getWishlist = () => api.get('/wishlist');
export const removeFromWishlist = (productId) => api.delete(`/wishlist/${productId}`);

export default api;
