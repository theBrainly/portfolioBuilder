import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export type SessionUserContext = {
  id: string;
  role: string;
  name: string;
  email: string;
  portfolioSlug: string;
};

export async function getSessionUser(): Promise<SessionUserContext | null> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return null;
  }

  return {
    id: session.user.id,
    role: session.user.role,
    name: session.user.name || "",
    email: session.user.email || "",
    portfolioSlug: session.user.portfolioSlug || "",
  };
}
