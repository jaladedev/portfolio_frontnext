"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  LogOut, Plus, Edit, Trash2, X, Save, Upload, Eye,
  FolderOpen, Wrench, MessageSquare, ChevronDown, ChevronUp,
  LayoutDashboard, FileQuestion,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

const inputCls =
  "w-full px-3.5 py-2.5 rounded-xl bg-ink-900 border border-ink-500 text-cream-100 placeholder-cream-200/20 focus:outline-none focus:border-electric-400/60 focus:ring-2 focus:ring-electric-400/10 transition-all text-sm font-sans";

// ─── Root Page ────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("projects");
  const [loading, setLoading] = useState(true);

  const [projects, setProjects] = useState([]);
  const [skills, setSkills]     = useState([]);
  const [messages, setMessages] = useState([]);
  const [quotes, setQuotes]     = useState([]);

  const [projectModal, setProjectModal] = useState({ open: false, editing: null });
  const [skillModal, setSkillModal]     = useState({ open: false, editing: null });
  const [deleteModal, setDeleteModal]   = useState(null);
  const [saving, setSaving]             = useState(false);
  const [formError, setFormError]       = useState("");

  // ─── Auth ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.replace("/admin/login");
      else setUser(session.user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session) router.replace("/admin/login");
      else setUser(session.user);
    });

    return () => subscription.unsubscribe();
  }, [router]);

  // ─── Load data ────────────────────────────────────────────────────────────
  const loadData = useCallback(async () => {
    try {
      const [pRes, sRes, mRes, qRes] = await Promise.all([
        supabase.from("projects").select("*").order("sort_order", { ascending: true }).order("created_at", { ascending: false }),
        supabase.from("skills").select("*").order("sort_order", { ascending: true }),
        supabase.from("messages").select("*").order("created_at", { ascending: false }),
        supabase.from("quotes").select("*").order("created_at", { ascending: false }),
      ]);
      setProjects(pRes.data || []);
      setSkills(sRes.data   || []);
      setMessages(mRes.data || []);
      setQuotes(qRes.data   || []);
    } catch (e) {
      console.error("Dashboard load error:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) loadData();
  }, [user, loadData]);

  // ─── Revalidation ─────────────────────────────────────────────────────────
  const revalidate = useCallback(async (paths) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      await fetch("/api/revalidate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ paths }),
      });
    } catch (e) {
      console.error("Revalidate call failed:", e);
    }
  }, []);

  // ─── Reorder ──────────────────────────────────────────────────────────────
  const handleReorder = useCallback(async (a, b) => {
    if (!a || !b) return;
    const aOrder = a.sort_order ?? 0;
    const bOrder = b.sort_order ?? 0;
    try {
      await Promise.all([
        supabase.from("projects").update({ sort_order: bOrder }).eq("id", a.id),
        supabase.from("projects").update({ sort_order: aOrder }).eq("id", b.id),
      ]);
      await loadData();
      await revalidate(["/", "/projects"]);
    } catch (e) {
      console.error("Reorder failed:", e);
    }
  }, [loadData, revalidate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-electric-400/30 border-t-electric-400 rounded-full animate-spin" />
          <p className="text-cream-200/40 text-sm font-mono">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { key: "projects", label: "Projects", count: projects.length },
    { key: "skills",   label: "Skills",   count: skills.length },
    { key: "messages", label: "Messages", count: messages.length },
    { key: "quotes",   label: "Quotes",   count: quotes.length },
  ];

  // Next sort_order for a brand-new project: end of the list, not 0.
  const nextSortOrder = projects.length
    ? Math.max(...projects.map((p) => p.sort_order ?? 0)) + 1
    : 0;

  const nextSkillSortOrder = skills.length
  ? Math.max(...skills.map((s) => s.sort_order ?? 0)) + 1
  : 0;

  return (
    <div className="min-h-screen bg-ink-900">

      {/* ── Header ── */}
      <header className="sticky top-0 z-40 border-b border-ink-600 bg-ink-900/95 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg border border-electric-400/30 bg-electric-400/10 flex items-center justify-center">
              <LayoutDashboard size={14} className="text-electric-400" />
            </div>
            <div>
              <p className="text-cream-100 font-semibold text-sm">Dashboard</p>
              <p className="text-cream-200/30 text-xs font-mono">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            
              <a href="/"
              target="_blank"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-ink-500 text-cream-200/40 hover:text-cream-100 text-xs font-mono transition-colors"
            >
              <Eye size={12} /> View Site
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-400/20 text-red-400 hover:text-red-300 text-xs font-mono transition-colors"
            >
              <LogOut size={12} /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* ── Stat cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`p-4 rounded-xl border text-left transition-all ${
                activeTab === t.key
                  ? "border-electric-400/30 bg-electric-400/5"
                  : "border-ink-600 bg-ink-800 hover:border-ink-500"
              }`}
            >
              <p className={`text-2xl font-bold font-mono mb-1 ${activeTab === t.key ? "text-electric-400" : "text-cream-100"}`}>
                {t.count}
              </p>
              <p className="text-cream-200/40 text-xs">{t.label}</p>
            </button>
          ))}
        </div>

        {/* ── Tab bar ── */}
        <div className="flex gap-1 mb-6 p-1 rounded-xl bg-ink-800 border border-ink-600 w-fit">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`px-4 py-2 rounded-lg text-sm font-mono transition-all ${
                activeTab === t.key
                  ? "bg-electric-500 text-white"
                  : "text-cream-200/40 hover:text-cream-100"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Tab content ── */}
        {activeTab === "projects" && (
          <ProjectsTab
            projects={projects}
            onAdd={() => setProjectModal({ open: true, editing: null })}
            onEdit={(p) => setProjectModal({ open: true, editing: p })}
            onDelete={(id) => setDeleteModal({ open: true, type: "project", id })}
            onReorder={handleReorder}
          />
        )}
        {activeTab === "skills" && (
          <SkillsTab
            skills={skills}
            onAdd={() => setSkillModal({ open: true, editing: null })}
            onEdit={(s) => setSkillModal({ open: true, editing: s })}
            onDelete={(id) => setDeleteModal({ open: true, type: "skill", id })}
          />
        )}
        {activeTab === "messages" && <MessagesTab messages={messages} onRefresh={loadData} />}
        {activeTab === "quotes"   && <QuotesTab   quotes={quotes}     onRefresh={loadData} />}
      </div>

      {/* ── Project Modal ── */}
      {projectModal.open && (
        <ProjectModal
          editing={projectModal.editing}
          defaultSortOrder={nextSortOrder}
          saving={saving}
          error={formError}
          onClose={() => { setProjectModal({ open: false, editing: null }); setFormError(""); }}
          onSave={async (form, imageFile) => {
            setSaving(true);
            setFormError("");
            try {
              let image_url = projectModal.editing?.image_url || null;
              if (imageFile) {
                const ext = imageFile.name.split(".").pop();
                const path = `projects/${Date.now()}.${ext}`;
                const { error: uploadErr } = await supabase.storage
                  .from("portfolio")
                  .upload(path, imageFile, { upsert: true });
                if (uploadErr) throw uploadErr;
                const { data: urlData } = supabase.storage.from("portfolio").getPublicUrl(path);
                image_url = urlData.publicUrl;
              }
              const payload = { ...form, image_url };
              let projectId = projectModal.editing?.id;
              if (projectModal.editing) {
                const { error } = await supabase.from("projects").update(payload).eq("id", projectModal.editing.id);
                if (error) throw error;
              } else {
                const { data, error } = await supabase.from("projects").insert([payload]).select("id").single();
                if (error) throw error;
                projectId = data.id;
              }
              await loadData();
              await revalidate(["/", "/projects", `/projects/${projectId}`]);
              setProjectModal({ open: false, editing: null });
            } catch (e) {
              setFormError(e?.message || "Failed to save project.");
            } finally {
              setSaving(false);
            }
          }}
        />
      )}

      {/* ── Skill Modal ── */}
      {skillModal.open && (
        <SkillModal
          editing={skillModal.editing}
          defaultSortOrder={nextSkillSortOrder}
          saving={saving}
          error={formError}
          onClose={() => { setSkillModal({ open: false, editing: null }); setFormError(""); }}
          onSave={async (data) => {
            setSaving(true);
            setFormError("");
            try {
              if (skillModal.editing) {
                const { error } = await supabase.from("skills").update(data).eq("id", skillModal.editing.id);
                if (error) throw error;
              } else {
                const { error } = await supabase.from("skills").insert([data]);
                if (error) throw error;
              }
              await loadData();
              setSkillModal({ open: false, editing: null });
            } catch (e) {
              setFormError(e?.message || "Failed to save skill.");
            } finally {
              setSaving(false);
            }
          }}
        />
      )}

      {/* ── Delete Modal ── */}
      {deleteModal?.open && (
        <DeleteModal
          type={deleteModal.type}
          onCancel={() => setDeleteModal(null)}
          onConfirm={async () => {
            try {
              const table = deleteModal.type === "project" ? "projects" : "skills";
              await supabase.from(table).delete().eq("id", deleteModal.id);
              await loadData();
              if (deleteModal.type === "project") {
                await revalidate(["/", "/projects", `/projects/${deleteModal.id}`]);
              }
            } catch (e) {
              console.error(e);
            }
            setDeleteModal(null);
          }}
        />
      )}
    </div>
  );
}

// ─── Projects Tab ─────────────────────────────────────────────────────────────
function ProjectsTab({ projects, onAdd, onEdit, onDelete, onReorder }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-cream-100 font-display text-2xl">Projects</h2>
        <button onClick={onAdd} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-electric-500 hover:bg-electric-400 text-white text-sm font-mono transition-colors">
          <Plus size={14} /> Add Project
        </button>
      </div>

      {projects.length === 0 ? (
        <EmptyState icon={FolderOpen} message="No projects yet. Add your first one!" />
      ) : (
        <div className="space-y-3">
          {projects.map((p, i) => (
            <div key={p.id} className="flex items-center gap-4 p-4 rounded-xl border border-ink-600 bg-ink-800 hover:border-ink-500 transition-colors">
              <div className="flex flex-col gap-0.5 flex-shrink-0">
                <button
                  onClick={() => onReorder(p, projects[i - 1])}
                  disabled={i === 0}
                  className="p-1 text-cream-200/30 hover:text-electric-400 disabled:opacity-20 disabled:hover:text-cream-200/30 transition-colors"
                >
                  <ChevronUp size={14} />
                </button>
                <button
                  onClick={() => onReorder(p, projects[i + 1])}
                  disabled={i === projects.length - 1}
                  className="p-1 text-cream-200/30 hover:text-electric-400 disabled:opacity-20 disabled:hover:text-cream-200/30 transition-colors"
                >
                  <ChevronDown size={14} />
                </button>
              </div>

              {p.image_url ? (
                <img src={p.image_url} alt={p.title} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-ink-600 flex items-center justify-center flex-shrink-0">
                  <span className="font-display text-xl text-electric-400/30">{p.title?.[0]}</span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-cream-100 font-semibold text-sm truncate">{p.title}</p>
                  {p.featured && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-electric-400/10 text-electric-400 border border-electric-400/20 flex-shrink-0">
                      featured
                    </span>
                  )}
                  <span className="font-mono text-[10px] text-cream-200/25 flex-shrink-0">order: {p.sort_order ?? 0}</span>
                </div>
                {p.stack && <p className="font-mono text-xs text-electric-400/60 truncate">{p.stack}</p>}
                <p className="text-cream-200/40 text-xs truncate mt-0.5">{p.summary}</p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {p.website && (
                  <a href={p.website} target="_blank" rel="noopener noreferrer" className="p-2 text-cream-200/30 hover:text-cream-100 transition-colors">
                    <Eye size={14} />
                  </a>
                )}
                <button onClick={() => onEdit(p)} className="p-2 text-cream-200/30 hover:text-electric-400 transition-colors"><Edit size={14} /></button>
                <button onClick={() => onDelete(p.id)} className="p-2 text-cream-200/30 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Skills Tab ───────────────────────────────────────────────────────────────
function SkillsTab({ skills, onAdd, onEdit, onDelete }) {
  const grouped = skills.reduce((acc, s) => {
    const cat = s.category || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(s);
    return acc;
  }, {});

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-cream-100 font-display text-2xl">Skills</h2>
        <button onClick={onAdd} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-electric-500 hover:bg-electric-400 text-white text-sm font-mono transition-colors">
          <Plus size={14} /> Add Skill
        </button>
      </div>

      {skills.length === 0 ? (
        <EmptyState icon={Wrench} message="No skills yet. Add your first one!" />
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category}>
              <p className="font-mono text-xs text-electric-400/60 uppercase tracking-widest mb-3">{category}</p>
              <div className="space-y-2">
                {items.map((s) => (
                  <div key={s.id} className="flex items-center gap-4 p-3 rounded-xl border border-ink-600 bg-ink-800 hover:border-ink-500 transition-colors">
                    <p className="text-cream-100 text-sm font-medium flex-1">{s.name}</p>
                    <span className="font-mono text-xs text-cream-200/25">order: {s.sort_order ?? 0}</span>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button onClick={() => onEdit(s)} className="p-1.5 text-cream-200/30 hover:text-electric-400 transition-colors"><Edit size={13} /></button>
                      <button onClick={() => onDelete(s.id)} className="p-1.5 text-cream-200/30 hover:text-red-400 transition-colors"><Trash2 size={13} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Messages Tab ─────────────────────────────────────────────────────────────
function MessagesTab({ messages, onRefresh }) {
  const [expanded, setExpanded] = useState(null);

  const markRead = async (id) => {
    await supabase.from("messages").update({ read: true }).eq("id", id);
    onRefresh();
  };

  return (
    <div>
      <h2 className="text-cream-100 font-display text-2xl mb-5">
        Messages
        {messages.filter(m => !m.read).length > 0 && (
          <span className="ml-3 font-mono text-sm text-electric-400">
            · {messages.filter(m => !m.read).length} new
          </span>
        )}
      </h2>

      {messages.length === 0 ? (
        <EmptyState icon={MessageSquare} message="No messages yet." />
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <div key={m.id} className={`rounded-xl border overflow-hidden transition-colors ${m.read ? "border-ink-600 bg-ink-800" : "border-electric-400/30 bg-electric-400/5"}`}>
              <button
                className="w-full flex items-center gap-4 p-4 text-left hover:bg-ink-700/40 transition-colors"
                onClick={() => { setExpanded(expanded === m.id ? null : m.id); if (!m.read) markRead(m.id); }}
              >
                <div className="w-9 h-9 rounded-full bg-electric-400/10 border border-electric-400/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-electric-400 text-xs font-bold uppercase">{m.name.charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-cream-100 text-sm font-medium">{m.name}</p>
                    {!m.read && <span className="w-1.5 h-1.5 rounded-full bg-electric-400 flex-shrink-0" />}
                  </div>
                  <p className="text-cream-200/40 text-xs truncate">{m.email}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-cream-200/30 text-xs hidden sm:block">{new Date(m.created_at).toLocaleDateString()}</span>
                  {expanded === m.id ? <ChevronUp size={14} className="text-cream-200/30" /> : <ChevronDown size={14} className="text-cream-200/30" />}
                </div>
              </button>
              {expanded === m.id && (
                <div className="px-4 pb-4 border-t border-ink-600">
                  <p className="text-cream-200/60 text-sm leading-relaxed mt-3">{m.message}</p>
                  
                    <a href={`mailto:${m.email}?subject=Re: Your message&body=Hi ${m.name},%0A%0A`}
                    className="inline-flex items-center gap-1.5 mt-4 text-electric-400/60 hover:text-electric-400 text-xs font-mono transition-colors"
                  >
                    Reply via email →
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Quotes Tab ───────────────────────────────────────────────────────────────
function QuotesTab({ quotes, onRefresh }) {
  const [expanded, setExpanded] = useState(null);
  const statuses = ["new", "reviewed", "replied", "closed"];

  const statusCls = {
    new:      "bg-gold-400/10 text-gold-400 border-gold-400/20",
    reviewed: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    replied:  "bg-green-500/10 text-green-400 border-green-500/20",
    closed:   "bg-ink-600 text-cream-200/30 border-ink-500",
  };

  const updateStatus = async (id, status) => {
    await supabase.from("quotes").update({ status }).eq("id", id);
    onRefresh();
  };

  return (
    <div>
      <h2 className="text-cream-100 font-display text-2xl mb-5">Quote Requests</h2>

      {quotes.length === 0 ? (
        <EmptyState icon={FileQuestion} message="No quote requests yet." />
      ) : (
        <div className="space-y-3">
          {quotes.map((q) => (
            <div key={q.id} className="rounded-xl border border-ink-600 bg-ink-800 overflow-hidden">
              <button
                className="w-full flex items-center gap-4 p-4 text-left hover:bg-ink-700/40 transition-colors"
                onClick={() => setExpanded(expanded === q.id ? null : q.id)}
              >
                <div className="w-9 h-9 rounded-full bg-electric-400/10 border border-electric-400/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-electric-400 text-xs font-bold uppercase">{q.name.charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-cream-100 text-sm font-medium">{q.name}</p>
                  <p className="text-cream-200/40 text-xs truncate">{q.email}{q.company ? ` · ${q.company}` : ""}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={`hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-mono border ${statusCls[q.status] || statusCls.new}`}>
                    {q.status}
                  </span>
                  <span className="text-cream-200/30 text-xs hidden sm:block">{new Date(q.created_at).toLocaleDateString()}</span>
                  {expanded === q.id ? <ChevronUp size={14} className="text-cream-200/30" /> : <ChevronDown size={14} className="text-cream-200/30" />}
                </div>
              </button>
              {expanded === q.id && (
                <div className="px-4 pb-4 border-t border-ink-600 space-y-3">
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="font-mono text-xs px-2.5 py-1 rounded-full border border-ink-500 text-cream-200/40">{q.project_type}</span>
                    {q.timeline && <span className="font-mono text-xs px-2.5 py-1 rounded-full border border-ink-500 text-cream-200/40">{q.timeline}</span>}
                    <select
                      value={q.status}
                      onChange={(e) => updateStatus(q.id, e.target.value)}
                      className="font-mono text-xs px-2.5 py-1 rounded-full border border-electric-400/30 bg-transparent text-electric-400 focus:outline-none cursor-pointer"
                    >
                      {statuses.map((s) => <option key={s} value={s} className="bg-ink-800 text-cream-100">{s}</option>)}
                    </select>
                  </div>
                  <p className="text-cream-200/60 text-sm leading-relaxed">{q.message}</p>
                  
                   <a href={`mailto:${q.email}?subject=Re: Your quote request&body=Hi ${q.name},%0A%0A`}
                    className="inline-flex items-center gap-1.5 text-electric-400/60 hover:text-electric-400 text-xs font-mono transition-colors"
                  >
                    Reply via email →
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Project Modal ────────────────────────────────────────────────────────────
function ProjectModal({ editing, defaultSortOrder, saving, error, onClose, onSave }) {
  const [form, setForm] = useState({
    title:       editing?.title       || "",
    summary:     editing?.summary     || "",
    description: editing?.description || "",
    stack:       editing?.stack       || "",
    stack_tags:  editing?.stack_tags?.join(", ") || "",
    github:      editing?.github      || "",
    website:     editing?.website     || "",
    featured:    editing?.featured    || false,
    sort_order:  editing ? (editing.sort_order ?? 0) : defaultSortOrder,
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview]     = useState(editing?.image_url || null);

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (file) { setImageFile(file); setPreview(URL.createObjectURL(file)); }
  };

  return (
    <Modal title={editing ? "Edit Project" : "New Project"} onClose={onClose}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const payload = {
            ...form,
            stack_tags: form.stack_tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean),
          };
          onSave(payload, imageFile);
        }}
        className="space-y-4"
      >
        {error && <p className="text-red-400 text-xs p-3 rounded-lg bg-red-900/10 border border-red-400/20">{error}</p>}

        <div className="grid sm:grid-cols-2 gap-4">
          <ModalField label="Title *">
            <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className={inputCls} placeholder="Project title" />
          </ModalField>
          <ModalField label="Stack">
            <input value={form.stack} onChange={e => setForm({ ...form, stack: e.target.value })} className={inputCls} placeholder="React, Laravel, MySQL" />
          </ModalField>
        </div>

        <ModalField label="Stack Tags">
          <input
            value={form.stack_tags}
            onChange={e => setForm({ ...form, stack_tags: e.target.value })}
            className={inputCls}
            placeholder="Next.js, Tailwind CSS, Laravel (comma-separated)"
          />
        </ModalField>

        <ModalField label="Summary *">
          <textarea required rows={2} value={form.summary} onChange={e => setForm({ ...form, summary: e.target.value })} className={`${inputCls} resize-none`} placeholder="One-line description" />
        </ModalField>

        <ModalField label="Full Description">
          <textarea rows={4} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className={`${inputCls} resize-none`} placeholder="Detailed description..." />
        </ModalField>

        <div className="grid sm:grid-cols-2 gap-4">
          <ModalField label="GitHub URL">
            <input type="url" value={form.github} onChange={e => setForm({ ...form, github: e.target.value })} className={inputCls} placeholder="https://github.com/..." />
          </ModalField>
          <ModalField label="Live Site URL">
            <input type="url" value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} className={inputCls} placeholder="https://..." />
          </ModalField>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <ModalField label="Sort Order">
            <input type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: +e.target.value })} className={inputCls} min={0} />
          </ModalField>
          <ModalField label="Featured">
            <label className="flex items-center gap-3 h-10 cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4 accent-electric-400" />
              <span className="text-cream-200/60 text-sm">Show as featured project</span>
            </label>
          </ModalField>
        </div>

        <ModalField label="Project Image">
          <label className="flex items-center gap-3 p-3 rounded-xl border border-dashed border-ink-500 hover:border-electric-400/40 bg-ink-900 cursor-pointer transition-colors">
            <Upload size={14} className="text-cream-200/30 flex-shrink-0" />
            <span className="text-cream-200/30 text-xs">{imageFile ? imageFile.name : "Click to upload image"}</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
          </label>
          {preview && (
            <div className="relative mt-2 h-28 rounded-lg overflow-hidden border border-ink-500">
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
        </ModalField>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-ink-500 text-cream-200/40 hover:text-cream-100 text-sm transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={saving} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-electric-500 hover:bg-electric-400 text-white text-sm font-semibold disabled:opacity-50 transition-colors">
            {saving
              ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : <><Save size={14} /> Save</>
            }
          </button>
        </div>
      </form>
    </Modal>
  );
}

// ─── Skill Modal ──────────────────────────────────────────────────────────────
function SkillModal({ editing, defaultSortOrder, saving, error, onClose, onSave }) {
  const [form, setForm] = useState({
    name:       editing?.name       || "",
    category:   editing?.category   || "",
    sort_order: editing ? (editing.sort_order ?? 0) : defaultSortOrder,
  });

  const categories = [
    "Frontend", "Backend", "Database", "DevOps",
    "Mobile", "Payments", "Cloud & Storage", "Testing", "Other",
  ];

  return (
    <Modal title={editing ? "Edit Skill" : "New Skill"} onClose={onClose}>
      <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="space-y-4">
        {error && <p className="text-red-400 text-xs p-3 rounded-lg bg-red-900/10 border border-red-400/20">{error}</p>}

        <ModalField label="Skill Name *">
          <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={inputCls} placeholder="e.g. React, Laravel, PostgreSQL" />
        </ModalField>

        <ModalField label="Category">
          <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className={`${inputCls} appearance-none`}>
            <option value="">Select category</option>
            {categories.map(c => <option key={c} value={c} className="bg-ink-800">{c}</option>)}
          </select>
        </ModalField>

        <ModalField label="Sort Order">
          <input type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: +e.target.value })} className={inputCls} min={0} />
        </ModalField>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-ink-500 text-cream-200/40 hover:text-cream-100 text-sm transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={saving} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-electric-500 hover:bg-electric-400 text-white text-sm font-semibold disabled:opacity-50 transition-colors">
            {saving
              ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : <><Save size={14} /> Save</>
            }
          </button>
        </div>
      </form>
    </Modal>
  );
}

// ─── Delete Modal ─────────────────────────────────────────────────────────────
function DeleteModal({ type, onCancel, onConfirm }) {
  return (
    <Modal title="Confirm Delete" onClose={onCancel}>
      <p className="text-cream-200/50 text-sm mb-6">
        Are you sure you want to delete this {type}? This action cannot be undone.
      </p>
      <div className="flex gap-3">
        <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-ink-500 text-cream-200/40 hover:text-cream-100 text-sm transition-colors">
          Cancel
        </button>
        <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-400 text-white text-sm font-semibold transition-colors">
          Delete
        </button>
      </div>
    </Modal>
  );
}

// ─── Shared UI ────────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-ink-600 bg-ink-800 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-ink-600">
          <h3 className="font-display text-lg text-cream-100">{title}</h3>
          <button onClick={onClose} className="p-1.5 text-cream-200/30 hover:text-cream-100 transition-colors rounded-lg hover:bg-ink-700">
            <X size={16} />
          </button>
        </div>
        <div className="p-6 max-h-[80vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

function ModalField({ label, children }) {
  return (
    <div>
      <label className="block text-cream-200/40 text-xs font-mono uppercase tracking-widest mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function EmptyState({ icon: Icon, message }) {
  return (
    <div className="text-center py-16 border border-dashed border-ink-600 rounded-xl">
      <Icon size={32} className="text-cream-200/10 mx-auto mb-3" />
      <p className="text-cream-200/30 text-sm font-mono">{message}</p>
    </div>
  );
}