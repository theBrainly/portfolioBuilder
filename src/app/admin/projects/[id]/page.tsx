"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import AdminHeader from "@/components/admin/AdminHeader";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import Switch from "@/components/ui/Switch";
import Spinner from "@/components/ui/Spinner";
import ImageUploader from "@/components/ui/ImageUploader";
import TagInput from "@/components/admin/TagInput";
import MultiImageUploader from "@/components/admin/MultiImageUploader";
import { useAdminMenu } from "@/hooks/useAdminMenu";
import { projectSchema, ProjectFormData } from "@/lib/validations";
import { PROJECT_CATEGORIES, TECH_SUGGESTIONS } from "@/constants";
import toast from "react-hot-toast";

export default function EditProjectPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { onMenuClick } = useAdminMenu();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<ProjectFormData>({ resolver: zodResolver(projectSchema) });

  useEffect(() => {
    fetch(`/api/admin/projects/${params.id}`).then((r) => r.json()).then((d) => {
      if (d.success) {
        const p = d.data;
        reset({ title: p.title, shortDescription: p.shortDescription, longDescription: p.longDescription || "", thumbnail: p.thumbnail || "", images: p.images || [], techStack: p.techStack || [],
          category: p.category, liveUrl: p.liveUrl || "", githubUrl: p.githubUrl || "", clientName: p.clientName || "",
          completionDate: p.completionDate ? new Date(p.completionDate).toISOString().split("T")[0] : "", isFeatured: p.isFeatured, isVisible: p.isVisible, order: p.order });
      } else { toast.error("Not found"); router.push("/admin/projects"); }
    }).finally(() => setLoading(false));
  }, [params.id, reset, router]);

  const onSubmit = async (data: ProjectFormData) => {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/projects/${params.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      toast.success("Updated!"); router.push("/admin/projects");
    } catch (e: any) { toast.error(e.message); } finally { setSubmitting(false); }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen"><Spinner size="lg" /></div>;

  return (
    <>
      <AdminHeader title="Edit Project" onMenuClick={onMenuClick}
        actions={<Link href="/admin/projects"><Button variant="ghost" leftIcon={<ArrowLeft className="w-4 h-4" />}>Back</Button></Link>} />
      <div className="p-4 md:p-6 max-w-4xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="bg-surface border border-border rounded-2xl p-6 space-y-5">
            <h3 className="text-lg font-semibold text-text-primary">Basic Information</h3>
            <Input label="Title *" error={errors.title?.message} {...register("title")} />
            <Textarea label="Short Description *" rows={3} error={errors.shortDescription?.message} {...register("shortDescription")} />
            <Textarea label="Full Description" rows={8} {...register("longDescription")} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Select label="Category *" options={PROJECT_CATEGORIES} {...register("category")} />
              <Input label="Client Name" {...register("clientName")} />
            </div>
            <Input label="Completion Date" type="date" {...register("completionDate")} />
          </div>
          <div className="bg-surface border border-border rounded-2xl p-6 space-y-5">
            <h3 className="text-lg font-semibold text-text-primary">Tech Stack</h3>
            <Controller name="techStack" control={control} render={({ field }) => <TagInput value={field.value} onChange={field.onChange} label="Technologies *" error={errors.techStack?.message} suggestions={TECH_SUGGESTIONS} />} />
          </div>
          <div className="bg-surface border border-border rounded-2xl p-6 space-y-5">
            <h3 className="text-lg font-semibold text-text-primary">Images</h3>
            <Controller name="thumbnail" control={control} render={({ field }) => <ImageUploader value={field.value} onChange={field.onChange} folder="projects" label="Thumbnail" />} />
            <Controller name="images" control={control} render={({ field }) => <MultiImageUploader value={field.value} onChange={field.onChange} folder="projects" label="Gallery" />} />
          </div>
          <div className="bg-surface border border-border rounded-2xl p-6 space-y-5">
            <h3 className="text-lg font-semibold text-text-primary">Links</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input label="Live URL" {...register("liveUrl")} />
              <Input label="GitHub URL" {...register("githubUrl")} />
            </div>
          </div>
          <div className="bg-surface border border-border rounded-2xl p-6 space-y-5">
            <h3 className="text-lg font-semibold text-text-primary">Settings</h3>
            <Input label="Order" type="number" {...register("order", { valueAsNumber: true })} />
            <div className="flex flex-wrap gap-8 pt-2">
              <Controller name="isVisible" control={control} render={({ field }) => <Switch checked={field.value} onChange={field.onChange} label="Published" />} />
              <Controller name="isFeatured" control={control} render={({ field }) => <Switch checked={field.value} onChange={field.onChange} label="Featured" />} />
            </div>
          </div>
          <div className="flex justify-end gap-3 pb-8">
            <Link href="/admin/projects"><Button variant="ghost" type="button">Cancel</Button></Link>
            <Button type="submit" isLoading={submitting} leftIcon={<Save className="w-4 h-4" />}>Save Changes</Button>
          </div>
        </form>
      </div>
    </>
  );
}
