import { useState, useCallback } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/ui/icons";
import { Separator } from "@/components/ui/separator";
import { ProjectFiltersInterface } from "@/types/project";
import { ProjectFilters } from "./ProjectFilters";
import { formatDate } from "@/lib/utils";

interface ProjectSearchFiltersProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: ProjectFiltersInterface) => void;
  className?: string;
  initialFilters?: ProjectFiltersInterface;
  isLoading?: boolean;
}

export function ProjectSearchFilters({
  onSearch,
  onFilterChange,
  initialFilters,
  isLoading,
}: ProjectSearchFiltersProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<ProjectFiltersInterface>(
    initialFilters ?? {}
  );
  const [quickStatus, setQuickStatus] = useState("all");
  const [quickBudget, setQuickBudget] = useState("all");

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  const handleFilterChange = useCallback(
    (newFilters: ProjectFiltersInterface) => {
      setFilters(newFilters);
      onFilterChange(newFilters);
    },
    [onFilterChange]
  );

  const removeFilter = (key: keyof ProjectFiltersInterface) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    handleFilterChange(newFilters);
  };

  const clearAllFilters = () => {
    setFilters({});
    setQuickStatus("all");
    setQuickBudget("all");
    setSearchQuery("");
    onFilterChange({});
    onSearch("");
  };

  const handleQuickStatusChange = (value: string) => {
    setQuickStatus(value);
    const newFilters = { ...filters };

    if (value !== "all") {
      newFilters.status = value;
    } else {
      delete newFilters.status;
    }

    handleFilterChange(newFilters);
  };

  const handleQuickBudgetChange = (value: string) => {
    setQuickBudget(value);
    const newFilters = { ...filters };

    switch (value) {
      case "0-1000":
        newFilters.budgetMin = 0;
        newFilters.budgetMax = 1000;
        break;
      case "1000-5000":
        newFilters.budgetMin = 1000;
        newFilters.budgetMax = 5000;
        break;
      case "5000+":
        newFilters.budgetMin = 5000;
        delete newFilters.budgetMax;
        break;
      case "all":
        delete newFilters.budgetMin;
        delete newFilters.budgetMax;
        break;
    }

    handleFilterChange(newFilters);
  };

  return (
    <div className="bg-background border rounded-lg shadow-sm">
      <div className="p-4 space-y-4">
        <div className="flex flex-wrap gap-4">
          {/* Search Bar */}
          <div className="flex-1 min-w-[240px]">
            <div className="relative">
              <Icons.search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex gap-2">
            <Select value={quickStatus} onValueChange={handleQuickStatusChange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={quickBudget} onValueChange={handleQuickBudgetChange}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Budget Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Budgets</SelectItem>
                <SelectItem value="0-1000">Under $1,000</SelectItem>
                <SelectItem value="1000-5000">$1,000 - $5,000</SelectItem>
                <SelectItem value="5000+">$5,000+</SelectItem>
              </SelectContent>
            </Select>

            {/* Advanced Filters Button */}
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="default" className="gap-2">
                  <Icons.filter className="h-4 w-4" />
                  More Filters
                  {Object.keys(filters).length > 0 && (
                    <Badge variant="secondary" className="ml-1">
                      {Object.keys(filters).length}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Advanced Filters</SheetTitle>
                </SheetHeader>
                <Separator className="my-4" />
                <ProjectFilters
                  onFilterChange={handleFilterChange}
                  onClose={() => setIsFilterOpen(false)}
                />
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Active Filters */}
        {Object.keys(filters).length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {Object.entries(filters).map(([key, value]) => (
              <Badge
                key={key as keyof ProjectFiltersInterface}
                variant="secondary"
                className="gap-1 cursor-pointer hover:bg-secondary/80"
                onClick={() =>
                  removeFilter(key as keyof ProjectFiltersInterface)
                }
              >
                {key === "hasDeadlineBefore"
                  ? `Deadline before: ${formatDate(value as string)}`
                  : `${key}: ${value}`}
                <Icons.x className="h-3 w-3" />
              </Badge>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Clear all
            </Button>
          </div>
        )}

        {isLoading && (
          <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
            <Icons.spinner className="h-6 w-6 animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}
