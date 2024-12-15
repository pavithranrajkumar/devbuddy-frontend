import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { projectApi } from "@/services/api/project";
import { Project, ProjectApplication } from "@/types/project";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { useAuth } from "@/contexts/AuthContext";
import { ApplicationList } from "../client/ApplicationList";
import { formatCurrency, formatDate } from "@/lib/utils";
import { applicationApi } from "@/services/api/application";
import { Badge } from "@/components/ui/badge";

export function ProjectDetails() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [project, setProject] = useState<Project | null>(null);
  const [application, setApplication] = useState<ProjectApplication | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const isClient = user?.userType === "client";
  const isFreelancer = user?.userType === "freelancer";

  useEffect(() => {
    if (id) {
      loadProjectData(Number(id));
    }
  }, [id]);

  const loadProjectData = async (projectId: number) => {
    try {
      setIsLoading(true);
      console.log("Fetching project for projectId:", projectId);
      const projectData = await projectApi.getProject(projectId);
      setProject(projectData);
      console.log("Project Data:", projectData);
      await loadApplications(projectId);
    } catch (error) {
      console.error("Error loading project:", error);
      toast({
        title: "Error",
        description: "Failed to load project details",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadApplications = async (projectId: number) => {
    try {
      setIsLoading(true);
      const data = await applicationApi.getApplications({ projectId });
      console.log("aply Data:", data);
      setApplication(data.length > 0 ? data[0] : null);
    } catch (error) {
      console.error("Error loading applications:", error);
      toast({
        title: "Error",
        description: "Failed to load applications",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusVariant = (
    status: string
  ): "default" | "secondary" | "destructive" => {
    switch (status) {
      case "published":
        return "default";
      case "in_progress":
      case "completed":
        return "secondary";
      case "cancelled":
        return "destructive";
      default:
        return "default";
    }
  };

  const toTitleCase = (str: string) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const handleApply = () => {
    if (!project) return;

    const formattedBudget = {
      min: project.budgetMin.toString(),
      max: project.budgetMax.toString(),
    };

    console.log("Formatted Budget Range:", formattedBudget);

    navigate(`/projects/${project.id}/apply`, {
      state: {
        from: "details",
        budget: formattedBudget,
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Icons.spinner className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <Icons.alertCircle className="mx-auto h-12 w-12 text-muted-foreground/50" />
        <h3 className="mt-4 text-sm font-semibold text-muted-foreground">
          Project not found
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          The project you're looking for doesn't exist.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex gap-8">
        <div className="shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors sticky top-6"
            onClick={() => navigate("/projects")}
          >
            <Icons.arrowLeft className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 space-y-8">
          <div className="bg-card rounded-lg p-8 shadow-sm border">
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold tracking-tight">
                    {project.title}
                  </h1>
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Icons.calendar className="h-4 w-4" />
                      <span>Posted {formatDate(project.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icons.user className="h-4 w-4" />
                      <span>By {project.title}</span>
                    </div>
                  </div>
                </div>
                <Badge
                  variant={getStatusVariant(project.status)}
                  className="text-sm px-3 py-1"
                >
                  {toTitleCase(project.status.replace("_", " "))}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-6 mt-6">
                <div className="bg-muted/50 rounded-lg p-6 space-y-3 border hover:border-primary/50 transition-colors">
                  <div className="flex items-center gap-2">
                    <Icons.dollarSign className="h-5 w-5 text-muted-foreground" />
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Budget Range
                    </h3>
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-primary">
                      {formatCurrency(project.budgetMin)}
                      <span className="text-muted-foreground mx-2">-</span>
                      {formatCurrency(project.budgetMax)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Fixed price project
                    </p>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-6 space-y-3 border hover:border-primary/50 transition-colors">
                  <div className="flex items-center gap-2">
                    <Icons.calendar className="h-5 w-5 text-muted-foreground" />
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Project Timeline
                    </h3>
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-primary">
                      {formatDate(project.deadline)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(project.deadline) > new Date()
                        ? `${Math.ceil(
                            (new Date(project.deadline).getTime() -
                              new Date().getTime()) /
                              (1000 * 60 * 60 * 24)
                          )} days remaining`
                        : "Deadline passed"}
                    </p>
                  </div>
                </div>
              </div>

              {project.skills && project.skills.length > 0 && (
                <div className="border-t pt-6">
                  <h2 className="text-lg font-semibold mb-3">
                    Required Skills
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {project.skills.map((skill) => (
                      <Badge
                        key={skill.id}
                        variant="secondary"
                        className="px-3 py-1"
                      >
                        {skill.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-card rounded-lg p-8 shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">Project Description</h2>
            <div className="prose prose-gray max-w-none">
              <p className="whitespace-pre-wrap leading-relaxed">
                {project.description}
              </p>
            </div>
          </div>

          {isFreelancer && (
            <div className="bg-card rounded-lg p-8 shadow-sm border">
              {application ? (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Your Application</h2>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Status
                      </h3>
                      <Badge variant="outline" className="text-base">
                        {toTitleCase(application.status.replace("_", " "))}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Proposed Rate
                      </h3>
                      <p className="text-lg font-semibold">
                        {formatCurrency(application.proposedRate)}/hr
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Duration
                      </h3>
                      <p className="text-lg font-semibold">
                        {application.estimatedDuration} days
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <h2 className="text-xl font-semibold mb-2">
                    Interested in this project?
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Submit your proposal and start working!
                  </p>
                  <Button onClick={handleApply} className="px-8">
                    Apply Now
                  </Button>
                </div>
              )}
            </div>
          )}

          {isClient && (
            <div className="bg-card rounded-lg p-8 shadow-sm border">
              <h2 className="text-xl font-semibold mb-6">Applications</h2>
              <ApplicationList projectId={project.id} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
