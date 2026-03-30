"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  BadgeCheck,
  Briefcase,
  FileSearch,
  GraduationCap,
  Rocket,
  Sparkles,
  Trophy,
  Upload,
  Wrench,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";
import toast from "react-hot-toast";
import type { SettingsFormData } from "@/lib/validations";
import type { ResumeParsedData, ResumeParseMode } from "@/lib/resumeImport";

type ResumeImportAssistantProps = {
  onApplySettings: (values: Partial<SettingsFormData>) => void;
};

async function readApiPayload(response: Response) {
  const raw = await response.text();

  try {
    return JSON.parse(raw);
  } catch {
    const compact = raw.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    throw new Error(
      compact
        ? `Server returned ${response.status}: ${compact.slice(0, 180)}`
        : `Server returned ${response.status}`
    );
  }
}

function PreviewPill({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  if (!value) return null;

  return (
    <div className="rounded-xl border border-border bg-surface-2 px-3 py-2">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-text-muted">
        {icon}
        {label}
      </div>
      <p className="mt-2 text-sm font-medium text-text-primary">{value}</p>
    </div>
  );
}

function PreviewList({
  title,
  icon,
  items,
  emptyLabel,
}: {
  title: string;
  icon: ReactNode;
  items: string[];
  emptyLabel: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface-2 p-4">
      <div className="flex items-center gap-2">
        {icon}
        <h4 className="text-sm font-semibold text-text-primary">{title}</h4>
      </div>

      {items.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {items.map((item) => (
            <span
              key={item}
              className="rounded-full border border-border px-3 py-1 text-xs text-text-secondary"
            >
              {item}
            </span>
          ))}
        </div>
      ) : (
        <p className="mt-3 text-sm text-text-muted">{emptyLabel}</p>
      )}
    </div>
  );
}

