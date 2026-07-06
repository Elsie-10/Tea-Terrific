import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

export const mapProductRow = (row) => ({
  ...row,
  createdAt: row.created_at ?? row.createdAt,
  updatedAt: row.updated_at ?? row.updatedAt,
});

export const mapOrderRow = (row) => ({
  ...row,
  _id: row.id,
  id: row.id,
  createdAt: row.created_at ?? row.createdAt,
  updatedAt: row.updated_at ?? row.updatedAt,
  customerName: row.customer_name ?? row.customerName,
  paymentStatus: row.payment_status ?? row.paymentStatus,
  orderStatus: row.order_status ?? row.orderStatus,
  mpesaReceiptNumber: row.mpesa_receipt_number ?? row.mpesaReceiptNumber,
  mpesaTransactionId: row.mpesa_transaction_id ?? row.mpesaTransactionId,
  checkoutRequestId: row.checkout_request_id ?? row.checkoutRequestId,
  userId: row.user_id ?? row.userId,
});

export const mapUserRow = (row) => ({
  ...row,
  _id: row.id,
  id: row.id,
  createdAt: row.created_at ?? row.createdAt,
  updatedAt: row.updated_at ?? row.updatedAt,
});
