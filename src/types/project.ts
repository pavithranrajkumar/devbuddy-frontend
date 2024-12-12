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
  status: 'draft' | 'published' | 'in_progress' | 'completed';
  skills: Skill[];
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
  status?: string[];
  budgetMin?: number;
  budgetMax?: number;
  skills?: number[];
}
