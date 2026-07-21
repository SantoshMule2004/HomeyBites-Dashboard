import { PublicApiClient, PrivateApiClient } from "./apiHelper";

export const getTiffinPlansOfProvider = (providerId, filters = {}, page = 0, size = 5) => {
  const params = { page, size };
  if (filters.isActive !== null && filters.isActive !== undefined) params.isActive = filters.isActive;
  if (filters.search) params.search = filters.search;

  return PrivateApiClient
    .get(`/api/v1/tiffinplan/tiffin-provider/${providerId}`, { params })
    .then((res) => res.data);
};

export const addTiffinPlan = (providerId, planData) => {
  return PrivateApiClient.post(`/api/v1/tiffinplan/tiffin-provider/${providerId}`, planData).then((res) => res.data);
};

export const updateTiffinPlan = (planId, providerId, planData) => {
  return PrivateApiClient.put(`/api/v1/tiffinplan/${planId}/tiffin-provider/${providerId}`, planData).then((res) => res.data);
};

export const toggleTiffinPlan = (providerId, planId, isActive) => {
  return PrivateApiClient
    .patch(`/api/v1/tiffinplan/tiffin-provider/${providerId}/toggle/${planId}`, null, { params: { isActive } })
    .then((res) => res.data);
};

export const deleteTiffinPlan = (planId, providerId) => {
  return PrivateApiClient.delete(`/api/v1/tiffinplan/${planId}/tiffin-provider/${providerId}`).then((res) => res.data);
};