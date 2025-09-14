import { requireStudent } from "@/lib/server-auth";
import { redirect } from "next/navigation";
import TemplateSelector from "@/components/TemplateSelector";

export default async function PortfolioTemplatesPage() {
  try {
    await requireStudent();
  } catch {
    redirect('/sign-in');
  }
  
  return <TemplateSelector />;
}