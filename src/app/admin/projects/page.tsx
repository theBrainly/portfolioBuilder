"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Search, Eye, EyeOff, Pencil, Trash2, ExternalLink, Star } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import DeleteDialog from "@/components/ui/DeleteDialog";
import Spinner from "@/components/ui/Spinner";
import { useAdminMenu } from "@/hooks/useAdminMenu";
import { truncateText } from "@/lib/utils";
import { PROJECT_CATEGORIES } from "@/constants";
import toast from "react-hot-toast";
import type { IProject } from "@/types";

export default function ProjectsPage() {
  const { onMenuClick } = useAdminMenu();
  const [projects, setProjects] = useState<IProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchProjects = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (category !== "All") params.set("category", category);
      const res = await fetch(`/api/admin/projects?${params}`);
      const data = await res.json();
      if (data.success) setProjects(data.data);
    } catch { toast.error("Failed to fetch projects"); } finally { setLoading(false); }
  }, [category, search]);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  const toggleVisibility = async (id: string, current: boolean) => {
    const project = projects.find((p) => p._id === id);
    if (!project) return;
    try {
      await fetch(`/api/admin/projects/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...project, isVisible: !current }) });
      setProjects(projects.map((p) => p._id === id ? { ...p, isVisible: !current } : p));
      toast.success(!current ? "Published" : "Hidden");
    } catch { toast.error("Failed"); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/projects/${deleteId}`, { method: "DELETE" });
      if (res.ok) { setProjects(projects.filter((p) => p._id !== deleteId)); toast.success("Deleted!"); }
    } catch { toast.error("Failed"); } finally { setDeleting(false); setDeleteId(null); }
  };

  return (
    <>
      <AdminHeader title="Projects" subtitle={`${projects.length} total`} onMenuClick={onMenuClick}
        actions={<Link href="/admin/projects/new"><Button leftIcon={<Plus className="w-4 h-4" />}>Add Project</Button></Link>} />
      <div className="p-4 md:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input type="text" placeholder="Search projects..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-surface text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {["All", ...PROJECT_CATEGORIES.map((c) => c.value)].map((cat) => (
              <button key={cat} onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${category === cat ? "bg-primary text-white" : "bg-surface-2 text-text-secondary hover:text-text-primary"}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>
        {loading ? <div className="flex justify-center py-20"><Spinner size="lg" /></div>
          : projects.length === 0 ? <div className="text-center py-20"><p className="text-text-muted text-lg mb-4">No projects found</p><Link href="/admin/projects/new"><Button leftIcon={<Plus className="w-4 h-4" />}>Create First Project</Button></Link></div>
          : (
            <div className="bg-surface border border-border rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead><tr className="border-b border-border bg-surface-2/50">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Project</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider hidden md:table-cell">Category</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider hidden lg:table-cell">Tech</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Status</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Actions</th>
                  </tr></thead>
                  <tbody className="divide-y divide-border">
                    {projects.map((p) => (
                      <tr key={p._id} className="hover:bg-surface-2/30 transition-colors">
                        <td className="px-4 py-3"><div className="flex items-center gap-3">
                          <div className="w-14 h-10 rounded-lg overflow-hidden bg-surface-2 flex-shrink-0 border border-border">
                            {p.thumbnail ? <Image src={p.thumbnail} alt={p.title} width={56} height={40} className="w-full h-full object-cover" />
                              : <div className="w-full h-full flex items-center justify-center text-text-muted text-xs">No img</div>}
                          </div>
                          <div className="min-w-0"><p className="font-medium text-sm truncate text-text-primary">{p.title}</p><p className="text-xs text-text-muted truncate max-w-[200px]">{truncateText(p.shortDescription, 50)}</p></div>
                        </div></td>
                        <td className="px-4 py-3 hidden md:table-cell"><Badge>{p.category}</Badge></td>
                        <td className="px-4 py-3 hidden lg:table-cell"><div className="flex flex-wrap gap-1">
                          {p.techStack.slice(0, 3).map((t) => <Badge key={t} variant="primary">{t}</Badge>)}
                          {p.techStack.length > 3 && <Badge>+{p.techStack.length - 3}</Badge>}
                        </div></td>
                        <td className="px-4 py-3 text-center"><div className="flex items-center justify-center gap-2">
                          <Badge variant={p.isVisible ? "success" : "warning"}>{p.isVisible ? "Live" : "Draft"}</Badge>
                          {p.isFeatured && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />}
                        </div></td>
                        <td className="px-4 py-3"><div className="flex items-center justify-end gap-1">
                          <button onClick={() => toggleVisibility(p._id, p.isVisible)} className="p-2 text-text-muted hover:bg-surface-2 rounded-lg transition-colors" title="Toggle visibility">
                            {p.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </button>
                          {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-text-muted hover:bg-surface-2 rounded-lg transition-colors"><ExternalLink className="w-4 h-4" /></a>}
                          <Link href={`/admin/projects/${p._id}`} className="p-2 text-text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"><Pencil className="w-4 h-4" /></Link>
                          <button onClick={() => setDeleteId(p._id)} className="p-2 text-text-muted hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
      </div>
      <DeleteDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Project" isLoading={deleting} />
    </>
  );
}
