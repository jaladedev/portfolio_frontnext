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
    .order("featured", { ascending: false })
    .order("sort_order", { ascending: true })
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

// ─── Messages ─────────────────────────────────────────────────────────────────

export async function submitMessage(payload) {
  const { data, error } = await supabase
    .from("messages")
    .insert([{
      name:    payload.name.trim(),
      email:   payload.email.trim().toLowerCase(),
      message: payload.message.trim(),
    }])
    .select("id")
    .single();

  if (error) throw error;
  return data;
}

export async function getMessages() {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function markMessageRead(id) {
  const { error } = await supabase
    .from("messages")
    .update({ read: true })
    .eq("id", id);

  if (error) throw error;
}

// ─── Quotes ───────────────────────────────────────────────────────────────────

export async function submitQuote(payload) {
  const { data, error } = await supabase
    .from("quotes")
    .insert([{
      name:         payload.name.trim(),
      email:        payload.email.trim().toLowerCase(),
      company:      payload.company?.trim() || null,
      project_type: payload.project_type,
      timeline:     payload.timeline || null,
      message:      payload.message.trim(),
      status:       "new",
    }])
    .select("id")
    .single();

  if (error) throw error;
  return data;
}

export async function getQuotes() {
  const { data, error } = await supabase
    .from("quotes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function updateQuoteStatus(id, status) {
  const { error } = await supabase
    .from("quotes")
    .update({ status })
    .eq("id", id);

  if (error) throw error;
}