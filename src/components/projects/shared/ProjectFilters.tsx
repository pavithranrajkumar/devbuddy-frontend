import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ProjectFiltersInterface } from "@/types/project";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Icons } from "@/components/ui/icons";

interface ProjectFiltersProps {
  onFilterChange: (filters: ProjectFiltersInterface) => void;
  onClose: () => void;
  initialFilters?: ProjectFiltersInterface;
}

export function ProjectFilters({
  onFilterChange,
  onClose,
  initialFilters = {},
}: ProjectFiltersProps) {
  const [status, setStatus] = useState<string>(
    initialFilters.status?.[0] || "all"
  );
  const [budgetMin, setBudgetMin] = useState<string>(
    initialFilters.budgetMin?.toString() || ""
  );
  const [budgetMax, setBudgetMax] = useState<string>(
    initialFilters.budgetMax?.toString() || ""
  );
  const [date, setDate] = useState<Date | undefined>(
    initialFilters.hasDeadlineBefore
      ? new Date(initialFilters.hasDeadlineBefore)
      : undefined
  );

  const handleApply = () => {
    const filters: ProjectFiltersInterface = {};

    if (status && status !== "all") {
      filters.status = status;
    }

    if (budgetMin && !isNaN(Number(budgetMin)) && Number(budgetMin) > 0) {
      filters.budgetMin = Number(budgetMin);
    }

    if (budgetMax && !isNaN(Number(budgetMax)) && Number(budgetMax) > 0) {
      filters.budgetMax = Number(budgetMax);
    }

    if (date) {
      filters.hasDeadlineBefore = date.toISOString();
    }

    onFilterChange(filters);
    onClose();
  };

  const handleReset = () => {
    setStatus("all");
    setBudgetMin("");
    setBudgetMax("");
    setDate(new Date());
    onFilterChange({});
    onClose();
  };

  return (
    <div className="space-y-6 px-2">
      <div className="space-y-4">
        <Label className="text-base font-semibold">Project Status</Label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      <div className="space-y-4">
        <Label className="text-base font-semibold">Budget Range</Label>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Minimum ($)</Label>
            <Input
              type="number"
              min="0"
              placeholder="0"
              value={budgetMin}
              onChange={(e) => setBudgetMin(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Maximum ($)</Label>
            <Input
              type="number"
              min={budgetMin || "0"}
              placeholder="Any"
              value={budgetMax}
              onChange={(e) => setBudgetMax(e.target.value)}
            />
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <Label className="text-base font-semibold">Deadline Before</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <Icons.calendar className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto p-0"
            align="center"
            side="bottom"
            sideOffset={4}
          >
            <div className="p-3 border-b">
              <h4 className="font-medium text-sm">Select deadline</h4>
              <p className="text-sm text-muted-foreground">
                Projects due before selected date
              </p>
            </div>
            {/* <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
              disabled={(date) => date < new Date()}
              className="rounded-t-none"
            /> */}
          </PopoverContent>
        </Popover>
      </div>

      <div className="sticky bottom-0 bg-background pt-4 border-t space-y-2">
        <Button onClick={handleApply} className="w-full" variant="default">
          Apply Filters
        </Button>
        <Button onClick={handleReset} className="w-full" variant="outline">
          Reset Filters
        </Button>
      </div>
    </div>
  );
}
