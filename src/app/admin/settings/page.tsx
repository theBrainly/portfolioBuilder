"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, RefreshCw } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Spinner from "@/components/ui/Spinner";
import ImageUploader from "@/components/ui/ImageUploader";
import { useAdminMenu } from "@/hooks/useAdminMenu";
import { settingsSchema, SettingsFormData } from "@/lib/validations";
import toast from "react-hot-toast";

export default function AdminSettingsPage() {
  const { onMenuClick } = useAdminMenu();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty },
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      if (data.success) {
        reset(data.data);
      }
    } catch (error) {
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

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
      reset(data); // Reset dirty state
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
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
        subtitle="Manage your portfolio content"
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

      <div className="p-4 md:p-6 max-w-4xl space-y-8 pb-20">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Hero Section */}
          <div className="bg-surface border border-border rounded-2xl p-6 space-y-5">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              🚀 Hero Section
            </h3>

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

          {/* About Section */}
          <div className="bg-surface border border-border rounded-2xl p-6 space-y-5">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              👤 About Section
            </h3>

            <Input
              label="About Title"
              placeholder="About Me"
              {...register("aboutTitle")}
            />

            <Textarea
              label="About Description *"
              placeholder="Tell your story... (supports long text)"
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

          {/* Contact Info */}
          <div className="bg-surface border border-border rounded-2xl p-6 space-y-5">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              📬 Contact Information
            </h3>

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

          {/* Social Links */}
          <div className="bg-surface border border-border rounded-2xl p-6 space-y-5">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              🔗 Social Links
            </h3>

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

          {/* Resume */}
          <div className="bg-surface border border-border rounded-2xl p-6 space-y-5">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              📄 Resume
            </h3>

            <Input
              label="Resume URL"
              placeholder="https://drive.google.com/... or Cloudinary URL"
              helperText="Upload your resume to Google Drive or Cloudinary and paste the URL"
              {...register("resumeUrl")}
            />
          </div>

          {/* SEO */}
          <div className="bg-surface border border-border rounded-2xl p-6 space-y-5">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              🔍 SEO Settings
            </h3>

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

          {/* Submit */}
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
      </div>
    </>
  );
}
