
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

export default function OrderDetails() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const response = await getOrderById(id);

        setOrder(response.data.order);
      } catch (error) {
        setError(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [id]);

  return (
    <>
      <Navbar />

      <div
        style={{
          maxWidth: "900px",
          margin: "40px auto",
          padding: "20px"
        }}
      >

        <Link to="/orders">
          ← My Orders
        </Link>

        {loading && (
          <h2>Loading...</h2>
        )}

        {error && (
          <div
            style={{
              color: "red"
            }}
          >
            {error}
          </div>
        )}

        {order && (
          <>
            <h1>
              Order Details
            </h1>

            <p>
              Order ID:
              <strong>
                {" "}{order._id}
              </strong>
            </p>

            <p>
              Order Status:
              <strong>
                {" "}{order.status}
              </strong>
            </p>

            <p>
              Payment Status:
              <strong>
                {" "}{order.paymentStatus}
              </strong>
            </p>

            <h2>
              Shipping Address
            </h2>

            <p>
              {order.shippingAddress?.fullName}
              <br />
              {order.shippingAddress?.phone}
              <br />
              {order.shippingAddress?.addressLine1}
              <br />
              {order.shippingAddress?.city},{" "}
              {order.shippingAddress?.state}
              <br />
              {order.shippingAddress?.pincode}
            </p>

            <h2>Items</h2>

            {order.items?.map((item) => (
              <div
                key={item._id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  borderBottom: "1px solid #ddd",
                  padding: "15px 0"
                }}
              >
                <div>
                  <strong>
                    {item.name}
                  </strong>

                  <div>
                    Quantity: {item.quantity}
                  </div>

                  <div>
                    Price: ₹
                    {Number(item.price).toLocaleString("en-IN")}
                  </div>
                </div>

                <strong>
                  ₹
                  {(
                    Number(item.price) *
                    Number(item.quantity)
                  ).toLocaleString("en-IN")}
                </strong>
              </div>
            ))}

            <h2>
              Total: ₹
              {Number(order.totalAmount).toLocaleString("en-IN")}
            </h2>
          </>
        )}
      </div>
    </>
  );
}


