import api from '@/lib/api';
import { ProjectApplication } from '@/types/project';
import axios from 'axios';

export const applicationApi = {
  // Apply to a project
  applyToProject: async (
    projectId: number,
    data: {
      coverLetter: string;
      proposedRate: number;
      estimatedDuration: number;
    }
  ): Promise<void> => {
    await api.post(`/applications/projects/${projectId}/apply`, data);
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
