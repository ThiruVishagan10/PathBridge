import { getJobAssignments } from "@/actions/jobAssignment.action";
import JobsPageClient from "./JobsPageClient";

export default async function JobsPage() {
  const assignments = await getJobAssignments();

  return <JobsPageClient assignments={assignments} />;
}