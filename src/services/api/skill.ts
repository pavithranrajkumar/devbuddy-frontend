import { Skill, UserSkill } from '@/contexts/auth/types';
import api from '@/lib/api';

interface UserSkillInput {
  skillId: number;
  proficiencyLevel: 'beginner' | 'intermediate' | 'expert';
}

export const skillApi = {
  // Get all available skills
  getAllSkills: async (): Promise<Skill[]> => {
    const response = await api.get('/skills');
    return response.data;
  },

  // Get user's skills
  getUserSkills: async (): Promise<UserSkill[]> => {
    const response = await api.get('/user/skills');
    return response.data;
  },

  // Add a skill to user's profile
  addUserSkill: async (data: UserSkillInput): Promise<Skill> => {
    const response = await api.post('/user/skills', data);
    return response.data;
  },

  // Update user's skill proficiency
  updateUserSkill: async (skillId: number, data: Pick<UserSkillInput, 'proficiencyLevel'>): Promise<Skill> => {
    const response = await api.put(`/user/skills/${skillId}`, data);
    return response.data;
  },

  // Remove a skill from user's profile
  removeUserSkill: async (skillId: number): Promise<void> => {
    await api.delete(`/user/skills/${skillId}`);
  },
};
