/**
 * M-Pesa Daraja API utility functions
 * Supports Safaricom Daraja 2.0
 */

const MPESA_BASE_URL =
  process.env.MPESA_ENV === "production"
    ? "https://api.safaricom.co.ke"
    : "https://sandbox.safaricom.co.ke";

/**
 * Get OAuth access token from Safaricom
 */
export async function getMpesaAccessToken() {
  const consumerKey = process.env.MPESA_CONSUMER_KEY;
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET;

  if (!consumerKey || !consumerSecret) {
    throw new Error("M-Pesa credentials not configured");
  }

  const credentials = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");

  const res = await fetch(
    `${MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
    {
      headers: { Authorization: `Basic ${credentials}` },
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to get M-Pesa access token: ${res.status}`);
  }

  const data = await res.json();
  return data.access_token;
}

/**
 * Generate the Base64-encoded password for STK push
 */
export function getMpesaPassword(timestamp) {
  const shortCode = process.env.MPESA_SHORTCODE;
  const passkey = process.env.MPESA_PASSKEY;
  return Buffer.from(`${shortCode}${passkey}${timestamp}`).toString("base64");
}

/**
 * Get current timestamp in YYYYMMDDHHmmss format
 */
export function getMpesaTimestamp() {
  return new Date()
    .toISOString()
    .replace(/[-T:.Z]/g, "")
    .slice(0, 14);
}

/**
 * Format phone number to 254XXXXXXXXX
 */
export function formatPhoneNumber(phone) {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("0")) return "254" + cleaned.slice(1);
  if (cleaned.startsWith("254")) return cleaned;
  if (cleaned.startsWith("7") || cleaned.startsWith("1")) return "254" + cleaned;
  return cleaned;
}

/**
 * Initiate STK Push
 */
export async function initiateStkPush({ phone, amount, orderId }) {
  const accessToken = await getMpesaAccessToken();
  const timestamp = getMpesaTimestamp();
  const password = getMpesaPassword(timestamp);
  const formattedPhone = formatPhoneNumber(phone);

  const body = {
    BusinessShortCode: process.env.MPESA_SHORTCODE,
    Password: password,
    Timestamp: timestamp,
    TransactionType: "CustomerPayBillOnline",
    Amount: Math.ceil(amount), // M-Pesa requires whole numbers
    PartyA: formattedPhone,
    PartyB: process.env.MPESA_SHORTCODE,
    PhoneNumber: formattedPhone,
    CallBackURL: `${process.env.NEXTAUTH_URL}/api/mpesa/callback`,
    AccountReference: `TEATRFC-${orderId}`,
    TransactionDesc: "Tea-Terrific Bakery Order",
  };

  const res = await fetch(`${MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (data.ResponseCode !== "0") {
    throw new Error(data.ResponseDescription || "STK Push failed");
  }

  return data;
}
