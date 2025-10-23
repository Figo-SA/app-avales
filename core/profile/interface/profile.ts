export interface UserProfile {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  cedula?: string;

  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateProfileRequest {
  nombre?: string;
  apellido?: string;
  cedula?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
