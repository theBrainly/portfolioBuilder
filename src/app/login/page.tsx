import { redirect } from "next/navigation";
import LoginPageClient from "@/components/auth/LoginPageClient";
import { getSessionUser } from "@/lib/session";

export default async function LoginPage() {
  const user = await getSessionUser();
  if (user) {
    redirect("/admin/dashboard");
  }

  return <LoginPageClient />;
}
