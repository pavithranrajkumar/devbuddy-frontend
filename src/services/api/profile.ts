import { Skill, UpdateProfileDTO, User } from '@/contexts/auth/types';
import api from '@/lib/api';

export const profileApi = {
  updateProfile: async (data: UpdateProfileDTO): Promise<User> => {
    const response = await api.patch('/users/profile', data);
    return response.data;
  },

  uploadAvatar: async (file: File): Promise<{ avatarUrl: string }> => {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await api.post('/users/profile/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  addSkill: async (skill: Omit<Skill, 'id' | 'userId'>): Promise<Skill> => {
    const response = await api.post('/users/skills', skill);
    return response.data;
  },

  removeSkill: async (skillId: number): Promise<void> => {
    await api.delete(`/users/skills/${skillId}`);
  },
};
