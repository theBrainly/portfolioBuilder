"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowDown,
  ArrowUp,
  Palette,
  RefreshCw,
  Save,
} from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import AIContentAssistant from "@/components/admin/AIContentAssistant";
import SettingsLivePreview from "@/components/admin/SettingsLivePreview";
import Button from "@/components/ui/Button";
import DragResizeHandle from "@/components/ui/DragResizeHandle";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import Spinner from "@/components/ui/Spinner";
import ImageUploader from "@/components/ui/ImageUploader";
import { useAdminMenu } from "@/hooks/useAdminMenu";
import { settingsSchema, SettingsFormData } from "@/lib/validations";
import type { AIContentFieldId } from "@/constants/aiWriting";
import {
  DESIGN_PRESETS,
  HOME_SECTION_OPTIONS,
  THEME_PALETTES,
} from "@/constants/siteCustomization";
import { normalizeHomeSectionOrder } from "@/lib/siteSettings";
import {
  SETTINGS_DEFAULT_PREVIEW_WIDTH,
  SETTINGS_MAX_PREVIEW_WIDTH,
  SETTINGS_MIN_PREVIEW_WIDTH,
} from "@/constants/adminLayout";
import { getPortfolioPublicUrl, getSuggestedPortfolioSlug } from "@/lib/portfolioUrl";
import toast from "react-hot-toast";

