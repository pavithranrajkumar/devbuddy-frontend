import { useAuth } from "@/contexts/AuthContext";
import { FreelancerDashboard } from "./FreelancerDashboard";
import { ProjectListView } from "@/components/projects/shared/ProjectListView";

export function DashboardPage() {
  const { user } = useAuth();

  return user?.userType === "client" ? (
    <ProjectListView />
  ) : (
    <FreelancerDashboard />
  );
}
