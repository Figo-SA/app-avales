import { API_ENDPOINTS } from "@/core/api/api.config";
import { httpClient } from "@/core/api/http-client";
import { handleApiError } from "@/helpers/error-handler";

export const updatePushToken = async (
  pushToken: string
): Promise<{ message: string }> => {
  try {
    const response = await httpClient.patch(
      API_ENDPOINTS.USER.UPDATE_PUSH_TOKEN,
      { pushToken }
    );
    return response.data;
  } catch (error) {
    const errorMessage = handleApiError(error, "updatePushToken");
    throw new Error(errorMessage);
  }
};
