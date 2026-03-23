"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  MessageSquareQuote,
  Star,
  Quote,
} from "lucide-react";
import Image from "next/image";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AdminHeader from "@/components/admin/AdminHeader";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Switch from "@/components/ui/Switch";
import Modal from "@/components/ui/Modal";
import DeleteDialog from "@/components/ui/DeleteDialog";
import Spinner from "@/components/ui/Spinner";
import ImageUploader from "@/components/ui/ImageUploader";
import { useAdminMenu } from "@/hooks/useAdminMenu";
import { testimonialSchema, TestimonialFormData } from "@/lib/validations";
import { getInitials } from "@/lib/utils";
import toast from "react-hot-toast";
import type { ITestimonial } from "@/types";

export default function AdminTestimonialsPage() {
  const { onMenuClick } = useAdminMenu();
  const [testimonials, setTestimonials] = useState<ITestimonial[]>([]);
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
  } = useForm<TestimonialFormData>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      clientName: "",
      clientPosition: "",
      clientImage: "",
      content: "",
      rating: 5,
      isVisible: true,
      order: 0,
    },
  });

  const ratingValue = watch("rating");

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const res = await fetch("/api/admin/testimonials");
      const data = await res.json();
      if (data.success) setTestimonials(data.data);
    } catch (error) {
      toast.error("Failed to fetch testimonials");
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingId(null);
    reset({
      clientName: "",
      clientPosition: "",
      clientImage: "",
      content: "",
      rating: 5,
      isVisible: true,
      order: 0,
    });
    setModalOpen(true);
  };

  const openEditModal = (t: ITestimonial) => {
    setEditingId(t._id);
    reset({
      clientName: t.clientName,
      clientPosition: t.clientPosition,
      clientImage: t.clientImage || "",
      content: t.content,
      rating: t.rating,
      isVisible: t.isVisible,
      order: t.order,
    });
    setModalOpen(true);
  };

  const onSubmit = async (data: TestimonialFormData) => {
    setIsSubmitting(true);
    try {
      const url = editingId
        ? `/api/admin/testimonials/${editingId}`
        : "/api/admin/testimonials";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error);

      toast.success(
        editingId ? "Testimonial updated!" : "Testimonial added!"
      );
      setModalOpen(false);
      fetchTestimonials();
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
      const res = await fetch(`/api/admin/testimonials/${deleteId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setTestimonials(testimonials.filter((t) => t._id !== deleteId));
        toast.success("Testimonial deleted!");
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
        title="Testimonials"
        subtitle={`${testimonials.length} reviews`}
        onMenuClick={onMenuClick}
        actions={
          <Button
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={openCreateModal}
          >
            Add Testimonial
          </Button>
        }
      />

      <div className="p-4 md:p-6">
        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : testimonials.length === 0 ? (
          <div className="text-center py-20">
            <MessageSquareQuote className="w-12 h-12 text-text-muted mx-auto mb-4" />
            <p className="text-text-muted text-lg mb-4">
              No testimonials yet
            </p>
            <Button
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={openCreateModal}
            >
              Add First Testimonial
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {testimonials.map((t) => (
              <div
                key={t._id}
                className="bg-surface border border-border rounded-2xl p-6 hover:border-primary/20 transition-colors group relative"
              >
                <Quote className="absolute top-4 right-4 w-8 h-8 text-primary/10" />

                {/* Actions */}
                <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEditModal(t)}
                    className="p-1.5 text-text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteId(t._id)}
                    className="p-1.5 text-text-muted hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Stars */}
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < t.rating
                          ? "text-amber-400 fill-amber-400"
                          : "text-border"
                      }`}
                    />
                  ))}
                </div>

                {/* Content */}
                <p className="text-text-secondary text-sm leading-relaxed mb-4 line-clamp-4">
                  &ldquo;{t.content}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  {t.clientImage ? (
                    <Image
                      src={t.clientImage}
                      alt={t.clientName}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-bold">
                      {getInitials(t.clientName)}
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-sm">{t.clientName}</p>
                    <p className="text-xs text-text-muted">
                      {t.clientPosition}
                    </p>
                  </div>
                </div>

                {!t.isVisible && (
                  <Badge variant="warning" size="sm" className="mt-3">
                    Hidden
                  </Badge>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Edit Testimonial" : "Add Testimonial"}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Client Name *"
              placeholder="Jane Smith"
              error={errors.clientName?.message}
              {...register("clientName")}
            />
            <Input
              label="Position *"
              placeholder="CEO at StartupX"
              error={errors.clientPosition?.message}
              {...register("clientPosition")}
            />
          </div>

          <Controller
            name="clientImage"
            control={control}
            render={({ field }) => (
              <ImageUploader
                value={field.value}
                onChange={field.onChange}
                folder="testimonials"
                label="Client Photo (optional)"
              />
            )}
          />

          <Textarea
            label="Testimonial Content *"
            placeholder="What the client said about your work..."
            rows={4}
            error={errors.content?.message}
            {...register("content")}
          />

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Rating
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Controller
                  key={star}
                  name="rating"
                  control={control}
                  render={({ field }) => (
                    <button
                      type="button"
                      onClick={() => field.onChange(star)}
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= (ratingValue || 0)
                            ? "text-amber-400 fill-amber-400"
                            : "text-border"
                        }`}
                      />
                    </button>
                  )}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
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
              {editingId ? "Save Changes" : "Add Testimonial"}
            </Button>
          </div>
        </form>
      </Modal>

      <DeleteDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Testimonial"
        isLoading={deleting}
      />
    </>
  );
}
