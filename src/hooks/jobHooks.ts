import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';
import jobApi from '../api/jobApi';
import { startTrace } from '@bka-stuff/pe-mfe-utils';

export const useGetJobs = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: ['get-jobs', params],
    queryFn: async () => {
      const response = await jobApi.get(params);
      return response?.data;
    },
  });
};

export const useCreateJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['create-new-job'],
    mutationFn: async (payload: Obj) => {
      const traceId = startTrace(payload.jobTitle);
      const response = await jobApi.create(payload, traceId);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['get-companies'] });
    },
  });
};

export const useUpdateJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['update-job'],
    mutationFn: async (payload: Obj) => {
      let traceId;
      if (payload.status === 'interviewing') {
        const traceTitle = payload.companyName + ' - interviewing';
        traceId = startTrace(traceTitle);
      }
      const response = await jobApi.update(payload, traceId);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['get-jobs'] }),
  });
};

export const useSetJobReported = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['set-job-reported'],
    mutationFn: async ({ id, reported }: { id: string; reported: boolean }) => {
      const response = await jobApi.setReported(id, reported);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['get-jobs'] }),
  });
};

export const useGetCompanies = () => {
  return useQuery({
    queryKey: ['get-companies'],
    queryFn: async () => {
      const response = await jobApi.getCompanies();
      return response?.data as string[];
    },
  });
};

export const useDeleteJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['delete-job'],
    mutationFn: async (id: string) => {
      const response = await jobApi.delete(id);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['get-jobs'] }),
  });
};
