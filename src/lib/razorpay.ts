let razorpayLoaded = false;

/**
 * Dynamically loads the Razorpay checkout script.
 * Returns a promise that resolves when the script is ready.
 */
export function loadRazorpayScript(): Promise<boolean> {
  if (razorpayLoaded) return Promise.resolve(true);

  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => {
      razorpayLoaded = true;
      resolve(true);
    };
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

interface RazorpayCheckoutOptions {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
  userName: string;
  userEmail: string;
  onSuccess: (response: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => void;
  onFailure: (error: unknown) => void;
}

/**
 * Opens the Razorpay checkout modal.
 */
export async function openRazorpayCheckout(options: RazorpayCheckoutOptions) {
  const loaded = await loadRazorpayScript();
  if (!loaded) {
    options.onFailure(new Error("Failed to load Razorpay SDK"));
    return;
  }

  const rzp = new (window as any).Razorpay({
    key: options.keyId,
    amount: options.amount,
    currency: options.currency,
    name: "Portfolio Builder",
    description: "Pro Plan – Unlock all features",
    order_id: options.orderId,
    prefill: {
      name: options.userName,
      email: options.userEmail,
    },
    theme: {
      color: "#7D6A3C",
    },
    handler: options.onSuccess,
    modal: {
      ondismiss: () => {
        // User closed the checkout – no action needed
      },
    },
  });

  rzp.on("payment.failed", (response: any) => {
    options.onFailure(response.error);
  });

  rzp.open();
}
