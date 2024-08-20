const otpStore = {};

export const storeOTP = (email, otp) => {
  otpStore[email] = {
    otp,
    expiry: Date.now() + 5 * 60 * 1000, 
  };
};

export const verifyOTP = (email, otp) => {
  const otpData = otpStore[email];
  if (!otpData) return false;
  if (otpData.otp !== otp) return false;
  if (Date.now() > otpData.expiry) return false;
  return true;
};

export const clearOTP = (email) => {
  delete otpStore[email];
};

export const validateOTP = (email, inputOtp) => {
  const otpData = otpStore[email];
  
  if (!otpData) {
    console.log('OTP not found for:', email);
    return { valid: false, message: "OTP not found" };
  }

  const { otp, expirationTime } = otpData;

  if (inputOtp !== otp) {
    console.log('Invalid OTP:', inputOtp, 'Expected:', otp);
    return { valid: false, message: "Invalid OTP" };
  }

  if (Date.now() > expirationTime) {
    console.log('OTP expired for:', email);
    return { valid: false, message: "OTP expired" };
  }

  return { valid: true, message: "OTP is valid" };
};
