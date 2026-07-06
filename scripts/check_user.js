require("dotenv").config({ path: ".env.local" });
const { createClient } = require("@supabase/supabase-js");

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("Missing Supabase env vars in .env.local");
    process.exit(1);
  }

  const supabase = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
  const email = process.argv[2] || "tester+automation@example.com";

  const { data, error } = await supabase.from("users").select("*").eq("email", email.toLowerCase().trim()).maybeSingle();
  if (error) throw error;

  if (!data) {
    console.log("User not found:", email);
  } else {
    console.log("User found:");
    console.log({ id: data.id, name: data.name, email: data.email, role: data.role, createdAt: data.created_at });
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
