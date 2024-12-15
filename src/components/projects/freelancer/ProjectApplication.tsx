import { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { useToast } from "@/hooks/use-toast";
import { FormTextareaComponent } from "@/components/form/FormTextareaComponent";
import { FormFieldComponent } from "@/components/form/FormFieldComponent";
import { applicationApi } from "@/services/api/application";

const createApplicationSchema = (budget: { min: string; max: string }) =>
  z.object({
    coverLetter: z
      .string()
      .min(50, "Cover letter must be at least 50 characters"),
    proposedRate: z
      .number()
      .min(
        parseFloat(budget.min.replace(/[^0-9.-]+/g, "")),
        `Proposed rate must be at least ${budget.min}`
      )
      .max(
        parseFloat(budget.max.replace(/[^0-9.-]+/g, "")),
        `Proposed rate must be within the project budget of ${budget.max}`
      ),
    estimatedDuration: z
      .number()
      .min(1, "Please specify estimated duration in days"),
  });

export function ProjectApplication() {
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Safely access budget from location.state
  const budget = location.state?.budget;

  // Debugging log
  console.log("Location state:", location.state);
  console.log("Budget:", budget);

  // Check if budget is valid
  if (
    !budget ||
    typeof budget.min !== "string" ||
    typeof budget.max !== "string"
  ) {
    toast({
      title: "Error",
      description: "Budget information is missing or invalid.",
      variant: "destructive",
    });
    navigate(-1); // Navigate back if budget is not available
    return null; // Prevent rendering the form
  }

  const form = useForm<z.infer<ReturnType<typeof createApplicationSchema>>>({
    resolver: zodResolver(createApplicationSchema(budget)),
    defaultValues: {
      coverLetter: "",
      proposedRate: 0,
      estimatedDuration: 0,
    },
  });

  const onSubmit = async (
    data: z.infer<ReturnType<typeof createApplicationSchema>>
  ) => {
    if (!id) return;

    try {
      setIsSubmitting(true);
      await applicationApi.applyToProject(Number(id), data);

      toast({
        title: "Success",
        description: "Application submitted successfully",
      });

      navigate(`/applications`);
    } catch (error) {
      console.error("Failed to submit application:", error);
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to submit application";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    const from = location.state?.from; // Get the 'from' state
    if (from === "list") {
      navigate("/projects"); // Navigate back to Project List View
    } else {
      navigate(`/projects/${id}`); // Navigate back to Project Details
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Submit Application</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormTextareaComponent
            form={form}
            name="coverLetter"
            label="Cover Letter"
            placeholder="Explain why you're the best fit for this project..."
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <FormFieldComponent
              form={form}
              name="proposedRate"
              label={`Proposed Rate ($/hr) - Budget: $${budget.min} - $${budget.max}`}
              placeholder="Enter your rate"
              type="number"
              required
            />

            <FormFieldComponent
              form={form}
              name="estimatedDuration"
              label="Estimated Duration (days)"
              placeholder="Enter estimated days"
              type="number"
              required
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel} // Use the new handleCancel function
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Application"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
