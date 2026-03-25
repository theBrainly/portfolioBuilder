"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import AuthShell from "@/components/auth/AuthShell";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { signupSchema, type SignupFormData } from "@/lib/validations";
import toast from "react-hot-toast";

export default function SignupPageClient() {
  const router = useRouter();
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      portfolioSlug: "",
    },
  });

  const slugPreview = watch("portfolioSlug");

  const onSubmit = async (data: SignupFormData) => {
    setLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to create account");
      }

      const login = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (login?.error) {
        toast.success("Account created. Please log in.");
        router.push("/login");
        return;
      }

      toast.success("Account created!");
      router.push("/admin/dashboard");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Create account"
      description="Start your own workspace and publish your portfolio on a personal slug."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="text-amber-200 transition-colors hover:text-amber-100">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="Full Name"
          placeholder="Akash Sharma"
          error={errors.name?.message}
          {...register("name")}
        />

        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email")}
        />

        <div>
          <Input
            label="Portfolio Slug"
            placeholder="akash-sharma"
            helperText={
              slugPreview
                ? `Your portfolio will publish at http://localhost:3000/${slugPreview}`
                : "Choose the unique path people will use to open your portfolio."
            }
            error={errors.portfolioSlug?.message}
            {...register("portfolioSlug")}
          />
        </div>

        <div className="relative">
          <Input
            label="Password"
            type={showPw ? "text" : "password"}
            placeholder="Create a password"
            error={errors.password?.message}
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPw((current) => !current)}
            className="absolute right-3 top-[38px] text-text-muted transition-colors hover:text-text-primary"
          >
            {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        <Button type="submit" className="w-full" size="lg" isLoading={loading}>
          Create Account
        </Button>
      </form>
    </AuthShell>
  );
}
