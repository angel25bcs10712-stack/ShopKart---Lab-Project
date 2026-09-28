import { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import {
  getCart,
  addToCart as apiAddToCart,
  updateCartQuantity as apiUpdateCartQuantity,
  removeFromCart as apiRemoveFromCart
} from '../services/ProductApi';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState({});

  const setItemLoading = (productId, action) => {
    setActionLoading((prev) => {
      if (!action) {
        const next = { ...prev };
        delete next[productId];
        return next;
      }
      return { ...prev, [productId]: action };
    });
  };

  const fetchCart = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getCart();
      if (response.data && response.data.cart) {
        setCartItems(response.data.cart);
      }
    } catch (err) {
      // If user is not logged in (401), cart is just empty
      if (err?.response?.status === 401) {
        setCartItems([]);
      } else {
        setError(err?.response?.data?.message || 'Unable to load your cart.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId) => {
    setItemLoading(productId, 'adding');
    setError('');
    try {
      const response = await apiAddToCart(productId);
      if (response.data && response.data.cart) {
        setCartItems(response.data.cart);
      }
      return { success: true, message: response.data?.message || 'Product added to cart' };
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to add product to cart';
      return { success: false, message: msg };
    } finally {
      setItemLoading(productId, null);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    setItemLoading(productId, 'updating');
    setError('');
    try {
      const response = await apiUpdateCartQuantity(productId, quantity);
      if (response.data && response.data.cart) {
        setCartItems(response.data.cart);
      }
      return { success: true, message: response.data?.message || 'Cart updated' };
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to update quantity';
      return { success: false, message: msg };
    } finally {
      setItemLoading(productId, null);
    }
  };

  const removeFromCart = async (productId) => {
    setItemLoading(productId, 'removing');
    setError('');
    try {
      const response = await apiRemoveFromCart(productId);
      if (response.data && response.data.cart) {
        setCartItems(response.data.cart);
      }
      return { success: true, message: response.data?.message || 'Product removed from cart' };
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to remove product from cart';
      return { success: false, message: msg };
    } finally {
      setItemLoading(productId, null);
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Derived values
  const cartCount = useMemo(() => {
    return cartItems.reduce((total, item) => total + (item.quantity || 0), 0);
  }, [cartItems]);

  const subtotal = useMemo(() => {
    return cartItems.reduce((total, item) => {
      const price = item.product?.price || 0;
      const quantity = item.quantity || 0;
      return total + price * quantity;
    }, 0);
  }, [cartItems]);

  const getItemQuantity = useCallback((productId) => {
    const found = cartItems.find(
      (item) => item.product?._id === productId || item.product === productId
    );
    return found ? found.quantity : 0;
  }, [cartItems]);

  const value = {
    cartItems,
    loading,
    error,
    actionLoading,
    cartCount,
    subtotal,
    fetchCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getItemQuantity,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
