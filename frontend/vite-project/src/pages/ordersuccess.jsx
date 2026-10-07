import { useEffect, useState } from "react";
import {
  Link,
  useParams
} from "react-router-dom";
import Navbar from "../components/Navbar";
import {
  getOrderById,
  getErrorMessage
} from "../services/orderApi";

export default function OrderSuccess() {
  const { id } = useParams();

  const [order, setOrder] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const response =
          await getOrderById(id);

        setOrder(
          response.data.order
        );
      } catch (error) {
        setError(
          getErrorMessage(error)
        );
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [id]);

  return (
    <>
      <Navbar />

      <div style={{
        maxWidth: "800px",
        margin: "60px auto",
        padding: "30px",
        textAlign: "center"
      }}>

        {loading && (
          <h2>
            Loading order...
          </h2>
        )}

        {error && (
          <>
            <h2>Order not found</h2>
            <p>{error}</p>
          </>
        )}

        {order && (
          <>
            <div style={{
              fontSize: "60px"
            }}>
              ?
            </div>

            <h1>
              Order Placed Successfully!
            </h1>

            <p>
              Thank you for shopping
              with ShopKart.
            </p>

            <p>
              Order ID:
              <strong>
                {" "}{order._id}
              </strong>
            </p>

            <p>
              Payment:
              <strong>
                {" "}
                {order.paymentStatus}
              </strong>
            </p>

            <p>
              Status:
              <strong>
                {" "}
                {order.status}
              </strong>
            </p>

            <h2>
              ?
              {Number(
                order.totalAmount
              ).toLocaleString()}
            </h2>

            <div style={{
              marginTop: "30px",
              display: "flex",
              gap: "15px",
              justifyContent: "center"
            }}>
              <Link to="/orders">
                My Orders
              </Link>

              <Link to="/products">
                Continue Shopping
              </Link>
            </div>
          </>
        )}

      </div>
    </>
  );
}
