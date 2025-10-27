import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
  getEarnings,
  getTestSales,
  getPopularTests,
  getEarningsOverview,
  getTestDistribution,
} from 'src/api/api';
import api from 'src/api/axiosConfig';

// Fetch earnings for the clinic
export const useEarnings = () =>
  useQuery({
    queryKey: ['earnings'],
    queryFn: getEarnings,
  });

// Fetch test distribution statistics
export const useTestDistribution = () =>
  useQuery({
    queryKey: ['testDistribution'],
    queryFn: getTestDistribution,
  });

// Fetch most popular tests based on sales data
export const usePopularTests = () =>
  useQuery({
    queryKey: ['popularTests'],
    queryFn: getPopularTests,
  });

// Fetch test sales data with filtering (default: monthly)
export const useTestSales = (filterType = 'monthly') =>
  useQuery({
    queryKey: ['testSales', filterType],
    queryFn: () => getTestSales(filterType),
  });

// Fetch earnings overview with filtering (default: monthly)
export const useEarningsOverview = (filterType = 'monthly') =>
  useQuery({
    queryKey: ['earningsOverview', filterType],
    queryFn: () => getEarningsOverview(filterType),
  });

// Fetch clinic profile details
export const useClinicDetails = () =>
  useQuery({
    queryKey: ['clinicProfile'],
    queryFn: async () => {
      const { data } = await api.get('/clinic/me');
      return data.data;
    },
    onError: (error) => {
      throw error;
    },
  });

export const useAcceptContract = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.patch('/clinic/accept-contract');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['clinicDetails']);
    },
    onError: (error) => {
      throw error;
    },
  });
};

// Update clinic profile settings
export const useUpdateClinicProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData) => {
      const { data } = await api.patch('/clinic/settings', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return data.data;
    },
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ['clinicProfile'] });

      const previousClinic = queryClient.getQueryData(['clinicProfile']);

      queryClient.setQueryData(['clinicProfile'], (old) => ({
        ...old,
        ...Object.fromEntries(newData),
        supportInsurance: JSON.parse(newData.get('supportInsurance')),
      }));

      return { previousClinic };
    },
    onError: (err, _, context) => {
      if (context?.previousClinic) {
        queryClient.setQueryData(['clinicProfile'], context.previousClinic);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['clinicProfile'] });
    },
  });
};

// Create a new test
export const useCreateTest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData) => {
      const { data } = await api.post('/tests', formData);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['tests']);
      queryClient.invalidateQueries(['clinicTests']);
      queryClient.invalidateQueries(['testDetails', data.testNo]);
    },
    onError: (error) => {
      throw error;
    },
  });
};

export const useCreateTestItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData) => {
      const { data } = await api.post('/tests/test-items', formData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['testItems']);
    },
    onError: (error) => {
      throw error;
    },
  });
};

export const useFetchTestNamesInTestItem = () =>
  useQuery({
    queryKey: ['testNames'],
    queryFn: async () => {
      const { data } = await api.get('/tests/names/all');
      return data.data;
    },
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    onError: (error) => {
      throw error;
    },
  });

// Fetch a paginated list of clinic tests
export const useFetchTests = ({ searchTerm, filter, page, rowsPerPage }) =>
  useQuery({
    queryKey: ['clinicTests', { searchTerm, filter, page, rowsPerPage }],
    queryFn: async () => {
      const { data } = await api.get('/tests/clinic/all', {
        params: {
          search: searchTerm || '',
          filter: filter === 'all' ? '' : filter,
          page: page + 1,
          limit: rowsPerPage,
        },
      });
      return data;
    },
    keepPreviousData: true,
    staleTime: 0,
    refetchInterval: 30000,
    onError: (error) => {
      throw error;
    },
  });

// Fetch detailed information about a specific test
export const useFetchTestDetails = (testNo) =>
  useQuery({
    queryKey: ['testDetails', testNo],
    queryFn: async () => {
      const { data } = await api.get(`/tests/${testNo}`);
      return data.data;
    },
    enabled: !!testNo,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchInterval: 30000,
  });

export const useSupportedTests = () =>
  useQuery({
    queryKey: ['supportedTestsWithStatus'],
    queryFn: async () => {
      const { data } = await api.get('/tests/clinic/supported-tests');
      return data.data;
    },
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchInterval: 30000,
  });

