export interface Skill {
  id: number;
  name: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  budgetMin: number;
  budgetMax: number;
  deadline: string;
  skills: Skill[];
  status: 'published' | 'in_progress' | 'completed' | 'cancelled';
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
  status: 'applied' | 'marked_for_interview' | 'accepted' | 'rejected' | 'withdrawn';
  createdAt: string;
  updatedAt: string;
}

export interface ProjectFiltersInterface {
  status?: string;
  budgetMin?: number;
  budgetMax?: number;
  skills?: number[];
  search?: string;
  hasDeadlineBefore?: string;
}
