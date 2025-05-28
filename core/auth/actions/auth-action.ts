import { avalesApi } from "../api/avalesApi";
import { User } from "../interface/user";

export interface AuthResponse {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  cedula: string;
  roles: string[];
  token: string;
}

const returnUserToken = (
  data: AuthResponse
): {
  user: User;
  token: string;
} => {
  const { token, ...user } = data;

  return {
    user,
    token,
  };
};

export const authLogin = async (email: string, password: string) => {
  email = email.trim().toLowerCase();
  try {
    const { data } = await avalesApi.post<AuthResponse>("/auth/login", {
      email,
      password,
    });

    return returnUserToken(data);
  } catch (error) {
    console.error("Error during login:", error);
    throw new Error("Login failed. Please check your credentials.");
  }
};

export const authCheckStatus = async () => {
  try {
    const { data } = await avalesApi.get<AuthResponse>("/auth/check-status");
    return returnUserToken(data);
  } catch (error) {
    console.error("Error checking auth status:", error);
    throw new Error("Failed to check authentication status.");
  }
};
