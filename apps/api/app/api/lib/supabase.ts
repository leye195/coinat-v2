import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseCredentials } from "./env";

type SupabaseDatabase = any; // Replace with your generated types when available.

const supabaseOptions = {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
};

let client: SupabaseClient<SupabaseDatabase> | null = null;

export function getSupabaseClient() {
  if (!client) {
    const { url, serviceRoleKey } = getSupabaseCredentials();
    client = createClient<SupabaseDatabase>(url, serviceRoleKey, supabaseOptions);
  }
  return client;
}
