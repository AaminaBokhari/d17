import React from 'react';
import { FaUserInjured, FaCheckCircle, FaClock, FaCalendarCheck } from 'react-icons/fa';
import { useDashboardStats } from '../../hooks/useDashboard';
import LoadingSpinner from '../common/LoadingSpinner';

function DashboardStats() {
  const { data: stats, isLoading, error } = useDashboardStats();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg">
        <p className="text-red-600">Error loading dashboard stats: {error.message}</p>
      </div>
    );
  }

  const statCards = [
    {
      title: "Today's Patients",
      value: stats?.todayTotal || 0,
      trend: "↑ 20% vs last week",
      icon: FaUserInjured,
      gradient: "from-blue-500 to-blue-600"
    },
    {
      title: "Completed",
      value: stats?.completed || 0,
      trend: `${stats?.pending || 0} appointments remaining`,
      icon: FaCheckCircle,
      gradient: "from-green-500 to-green-600"
    },
    {
      title: "Pending",
      value: stats?.pending || 0,
      trend: "Next in 15 minutes",
      icon: FaClock,
      gradient: "from-purple-500 to-purple-600"
    },
    {
      title: "Tomorrow",
      value: stats?.tomorrow || 0,
      trend: "First at 9:00 AM",
      icon: FaCalendarCheck,
      gradient: "from-orange-500 to-orange-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      {statCards.map((stat, index) => (
        <div key={index} className={`bg-gradient-to-r ${stat.gradient} text-white p-6 rounded-xl shadow-lg`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">{stat.title}</h3>
            <stat.icon className="text-2xl opacity-80" />
          </div>
          <p className="text-3xl font-bold">{stat.value}</p>
          <p className="text-sm mt-2 opacity-90">{stat.trend}</p>
        </div>
      ))}
    </div>
  );
}

export default DashboardStats;