import { redirect } from "next/navigation";
import SignupPageClient from "@/components/auth/SignupPageClient";
import { getSessionUser } from "@/lib/session";

export default async function SignupPage() {
  const user = await getSessionUser();
  if (user) {
    redirect("/admin/dashboard");
  }

  return <SignupPageClient />;
}
