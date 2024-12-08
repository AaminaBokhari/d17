import api from './api';

class AppointmentService {
  async getAll() {
    try {
      const response = await api.get('/appointments');
      return this.transformAppointments(response.data);
    } catch (error) {
      throw error;
    }
  }

  async create(appointmentData) {
    const response = await api.post('/appointments', appointmentData);
    return response.data;
  }

  async update(id, updateData) {
    const response = await api.patch(`/appointments/${id}`, updateData);
    return response.data;
  }

  async cancel(id, reason) {
    const response = await api.patch(`/appointments/${id}/cancel`, { reason });
    return response.data;
  }

  async reschedule(id, dateTime) {
    const response = await api.patch(`/appointments/${id}/reschedule`, { dateTime });
    return response.data;
  }

  transformAppointments(appointments) {
    return appointments.map(appointment => ({
      id: appointment._id,
      dateTime: appointment.dateTime,
      type: appointment.type,
      status: appointment.status,
      notes: appointment.notes,
      patient: {
        id: appointment.patient,
        name: appointment.patientName || 'Unknown Patient',
      },
      doctor: appointment.doctor,
    }));
  }
}

const service = new AppointmentService();
export const rescheduleAppointment = service.reschedule.bind(service);
export const cancelAppointment = service.cancel.bind(service);
export default se
