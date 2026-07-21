import { PublicApiClient } from "./apiHelper";

export const reverseGeocode = async (latitude, longitude) => {
  const response = await PublicApiClient.get("/api/v1/location/reverse-geocoding", {
    params: { latitude: latitude, longitude: longitude },
  });
  return response.data;
};