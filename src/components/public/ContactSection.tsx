"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send, Mail, Phone, MapPin, Github, Linkedin, Twitter, CheckCircle2 } from "lucide-react";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import MotionWrapper from "@/components/animations/MotionWrapper";
import SectionHeader from "./SectionHeader";
import { contactSchema, ContactFormData } from "@/lib/validations";
import toast from "react-hot-toast";
import type { ISiteSettings } from "@/types";
import { motion } from "framer-motion";

export default function ContactSection({ settings }: { settings: ISiteSettings | null }) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormData>({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (data: ContactFormData) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      setSubmitted(true); reset(); toast.success("Message sent!");
      setTimeout(() => setSubmitted(false), 5000);
    } catch (e: any) { toast.error(e.message || "Failed to send"); } finally { setSubmitting(false); }
  };

  const socials = [
    { icon: Github, url: settings?.github, label: "GitHub" },
    { icon: Linkedin, url: settings?.linkedin, label: "LinkedIn" },
    { icon: Twitter, url: settings?.twitter, label: "Twitter" },
  ].filter((s) => s.url);

  const info = [
    { icon: Mail, value: settings?.email, label: "Email", href: `mailto:${settings?.email}` },
    { icon: Phone, value: settings?.phone, label: "Phone", href: `tel:${settings?.phone}` },
    { icon: MapPin, value: settings?.location, label: "Location" },
  ].filter((c) => c.value);

  return (
    <section id="contact" className="section-padding">
      <div className="section-container">
        <SectionHeader label="// contact" title="Get In Touch" description="Have a project in mind? I'd love to hear from you!" />
        <div className="grid lg:grid-cols-5 gap-12 max-w-5xl mx-auto">
          <MotionWrapper direction="left" className="lg:col-span-2">
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold mb-4 text-text-primary">Let&apos;s work <span className="gradient-text">together!</span></h3>
                <p className="text-text-secondary leading-relaxed">I&apos;m always open to new opportunities. Feel free to reach out.</p>
              </div>
              <div className="space-y-4">
                {info.map((item) => (
                  <div key={item.label} className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center flex-shrink-0"><item.icon className="w-5 h-5" /></div>
                    <div><p className="text-xs text-text-muted uppercase tracking-wider">{item.label}</p>
                      {item.href ? <a href={item.href} className="text-text-primary hover:text-primary transition-colors font-medium">{item.value}</a>
                        : <p className="text-text-primary font-medium">{item.value}</p>}</div>
                  </div>
                ))}
              </div>
              {socials.length > 0 && (
                <div><p className="text-sm text-text-muted mb-3">Find me on</p>
                  <div className="flex gap-2">
                    {socials.map((s) => <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer"
                      className="p-3 bg-surface border border-border rounded-xl text-text-secondary hover:text-primary hover:border-primary/30 transition-all"><s.icon className="w-5 h-5" /></a>)}
                  </div>
                </div>
              )}
            </div>
          </MotionWrapper>
          <MotionWrapper direction="right" className="lg:col-span-3">
            <div className="bg-surface border border-border rounded-3xl p-6 md:p-8">
              {submitted ? (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                  <CheckCircle2 className="w-16 h-16 text-secondary mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-text-primary mb-2">Message Sent!</h3>
                  <p className="text-text-secondary">Thank you! I&apos;ll get back to you soon.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Input label="Name" placeholder="Your name" error={errors.name?.message} {...register("name")} />
                    <Input label="Email" type="email" placeholder="you@email.com" error={errors.email?.message} {...register("email")} />
                  </div>
                  <Input label="Subject" placeholder="What's this about?" error={errors.subject?.message} {...register("subject")} />
                  <Textarea label="Message" placeholder="Tell me about your project..." rows={5} error={errors.message?.message} {...register("message")} />
                  <Button type="submit" size="lg" className="w-full" isLoading={submitting} rightIcon={<Send className="w-4 h-4" />}>Send Message</Button>
                </form>
              )}
            </div>
          </MotionWrapper>
        </div>
      </div>
    </section>
  );
}
