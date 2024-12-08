import asyncHandler from '../utils/asyncHandler.js';
import { logger } from '../utils/logger.js';
import AppError from '../utils/AppError.js';
import Appointment from '../models/Appointment.js';
import { startOfDay, endOfDay, addDays } from 'date-fns';

export const getDashboardStats = asyncHandler(async (req, res) => {
  try {
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
                doctor: req.user._id,
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
                doctor: req.user._id,
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

    const response = {
      todayTotal: todayStats.scheduled + todayStats.completed + todayStats['in progress'] || 0,
      completed: todayStats.completed || 0,
      pending: (todayStats.scheduled || 0) + (todayStats['in progress'] || 0),
      tomorrow: stats[0].tomorrowAppointments[0]?.total || 0
    };

    logger.info(`Dashboard stats retrieved for doctor ${req.user._id}`);
    res.json(response);
  } catch (error) {
    logger.error(`Error fetching dashboard stats: ${error.message}`);
    throw new AppError('Failed to fetch dashboard statistics', 500);
  }
});