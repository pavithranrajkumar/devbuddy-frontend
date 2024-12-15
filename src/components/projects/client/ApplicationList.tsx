import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { useToast } from "@/hooks/use-toast";
import { ProjectApplication } from "@/types/project";
import { formatDate } from "@/lib/utils";
import { applicationApi } from "@/services/api/application";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface ApplicationListProps {
  projectId: number;
}

export function ApplicationList({ projectId }: ApplicationListProps) {
  const { toast } = useToast();
  const [applications, setApplications] = useState<ProjectApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [rejectionDialog, setRejectionDialog] = useState<{
    isOpen: boolean;
    applicationId: number | null;
  }>({
    isOpen: false,
    applicationId: null,
  });
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    loadApplications();
  }, [projectId]);

  const loadApplications = async () => {
    try {
      setIsLoading(true);
      const data = await applicationApi.getApplications({ projectId });
      console.log({ data });
      setApplications(data);
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

  const handleStatusUpdate = async (
    applicationId: number,
    status: "accepted" | "rejected" | "marked_for_interview"
  ) => {
    try {
      await applicationApi.updateApplicationStatus({ applicationId, status });
      await loadApplications();
      toast({
        title: "Success",
        description: "Application status updated successfully",
      });
    } catch (error) {
      console.error("Error updating application:", error);
      const errorMessage =
        (error as any).response?.data?.message ||
        "Failed to update application status";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleReject = async () => {
    if (!rejectionDialog.applicationId) return;

    if (!rejectionReason.trim()) {
      toast({
        title: "Error",
        description: "Please enter a reason for rejection",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log("Request Payload:", {
        applicationId: rejectionDialog.applicationId,
        status: "rejected",
        rejectionReason,
      });
      await applicationApi.updateApplicationStatus({
        applicationId: rejectionDialog.applicationId,
        status: "rejected",
        rejectionReason,
      });
      await loadApplications();
      toast({
        title: "Success",
        description: `Application rejected successfully. Reason: ${rejectionReason}`,
      });
      setRejectionDialog({ isOpen: false, applicationId: null });
      setRejectionReason("");
    } catch (error) {
      console.error("Error rejecting application:", error);
      const errorMessage =
        (error as any).response?.data?.message ||
        "Failed to reject application";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const toTitleCase = (str: string) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <Icons.spinner className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="text-center py-8">
        <Icons.inbox className="mx-auto h-12 w-12 text-muted-foreground/50" />
        <h3 className="mt-4 text-sm font-semibold text-muted-foreground">
          No applications yet
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Applications will appear here once freelancers apply.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {applications.map((application) => (
        <div key={application.id} className="border rounded-lg p-4 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold">
                Proposed Rate: ${application.proposedRate}/hr
              </h3>
              <p className="text-sm text-muted-foreground">
                Estimated Duration: {application.estimatedDuration} days
              </p>
              <p className="text-sm text-muted-foreground">
                Applied: {formatDate(application.createdAt)}
              </p>
              <p className="text-sm font-medium text-muted-foreground">
                Status: {toTitleCase(application.status.replace("_", " "))}
              </p>
            </div>
            <div className="space-x-2">
              {application.status === "applied" && (
                <>
                  <Button
                    size="sm"
                    onClick={() =>
                      handleStatusUpdate(application.id, "marked_for_interview")
                    }
                  >
                    Mark for Interview
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      setRejectionDialog({
                        isOpen: true,
                        applicationId: application.id,
                      })
                    }
                  >
                    Reject
                  </Button>
                </>
              )}
              {application.status === "marked_for_interview" && (
                <>
                  <Button
                    size="sm"
                    onClick={() =>
                      handleStatusUpdate(application.id, "accepted")
                    }
                  >
                    Accept
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      setRejectionDialog({
                        isOpen: true,
                        applicationId: application.id,
                      })
                    }
                  >
                    Reject
                  </Button>
                </>
              )}
            </div>
          </div>
          <p className="text-sm whitespace-pre-wrap">
            {application.coverLetter}
          </p>
        </div>
      ))}
      <Dialog
        open={rejectionDialog.isOpen}
        onOpenChange={(open) =>
          !open && setRejectionDialog({ isOpen: false, applicationId: null })
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Application</DialogTitle>
          </DialogHeader>
          <Textarea
            placeholder="Provide a reason for rejection"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            className="min-h-[100px]"
            required
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setRejectionDialog({ isOpen: false, applicationId: null })
              }
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject}>
              Reject Application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