export default function ResumeImportAssistant({
  onApplySettings,
}: ResumeImportAssistantProps) {
  const [file, setFile] = useState<File | null>(null);
  const [parseMode, setParseMode] = useState<ResumeParseMode>("manual");
  const [aiInstructions, setAiInstructions] = useState("");
  const [parsed, setParsed] = useState<ResumeParsedData | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<{
    created: { skills: number; experience: number; projects: number };
    skipped: { skills: number; experience: number; projects: number };
  } | null>(null);

  const stats = useMemo(
    () =>
      parsed
        ? [
            { label: "Skills", value: String(parsed.skills.length), icon: <Wrench className="h-4 w-4" /> },
            {
              label: "Experience",
              value: String(parsed.experiences.length),
              icon: <Briefcase className="h-4 w-4" />,
            },
            { label: "Projects", value: String(parsed.projects.length), icon: <Rocket className="h-4 w-4" /> },
            {
              label: "Achievements",
              value: String(parsed.achievements.length),
              icon: <Trophy className="h-4 w-4" />,
            },
          ]
        : [],
    [parsed]
  );

  const handleParse = async () => {
    if (!file) {
      toast.error("Choose a PDF, DOCX, or TXT resume first.");
      return;
    }

    setIsParsing(true);
    setImportResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("mode", parseMode);
      if (parseMode === "ai" && aiInstructions.trim()) {
        formData.append("aiInstructions", aiInstructions.trim());
      }

      const response = await fetch("/api/admin/resume/parse", {
        method: "POST",
        body: formData,
      });
      const payload = await readApiPayload(response);

      if (!response.ok || !payload.success) {
        throw new Error(payload.error || "Failed to parse resume");
      }

      setParsed(payload.data as ResumeParsedData);
      toast.success(
        parseMode === "ai" ? "AI resume parse completed" : "Manual resume parse completed"
      );
    } catch (error: any) {
      toast.error(error.message || "Failed to parse resume");
    } finally {
      setIsParsing(false);
    }
  };

  const handleApplySettings = () => {
    if (!parsed) {
      toast.error("Parse a resume before applying settings.");
      return;
    }

    onApplySettings(parsed.suggestedSettings);
    toast.success("Resume data applied to the settings form");
  };

  const handleImportCollections = async () => {
    if (!parsed) {
      toast.error("Parse a resume before importing content.");
      return;
    }

    setIsImporting(true);

    try {
      const response = await fetch("/api/admin/resume/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parsed,
          options: {
            importSkills: true,
            importExperience: true,
            importProjects: true,
          },
        }),
      });
      const payload = await readApiPayload(response);

      if (!response.ok || !payload.success) {
        throw new Error(payload.error || "Failed to import resume content");
      }

      setImportResult(payload.data);
      toast.success("Imported parsed skills, experience, and projects");
    } catch (error: any) {
      toast.error(error.message || "Failed to import resume content");
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 space-y-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-2 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-text-muted">
            <FileSearch className="h-3.5 w-3.5" />
            Resume Import
          </div>
          <h3 className="mt-4 text-lg font-semibold text-text-primary">
            Parse a resume and map it into your portfolio
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-text-muted">
            Upload a PDF, DOCX, or TXT resume. The importer extracts profile info,
            skills, work experience, education, achievements, and projects, then
            prepares settings content for your hero/about sections.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-surface-2 px-4 py-3 text-xs text-text-muted">
          Manual mode uses your local parser. AI mode uses the server AI provider and can follow
          custom extraction instructions.
        </div>
      </div>

      <div className="rounded-2xl border border-dashed border-border bg-surface-2/50 p-5">
        <div className="mb-5 space-y-4">
          <div>
            <p className="text-sm font-medium text-text-primary">Extraction Mode</p>
            <p className="mt-1 text-xs text-text-muted">
              Use Manual for your rule-based parser, or AI when you want the resume mapped to
              exact fields with extra instructions.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant={parseMode === "manual" ? "primary" : "outline"}
              onClick={() => setParseMode("manual")}
            >
              Manual
            </Button>
            <Button
              type="button"
              variant={parseMode === "ai" ? "primary" : "outline"}
              onClick={() => setParseMode("ai")}
              leftIcon={<Sparkles className="h-4 w-4" />}
            >
              AI
            </Button>
          </div>

          {parseMode === "ai" && (
            <div className="space-y-2">
              <Textarea
                label="AI Extraction Instructions"
                rows={4}
                value={aiInstructions}
                onChange={(event) => setAiInstructions(event.target.value)}
                placeholder="Example: Extract hero section details, exact work experience, education background, projects, and contact links. Do not place experience inside education or project fields."
              />
              <p className="text-xs text-text-muted">
                Optional. Tell AI exactly which fields you want and how they should be mapped.
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-text-primary">Choose Resume File</p>
            <input
              type="file"
              accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
              onChange={(event) => {
                const nextFile = event.target.files?.[0] || null;
                setFile(nextFile);
                setParsed(null);
                setImportResult(null);
              }}
              className="block w-full text-sm text-text-secondary file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2.5 file:text-sm file:font-medium file:text-primary-foreground hover:file:bg-primary-light"
            />
            <p className="text-xs text-text-muted">
              Best results come from resumes with clear section headings like Skills,
              Experience, Projects, Education, and Achievements.
            </p>
          </div>

          <Button
            type="button"
            onClick={handleParse}
            isLoading={isParsing}
            leftIcon={
              parseMode === "ai" ? <Sparkles className="h-4 w-4" /> : <Upload className="h-4 w-4" />
            }
          >
            {parseMode === "ai" ? "Parse With AI" : "Parse Manually"}
          </Button>
        </div>

        {file && (
          <p className="mt-4 text-sm text-text-secondary">
            Selected file: <span className="font-medium text-text-primary">{file.name}</span>
          </p>
        )}
      </div>

      {parsed && (
        <div className="space-y-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-2 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-text-muted">
                {parsed.mode === "ai" ? <Sparkles className="h-3.5 w-3.5" /> : <BadgeCheck className="h-3.5 w-3.5" />}
                {parsed.mode === "ai" ? "AI Parse" : "Manual Parse"}
              </span>

              {stats.map((stat) => (
                <span
                  key={stat.label}
                  className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs text-text-secondary"
                >
                  {stat.icon}
                  {stat.label}: {stat.value}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" onClick={handleApplySettings}>
                Apply To Settings Form
              </Button>
              <Button
                type="button"
                onClick={handleImportCollections}
                isLoading={isImporting}
              >
                Import Skills, Experience & Projects
              </Button>
            </div>
          </div>

          {parsed.notes.length > 0 && (
            <div className="rounded-2xl border border-border bg-surface-2 p-4">
              <p className="text-sm font-medium text-text-primary">Import Notes</p>
              <div className="mt-2 space-y-2">
                {parsed.notes.map((note) => (
                  <p key={note} className="text-sm text-text-muted">
                    {note}
                  </p>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <PreviewPill
              icon={<BadgeCheck className="h-3.5 w-3.5" />}
              label="Name"
              value={parsed.profile.name}
            />
            <PreviewPill
              icon={<Briefcase className="h-3.5 w-3.5" />}
              label="Headline"
              value={parsed.profile.headline}
            />
            <PreviewPill
              icon={<GraduationCap className="h-3.5 w-3.5" />}
              label="Location"
              value={parsed.profile.location}
            />
            <PreviewPill
              icon={<BadgeCheck className="h-3.5 w-3.5" />}
              label="Email"
              value={parsed.profile.email}
            />
            <PreviewPill
              icon={<BadgeCheck className="h-3.5 w-3.5" />}
              label="Phone"
              value={parsed.profile.phone}
            />
            <PreviewPill
              icon={<BadgeCheck className="h-3.5 w-3.5" />}
              label="LinkedIn"
              value={parsed.profile.linkedin}
            />
          </div>

          {parsed.profile.summary && (
            <div className="rounded-2xl border border-border bg-surface-2 p-4">
              <p className="text-sm font-medium text-text-primary">Summary</p>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                {parsed.profile.summary}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <PreviewList
              title="Skills"
              icon={<Wrench className="h-4 w-4 text-text-muted" />}
              items={parsed.skills.slice(0, 16).map((skill) => skill.name)}
              emptyLabel="No structured skills were extracted."
            />
            <PreviewList
              title="Projects"
              icon={<Rocket className="h-4 w-4 text-text-muted" />}
              items={parsed.projects.slice(0, 8).map((project) => project.title)}
              emptyLabel="No structured projects were extracted."
            />
            <PreviewList
              title="Experience"
              icon={<Briefcase className="h-4 w-4 text-text-muted" />}
              items={parsed.experiences.slice(0, 8).map((experience) => `${experience.position} at ${experience.company}`)}
              emptyLabel="No structured experience entries were extracted."
            />
            <PreviewList
              title="Education & Achievements"
              icon={<Trophy className="h-4 w-4 text-text-muted" />}
              items={[
                ...parsed.education.slice(0, 4).map((item) => item.title),
                ...parsed.achievements.slice(0, 4).map((item) => item.title),
              ]}
              emptyLabel="No education or achievement highlights were extracted."
            />
          </div>

          <div className="rounded-2xl border border-border bg-surface-2 p-4">
            <p className="text-sm font-medium text-text-primary">
              Suggested Settings Preview
            </p>
            <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-text-muted">
                  Hero
                </p>
                <p className="mt-2 text-sm font-semibold text-text-primary">
                  {parsed.suggestedSettings.heroTitle || "No hero title suggestion"}
                </p>
                <p className="mt-1 text-sm text-text-secondary">
                  {parsed.suggestedSettings.heroSubtitle || "No hero subtitle suggestion"}
                </p>
                <p className="mt-2 text-sm text-text-muted">
                  {parsed.suggestedSettings.heroDescription || "No hero description suggestion"}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-text-muted">
                  About
                </p>
                <p className="mt-2 text-sm text-text-muted whitespace-pre-line">
                  {parsed.suggestedSettings.aboutDescription ||
                    "No about-section suggestion was generated."}
                </p>
              </div>
            </div>
          </div>

          {importResult && (
            <div className="rounded-2xl border border-border bg-surface-2 p-4">
              <p className="text-sm font-medium text-text-primary">Last Import Result</p>
              <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
                <div className="rounded-xl border border-border px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-text-muted">Skills</p>
                  <p className="mt-2 text-sm text-text-secondary">
                    Created {importResult.created.skills}, skipped {importResult.skipped.skills}
                  </p>
                </div>
                <div className="rounded-xl border border-border px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-text-muted">Experience</p>
                  <p className="mt-2 text-sm text-text-secondary">
                    Created {importResult.created.experience}, skipped {importResult.skipped.experience}
                  </p>
                </div>
                <div className="rounded-xl border border-border px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-text-muted">Projects</p>
                  <p className="mt-2 text-sm text-text-secondary">
                    Created {importResult.created.projects}, skipped {importResult.skipped.projects}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="rounded-2xl border border-border bg-surface-2 p-4">
            <p className="text-sm font-medium text-text-primary">Extracted Text Preview</p>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-text-muted">
              {parsed.rawTextPreview}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
