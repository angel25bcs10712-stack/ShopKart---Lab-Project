export const validateShipping = (shipping) => {
  const errors = {};

  if (!shipping.fullName?.trim()) {
    errors.fullName = "Full name is required";
  }

  if (!shipping.phone?.trim()) {
    errors.phone = "Phone number is required";
  } else if (!/^[6-9]\d{9}$/.test(shipping.phone.trim())) {
    errors.phone = "Enter a valid 10-digit phone number";
  }

  if (!shipping.addressLine1?.trim()) {
  errors.addressLine1 = "Address is required";
}

  if (!shipping.city?.trim()) {
    errors.city = "City is required";
  }

  if (!shipping.state?.trim()) {
    errors.state = "State is required";
  }

  if (!shipping.pincode?.trim()) {
    errors.pincode = "Pincode is required";
  } else if (!/^\d{6}$/.test(shipping.pincode.trim())) {
    errors.pincode = "Enter a valid 6-digit pincode";
  }

  return errors;
};