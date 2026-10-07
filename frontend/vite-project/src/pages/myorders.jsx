import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
  getMyOrders,
  getErrorMessage
} from "../services/orderApi";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] =
    useState(true);
  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response =
          await getMyOrders();

        setOrders(
          response.data.orders || []
        );
      } catch (error) {
        setError(
          getErrorMessage(error)
        );
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  return (
    <>
      <Navbar />

      <div style={{
        maxWidth: "1000px",
        margin: "40px auto",
        padding: "20px"
      }}>
        <h1>My Orders</h1>

        {loading && (
          <p>Loading orders...</p>
        )}

        {error && (
          <div style={{
            color: "red",
            margin: "20px 0"
          }}>
            {error}
          </div>
        )}

        {!loading &&
          !error &&
          orders.length === 0 && (
            <div>
              <h2>No orders yet</h2>

              <Link to="/products">
                Start Shopping
              </Link>
            </div>
          )}

        {orders.map((order) => (
          <div
            key={order._id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "20px",
              marginTop: "20px"
            }}
          >
            <h3>
              Order #{order._id.slice(-8)}
            </h3>

            <p>
              Status:{" "}
              <strong>
                {order.status}
              </strong>
            </p>

            <p>
              Payment:{" "}
              <strong>
                {order.paymentStatus}
              </strong>
            </p>

            <p>
              Total: ₹
              {Number(
                order.totalAmount
              ).toLocaleString()}
            </p>

            <p>
              Items:{" "}
              {order.items?.length || 0}
            </p>

            <Link
              to={`/orders/${order._id}`}
            >
              View Order
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}
