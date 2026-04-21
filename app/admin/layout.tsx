import { redirect } from "next/navigation";
import { fetchAuthQuery } from "@/lib/auth-server";
import { api } from "@/convex/_generated/api";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const access = await fetchAuthQuery(api.profiles.getAccess, {});
  if (!access.canAccessAdmin) {
    redirect("/login?next=%2Fadmin");
  }
  return <>{children}</>;
}
