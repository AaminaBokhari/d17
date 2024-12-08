import asyncHandler from '../utils/asyncHandler.js';
import * as appointmentService from '../services/appointmentService.js';
import AppError from '../utils/AppError.js';

// In your appointments controller, add more logging
export const createAppointment = asyncHandler(async (req, res) => {
  // Add more robust patient and doctor ID handling
  const appointment = await appointmentService.createAppointmentService({
    patient: req.body.patient, // Explicitly use patient from request
    doctor: req.user.role === 'doctor' ? req.user.id : req.body.doctor,
    dateTime: req.body.dateTime,
    type: req.body.type,
    status: req.body.status,
    notes: req.body.notes
  });

  // Add more detailed error handling
  if (!appointment) {
    throw new AppError('Failed to create appointment', 400);
  }

  await appointment.populate(['patient', 'doctor']);
  res.status(201).json(appointment);
});



export const getAppointments = asyncHandler(async (req, res) => {
  // More flexible query handling
  const query = req.user.role === 'doctor' 
    ? { doctor: req.user.id }
    : { patient: req.user.id };

  console.log('Appointment Query:', query);
  const appointments = await appointmentService.getAppointmentsService(query);
  res.json(appointments);
});

export const updateAppointment = asyncHandler(async (req, res) => {
  const appointment = await appointmentService.updateAppointmentService(
    req.params.id,
    req.body
  );

  if (!appointment) {
    throw new AppError('Appointment not found', 404);
  }

  res.json(appointment);
});

export const cancelAppointment = asyncHandler(async (req, res) => {
  const { reason } = req.body;
  
  if (!reason) {
    throw new AppError('Cancellation reason is required', 400);
  }

  const appointment = await appointmentService.updateAppointmentService(
    req.params.id,
    {
      status: 'Cancelled',
      cancellationReason: reason,
      cancelledAt: new Date(),
      cancelledBy: req.user.id
    }
  );

  if (!appointment) {
    throw new AppError('Appointment not found', 404);
  }

  res.json(appointment);
});

export const rescheduleAppointment = asyncHandler(async (req, res) => {
  const { dateTime } = req.body;
  
  if (!dateTime) {
    throw new AppError('New appointment date and time are required', 400);
  }

  const appointment = await appointmentService.updateAppointmentService(
    req.params.id,
    {
      dateTime: new Date(dateTime),
      status: 'Rescheduled',
      rescheduledAt: new Date(),
      rescheduledBy: req.user.id
    }
  );

  if (!appointment) {
    throw new AppError('Appointment not found', 404);
  }

  res.json(appointment);
});