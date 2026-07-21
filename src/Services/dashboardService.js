import { PublicApiClient, PrivateApiClient } from "./apiHelper";

export const getProviderDashboard = async () => {
    const response = await PrivateApiClient.get(`/api/v1/dashboard/tiffin-provider`);
    return response.data;
};

export const getAdminDashboard = async () => {
    const response = await PrivateApiClient.get(`/api/v1/dashboard/admin`);
    return response.data;
};

export const getProviderRevenueDashboard = async (filters = {}) => {
    const params = {}
    if (filters.groupBy) params.groupBy = filters.groupBy;
    if (filters.dateRange) params.dateFilter = filters.dateRange;
    if (filters.startDate) params.startDate = filters.startDate;
    if (filters.endDate) params.endDate = filters.endDate;

    const response = await PrivateApiClient.get(`/api/v1/dashboard/revenue/tiffin-provider`, { params });
    return response.data;
};

export const getAdminRevenueDashboard = async (filters = {}) => {
    const params = {}
    if (filters.groupBy) params.groupBy = filters.groupBy;
    if (filters.dateRange) params.dateFilter = filters.dateRange;
    if (filters.startDate) params.startDate = filters.startDate;
    if (filters.endDate) params.endDate = filters.endDate;

    const response = await PrivateApiClient.get(`/api/v1/dashboard/revenue/admin`, { params });
    return response.data;
};