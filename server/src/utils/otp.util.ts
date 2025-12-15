import crypto from "crypto";
export function generateOTP(n = 6) {

  if (!Number.isInteger(n) || n <= 0)
    throw new TypeError("n must be a positive integer");
  let otp = "";
  for (let i = 0; i < n; i++) otp += crypto.randomInt(0, 10);
  return otp;
}
