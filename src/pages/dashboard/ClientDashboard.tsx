import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { Icons } from "@/components/ui/icons";
import { User } from "@/contexts/auth/types";

interface ClientDashboardProps {
  user: User;
}

export function ClientDashboard({ user }: ClientDashboardProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user.name}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Active Projects"
          value="4"
          subtext="+2 from last month"
          icon={Icons.folder}
        />
        <DashboardCard
          title="Total Spent"
          value="$12,234"
          subtext="+19% from last month"
          icon={Icons.dollarSign}
        />
        <DashboardCard
          title="Active Developers"
          value="6"
          subtext="+2 from last month"
          icon={Icons.users}
        />
      </div>
    </div>
  );
}