// Update a test's details
export const useUpdateTest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ testNo, ...updatedData }) => {
      const { data } = await api.patch(`/tests/${testNo}`, updatedData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return data;
    },
    onMutate: async ({ testNo, ...updatedData }) => {
      await queryClient.cancelQueries(['testDetails', testNo]);
      const previousTestDetails = queryClient.getQueryData(['testDetails', testNo]);

      queryClient.setQueryData(['testDetails', testNo], (old) => ({
        ...old,
        ...updatedData,
      }));

      return { previousTestDetails };
    },
    onError: (err, _, context) => {
      if (context?.previousTestDetails) {
        queryClient.setQueryData(['testDetails', context.previousTestDetails]);
      }
    },
    onSuccess: (_, { testNo }) => {
      queryClient.invalidateQueries(['tests']);
      queryClient.invalidateQueries(['clinicTests']);
      queryClient.invalidateQueries(['testDetails', testNo]);
    },
  });
};

// Fetch a paginated list of clinic patients
export const useFetchPatients = ({ searchTerm, filterStatus, page, rowsPerPage }) =>
  useQuery({
    queryKey: ['clinicPatients', { searchTerm, filterStatus, page, rowsPerPage }],
    queryFn: async () => {
      const { data } = await api.get('/clinic/patients', {
        params: {
          search: searchTerm || '',
          status: filterStatus || '',
          page: page + 1,
          limit: rowsPerPage,
        },
      });
      return data?.data || {};
    },
    keepPreviousData: true,
    staleTime: 0,
    refetchInterval: 30000,
    onError: (error) => {
      throw error;
    },
  });

// Fetch a patient's claim history
export const useFetchPatientClaimHistory = (patientId) =>
  useQuery({
    queryKey: ['patientClaimHistory', patientId],
    queryFn: async () => {
      const { data } = await api.get(`/claims/history/${patientId}`);
      return data?.data;
    },
    enabled: !!patientId,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchInterval: 30000,
  });

// Fetch all available tests for auto-complete in claim creation
export const useFetchAllTests = () =>
  useQuery({
    queryKey: ['allTests'],
    queryFn: async () => {
      const { data } = await api.get('/tests/clinic/tests/all');
      return data.data || [];
    },
    staleTime: 60000,
    refetchOnWindowFocus: false,
    onError: (error) => {
      throw error;
    },
  });

// Create a new claim request
export const useCreateClaim = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData) => {
      const { data } = await api.post('/claims/add', formData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allClaims'] });
      queryClient.invalidateQueries({ queryKey: ['recentClaims'] });
    },
    onError: (error) => {
      throw error;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['clinicNotifications'] });
    },
  });
};

// Fetch all claims with search, filter, pagination, and date range support
export const useFetchAllClaims = ({ searchTerm, filterStatus, page, rowsPerPage, filterDate }) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['clinicClaims', { searchTerm, filterStatus, page, rowsPerPage, filterDate }],
    queryFn: async () => {
      const { data } = await api.get('/claims/all', {
        params: {
          search: searchTerm || '',
          status: filterStatus || '',
          page: page + 1,
          limit: rowsPerPage,
          date: filterDate || '',
        },
      });

      return data;
    },
    keepPreviousData: true,
    staleTime: 0,
    refetchInterval: 30000,
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recentClaims'] });
    },
    onError: (error) => {
      throw error;
    },
  });
};

// Fetch patient-related statistics and metrics
export const useFetchPatientMetrics = () =>
  useQuery({
    queryKey: ['patientMetrics'],
    queryFn: async () => {
      const { data } = await api.get('/clinic/patients/metrics');
      return data.data || {};
    },
    staleTime: 60000,
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
    onError: (error) => {
      throw error;
    },
  });

// Fetch all clinic orders with filters, pagination, and date support
export const useFetchAllOrders = ({ filterPaymentMethod, filterDate, page, rowsPerPage }) =>
  useQuery({
    queryKey: ['clinicOrders', { filterPaymentMethod, filterDate, page, rowsPerPage }],
    queryFn: async () => {
      const { data } = await api.get('/orders/clinic/orders', {
        params: {
          paymentMethod: filterPaymentMethod || '',
          date: filterDate || '',
          page: page + 1,
          limit: rowsPerPage,
        },
      });
      return data;
    },
    keepPreviousData: true,
    staleTime: 0,
    refetchInterval: 30000,
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
    onError: (error) => {
      throw error;
    },
  });

