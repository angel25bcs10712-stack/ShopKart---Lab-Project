export default function OrderSummary({
  items,
  onPlaceOrder,
  loading,
  disabled
}) {
  const total = items.reduce(
    (sum, item) =>
      sum +
      Number(item.product?.price || 0) *
        Number(item.quantity || 0),
    0
  );

  return (
    <div className="checkout-summary-card">
      <h2>Order Review</h2>

      {items.map((item) => (
        <div
          className="checkout-item"
          key={item.product?._id || item._id}
        >
          <div>
            <strong>
              {item.product?.name}
            </strong>

            <div>
              Qty: {item.quantity}
            </div>
          </div>

          <strong>
            ₹
            {(
              Number(item.product?.price || 0) *
              Number(item.quantity || 0)
            ).toLocaleString("en-IN")}
          </strong>
        </div>
      ))}

      <hr />

      <div className="checkout-total">
        <span>Total</span>

        <strong>
          ₹{total.toLocaleString("en-IN")}
        </strong>
      </div>

      <button
        className="place-order-btn"
        onClick={onPlaceOrder}
        disabled={disabled || loading}
      >
        {loading
          ? "Opening Payment..."
          : "Place Order & Pay"}
      </button>
    </div>
  );
}