"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Briefcase,
  Calendar,
  Eye,
  EyeOff,
} from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AdminHeader from "@/components/admin/AdminHeader";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import Switch from "@/components/ui/Switch";
import Modal from "@/components/ui/Modal";
import DeleteDialog from "@/components/ui/DeleteDialog";
import Spinner from "@/components/ui/Spinner";
import TagInput from "@/components/admin/TagInput";
import { useAdminMenu } from "@/hooks/useAdminMenu";
import { experienceSchema, ExperienceFormData } from "@/lib/validations";
import { EXPERIENCE_TYPES } from "@/constants";
import { formatDate } from "@/lib/utils";
import toast from "react-hot-toast";
import type { IExperience } from "@/types";

export default function AdminExperiencePage() {
  const { onMenuClick } = useAdminMenu();
  const [experiences, setExperiences] = useState<IExperience[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<ExperienceFormData>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      company: "",
      position: "",
      type: "Full Time",
      startDate: "",
      endDate: "",
      isCurrent: false,
      description: "",
      responsibilities: [],
      techUsed: [],
      companyLogo: "",
      companyUrl: "",
      order: 0,
      isVisible: true,
    },
  });

  const isCurrent = watch("isCurrent");

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const res = await fetch("/api/admin/experience");
      const data = await res.json();
      if (data.success) setExperiences(data.data);
    } catch (error) {
      toast.error("Failed to fetch experiences");
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingId(null);
    reset({
      company: "",
      position: "",
      type: "Full Time",
      startDate: "",
      endDate: "",
      isCurrent: false,
      description: "",
      responsibilities: [],
      techUsed: [],
      companyLogo: "",
      companyUrl: "",
      order: 0,
      isVisible: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (exp: IExperience) => {
    setEditingId(exp._id);
    reset({
      company: exp.company,
      position: exp.position,
      type: exp.type as any,
      startDate: new Date(exp.startDate).toISOString().split("T")[0],
      endDate: exp.endDate
        ? new Date(exp.endDate).toISOString().split("T")[0]
        : "",
      isCurrent: exp.isCurrent,
      description: exp.description,
      responsibilities: exp.responsibilities || [],
      techUsed: exp.techUsed || [],
      companyLogo: exp.companyLogo || "",
      companyUrl: exp.companyUrl || "",
      order: exp.order,
      isVisible: exp.isVisible,
    });
    setModalOpen(true);
  };

  const onSubmit = async (data: ExperienceFormData) => {
    setIsSubmitting(true);
    try {
      const url = editingId
        ? `/api/admin/experience/${editingId}`
        : "/api/admin/experience";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error);

      toast.success(editingId ? "Experience updated!" : "Experience added!");
      setModalOpen(false);
      fetchExperiences();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/experience/${deleteId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setExperiences(experiences.filter((e) => e._id !== deleteId));
        toast.success("Experience deleted!");
      }
    } catch (error) {
      toast.error("Failed to delete");
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  return (
    <>
      <AdminHeader
        title="Experience"
        subtitle={`${experiences.length} entries`}
        onMenuClick={onMenuClick}
        actions={
          <Button
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={openCreateModal}
          >
            Add Experience
          </Button>
        }
      />

      <div className="p-4 md:p-6">
        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : experiences.length === 0 ? (
          <div className="text-center py-20">
            <Briefcase className="w-12 h-12 text-text-muted mx-auto mb-4" />
            <p className="text-text-muted text-lg mb-4">No experience added</p>
            <Button
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={openCreateModal}
            >
              Add Your First Experience
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {experiences.map((exp) => (
              <div
                key={exp._id}
                className="bg-surface border border-border rounded-2xl p-5 hover:border-primary/20 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="font-semibold text-lg">{exp.position}</h3>
                      <Badge
                        variant={exp.isVisible ? "success" : "warning"}
                        size="sm"
                      >
                        {exp.isVisible ? "Visible" : "Hidden"}
                      </Badge>
                      {exp.isCurrent && (
                        <Badge variant="primary" size="sm">
                          Current
                        </Badge>
                      )}
                    </div>

                    <p className="text-text-secondary mt-1">{exp.company}</p>

                    <div className="flex items-center gap-4 mt-2 text-sm text-text-muted">
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-3.5 h-3.5" />
                        {exp.type}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(exp.startDate)} –{" "}
                        {exp.isCurrent
                          ? "Present"
                          : exp.endDate
                          ? formatDate(exp.endDate)
                          : "N/A"}
                      </span>
                    </div>

                    <p className="text-sm text-text-secondary mt-3 line-clamp-2">
                      {exp.description}
                    </p>

                    {exp.techUsed && exp.techUsed.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {exp.techUsed.map((tech) => (
                          <Badge key={tech} variant="primary" size="sm">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => openEditModal(exp)}
                      className="p-2 text-text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteId(exp._id)}
                      className="p-2 text-text-muted hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Edit Experience" : "Add Experience"}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Company *"
              placeholder="Tech Corp Inc."
              error={errors.company?.message}
              {...register("company")}
            />
            <Input
              label="Position *"
              placeholder="Senior Developer"
              error={errors.position?.message}
              {...register("position")}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="Type *"
              options={EXPERIENCE_TYPES}
              error={errors.type?.message}
              {...register("type")}
            />
            <Input
              label="Start Date *"
              type="date"
              error={errors.startDate?.message}
              {...register("startDate")}
            />
            <Input
              label="End Date"
              type="date"
              disabled={isCurrent}
              {...register("endDate")}
            />
          </div>

          <Controller
            name="isCurrent"
            control={control}
            render={({ field }) => (
              <Switch
                checked={field.value}
                onChange={field.onChange}
                label="I currently work here"
              />
            )}
          />

          <Textarea
            label="Description *"
            placeholder="Describe your role and achievements..."
            rows={4}
            error={errors.description?.message}
            {...register("description")}
          />

          <Controller
            name="responsibilities"
            control={control}
            render={({ field }) => (
              <TagInput
                value={field.value}
                onChange={field.onChange}
                label="Key Responsibilities"
                placeholder="Type responsibility and press Enter"
              />
            )}
          />

          <Controller
            name="techUsed"
            control={control}
            render={({ field }) => (
              <TagInput
                value={field.value}
                onChange={field.onChange}
                label="Technologies Used"
                placeholder="Type technology and press Enter"
              />
            )}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Company URL"
              placeholder="https://company.com"
              {...register("companyUrl")}
            />
            <Input
              label="Display Order"
              type="number"
              {...register("order", { valueAsNumber: true })}
            />
          </div>

          <Controller
            name="isVisible"
            control={control}
            render={({ field }) => (
              <Switch
                checked={field.value}
                onChange={field.onChange}
                label="Visible on portfolio"
              />
            )}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button
              variant="ghost"
              type="button"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {editingId ? "Save Changes" : "Add Experience"}
            </Button>
          </div>
        </form>
      </Modal>

      <DeleteDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Experience"
        isLoading={deleting}
      />
    </>
  );
}
