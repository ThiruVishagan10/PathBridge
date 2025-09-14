import PortfolioForm from "@/components/input";
import { requireStudent } from "@/lib/server-auth";
import { redirect } from "next/navigation";

export default async function GeneratePortfolioPage() {
  try {
    await requireStudent();
  } catch {
    redirect('/sign-in');
  }
  
  return <PortfolioForm />;
}