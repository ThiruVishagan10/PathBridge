import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import ReferPageClient from "./ReferPageClient";

export default async function ReferPage() {
  const user = await getCurrentUser();
  
  if (!user || user.role !== "ALUMNI") {
    redirect("/");
  }

  return <ReferPageClient />;
}