import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function AuthShell({
  title,
  description,
  footer,
  children,
}: {
  title: string;
  description: string;
  footer: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(236,201,75,0.1),_transparent_30%),linear-gradient(180deg,_#0b1120_0%,_#111827_100%)] px-4 py-10 text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-300 text-slate-950">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="font-display text-lg font-semibold">Portfolio Builder</p>
            <p className="text-xs uppercase tracking-[0.22em] text-white/55">
              Multi-user platform
            </p>
          </div>
        </Link>
      </div>

      <div className="mx-auto mt-12 grid max-w-6xl gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div className="px-2">
          <p className="inline-flex rounded-full border border-amber-300/20 bg-amber-300/10 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-amber-200">
            Publish on your own slug
          </p>
          <h1 className="mt-6 font-display text-4xl font-semibold leading-tight sm:text-5xl">
            Create and manage a portfolio that belongs to you.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/70">
            Sign in to your workspace, manage projects and branding, and publish your portfolio
            on a unique path.
          </p>
          <div className="mt-8 rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.18em] text-white/45">
              Example published URL
            </p>
            <p className="mt-3 rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white/80">
              http://localhost:3000/your-name
            </p>
          </div>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-semibold text-white">{title}</h2>
            <p className="mt-3 text-white/65">{description}</p>
          </div>

          {children}

          <div className="mt-6 text-center text-sm text-white/60">{footer}</div>
        </div>
      </div>
    </div>
  );
}
