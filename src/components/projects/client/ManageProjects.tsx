import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { useToast } from "@/hooks/use-toast";
import { Project, ProjectFiltersInterface } from "@/types/project";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProjectSearchFilters } from "../shared/ProjectSearchFilters";
import { projectApi } from "@/services/api/project";
import { formatCurrency, formatDate } from "@/lib/utils";
import { CustomPagination } from "@/components/ui/custom-pagination";

export function ManageProjects() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<ProjectFiltersInterface>({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ITEMS_PER_PAGE = 9;
  const [totalItems, setTotalItems] = useState(0);

  const loadProjects = async () => {
    try {
      setIsLoading(true);
      const response = await projectApi.getProjects({
        page,
        limit: ITEMS_PER_PAGE,
        search: searchQuery,
        ...filters,
      });
      setProjects(response.projects);
      console.log(response);
      setTotalPages(response.totalPages);
      setTotalItems(response.total);
    } catch (error) {
      console.error("Error loading projects:", error);
      toast({
        title: "Error",
        description: "Failed to load projects. Please try again.",
        variant: "destructive",
      });
      // Set empty state on error
      setProjects([]);
      setTotalPages(1);
      setTotalItems(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, [searchQuery, filters, page]);

  const handleFilterChange = (newFilters: ProjectFiltersInterface) => {
    console.log("New filters:", newFilters); // Debug log
    setFilters(newFilters);
    setPage(1);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  const handleView = (id: number) => navigate(`/projects/${id}`);
  const handleCreate = () => navigate("/projects/create");

  const getStatusVariant = (
    status: string
  ): "default" | "destructive" | "secondary" | "outline" => {
    switch (status) {
      case "published":
        return "default";
      case "in_progress":
        return "secondary";
      case "completed":
        return "secondary";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  const clearAllFilters = () => {
    setFilters({});
    setSearchQuery("");
    setPage(1);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">My Projects</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track your projects
          </p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Icons.plus className="h-4 w-4" />
          Create Project
        </Button>
      </div>

      <ProjectSearchFilters
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        initialFilters={filters}
      />

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Icons.spinner className="h-8 w-8 animate-spin" />
        </div>
      ) : projects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Icons.search className="h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold">No matching projects</h3>
            <p className="text-muted-foreground mt-2 text-center max-w-md">
              {Object.keys(filters).length > 0
                ? "Try adjusting your filters or search terms to find more projects."
                : "No projects found. Create your first project to get started."}
            </p>
            {Object.keys(filters).length > 0 && (
              <Button
                onClick={clearAllFilters}
                variant="outline"
                className="mt-4"
              >
                Clear all filters
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Card key={project.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="flex justify-between items-start gap-2">
                    <span className="truncate">{project.title}</span>
                    <Badge variant={getStatusVariant(project.status)}>
                      {project.status.replace("_", " ")}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Budget: {formatCurrency(project.budgetMin)} -{" "}
                    {formatCurrency(project.budgetMax)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {project.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Icons.users className="h-4 w-4" />
                      <span>{project.applicantsCount} applicants</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Icons.calendar className="h-4 w-4" />
                      <span>Due {formatDate(project.deadline)}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button size="sm" onClick={() => handleView(project.id)}>
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {totalItems > ITEMS_PER_PAGE && (
            <div className="flex flex-col items-center gap-2">
              <CustomPagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
                siblingsCount={1}
              />
              <p className="text-sm text-muted-foreground">
                Showing {projects.length} of {totalItems} projects
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
