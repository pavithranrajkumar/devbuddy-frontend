import api from '@/lib/api';
import { ProjectApplication } from '@/types/project';
import axios from 'axios';

export const applicationApi = {
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

  getApplication: async (projectId: number): Promise<ProjectApplication | null> => {
    try {
      const response = await api.get(`/projects/${projectId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  getApplications: async (params?: { projectId?: number }): Promise<ProjectApplication[]> => {
    const response = await api.get('/applications', { params });
    return response.data;
  },

  updateApplicationStatus: async ({
    applicationId,
    status,
    rejectionReason,
  }: {
    applicationId: number;
    status: 'accepted' | 'rejected' | 'marked_for_interview';
    rejectionReason?: string;
  }): Promise<void> => {
    await api.put(`/applications/${applicationId}/status`, { status, rejectionReason });
  },

  withdrawApplication: async (projectId: number, applicationId: number): Promise<void> => {
    await api.put(`/projects/${projectId}/applications/${applicationId}/withdraw`);
  },
};
