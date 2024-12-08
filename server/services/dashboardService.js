import Appointment from '../models/Appointment.js';
import { startOfDay, endOfDay, addDays } from 'date-fns';

export const getDashboardStats = async (doctorId) => {
  const today = new Date();
  const todayStart = startOfDay(today);
  const todayEnd = endOfDay(today);
  const tomorrowStart = startOfDay(addDays(today, 1));
  const tomorrowEnd = endOfDay(addDays(today, 1));

  const stats = await Appointment.aggregate([
    {
      $facet: {
        todayStats: [
          {
            $match: {
              doctor: doctorId,
              dateTime: { $gte: todayStart, $lte: todayEnd }
            }
          },
          {
            $group: {
              _id: '$status',
              count: { $sum: 1 }
            }
          }
        ],
        tomorrowAppointments: [
          {
            $match: {
              doctor: doctorId,
              dateTime: { $gte: tomorrowStart, $lte: tomorrowEnd }
            }
          },
          {
            $count: 'total'
          }
        ]
      }
    }
  ]);

  const todayStats = stats[0].todayStats.reduce((acc, curr) => {
    acc[curr._id.toLowerCase()] = curr.count;
    return acc;
  }, {});

  return {
    todayTotal: todayStats.scheduled + todayStats.completed + todayStats['in progress'] || 0,
    completed: todayStats.completed || 0,
    pending: (todayStats.scheduled || 0) + (todayStats['in progress'] || 0),
    tomorrow: stats[0].tomorrowAppointments[0]?.total || 0
  };
};