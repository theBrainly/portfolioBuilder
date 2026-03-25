"use client";
import { useEffect, useState } from "react";
import { FolderKanban, Briefcase, Wrench, MessageSquareQuote, Mail, MailOpen } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import StatsCard from "@/components/admin/StatsCard";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Spinner from "@/components/ui/Spinner";
import { useAdminMenu } from "@/hooks/useAdminMenu";
import { timeAgo, truncateText } from "@/lib/utils";
import type { DashboardStats } from "@/types";

export default function DashboardPage() {
  const { onMenuClick } = useAdminMenu();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats").then((r) => r.json()).then((d) => { if (d.success) setStats(d.data); }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center min-h-screen"><Spinner size="lg" /></div>;

  return (
    <>
      <AdminHeader title="Dashboard" subtitle="Overview of your portfolio" onMenuClick={onMenuClick} />
      <div className="p-4 md:p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <StatsCard title="Projects" value={stats?.totalProjects || 0} icon={FolderKanban} color="primary" />
          <StatsCard title="Experience" value={stats?.totalExperience || 0} icon={Briefcase} color="secondary" />
          <StatsCard title="Skills" value={stats?.totalSkills || 0} icon={Wrench} color="info" />
          <StatsCard title="Testimonials" value={stats?.totalTestimonials || 0} icon={MessageSquareQuote} color="accent" />
          <StatsCard title="Messages" value={stats?.totalMessages || 0} icon={Mail} color="primary" />
          <StatsCard title="Unread" value={stats?.unreadMessages || 0} icon={MailOpen} color="accent" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-lg font-semibold mb-4 text-text-primary">Recent Messages</h3>
            {stats?.recentMessages?.length ? stats.recentMessages.map((m) => (
              <div key={m._id} className="flex items-start gap-3 p-3 rounded-xl bg-surface-2/50 mb-2 last:mb-0">
                <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">{m.name[0].toUpperCase()}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2"><p className="text-sm font-medium truncate text-text-primary">{m.name}</p>{!m.isRead && <Badge variant="primary">New</Badge>}</div>
                  <p className="text-xs text-text-muted truncate">{m.subject}</p>
                  <p className="text-xs text-text-muted mt-1">{timeAgo(m.createdAt)}</p>
                </div>
              </div>
            )) : <p className="text-text-muted text-sm py-8 text-center">No messages yet</p>}
          </Card>
          <Card>
            <h3 className="text-lg font-semibold mb-4 text-text-primary">Recent Projects</h3>
            {stats?.recentProjects?.length ? stats.recentProjects.map((p) => (
              <div key={p._id} className="flex items-center gap-3 p-3 rounded-xl bg-surface-2/50 mb-2 last:mb-0">
                <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0"><FolderKanban className="w-5 h-5 text-secondary" /></div>
                <div className="flex-1 min-w-0"><p className="text-sm font-medium truncate text-text-primary">{p.title}</p><p className="text-xs text-text-muted">{truncateText(p.shortDescription, 60)}</p></div>
                <Badge variant={p.isVisible ? "success" : "warning"}>{p.isVisible ? "Live" : "Draft"}</Badge>
              </div>
            )) : <p className="text-text-muted text-sm py-8 text-center">No projects yet</p>}
          </Card>
        </div>
      </div>
    </>
  );
}
