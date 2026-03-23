"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Wrench } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AdminHeader from "@/components/admin/AdminHeader";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Switch from "@/components/ui/Switch";
import Modal from "@/components/ui/Modal";
import DeleteDialog from "@/components/ui/DeleteDialog";
import Spinner from "@/components/ui/Spinner";
import { useAdminMenu } from "@/hooks/useAdminMenu";
import { skillSchema, SkillFormData } from "@/lib/validations";
import { SKILL_CATEGORIES, TECH_ICON_MAP } from "@/constants";
import toast from "react-hot-toast";
import type { ISkill } from "@/types";

export default function AdminSkillsPage() {
  const { onMenuClick } = useAdminMenu();
  const [skills, setSkills] = useState<ISkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [filterCategory, setFilterCategory] = useState("All");

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<SkillFormData>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      name: "",
      icon: "",
      category: "Frontend",
      proficiency: 80,
      order: 0,
      isVisible: true,
    },
  });

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const res = await fetch("/api/admin/skills");
      const data = await res.json();
      if (data.success) setSkills(data.data);
    } catch (error) {
      toast.error("Failed to fetch skills");
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingId(null);
    reset({
      name: "",
      icon: "",
      category: "Frontend",
      proficiency: 80,
      order: 0,
      isVisible: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (skill: ISkill) => {
    setEditingId(skill._id);
    reset({
      name: skill.name,
      icon: skill.icon || "",
      category: skill.category as any,
      proficiency: skill.proficiency,
      order: skill.order,
      isVisible: skill.isVisible,
    });
    setModalOpen(true);
  };

  const onSubmit = async (data: SkillFormData) => {
    setIsSubmitting(true);
    try {
      const url = editingId
        ? `/api/admin/skills/${editingId}`
        : "/api/admin/skills";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error);

      toast.success(editingId ? "Skill updated!" : "Skill added!");
      setModalOpen(false);
      fetchSkills();
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
      const res = await fetch(`/api/admin/skills/${deleteId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setSkills(skills.filter((s) => s._id !== deleteId));
        toast.success("Skill deleted!");
      }
    } catch (error) {
      toast.error("Failed to delete");
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const filteredSkills =
    filterCategory === "All"
      ? skills
      : skills.filter((s) => s.category === filterCategory);

  // Group by category for display
  const groupedSkills = filteredSkills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, ISkill[]>);

  return (
    <>
      <AdminHeader
        title="Skills"
        subtitle={`${skills.length} skills`}
        onMenuClick={onMenuClick}
        actions={
          <Button
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={openCreateModal}
          >
            Add Skill
          </Button>
        }
      />

      <div className="p-4 md:p-6 space-y-4">
        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {["All", ...SKILL_CATEGORIES.map((c) => c.value)].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                filterCategory === cat
                  ? "bg-primary text-white"
                  : "bg-surface-2 text-text-secondary hover:text-text-primary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : Object.keys(groupedSkills).length === 0 ? (
          <div className="text-center py-20">
            <Wrench className="w-12 h-12 text-text-muted mx-auto mb-4" />
            <p className="text-text-muted text-lg mb-4">No skills added</p>
            <Button
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={openCreateModal}
            >
              Add Your First Skill
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedSkills).map(([category, categorySkills]) => (
              <div key={category}>
                <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">
                  {category}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {categorySkills.map((skill) => (
                    <div
                      key={skill._id}
                      className="bg-surface border border-border rounded-xl p-4 hover:border-primary/20 transition-colors group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">
                            {TECH_ICON_MAP[skill.name] || skill.icon || "🔧"}
                          </span>
                          <div>
                            <p className="font-medium text-sm">{skill.name}</p>
                            <p className="text-xs text-text-muted">
                              {skill.proficiency}%
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openEditModal(skill)}
                            className="p-1.5 text-text-muted hover:text-primary rounded transition-colors"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteId(skill._id)}
                            className="p-1.5 text-text-muted hover:text-red-400 rounded transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-3 h-1.5 bg-surface-2 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
                          style={{ width: `${skill.proficiency}%` }}
                        />
                      </div>

                      {!skill.isVisible && (
                        <Badge variant="warning" size="sm" className="mt-2">
                          Hidden
                        </Badge>
                      )}
                    </div>
                  ))}
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
        title={editingId ? "Edit Skill" : "Add Skill"}
        size="md"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            label="Skill Name *"
            placeholder="React.js"
            error={errors.name?.message}
            {...register("name")}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Icon (emoji)"
              placeholder="⚛️"
              {...register("icon")}
            />
            <Select
              label="Category *"
              options={SKILL_CATEGORIES}
              error={errors.category?.message}
              {...register("category")}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">
              Proficiency ({watch("proficiency") || 80}%)
            </label>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              className="w-full accent-primary"
              {...register("proficiency", { valueAsNumber: true })}
            />
            <div className="flex justify-between text-xs text-text-muted mt-1">
              <span>Beginner</span>
              <span>Expert</span>
            </div>
          </div>

          <Input
            label="Display Order"
            type="number"
            {...register("order", { valueAsNumber: true })}
          />

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
              {editingId ? "Save Changes" : "Add Skill"}
            </Button>
          </div>
        </form>
      </Modal>

      <DeleteDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Skill"
        isLoading={deleting}
      />
    </>
  );
}
