import api from '@/lib/api';
import { useState, useEffect } from 'react';

interface FreelancerDashboardResponse {
  profileOverview: {
    name: string;
    title: string;
    rating: number;
    activeProjects: number;
    completedProjects: number;
    profileCompleteness: number;
  };
  skills: Array<{
    name: string;
    proficiencyLevel: 'expert' | 'intermediate' | 'beginner';
    category: string;
  }>;
  applicationStats: {
    totalApplications: number;
    activeApplications: number;
    successRate: number;
    statusBreakdown: {
      applied: number;
      marked_for_interview: number;
      accepted: number;
      rejected: number;
    };
  };
  recentApplications: Array<{
    projectTitle: string;
    status: 'marked_for_interview' | 'accepted' | 'rejected' | 'applied';
    appliedDate: string;
    proposedRate: number;
  }>;
  matchingProjects: Array<{
    title: string;
    budgetRange: {
      min: number;
      max: number;
    };
    requiredSkills: string[];
    postedDate: string;
    matchScore: number;
  }>;
}

export function useFreelancerDashboard() {
  const [data, setData] = useState<FreelancerDashboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await api.get<FreelancerDashboardResponse>('/dashboard/freelancer');
        setData(response.data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch dashboard data'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, isLoading, error };
}
