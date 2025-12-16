type EnvVarName = "SUPABASE_URL" | "SUPABASE_ANON_KEY" | "SUPABASE_SERVICE_ROLE_KEY";

const MISSING_ENV_MESSAGE =
  "Supabase environment variables are missing. Make sure SUPABASE_URL and either SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY are set.";

function readEnv(name: EnvVarName): string | undefined {
  const value = process.env[name];
  return value?.trim() ? value : undefined;
}

function requireEnv(name: EnvVarName): string {
  const value = readEnv(name);
  if (!value) {
    throw new Error(`${MISSING_ENV_MESSAGE} Missing ${name}.`);
  }
  return value;
}

export function getSupabaseCredentials() {
  const url = requireEnv("SUPABASE_URL");
  const serviceRoleKey =
    readEnv("SUPABASE_SERVICE_ROLE_KEY") ?? requireEnv("SUPABASE_ANON_KEY");

  return { url, serviceRoleKey };
}
