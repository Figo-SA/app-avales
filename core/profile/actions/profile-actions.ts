import { API_ENDPOINTS } from "@/core/api/api.config";
import { httpClient } from "@/core/api/http-client";
import { handleApiError } from "@/helpers/error-handler";
import { UpdateProfileRequest, UserProfile } from "../interface/profile";

/**
 * Obtiene el perfil del usuario actual
 */
export const getUserProfile = async (): Promise<UserProfile> => {
  try {
    const response = await httpClient.get<UserProfile>(
      API_ENDPOINTS.AUTH.PROFILE
    );
    return response.data;
  } catch (error) {
    const errorMessage = handleApiError(error, "getUserProfile");
    throw new Error(errorMessage);
  }
};

/**
 * Actualiza el perfil del usuario actual
 */
export const updateUserProfile = async (
  data: UpdateProfileRequest
): Promise<UserProfile> => {
  try {
    const response = await httpClient.patch<UserProfile>(
      API_ENDPOINTS.USERS.UPDATE_PROFILE,
      data
    );
    return response.data;
  } catch (error) {
    const errorMessage = handleApiError(error, "updateUserProfile");
    throw new Error(errorMessage);
  }
};
