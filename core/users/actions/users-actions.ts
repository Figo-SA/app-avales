import { API_ENDPOINTS } from "@/core/api/api.config";
import { httpClient } from "@/core/api/http-client";
import { handleApiError } from "@/helpers/error-handler";
import type {
  User,
  UsersPaginatedResponse,
  CreateUserDto,
  UpdateUserDto,
} from "@/core/auth/interface/user";

export const getUsers = async (
  page = 1,
  limit = 10,
  search?: string
): Promise<UsersPaginatedResponse> => {
  try {
    const response = await httpClient.get<UsersPaginatedResponse>(
      API_ENDPOINTS.USERS.LIST,
      {
        params: {
          page,
          limit,
          ...(search && search.trim() !== "" ? { search: search.trim() } : {}),
        },
      }
    );

    if (Array.isArray(response.data)) {
      return {
        items: response.data,
        pagination: {
          total: response.data.length,
          page,
          limit,
          lastPage: 1,
          hasNext: false,
          hasPrev: false,
        },
      };
    }

    return response.data;
  } catch (error) {
    const errorMessage = handleApiError(error, "getUsers");
    throw new Error(errorMessage);
  }
};

export const getUserById = async (id: number): Promise<User> => {
  try {
    const response = await httpClient.get<User>(
      API_ENDPOINTS.USERS.GET_BY_ID(id)
    );
    return response.data;
  } catch (error) {
    const errorMessage = handleApiError(error, "getUserById");
    throw new Error(errorMessage);
  }
};

export const createUser = async (data: CreateUserDto): Promise<User> => {
  try {
    const response = await httpClient.post<User>(
      API_ENDPOINTS.USERS.CREATE,
      data
    );
    return response.data;
  } catch (error) {
    const errorMessage = handleApiError(error, "createUser");
    throw new Error(errorMessage);
  }
};

export const updateUser = async (
  id: number,
  data: UpdateUserDto
): Promise<User> => {
  try {
    const response = await httpClient.patch<User>(
      API_ENDPOINTS.USERS.UPDATE(id),
      data
    );
    return response.data;
  } catch (error) {
    const errorMessage = handleApiError(error, "updateUser");
    throw new Error(errorMessage);
  }
};

export const deleteUser = async (id: number): Promise<void> => {
  try {
    await httpClient.delete(API_ENDPOINTS.USERS.DELETE(id));
  } catch (error) {
    const errorMessage = handleApiError(error, "deleteUser");
    throw new Error(errorMessage);
  }
};
