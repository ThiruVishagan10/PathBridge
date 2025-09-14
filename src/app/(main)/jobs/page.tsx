import { getJobAssignments } from "@/actions/jobAssignment.action";
import JobsPageClient from "./JobsPageClient";

export const dynamic = 'force-dynamic';

export default async function JobsPage() {
  const assignments = await getJobAssignments();

  return <JobsPageClient assignments={assignments} />;
}