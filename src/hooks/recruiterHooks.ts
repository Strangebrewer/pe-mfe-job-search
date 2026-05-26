import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';
import recruiterApi from '../api/recruiterApi';

export const useGetRecruiters = () => {
  return useQuery({
    queryKey: ['get-recruiters'],
    queryFn: async () => {
      const response = await recruiterApi.get();
      return response?.data;
    },
  });
};

export const useCreateRecruiter = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['create-new-recruiter'],
    mutationFn: async (payload: Obj) => {
      const response = await recruiterApi.create(payload);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['get-recruiters'] }),
  });
};

export const useUpdateRecruiter = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['update-recruiter'],
    mutationFn: async (payload: Obj) => {
      const response = await recruiterApi.update(payload);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['get-recruiters'] }),
  });
};

export const useDeleteRecruiter = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['delete-recruiter'],
    mutationFn: async (id: string) => {
      const response = await recruiterApi.delete(id);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['get-recruiters'] }),
  });
};