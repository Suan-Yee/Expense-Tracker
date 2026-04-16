import type { ApiResponse } from "../types";
import type {
  AuthResponse,
  LoginRequest,
  SignupRequest,
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
