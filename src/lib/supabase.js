import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ─── Projects ─────────────────────────────────────────────────────────────────

export async function getProjects({ limit, stack } = {}) {
  let query = supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (limit) query = query.limit(limit);
  if (stack) query = query.contains("stack_tags", [stack]);

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getProject(id) {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function getAllProjectIds() {
  const { data, error } = await supabase.from("projects").select("id");
  if (error) return [];
  return data.map((p) => p.id);
}

// ─── Skills ───────────────────────────────────────────────────────────────────

export async function getSkills() {
  const { data, error } = await supabase
    .from("skills")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data;
}

// ─── Experience ───────────────────────────────────────────────────────────────

export async function getExperience() {
  const { data, error } = await supabase
    .from("experience")
    .select("*")
    .order("start_date", { ascending: false });

  if (error) throw error;
  return data;
}

// ─── Quotes ───────────────────────────────────────────────────────────────────

/**
 * Submit a quote request directly to Supabase.
 * The quotes table RLS allows public INSERT but no public SELECT.
 *
 * @param {{ name: string, email: string, company?: string, project_type: string, timeline?: string, message: string }} payload
 */
export async function submitQuote(payload) {
  const { data, error } = await supabase
    .from("quotes")
    .insert([
      {
        name:         payload.name.trim(),
        email:        payload.email.trim().toLowerCase(),
        company:      payload.company?.trim() || null,
        project_type: payload.project_type,
        timeline:     payload.timeline || null,
        message:      payload.message.trim(),
        status:       "new",
      },
    ])
    .select("id")
    .single();

  if (error) throw error;
  return data; // { id: uuid }
}

// ─── Admin: read quotes (requires service-role key — server-side only) ────────

/**
 * Server-side only. Reads quotes using the service-role key so RLS is bypassed.
 * Never expose SUPABASE_SERVICE_ROLE_KEY to the client.
 */
export async function getQuotesAdmin() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");

  const adminClient = createClient(supabaseUrl, serviceKey);
  const { data, error } = await adminClient
    .from("quotes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}