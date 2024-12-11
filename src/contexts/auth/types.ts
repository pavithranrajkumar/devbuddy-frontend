export interface User {
  id: number;
  email: string;
  name: string;
  userType: 'client' | 'freelancer';
  title?: string;
  bio?: string;
  hourlyRate?: number;
  linkedinUrl?: string;
  githubUrl?: string;
  experienceInMonths?: number;
  skills?: Skill[];
}

export interface Skill {
  id: number;
  name: string;
  proficiencyLevel: 'beginner' | 'intermediate' | 'expert';
  userId: number;
}

export interface UserSkill {
  id: number;
  userId: number;
  skillId: number;
  proficiencyLevel: 'beginner' | 'intermediate' | 'expert';
  createdAt: string;
  updatedAt: string;
  Skill: {
    name: string;
    category: string;
  };
}

export interface UpdateProfileDTO {
  name?: string;
  email?: string;
  title?: string;
  bio?: string;
  hourlyRate?: number;
  linkedinUrl?: string;
  githubUrl?: string;
  experienceInMonths?: number;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  userType: 'client' | 'freelancer';
  title?: string;
  bio?: string;
  hourlyRate?: number;
  linkedinUrl?: string;
  githubUrl?: string;
  experienceInMonths?: number;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticating: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}
