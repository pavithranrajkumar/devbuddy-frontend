export interface Skill {
  id: number;
  name: string;
}

export interface Project {
  userType: string;
  proposedRate: string;
  budget: number;
  name: any;
  id: number;
  title: string;
  description: string;
  budgetMin: number;
  budgetMax: number;
  deadline: string;
  skills: Skill[];
  status: "published" | "in_progress" | "completed" | "cancelled";
  clientId: number;
  client?: {
    id: number;
    name: string;
    rating: number;
  };
  applicantsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectApplication {
  id: number;
  projectId: number;
  Project: Project;
  freelancerId: number;
  coverLetter: string;
  proposedRate: number;
  estimatedDuration: number;
  status:
    | "applied"
    | "marked_for_interview"
    | "accepted"
    | "rejected"
    | "withdrawn";
  createdAt: string;
  updatedAt: string;
}

export interface ProjectFiltersInterface {
  status?: string; // Make sure this is optional if not always provided
  budget?: string;
  budgetMin?: number;
  budgetMax?: number;
  skills?: number[];
  search?: string;
  hasDeadlineBefore?: string;
  startDate?: string;
  endDate?: string;
}
