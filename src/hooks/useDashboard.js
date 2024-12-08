import { useQuery } from '@tanstack/react-query';
import { dashboard } from '../services/api';

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboardStats'],
    queryFn: () => dashboard.getStats()
  });
}

export function usePatientStats() {
  return useQuery({
    queryKey: ['patientStats'],
    queryFn: () => dashboard.getPatientStats()
  });
}

export function useRecentActivities(limit) {
  return useQuery({
    queryKey: ['recentActivities', limit],
    queryFn: () => dashboard.getActivities(limit)
  });
}