export const useFetchClinicOrderDetails = (orderId) =>
  useQuery({
    queryKey: ['clinicOrderDetails', { orderId }],
    queryFn: async () => {
      const { data } = await api.get(`/orders/clinic/order/${orderId}`);
      return data;
    },
    enabled: !!orderId,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
    onError: (error) => {
      throw error;
    },
  });

export const useFetchClinicOrdersForAutoComplete = () =>
  useQuery({
    queryKey: ['clinicOrderIds'],
    queryFn: async () => {
      const { data } = await api.get('/orders/clinic/order-ids');
      return data;
    },
    staleTime: 0,
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
    onError: (error) => {
      throw error;
    },
  });

// Update order status
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, testId, status, statusReason }) => {
      const payload = statusReason ? { status, statusReason } : { status };

      const { data } = await api.patch(
        `/orders/clinic/orders/${orderId}/tests/${testId}/status`,
        payload
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['clinicOrders']);
    },
    onError: (error) => {
      throw error;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['clinicNotifications'] });
    },
  });
};

/**
 * Resend test result email to the patient.
 */
export const useResendTestResultEmail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (testResultId) => {
      const { data } = await api.post(`/test-result/resend-email/${testResultId}`, {});
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['clinicTestResults']);
    },
    onError: (error) => {
      throw error;
    },
  });
};

/**
 * Fetch clinic test results with automatic updates after posting a new result.
 */
export const useFetchTestResults = ({ page, limit, date }) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['clinicTestResults', { page, limit, date }],
    queryFn: async () => {
      const { data } = await api.get('/test-result/clinic', {
        params: {
          page: page + 1,
          limit: limit || 10,
          date: date || '',
        },
      });

      return data;
    },
    keepPreviousData: true,
    staleTime: 0,
    refetchInterval: 30000,
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allTestResults'] });
    },
    onError: (error) => {
      throw error;
    },
  });
};

/**
 * Hook to upload test results and auto-refresh the test results list.
 */
export const useUploadTestResult = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData) => {
      const { data } = await api.post('/test-result/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clinicTestResults'] });
    },
    onError: (error) => {
      throw error;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['clinicNotifications'] });
    },
  });
};

/**
 * Fetch all clinic notifications with automatic updates.
 */
export const useFetchClinicNotifications = ({ page = 0, limit = 20, type } = {}) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['clinicNotifications', { page, limit, type }],
    queryFn: async () => {
      const { data } = await api.get('/clinic/notifications', {
        params: {
          page: page + 1,
          limit,
          ...(type ? { type } : {}),
        },
      });

      return data;
    },
    keepPreviousData: true,
    staleTime: 0,
    refetchInterval: 30000,
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allNotifications'] });
    },
    onError: (error) => {
      throw error;
    },
  });
};

/**
 * Marks the recent two notifications as read.
 */
export const useMarkRecentTwoNotificationsAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.patch(
        `/clinic/notifications/mark-recent-two-as-read`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return data;
    },
    onError: (err, _, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(['clinicNotifications'], context.previousNotifications);
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['clinicNotifications']);
    },
  });
};

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.patch(
        '/clinic/notifications/mark-all-as-read',
        {},
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return data;
    },
    onError: (err, _, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(['clinicNotifications'], context.previousNotifications);
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['clinicNotifications']);
    },
  });
};

/**
 * Uploads a PDF certificate.
 */
export const useUploadCertificate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData) => {
      const { data } = await api.patch('/clinic/upload-certificate', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return data.data;
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['clinicProfile'] });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['clinicProfile'] });
    },
  });
};

/**
 * Fetch test images (icons and images).
 */
export const useFetchTestImages = () => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['testImages'],
    queryFn: async () => {
      const { data } = await api.get('/tests/test/images');
      return data.data;
    },
    staleTime: 0,
    keepPreviousData: true,
    refetchInterval: 60000,
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testImages'] });
    },
    onError: (error) => {
      throw error;
    },
  });
};

