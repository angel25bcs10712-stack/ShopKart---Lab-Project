import axios from "axios";

const API = "http://localhost:5000";

const orderApi = axios.create({
  baseURL: API,
  withCredentials: true
});

export const createPaymentOrder = (shippingAddress) => {
  return orderApi.post(
    "/orders/create-payment-order",
    {
      shippingAddress
    }
  );
};

export const verifyPayment = (paymentData) => {
  return orderApi.post(
    "/orders/verify-payment",
    paymentData
  );
};

export const getMyOrders = () => {
  return orderApi.get("/orders");
};

export const getOrderById = (id) => {
  return orderApi.get(`/orders/${id}`);
};

export const getErrorMessage = (error) => {
  return (
    error?.response?.data?.message ||
    error?.message ||
    "Something went wrong. Please try again."
  );
};
