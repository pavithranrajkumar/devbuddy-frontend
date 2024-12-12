import api from '@/lib/api';
import { Project, ProjectApplication } from '@/types/project';
import axios from 'axios';

interface CreateProjectInput {
  title: string;
  description: string;
  budgetMin: number;
  budgetMax: number;
  deadline: string;
  requiredSkills: number[];
}

interface PaginatedResponse<T> {
  projects: T[];
  total: number;
  page: number;
  totalPages: number;
}

export const projectApi = {
  // Get all projects with filters
  getProjects: async ({ page = 1, limit = 9, search = '', ...filters }) => {
    const response = await api.get<PaginatedResponse<Project>>('/projects', {
      params: {
        page,
        limit,
        search,
        ...filters,
      },
    });
    return response.data;
  },

  // Get single project
  getProject: async (id: number): Promise<Project> => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  // Create new project
  createProject: async (data: CreateProjectInput): Promise<Project> => {
    const response = await api.post('/projects', data);
    return response.data;
  },

  // Update project
  updateProject: async (id: number, data: Partial<CreateProjectInput>): Promise<Project> => {
    const response = await api.put(`/projects/${id}`, data);
    return response.data;
  },

  // Delete project
  deleteProject: async (id: number): Promise<void> => {
    await api.delete(`/projects/${id}`);
  },

  // Apply to a project
  applyToProject: async (
    projectId: number,
    data: {
      coverLetter: string;
      proposedRate: number;
      estimatedDuration: number;
    }
  ): Promise<void> => {
    await api.post(`/projects/${projectId}/apply`, data);
  },

  // Get project applications
  getProjectApplications: async (projectId: number): Promise<ProjectApplication[]> => {
    const response = await api.get(`/applications/projects/${projectId}`);
    return response.data;
  },

  // Update application status
  updateApplicationStatus: async (
    projectId: number,
    applicationId: number,
    status: 'accepted' | 'rejected' | 'marked_for_interview'
  ): Promise<void> => {
    await api.put(`/projects/${projectId}/applications/${applicationId}`, { status });
  },

  // Get freelancer's application for a specific project
  getFreelancerApplication: async (projectId: number): Promise<ProjectApplication | null> => {
    try {
      const response = await api.get(`/projects/${projectId}/my-application`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  // Get all applications for a freelancer
  getFreelancerApplications: async (): Promise<ProjectApplication[]> => {
    const response = await api.get('/applications/freelancer');
    return response.data;
  },

  // Withdraw an application
  withdrawApplication: async (projectId: number, applicationId: number): Promise<void> => {
    await api.put(`/projects/${projectId}/applications/${applicationId}/withdraw`);
  },
};
