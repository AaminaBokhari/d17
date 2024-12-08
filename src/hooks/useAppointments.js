import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import appointmentService from '../services/appointmentService';
import { toast } from 'react-toastify';

export const useAppointments = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['appointments'],
    queryFn: () => appointmentService.getAll(),
    staleTime: 30000,
  });

  const createMutation = useMutation({
    mutationFn: (data) => appointmentService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['appointments']);
      toast.success('Appointment created successfully');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => appointmentService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['appointments']);
      toast.success('Appointment updated successfully');
    },
  });

  const cancelMutation = useMutation({
    mutationFn: ({ id, reason }) => appointmentService.cancel(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries(['appointments']);
      toast.success('Appointment cancelled successfully');
    },
  });

  const rescheduleMutation = useMutation({
    mutationFn: ({ id, dateTime }) => appointmentService.reschedule(id, dateTime),
    onSuccess: () => {
      queryClient.invalidateQueries(['appointments']);
      toast.success('Appointment rescheduled successfully');
    },
  });

  return {
    ...query,
    createAppointment: createMutation.mutate,
    updateAppointment: updateMutation.mutate,
    cancelAppointment: cancelMutation.mutate,
    rescheduleAppointment: rescheduleMutation.mutate,
  };
};
