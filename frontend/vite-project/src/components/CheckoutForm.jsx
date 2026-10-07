export default function CheckoutForm({
  values,
  errors,
  onChange,
  disabled
}) {
  const fields = [
    {
      name: "fullName",
      label: "Full Name",
      type: "text",
      placeholder: "Enter your full name"
    },
    {
      name: "phone",
      label: "Phone",
      type: "tel",
      placeholder: "Enter 10-digit phone"
    },
    {
      name: "addressLine1",
      label: "Address",
      type: "text",
      placeholder: "House number, street, area"
    },
    {
      name: "city",
      label: "City",
      type: "text",
      placeholder: "Enter city"
    },
    {
      name: "state",
      label: "State",
      type: "text",
      placeholder: "Enter state"
    },
    {
      name: "pincode",
      label: "Pincode",
      type: "text",
      placeholder: "6-digit pincode"
    }
  ];

  return (
    <div className="checkout-form-card">
      <h2>Shipping Details</h2>

      {fields.map((field) => (
        <div className="checkout-field" key={field.name}>
          <label htmlFor={field.name}>
            {field.label}
          </label>

          <input
            id={field.name}
            name={field.name}
            type={field.type}
            value={values[field.name]}
            onChange={onChange}
            placeholder={field.placeholder}
            disabled={disabled}
          />

          {errors[field.name] && (
            <small className="field-error">
              {errors[field.name]}
            </small>
          )}
        </div>
      ))}
    </div>
  );
}
