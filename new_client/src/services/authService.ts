import type { ApiResponse, User } from "../types";
import type {
  AuthResponse,
  LoginRequest,
  SignupRequest,
  UpdateProfileRequest,
  ChangePasswordRequest,
} from "../types/auth.types";
import api from "./api";

export const signup = async (data: SignupRequest) => {
  const response = await api.post<ApiResponse<AuthResponse>>("/auth/signup", data);
  return response.data;
};

export const login = async (data: LoginRequest) => {
  const response = await api.post<ApiResponse<AuthResponse>>("/auth/login", data);
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get<ApiResponse<User>>("/profile");
  return response.data;
}

export const updateProfile = async (data: UpdateProfileRequest) => {
  const response = await api.put<ApiResponse<User>>("/profile", data);
  return response.data;
}

export const changePassword = async (data: ChangePasswordRequest) => {
  const response = await api.put<ApiResponse<null>>("/profile/password", data);
  return response.data;
}

export const deleteAccount = async () => {
  const response = await api.delete<ApiResponse<null>>("/profile");
  return response.data;
}
