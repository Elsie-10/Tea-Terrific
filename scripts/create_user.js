require("dotenv").config({ path: ".env.local" });
const { createClient } = require("@supabase/supabase-js");
const bcrypt = require("bcryptjs");

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("Missing Supabase env vars in .env.local");
    process.exit(1);
  }

  const supabase = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
  const email = "tester+automation@example.com";

  const { data: existing } = await supabase.from("users").select("id").eq("email", email).maybeSingle();
  if (existing) {
    console.log("User already exists:", email);
    return;
  }

  const hashed = await bcrypt.hash("TestPass123", 12);
  const { data, error } = await supabase.from("users").insert({
    name: "Automation Tester",
    email,
    password: hashed,
    phone: "1234567890",
    role: "customer",
  }).select("id").single();

  if (error) throw error;
  console.log("Inserted user id:", data.id);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