export default function AdminSettingsPage() {
  const { onMenuClick } = useAdminMenu();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewWidth, setPreviewWidth] = useState(SETTINGS_DEFAULT_PREVIEW_WIDTH);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
  });

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      if (data.success) {
        reset({
          ...data.data,
          portfolioSlug:
            data.data.portfolioSlug || getSuggestedPortfolioSlug(data.data),
        });
      }
    } catch (error) {
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  }, [reset]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  useEffect(() => {
    const savedWidth = window.localStorage.getItem("admin-settings-preview-width");
    if (!savedWidth) return;

    const parsed = Number(savedWidth);
    if (Number.isFinite(parsed)) {
      setPreviewWidth(
        Math.min(SETTINGS_MAX_PREVIEW_WIDTH, Math.max(SETTINGS_MIN_PREVIEW_WIDTH, parsed))
      );
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("admin-settings-preview-width", String(previewWidth));
  }, [previewWidth]);

  const onSubmit = async (data: SettingsFormData) => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error);

      toast.success("Settings saved!");
      reset(result.data);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  const watchedHomeSectionOrder = watch("homeSectionOrder");
  const previewValues = watch();
  const homeSectionOrder = useMemo(
    () => normalizeHomeSectionOrder(watchedHomeSectionOrder),
    [watchedHomeSectionOrder]
  );
  const activePalette = watch("themePalette");
  const activeDesignPreset = watch("designPreset");
  const previewUrlSettings = useMemo(
    () => ({
      ...previewValues,
      portfolioSlug:
        previewValues.portfolioSlug || getSuggestedPortfolioSlug(previewValues),
    }),
    [previewValues]
  );
  const publicUrlPreview = useMemo(
    () => getPortfolioPublicUrl(previewUrlSettings),
    [previewUrlSettings]
  );

  const applyAiDraft = useCallback(
    (field: AIContentFieldId, value: string) => {
      setValue(field as keyof SettingsFormData, value as never, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    },
    [setValue]
  );

  const moveSection = (index: number, direction: "up" | "down") => {
    const nextIndex = direction === "up" ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= homeSectionOrder.length) return;

    const nextOrder = [...homeSectionOrder];
    [nextOrder[index], nextOrder[nextIndex]] = [nextOrder[nextIndex], nextOrder[index]];

    setValue("homeSectionOrder", nextOrder, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <AdminHeader
        title="Site Settings"
        subtitle="Manage content, branding, theme palettes, and homepage order"
        onMenuClick={onMenuClick}
        actions={
          <Button
            onClick={handleSubmit(onSubmit)}
            isLoading={saving}
            leftIcon={<Save className="w-4 h-4" />}
            disabled={!isDirty}
          >
            Save Changes
          </Button>
        }
      />

      <div className="p-4 md:p-6 max-w-7xl pb-20">
        <div
          className="grid gap-8 xl:gap-0 xl:grid-cols-[minmax(0,1fr)_16px_var(--settings-preview-width)] xl:items-start"
          style={
            {
              "--settings-preview-width": `${previewWidth}px`,
            } as React.CSSProperties
          }
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 xl:pr-6">
            <AIContentAssistant values={previewValues} onApply={applyAiDraft} />

            <div className="bg-surface border border-border rounded-2xl p-6 space-y-5">
              <h3 className="text-lg font-semibold">Branding & Navigation</h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label="Brand Name *"
                  placeholder="Akash Sharma"
                  error={errors.brandName?.message}
                  {...register("brandName")}
                />
                <Input
                  label="Logo Mark *"
                  placeholder="AS"
                  helperText="Shown inside the navbar/footer logo."
                  error={errors.brandMark?.message}
                  {...register("brandMark")}
                />
                <Input
                  label="Navbar CTA *"
                  placeholder="Hire Me"
                  error={errors.navbarCTA?.message}
                  {...register("navbarCTA")}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Input
                  label="About Nav Label *"
                  error={errors.sectionLabels?.about?.message}
                  {...register("sectionLabels.about")}
                />
                <Input
                  label="Skills Nav Label *"
                  error={errors.sectionLabels?.skills?.message}
                  {...register("sectionLabels.skills")}
                />
                <Input
                  label="Experience Nav Label *"
                  error={errors.sectionLabels?.experience?.message}
                  {...register("sectionLabels.experience")}
                />
                <Input
                  label="Projects Nav Label *"
                  error={errors.sectionLabels?.projects?.message}
                  {...register("sectionLabels.projects")}
                />
                <Input
                  label="Testimonials Nav Label *"
                  error={errors.sectionLabels?.testimonials?.message}
                  {...register("sectionLabels.testimonials")}
                />
                <Input
                  label="Contact Nav Label *"
                  error={errors.sectionLabels?.contact?.message}
                  {...register("sectionLabels.contact")}
                />
              </div>
            </div>

            <div className="bg-surface border border-border rounded-2xl p-6 space-y-5">
              <h3 className="text-lg font-semibold">Portfolio URL</h3>

              <p className="text-sm text-text-muted">
                Use a custom domain for a root portfolio URL, or leave that blank and publish on
                your current domain with a unique slug.
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Input
                  label="Custom Domain"
                  placeholder="portfolio.yourdomain.com"
                  helperText="Optional. Example: akash.dev or portfolio.akash.dev"
                  error={errors.customDomain?.message}
                  {...register("customDomain")}
                />
                <Input
                  label="Portfolio Slug"
                  placeholder="akash-sharma"
                  helperText="Used on your current domain when no custom domain is set."
                  error={errors.portfolioSlug?.message}
                  {...register("portfolioSlug")}
                />
              </div>

              <div className="rounded-2xl border border-border bg-surface-2 p-4">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-text-muted">
                  Resolved Public URL
                </p>
                <p className="mt-2 break-all text-sm font-semibold text-text-primary">
                  {publicUrlPreview}
                </p>
              </div>
            </div>

            <div className="bg-surface border border-border rounded-2xl p-6 space-y-5">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5" />
                <h3 className="text-lg font-semibold">Design Preset</h3>
              </div>

              <p className="text-sm text-text-muted">
                Switch the whole homepage direction, including layout, spacing, alignment,
                card treatment, and section styling.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {DESIGN_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() =>
                      setValue("designPreset", preset.id, {
                        shouldDirty: true,
                        shouldTouch: true,
                        shouldValidate: true,
                      })
                    }
                    className={`rounded-2xl border p-5 text-left transition-all ${
                      activeDesignPreset === preset.id
                        ? "border-primary bg-primary/10 shadow-sm"
                        : "border-border hover:border-primary/30"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-base font-semibold text-text-primary">
                          {preset.name}
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-text-muted">
                          {preset.description}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] ${
                          activeDesignPreset === preset.id
                            ? "bg-primary text-primary-foreground"
                            : "bg-surface-2 text-text-muted"
                        }`}
                      >
                        {activeDesignPreset === preset.id ? "Active" : "Preset"}
                      </span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {preset.features.map((feature) => (
                        <span
                          key={feature}
                          className="rounded-full border border-border px-3 py-1 text-xs text-text-muted"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>

              {errors.designPreset?.message && (
                <p className="text-sm text-red-500">{errors.designPreset.message}</p>
              )}
            </div>

            <div className="bg-surface border border-border rounded-2xl p-6 space-y-5">
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                <h3 className="text-lg font-semibold">Theme Palette</h3>
              </div>

              <Select
                label="Default Palette"
                value={activePalette}
                onChange={(event) =>
                  setValue("themePalette", event.target.value as SettingsFormData["themePalette"], {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true,
                  })
                }
                options={THEME_PALETTES.map((palette) => ({
                  value: palette.id,
                  label: palette.name,
                }))}
                error={errors.themePalette?.message}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {THEME_PALETTES.map((palette) => (
                  <button
                    key={palette.id}
                    type="button"
                    onClick={() =>
                      setValue("themePalette", palette.id, {
                        shouldDirty: true,
                        shouldTouch: true,
                        shouldValidate: true,
                      })
                    }
                    className={`rounded-2xl border p-4 text-left transition-all ${
                      activePalette === palette.id
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/30"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4 mb-3">
                      <div>
                        <p className="font-semibold text-text-primary">{palette.name}</p>
                        <p className="text-sm text-text-muted">{palette.description}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {palette.swatches.map((swatch) => (
                          <span
                            key={swatch}
                            className="h-4 w-4 rounded-full border border-black/10"
                            style={{ backgroundColor: swatch }}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-text-muted">
                      This palette is applied site-wide from admin settings.
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-surface border border-border rounded-2xl p-6 space-y-5">
              <h3 className="text-lg font-semibold">Homepage Sequence</h3>
              <p className="text-sm text-text-muted">
                Control the order in which sections appear after the hero section.
              </p>

              <div className="space-y-3">
                {homeSectionOrder.map((sectionId, index) => {
                  const section = HOME_SECTION_OPTIONS.find((item) => item.id === sectionId);
                  if (!section) return null;

                  return (
                    <div
                      key={sectionId}
                      className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-surface-2 px-4 py-3"
                    >
                      <div>
                        <p className="font-medium text-text-primary">{section.label}</p>
                        <p className="text-xs text-text-muted">
                          Position {index + 1} on the homepage
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => moveSection(index, "up")}
                          disabled={index === 0}
                          leftIcon={<ArrowUp className="w-4 h-4" />}
                        >
                          Up
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => moveSection(index, "down")}
                          disabled={index === homeSectionOrder.length - 1}
                          leftIcon={<ArrowDown className="w-4 h-4" />}
                        >
                          Down
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {errors.homeSectionOrder?.message && (
                <p className="text-sm text-red-500">{errors.homeSectionOrder.message}</p>
              )}
            </div>

            <div className="bg-surface border border-border rounded-2xl p-6 space-y-5">
              <h3 className="text-lg font-semibold">Hero Section</h3>

              <Input
                label="Hero Title *"
                placeholder="Hi, I'm John Doe"
                error={errors.heroTitle?.message}
                {...register("heroTitle")}
              />

              <Input
                label="Hero Subtitle *"
                placeholder="Full Stack Developer"
                error={errors.heroSubtitle?.message}
                {...register("heroSubtitle")}
              />

              <Textarea
                label="Hero Description *"
                placeholder="I build exceptional digital experiences..."
                rows={3}
                error={errors.heroDescription?.message}
                {...register("heroDescription")}
              />

              <Input
                label="CTA Button Text"
                placeholder="View My Work"
                {...register("heroCTA")}
              />

              <Controller
                name="heroImage"
                control={control}
                render={({ field }) => (
                  <ImageUploader
                    value={field.value}
                    onChange={field.onChange}
                    folder="hero"
                    label="Hero Image / Avatar"
                  />
                )}
              />
            </div>

            <div className="bg-surface border border-border rounded-2xl p-6 space-y-5">
              <h3 className="text-lg font-semibold">About Section</h3>

              <Input
                label="About Title"
                placeholder="Design has always been more than just a job."
                {...register("aboutTitle")}
              />

              <Textarea
                label="About Description *"
                placeholder="Tell your story..."
                rows={6}
                error={errors.aboutDescription?.message}
                {...register("aboutDescription")}
              />

              <Controller
                name="aboutImage"
                control={control}
                render={({ field }) => (
                  <ImageUploader
                    value={field.value}
                    onChange={field.onChange}
                    folder="about"
                    label="About Image"
                  />
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label="Years of Experience"
                  type="number"
                  {...register("yearsOfExperience", { valueAsNumber: true })}
                />
                <Input
                  label="Total Projects"
                  type="number"
                  {...register("totalProjects", { valueAsNumber: true })}
                />
                <Input
                  label="Total Clients"
                  type="number"
                  {...register("totalClients", { valueAsNumber: true })}
                />
              </div>
            </div>

            <div className="bg-surface border border-border rounded-2xl p-6 space-y-5">
              <h3 className="text-lg font-semibold">Contact Information</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Email *"
                  type="email"
                  placeholder="you@email.com"
                  error={errors.email?.message}
                  {...register("email")}
                />
                <Input
                  label="Phone"
                  placeholder="+1 234 567 890"
                  {...register("phone")}
                />
              </div>

              <Input
                label="Location"
                placeholder="City, Country"
                {...register("location")}
              />
            </div>

            <div className="bg-surface border border-border rounded-2xl p-6 space-y-5">
              <h3 className="text-lg font-semibold">Social Links</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="GitHub"
                  placeholder="https://github.com/username"
                  {...register("github")}
                />
                <Input
                  label="LinkedIn"
                  placeholder="https://linkedin.com/in/username"
                  {...register("linkedin")}
                />
                <Input
                  label="Twitter / X"
                  placeholder="https://twitter.com/username"
                  {...register("twitter")}
                />
                <Input
                  label="Instagram"
                  placeholder="https://instagram.com/username"
                  {...register("instagram")}
                />
              </div>
            </div>

            <div className="bg-surface border border-border rounded-2xl p-6 space-y-5">
              <h3 className="text-lg font-semibold">Footer</h3>

              <Textarea
                label="Footer Description *"
                rows={3}
                error={errors.footerDescription?.message}
                {...register("footerDescription")}
              />

              <Input
                label="Footer Copyright *"
                placeholder="All rights reserved."
                error={errors.footerCopyright?.message}
                {...register("footerCopyright")}
              />
            </div>

            <div className="bg-surface border border-border rounded-2xl p-6 space-y-5">
              <h3 className="text-lg font-semibold">Resume</h3>

              <Input
                label="Resume URL"
                placeholder="https://drive.google.com/... or Cloudinary URL"
                helperText="Upload your resume to Google Drive or Cloudinary and paste the URL"
                {...register("resumeUrl")}
              />
            </div>

            <div className="bg-surface border border-border rounded-2xl p-6 space-y-5">
              <h3 className="text-lg font-semibold">SEO Settings</h3>

              <Input
                label="Site Title *"
                placeholder="Your Name | Developer Portfolio"
                error={errors.siteTitle?.message}
                {...register("siteTitle")}
              />

              <Textarea
                label="Site Description *"
                placeholder="A brief description for search engines..."
                rows={3}
                error={errors.siteDescription?.message}
                {...register("siteDescription")}
              />

              <Controller
                name="ogImage"
                control={control}
                render={({ field }) => (
                  <ImageUploader
                    value={field.value}
                    onChange={field.onChange}
                    folder="seo"
                    label="OG Image (Social sharing)"
                  />
                )}
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="ghost"
                type="button"
                onClick={() => fetchSettings()}
                leftIcon={<RefreshCw className="w-4 h-4" />}
              >
                Reset
              </Button>
              <Button
                type="submit"
                isLoading={saving}
                leftIcon={<Save className="w-4 h-4" />}
                disabled={!isDirty}
              >
                Save All Settings
              </Button>
            </div>
          </form>

          <DragResizeHandle
            ariaLabel="Resize preview panel"
            className="hidden xl:flex self-stretch"
            onResize={(deltaX) =>
              setPreviewWidth((current) =>
                Math.min(
                  SETTINGS_MAX_PREVIEW_WIDTH,
                  Math.max(SETTINGS_MIN_PREVIEW_WIDTH, current - deltaX)
                )
              )
            }
          />

          <div className="xl:pl-6">
            <SettingsLivePreview values={previewValues} isDirty={isDirty} />
          </div>
        </div>
      </div>
    </>
  );
}