export const useFetchClinicWithdrawals = ({
  filterStatus,
  filterDate,
  searchText,
  page,
  rowsPerPage,
}) =>
  useQuery({
    queryKey: ['clinicWithdrawals', { filterStatus, filterDate, searchText, page, rowsPerPage }],
    queryFn: async () => {
      const { data } = await api.get('/clinic/withdrawals', {
        params: {
          status: filterStatus || '',
          date: filterDate || '',
          search: searchText || '',
          page: page + 1,
          limit: rowsPerPage,
        },
      });
      return data;
    },
    keepPreviousData: true,
    staleTime: 0,
    refetchInterval: 30000,
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
    onError: (error) => {
      throw error;
    },
  });

// Create a new withdrawal request (Pawapay)
export const useCreateWithdrawal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData) => {
      const { data } = await api.post('/clinic/withdraw/pawapay', formData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clinicWithdrawals'] });
      queryClient.invalidateQueries({ queryKey: ['clinicWithdrawalStats'] });
    },
    onError: (error) => {
      throw error;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['clinicNotifications'] });
    },
  });
};

export const useWithdrawalStats = () =>
  useQuery({
    queryKey: ['clinicWithdrawalStats'],
    queryFn: async () => {
      const { data } = await api.get('/clinic/withdrawal/stats');
      return data;
    },
    keepPreviousData: true,
    staleTime: 0,
    refetchInterval: 30000,
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
    onError: (error) => {
      throw error;
    },
  });

// Create a new withdrawal request (YellowCard)
export const useCreateYellowCardWithdrawal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData) => {
      const { data } = await api.post('/clinic/withdraw/yellowcard', formData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clinicWithdrawals'] });
    },
    onError: (error) => {
      throw error;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['clinicNotifications'] });
    },
  });
};

export const useClearNotifications = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.delete('/clinic/notifications/clear', {
        headers: { 'Content-Type': 'application/json' },
      });
      return data;
    },
    onError: (err, _, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(['clinicNotifications'], context.previousNotifications);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clinicNotifications'] });
    },
  });
};

// Fetch all clinic discounts with filters and pagination
export const useFetchAllDiscounts = ({ filterStatus, filterCode, page, rowsPerPage }) =>
  useQuery({
    queryKey: ['clinicDiscounts', { filterStatus, filterCode, page, rowsPerPage }],
    queryFn: async () => {
      const { data } = await api.get('/discount/clinic', {
        params: {
          status: filterStatus ?? '',
          code: filterCode ?? '',
          page: page + 1,
          limit: rowsPerPage,
        },
      });
      return data;
    },
    keepPreviousData: true,
    staleTime: 0,
    refetchInterval: 30000,
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
    onError: (error) => {
      throw error;
    },
  });

export const useDeleteDiscount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (discountNo) => {
      const { data } = await api.delete(`/discount/clinic/${discountNo}`);
      return data;
    },
    onMutate: async (discountNo) => {
      await queryClient.cancelQueries(['clinicDiscounts']);
      const previousDiscounts = queryClient.getQueryData(['clinicDiscounts']);

      queryClient.setQueryData(['clinicDiscounts'], (old) =>
        old
          ? {
              ...old,
              data: old.data.filter((d) => d.discountNo !== discountNo),
            }
          : old
      );

      return { previousDiscounts };
    },
    onError: (err, discountNo, context) => {
      if (context?.previousDiscounts) {
        queryClient.setQueryData(['clinicDiscounts'], context.previousDiscounts);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['clinicDiscounts']);
    },
  });
};

export const useCreateDiscount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newDiscount) => {
      const { data } = await api.post('/discount/clinic', newDiscount, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['clinicDiscounts']);
    },
  });
};

// Remove a test (soft delete)
export const useRemoveTest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (testId) => {
      const { data } = await api.delete(`/tests/${testId}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['tests']);
      queryClient.invalidateQueries(['clinicTests']);
    },
  });
};

// Update a test item (clinic)
export const useUpdateTestItemByClinic = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updatedData }) => {
      const { data } = await api.patch(`/tests/test-items/${id}`, updatedData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['testItems']);
    },
  });
};

// Delete a test item (clinic)
export const useDeleteTestItemByClinic = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const { data } = await api.delete(`/tests/test-items/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['testItems']);
    },
  });
};

// Fetch all clinic test items
export const useFetchClinicTestItems = () =>
  useQuery({
    queryKey: ['clinicTestItems'],
    queryFn: async () => {
      const { data } = await api.get('/tests/clinics/test-items');
      return data;
    },
    keepPreviousData: true,
    staleTime: 0,
    refetchInterval: 30000,
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
    onError: (error) => {
      throw error;
    },
  });
