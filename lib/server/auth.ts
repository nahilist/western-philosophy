import "server-only";

import type { User } from "@supabase/supabase-js";
import { createServerSideClient } from "@/lib/supabase/server";

type AuthenticatedContext = {
  supabase: NonNullable<Awaited<ReturnType<typeof createServerSideClient>>>;
  user: User;
};

export async function requireAuthenticatedUser(): Promise<AuthenticatedContext | null> {
  const supabase = await createServerSideClient();
  if (!supabase) return null;

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;
  return { supabase, user };
}
