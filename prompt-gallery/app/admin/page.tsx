"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface Submission {
  id: string;
  title: string;
  prompt: string;
  token_id: string;
  image_url: string;
  x_handle: string | null;
  status: "pending" | "approved" | "rejected";
  category: string | null;
  generations: number;
  more_details: string | null;
  ref_images: string | null;
  requires_ref_images: boolean;
  created_at: string;
}

interface Stats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

interface Category {
  id: string;
  slug: string;
  label: string;
}

export default function AdminPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");

  async function fetchData() {
    try {
      const [adminRes, catRes] = await Promise.all([
        fetch("/api/admin"),
        fetch("/api/categories"),
      ]);
      const data = await adminRes.json();
      const cats = await catRes.json();
      setSubmissions(data.submissions || []);
      setStats(data.stats || { total: 0, pending: 0, approved: 0, rejected: 0 });
      setCategories(Array.isArray(cats) ? cats : []);
    } catch (e) {
      console.error("Failed to fetch:", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  async function updateStatus(id: string, status: string) {
    try {
      await fetch("/api/admin", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      // Optimistic update
      setSubmissions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: status as any } : s))
      );
      setStats((prev) => {
        const old = submissions.find((s) => s.id === id)?.status;
        if (!old) return prev;
        return {
          ...prev,
          [old]: prev[old as keyof Stats] - 1,
          [status]: (prev[status as keyof Stats] as number) + 1,
        };
      });
    } catch (e) {
      console.error("Update failed:", e);
    }
  }

  async function createCategory() {
    if (!newCategoryName.trim()) return;
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: newCategoryName.trim() }),
      });
      if (res.ok) {
        const cat = await res.json();
        setCategories((prev) => [...prev, cat]);
        setNewCategoryName("");
      }
    } catch (e) {
      console.error("Create category failed:", e);
    }
  }

  async function deleteCategory(catId: string) {
    try {
      await fetch("/api/categories", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: catId }),
      });
      setCategories((prev) => prev.filter((c) => c.id !== catId));
    } catch (e) {
      console.error("Delete category failed:", e);
    }
  }

  async function toggleRefImages(id: string, current: boolean) {
    try {
      await fetch("/api/admin", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, requires_ref_images: !current }),
      });
      setSubmissions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, requires_ref_images: !current } : s))
      );
    } catch (e) {
      console.error("Toggle ref images failed:", e);
    }
  }

  async function updateCategory(id: string, category: string | null) {
    try {
      await fetch("/api/admin", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, category }),
      });
      setSubmissions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, category } : s))
      );
    } catch (e) {
      console.error("Category update failed:", e);
    }
  }

  async function deleteSubmission(id: string) {
    try {
      await fetch("/api/admin", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setSubmissions((prev) => prev.filter((s) => s.id !== id));
      setStats((prev) => ({
        ...prev,
        total: prev.total - 1,
        [submissions.find((s) => s.id === id)?.status || "pending"]:
          (prev[(submissions.find((s) => s.id === id)?.status || "pending") as keyof Stats] as number) - 1,
      }));
    } catch (e) {
      console.error("Delete failed:", e);
    }
  }

  const filtered = filter === "all" ? submissions : submissions.filter((s) => s.status === filter);

  return (
    <main className="min-h-screen bg-[#050505] text-white px-4 sm:px-6 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-display font-black text-gvc-gold">Admin Dashboard</h1>
            <p className="text-white/40 font-body text-sm">Manage prompt submissions</p>
          </div>
          <Link href="/" className="text-white/40 font-body text-sm hover:text-gvc-gold transition-colors">
            Back to Prompt Machine
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total", value: stats.total, color: "text-white" },
            { label: "Pending", value: stats.pending, color: stats.pending > 0 ? "text-gvc-gold" : "text-white/50" },
            { label: "Approved", value: stats.approved, color: "text-gvc-green" },
            { label: "Rejected", value: stats.rejected, color: "text-white/30" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl bg-[#121212] border border-white/[0.08] p-4 text-center">
              <p className={`text-2xl font-display font-black ${s.color}`}>{s.value}</p>
              <p className="text-white/40 font-body text-xs uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Category Management */}
        <div className="rounded-xl bg-[#121212] border border-white/[0.08] p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-display font-bold text-white/60">Categories</h3>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {categories.map((cat) => (
              <div key={cat.id} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06]">
                <span className="text-white/50 font-body text-xs">{cat.label}</span>
                <button onClick={() => { if (confirm(`Delete "${cat.label}" category?`)) deleteCategory(cat.id); }} className="text-white/20 hover:text-red-400/60 transition-colors">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="New category name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && createCategory()}
              className="flex-1 px-3 py-2 rounded-lg bg-black/40 border border-white/[0.08] text-white font-body text-xs placeholder:text-white/20 focus:outline-none focus:border-gvc-gold/30 transition-colors"
            />
            <button onClick={createCategory} className="px-4 py-2 rounded-lg bg-gvc-gold/15 text-gvc-gold font-display font-bold text-xs hover:bg-gvc-gold/25 transition-colors">
              Add
            </button>
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-6">
          {(["all", "pending", "approved", "rejected"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl font-display font-bold text-sm transition-all capitalize ${
                filter === f
                  ? "bg-gvc-gold/15 text-gvc-gold border border-gvc-gold/30"
                  : "border border-white/[0.08] text-white/40 hover:text-white/60"
              }`}
            >
              {f} {f !== "all" && `(${f === "pending" ? stats.pending : f === "approved" ? stats.approved : stats.rejected})`}
            </button>
          ))}
        </div>

        {/* Submissions */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-xl bg-[#121212] border border-white/[0.08] p-4 animate-pulse">
                <div className="h-4 w-48 bg-white/10 rounded mb-2" />
                <div className="h-3 w-32 bg-white/10 rounded" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl bg-[#121212] border border-white/[0.08] p-8 text-center">
            <p className="text-white/30 font-body">
              {filter === "pending" ? "All caught up. No pending submissions." : `No ${filter} submissions.`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {filtered.map((sub) => (
                <motion.div
                  key={sub.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className={`rounded-xl bg-[#121212] border overflow-hidden ${
                    sub.status === "pending"
                      ? "border-gvc-gold/20"
                      : sub.status === "approved"
                      ? "border-gvc-green/20 border-l-2 border-l-gvc-green"
                      : "border-white/[0.06]"
                  }`}
                >
                  <div className="flex gap-4 p-4">
                    {/* Image */}
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-black/40 flex-shrink-0">
                      <img src={sub.image_url} alt={sub.title} className="w-full h-full object-cover" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-display font-bold text-white text-sm">{sub.title}</h3>
                          <p className="text-white/30 font-body text-xs">
                            Token #{sub.token_id}
                            {sub.x_handle && ` - @${sub.x_handle}`}
                            {" - "}
                            {new Date(sub.created_at).toLocaleDateString()}
                            {(sub as any).generations > 0 && ` - ${(sub as any).generations} generations`}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-body font-semibold flex-shrink-0 ${
                            sub.status === "pending"
                              ? "bg-gvc-gold/15 text-gvc-gold"
                              : sub.status === "approved"
                              ? "bg-gvc-green/15 text-gvc-green"
                              : "bg-white/[0.04] text-white/30"
                          }`}
                        >
                          {sub.status}
                        </span>
                      </div>

                      {/* Expand/collapse prompt */}
                      <button
                        onClick={() => setExpandedId(expandedId === sub.id ? null : sub.id)}
                        className="text-white/20 font-body text-xs mt-1 hover:text-white/40 transition-colors"
                      >
                        {expandedId === sub.id ? "Hide prompt" : "View prompt"}
                      </button>
                    </div>
                  </div>

                  {/* Expanded details */}
                  <AnimatePresence>
                    {expandedId === sub.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 space-y-3">
                          {/* Prompt text */}
                          <div className="bg-black/40 rounded-lg p-3 border border-white/[0.06]">
                            <p className="text-white/60 font-body text-xs leading-relaxed whitespace-pre-wrap">{sub.prompt}</p>
                          </div>

                          {/* More details */}
                          {sub.more_details && (
                            <div>
                              <p className="text-white/30 font-body text-xs mb-1">Additional details:</p>
                              <div className="bg-black/40 rounded-lg p-3 border border-white/[0.06]">
                                <p className="text-white/50 font-body text-xs leading-relaxed whitespace-pre-wrap">{sub.more_details}</p>
                              </div>
                            </div>
                          )}

                          {/* Reference images */}
                          {sub.ref_images && (() => {
                            const refs = JSON.parse(sub.ref_images);
                            if (!Array.isArray(refs) || refs.length === 0) return null;
                            return (
                              <div>
                                <p className="text-white/30 font-body text-xs mb-2">Reference images ({refs.length}):</p>
                                <div className="flex flex-wrap gap-2">
                                  {refs.map((url: string, i: number) => (
                                    <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="w-24 h-24 rounded-lg overflow-hidden bg-black/40 border border-white/[0.08] hover:border-gvc-gold/30 transition-colors block">
                                      <img src={url} alt={`Reference ${i + 1}`} className="w-full h-full object-cover" />
                                    </a>
                                  ))}
                                </div>
                              </div>
                            );
                          })()}

                          {/* Requires reference images toggle */}
                          <div className="flex items-center gap-3 pt-2 border-t border-white/[0.04]">
                            <button
                              onClick={() => toggleRefImages(sub.id, sub.requires_ref_images)}
                              className={`relative w-10 h-5 rounded-full transition-colors ${sub.requires_ref_images ? "bg-gvc-gold/30" : "bg-white/10"}`}
                            >
                              <div className={`absolute top-0.5 w-4 h-4 rounded-full transition-all ${sub.requires_ref_images ? "left-5.5 bg-gvc-gold" : "left-0.5 bg-white/40"}`} style={{ left: sub.requires_ref_images ? "22px" : "2px" }} />
                            </button>
                            <span className="text-white/40 font-body text-xs">Requires reference images for users</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Category + Actions */}
                  <div className="px-4 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-white/30 font-body text-xs">Category:</span>
                      <select
                        value={sub.category || ""}
                        onChange={(e) => updateCategory(sub.id, e.target.value || null)}
                        className="px-2 py-1 rounded-lg bg-black/40 border border-white/[0.08] text-white/60 font-body text-xs focus:outline-none focus:border-gvc-gold/30 appearance-none cursor-pointer"
                      >
                        <option value="" className="bg-[#121212]">Unassigned</option>
                        {categories.map((cat) => (
                          <option key={cat.slug} value={cat.slug} className="bg-[#121212]">{cat.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-2 px-4 pb-4">
                    {sub.status === "pending" && (
                      <>
                        <button
                          onClick={() => updateStatus(sub.id, "approved")}
                          className="px-4 py-2 rounded-lg bg-gvc-green/15 text-gvc-green font-display font-bold text-xs hover:bg-gvc-green/25 transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => updateStatus(sub.id, "rejected")}
                          className="px-4 py-2 rounded-lg text-red-400/60 font-display font-bold text-xs hover:text-red-400 hover:bg-red-400/10 transition-colors"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {sub.status === "approved" && (
                      <button
                        onClick={() => updateStatus(sub.id, "pending")}
                        className="px-4 py-2 rounded-lg text-white/30 font-display font-bold text-xs hover:text-white/50 hover:bg-white/[0.04] transition-colors"
                      >
                        Move to pending
                      </button>
                    )}
                    {sub.status === "rejected" && (
                      <button
                        onClick={() => updateStatus(sub.id, "pending")}
                        className="px-4 py-2 rounded-lg text-white/30 font-display font-bold text-xs hover:text-white/50 hover:bg-white/[0.04] transition-colors"
                      >
                        Reconsider
                      </button>
                    )}
                    <button
                      onClick={() => {
                        if (confirm("Delete this submission?")) deleteSubmission(sub.id);
                      }}
                      className="px-4 py-2 rounded-lg text-red-400/30 font-display font-bold text-xs hover:text-red-400/60 hover:bg-red-400/5 transition-colors ml-auto"
                    >
                      Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </main>
  );
}
