import api from './api';

class DashboardService {
  async getStats() {
    const response = await api.get('/dashboard/stats');
    return response.data;
  }

  async getPatientStats() {
    const response = await api.get('/dashboard/patient-stats');
    return response.data;
  }

  async getRecentActivities(limit) {
    const response = await api.get(`/dashboard/activities${limit ? `?limit=${limit}` : ''}`);
    return response.data;
  }
}

export const dashboardService = new DashboardService();