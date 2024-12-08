import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboardService';

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboardStats'],
    queryFn: dashboardService.getStats,
    staleTime: 30000 // Cache for 30 seconds
  });
};

export const usePatientStats = () => {
  return useQuery({
    queryKey: ['patientStats'],
    queryFn: dashboardService.getPatientStats,
    staleTime: 30000
  });
};

export const useRecentActivities = (limit = 5) => {
  return useQuery({
    queryKey: ['recentActivities', limit],
    queryFn: () => dashboardService.getRecentActivities(limit),
    staleTime: 30000
  });
};