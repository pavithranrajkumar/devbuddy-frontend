import api from '@/lib/api';
import { Project } from '@/types/project';

interface CreateProjectInput {
  title: string;
  description: string;
  budgetMin: number;
  budgetMax: number;
  deadline: string;
  skills: number[];
}

interface PaginatedResponse<T> {
  projects: T[];
  total: number;
  page: number;
  totalPages: number;
}

export const projectApi = {
  // Get all projects with filters
  getProjects: async ({ page = 1, limit = 9, search = '', ...filters }): Promise<PaginatedResponse<Project>> => {
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
};
