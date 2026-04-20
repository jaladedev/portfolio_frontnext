"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Plus, Edit, Trash2, Eye, FileText } from "lucide-react";
import { supabase } from "@/lib/supabase";

const API = process.env.NEXT_PUBLIC_LARAVEL_API_URL || "http://localhost:8000/api";

async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

const PROJECT_TYPE_LABELS = {
  web: "Web App", mobile: "Mobile App", both: "Web + Mobile", other: "Other / Custom",
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [admin, setAdmin]         = useState(null);
  const [projects, setProjects]   = useState([]);
  const [messages, setMessages]   = useState([]);
  const [quotes, setQuotes]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [activeTab, setActiveTab] = useState("projects");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/admin/login"); return; }

    Promise.all([
      apiFetch("/admin/me"),
      apiFetch("/projects"),
      apiFetch("/messages"),
      supabase.from("quotes").select("*").order("created_at", { ascending: false }),
    ])
      .then(([me, proj, msgs, quotesRes]) => {
        setAdmin(me.admin);
        setProjects(proj.data || proj);
        setMessages(msgs.data || msgs);
        setQuotes(quotesRes.data || []);
      })
      .catch(() => {
        localStorage.removeItem("token");
        router.push("/admin/login");
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = () => { localStorage.removeItem("token"); router.push("/admin/login"); };
  const handleDelete = async (id) => {
    if (!confirm("Delete this project?")) return;
    await apiFetch(`/projects/${id}`, { method: "DELETE" });
    setProjects((p) => p.filter((x) => x.id !== id));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ink-900 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-electric-400/30 border-t-electric-400 rounded-full animate-spin" />
      </div>
    );
  }

  const tabs = [
    { id: "projects", label: `Projects (${projects.length})` },
    { id: "messages", label: `Messages (${messages.length})` },
    { id: "quotes",   label: `Quotes (${quotes.length})` },
  ];

  return (
    <div className="min-h-screen bg-ink-900">
      <header className="bg-ink-800 border-b border-ink-600 px-6 py-4 flex items-center justify-between">
        <div>
          <p className="font-mono text-xs text-electric-400 tracking-widest uppercase mb-0.5">Admin</p>
          <h1 className="font-display text-xl text-cream-100">Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-mono text-sm text-cream-200/40 hidden sm:block">{admin?.name}</span>
          <button onClick={handleLogout}
            className="flex items-center gap-2 font-mono text-xs px-4 py-2 border border-red-400/30 text-red-400 rounded-lg hover:bg-red-400/10 transition-all">
            <LogOut size={14} /> Logout
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-wrap gap-1 mb-8 border border-ink-600 rounded-lg p-1 w-fit">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`font-mono text-sm px-5 py-2 rounded-md transition-all ${activeTab === tab.id ? "bg-electric-500 text-white" : "text-cream-200/40 hover:text-cream-100"}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "projects" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-display text-2xl text-cream-100">Projects</h2>
              <button className="flex items-center gap-2 font-mono text-sm bg-electric-500 hover:bg-electric-400 text-white px-4 py-2 rounded-lg transition-colors">
                <Plus size={14} /> Add Project
              </button>
            </div>
            {projects.length === 0 ? <p className="text-cream-200/30 font-mono text-sm">No projects yet.</p> : (
              <div className="space-y-3">
                {projects.map((p) => (
                  <div key={p.id} className="bg-ink-800 border border-ink-600 rounded-xl p-5 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="text-cream-100 font-semibold truncate">{p.title}</h3>
                      <p className="font-mono text-xs text-electric-400/60 mt-0.5">{p.stack}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <a href={`/projects/${p.id}`} target="_blank" rel="noopener noreferrer" className="p-2 text-cream-200/40 hover:text-cream-100 transition-colors"><Eye size={16} /></a>
                      <button className="p-2 text-electric-400/60 hover:text-electric-400 transition-colors"><Edit size={16} /></button>
                      <button onClick={() => handleDelete(p.id)} className="p-2 text-red-400/60 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "messages" && (
          <div>
            <h2 className="font-display text-2xl text-cream-100 mb-6">Messages</h2>
            {messages.length === 0 ? <p className="text-cream-200/30 font-mono text-sm">No messages yet.</p> : (
              <div className="space-y-4">
                {messages.map((m) => (
                  <div key={m.id} className={`bg-ink-800 border rounded-xl p-5 ${m.read ? "border-ink-600" : "border-electric-400/40"}`}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-cream-100">{m.name}</p>
                        <a href={`mailto:${m.email}`} className="font-mono text-xs text-electric-400/70 hover:text-electric-400">{m.email}</a>
                      </div>
                      <div className="flex items-center gap-2">
                        {!m.read && <span className="font-mono text-xs px-2 py-0.5 bg-electric-400/10 text-electric-400 rounded-full border border-electric-400/30">New</span>}
                        <p className="font-mono text-xs text-cream-200/30">{new Date(m.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <p className="text-cream-200/60 text-sm leading-relaxed">{m.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "quotes" && (
          <div>
            <h2 className="font-display text-2xl text-cream-100 mb-6">Quote Requests</h2>
            {quotes.length === 0 ? (
              <div className="text-center py-16 border border-ink-600 rounded-xl bg-ink-800/40">
                <FileText size={32} className="text-cream-200/20 mx-auto mb-3" />
                <p className="text-cream-200/30 font-mono text-sm">No quote requests yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {quotes.map((q) => (
                  <div key={q.id} className={`bg-ink-800 border rounded-xl p-5 ${q.status === "new" ? "border-amber-500/30" : "border-ink-600"}`}>
                    <div className="flex flex-wrap justify-between items-start gap-3 mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="font-semibold text-cream-100">{q.name}</p>
                          {q.company && <span className="font-mono text-xs text-cream-200/40">· {q.company}</span>}
                        </div>
                        <a href={`mailto:${q.email}`} className="font-mono text-xs text-electric-400/70 hover:text-electric-400">{q.email}</a>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        <span className={`font-mono text-xs px-2.5 py-1 rounded-full border ${q.status === "new" ? "bg-amber-500/10 text-amber-400 border-amber-500/30" : q.status === "replied" ? "bg-green-500/10 text-green-400 border-green-500/30" : "bg-cream-200/5 text-cream-200/40 border-ink-600"}`}>
                          {q.status}
                        </span>
                        <span className="font-mono text-xs px-2.5 py-1 rounded-full border border-electric-400/20 text-electric-400/70">
                          {PROJECT_TYPE_LABELS[q.project_type] || q.project_type}
                        </span>
                        <p className="font-mono text-xs text-cream-200/30">{new Date(q.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    {q.timeline && <p className="font-mono text-xs text-cream-200/40 mb-2">Timeline: {q.timeline}</p>}
                    <p className="text-cream-200/60 text-sm leading-relaxed">{q.message}</p>
                    <div className="mt-4 pt-3 border-t border-ink-600">
                      <a href={`mailto:${q.email}?subject=Re: Your project quote request&body=Hi ${q.name},%0A%0AThanks for reaching out...`}
                        className="inline-flex items-center gap-1.5 font-mono text-xs text-electric-400/60 hover:text-electric-400 transition-colors">
                        Reply via email →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}