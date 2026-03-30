import Razorpay from "razorpay";
import { AppError } from "@/lib/apiError";

let razorpayClient: Razorpay | null = null;

export function getRazorpayServerClient() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new AppError(
      "Razorpay is not configured on the server.",
      503,
      "EXTERNAL_SERVICE_ERROR"
    );
  }

  if (!razorpayClient) {
    razorpayClient = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
  }

  return razorpayClient;
}
