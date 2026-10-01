const PLACEHOLDER_MARKERS = [
  "your-supabase",
  "your-project",
  "placeholder",
  "example",
];

function isPlaceholder(value: string) {
  const normalized = value.toLowerCase();
  return PLACEHOLDER_MARKERS.some((marker) => normalized.includes(marker));
}
export function getSupabasePublicConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "";

  let validUrl = false;
  try {
    const parsed = new URL(url);
    validUrl = parsed.protocol === "https:" && parsed.hostname.endsWith(".supabase.co");
  } catch {
    validUrl = false;
  }

  const validKey = key.length > 20 && !isPlaceholder(key);
  const isConfigured = validUrl && validKey && !isPlaceholder(url);

  return { url, key, isConfigured } as const;
}
