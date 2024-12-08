import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { medicalHistory } from '../services/api';
import { toast } from 'react-toastify';

export function useMedicalHistory(patientId) {
  const queryClient = useQueryClient();

  const {
    data: medicalHistoryData,
    isLoading,
    error
  } = useQuery({
    queryKey: ['medicalHistory', patientId],
    queryFn: () => patientId 
      ? medicalHistory.getForPatient(patientId)
      : medicalHistory.getAll()
  });

  const createMutation = useMutation({
    mutationFn: medicalHistory.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['medicalHistory']);
      toast.success('Medical history record created successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create record');
    }
  });

  return {
    medicalHistory: medicalHistoryData?.data || [],
    isLoading,
    error,
    createRecord: createMutation.mutate
  };
}