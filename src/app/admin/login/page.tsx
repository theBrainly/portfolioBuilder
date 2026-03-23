"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Code2, Eye, EyeOff } from "lucide-react";
import { loginSchema, LoginFormData } from "@/lib/validations";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      const res = await signIn("credentials", { email: data.email, password: data.password, redirect: false });
      if (res?.error) { toast.error("Invalid email or password"); return; }
      toast.success("Welcome back!"); router.push("/admin/dashboard"); router.refresh();
    } catch { toast.error("Something went wrong"); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      </div>
      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/20"><Code2 className="w-8 h-8 text-white" /></div>
          <h1 className="text-2xl font-bold text-text-primary">Admin Panel</h1>
          <p className="text-text-muted mt-2">Sign in to manage your portfolio</p>
        </div>
        <div className="bg-surface border border-border rounded-2xl p-8 shadow-xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input label="Email" type="email" placeholder="admin@yourdomain.com" error={errors.email?.message} {...register("email")} />
            <div className="relative">
              <Input label="Password" type={showPw ? "text" : "password"} placeholder="Enter your password" error={errors.password?.message} {...register("password")} />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-[38px] text-text-muted hover:text-text-primary transition-colors">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <Button type="submit" className="w-full" size="lg" isLoading={loading}>Sign In</Button>
          </form>
        </div>
        <p className="text-center text-sm text-text-muted mt-6">First time? <a href="/api/seed" className="text-primary hover:text-primary-light transition-colors">Run seed to create admin</a></p>
      </div>
    </div>
  );
}
