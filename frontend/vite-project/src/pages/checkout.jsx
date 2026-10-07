import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import CheckoutForm from "../components/CheckoutForm";
import OrderSummary from "../components/OrderSummary";
import { useCart } from "../context/CartContext";
import {
  createPaymentOrder,
  verifyPayment,
  getErrorMessage
} from "../services/orderApi";
import { validateShipping } from "../utils/validateShipping";
import { loadRazorpayScript } from "../utils/loadRazorpay";
import "../styles/checkout.css";

const EMPTY = {
  fullName: "",
  phone: "",
  addressLine1: "",
  city: "",
  state: "",
  pincode: ""
};

export default function Checkout() {
  const navigate = useNavigate();

  const {
    cartItems,
    clearCart,
    loading: cartLoading
  } = useCart();

  const [values, setValues] =
    useState(EMPTY);

  const [errors, setErrors] =
    useState({});

  const [apiError, setApiError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const paidRef = useRef(false);

  useEffect(() => {
    if (
      !cartLoading &&
      cartItems.length === 0 &&
      !paidRef.current
    ) {
      navigate("/cart", {
        replace: true
      });
    }
  }, [
    cartItems,
    cartLoading,
    navigate
  ]);

  const handleChange = (event) => {
    const {
      name,
      value
    } = event.target;

    setValues((previous) => ({
      ...previous,
      [name]: value
    }));

    if (errors[name]) {
      setErrors((previous) => ({
        ...previous,
        [name]: ""
      }));
    }
  };

  const handlePlaceOrder = async () => {
    setApiError("");

    const validationErrors =
      validateShipping(values);

    if (
      Object.keys(validationErrors).length > 0
    ) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      /*
      Razorpay frontend script.
      */
      const loaded =
        await loadRazorpayScript();

      if (!loaded || !window.Razorpay) {
        throw new Error(
          "Unable to load Razorpay."
        );
      }

      /*
      IMPORTANT:
      Only shipping address is sent.
      Price/cart total is NOT trusted.
      */
      const shippingAddress = {
        fullName: values.fullName.trim(),
        phone: values.phone.trim(),
        addressLine1:
          values.addressLine1.trim(),
        city: values.city.trim(),
        state: values.state.trim(),
        pincode: values.pincode.trim()
      };

      /*
      Backend calculates latest price,
      validates stock and creates
      Razorpay order.
      */
      const response =
        await createPaymentOrder(
          shippingAddress
        );

      const data = response.data;

      const razorpayOptions = {
        key: data.key,

        amount: data.amount,

        currency: data.currency,

        name: "ShopKart",

        description:
          "ShopKart Test Payment",

        order_id:
          data.razorpayOrderId,

        prefill: {
          name:
            shippingAddress.fullName,
          contact:
            shippingAddress.phone
        },

        theme: {
          color: "#3399cc"
        },

        handler: async (
          paymentResponse
        ) => {
          try {
            /*
            Payment success from Razorpay
            is NOT trusted by itself.
            Send signature to backend.
            */
            const verifyResponse =
              await verifyPayment({
                shopKartOrderId:
                  data.shopKartOrderId,

                razorpay_order_id:
                  paymentResponse.razorpay_order_id,

                razorpay_payment_id:
                  paymentResponse.razorpay_payment_id,

                razorpay_signature:
                  paymentResponse.razorpay_signature
              });

            /*
            Backend verified signature.
            NOW clear frontend cart.
            */
            paidRef.current = true;

            clearCart();

            navigate(
              `/order-success/${verifyResponse.data.order._id}`,
              {
                replace: true
              }
            );

          } catch (error) {
            setApiError(
              getErrorMessage(error)
            );

            setLoading(false);
          }
        },

        modal: {
          ondismiss: () => {
            setLoading(false);
          }
        }
      };

      const razorpay =
        new window.Razorpay(
          razorpayOptions
        );

      razorpay.on(
        "payment.failed",
        () => {
          setApiError(
            "Payment failed. Your cart has not been cleared."
          );

          setLoading(false);
        }
      );

      razorpay.open();

    } catch (error) {
      setApiError(
        getErrorMessage(error)
      );

      setLoading(false);
    }
  };

  if (cartLoading) {
    return (
      <div style={{
        padding: "40px",
        textAlign: "center"
      }}>
        Loading checkout...
      </div>
    );
  }

  return (
    <div className="checkout-page">

      <h1>Checkout</h1>

      {apiError && (
        <div
          className="error-banner"
          role="alert"
        >
          {apiError}
        </div>
      )}

      <div className="checkout-layout">

        <CheckoutForm
          values={values}
          errors={errors}
          onChange={handleChange}
          disabled={loading}
        />

        <OrderSummary
          items={cartItems}
          onPlaceOrder={
            handlePlaceOrder
          }
          loading={loading}
          disabled={
            cartItems.length === 0
          }
        />

      </div>

    </div>
  );
}
