import { create } from "zustand";
import type { AuthState } from "../types/auth.types";
import { login as loginService, signup as signupService, getProfile as getProfileService, updateProfile as updateProfileService, changePassword as changePasswordService, deleteAccount as deleteAccountService } from "../services/authService";
import type { UpdateProfileRequest, ChangePasswordRequest } from "../types/auth.types";
import { TOKEN_KEY } from "../services/api";
import type { AxiosError } from "axios";

interface AuthStore extends AuthState {
    login: (email: string, password: string) => Promise<void>
    signup: (name: string, email: string, password: string) => Promise<boolean>
    getProfile: () => Promise<void>
    updateProfile: (data: UpdateProfileRequest) => Promise<boolean>
    changePassword: (data: ChangePasswordRequest) => Promise<boolean>
    deleteAccount: () => Promise<boolean>
    logout: () => void
}

const storedToken = localStorage.getItem(TOKEN_KEY);

export const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    token: storedToken,
    isLoading: false,
    error: null,
    isAuthenticated: Boolean(storedToken),

    login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });

        try {
            const response = await loginService({ email, password });

            if (response.data) {
                const { user, token } = response.data;
                localStorage.setItem(TOKEN_KEY, token);

                set({
                    user,
                    token,
                    isAuthenticated: true,
                    isLoading: false,
                    error: null,
                });
            }
        } catch (error) {
            const err = error as AxiosError<{ errorMessage?: string, error?: string }>
            set({
                error: err.response?.data?.errorMessage || "Unable to login right now.",
                isLoading: false,
                isAuthenticated: false
            })
        }
    },

    signup: async (name: string, email: string, password: string) => {
        set({isLoading: true, error: null})

        try {
            const response = await signupService({name, email, password})

            if (response.data) {
                const { user } = response.data;

                set({
                    user,
                    isLoading: false,
                    error: null,
                });
                return true;
            }
            return false;
        } catch (error) {
            const err = error as AxiosError<{ errorMessage?: string, error?: string }>
            set({
                error: err.response?.data?.errorMessage || "Unable to sign up right now.",
                isLoading: false,
                isAuthenticated: false
            })
            return false;
        }
    },

    getProfile: async () => {
        set({ isLoading: true })

        try {
            const response = await getProfileService();
            if (response.data) {
                set({
                    user: response.data,
                    isLoading: false,
                    error: null,
                })
            }
        } catch (error) {
            const err = error as AxiosError<{ errorMessage?: string, error?: string }>
            set({
                error: err.response?.data?.errorMessage || "Unable to sign up right now.",
                isLoading: false,
            })
        }
    },

    updateProfile: async (data: UpdateProfileRequest) => {
        set({ isLoading: true, error: null });
        try {
            const response = await updateProfileService(data);
            if (response.data) {
                set({
                    user: response.data,
                    isLoading: false,
                    error: null,
                });
                return true;
            }
            return false;
        } catch (error) {
            const err = error as AxiosError<{ errorMessage?: string }>;
            set({
                error: err.response?.data?.errorMessage || "Unable to update profile right now.",
                isLoading: false,
            });
            return false;
        }
    },

    changePassword: async (data: ChangePasswordRequest) => {
        set({ isLoading: true, error: null });
        try {
            const response = await changePasswordService(data);
            if (response.success) {
                set({ isLoading: false, error: null });
                return true;
            }
            return false;
        } catch (error) {
            const err = error as AxiosError<{ errorMessage?: string }>;
            set({
                error: err.response?.data?.errorMessage || "Unable to change password right now.",
                isLoading: false,
            });
            return false;
        }
    },

    deleteAccount: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await deleteAccountService();
            if (response.success) {
                set({ isLoading: false });
                return true;
            }
            return false;
        } catch (error) {
            const err = error as AxiosError<{ errorMessage?: string }>;
            set({
                error: err.response?.data?.errorMessage || "Unable to delete account right now.",
                isLoading: false,
            });
            return false;
        }
    },

    logout: () => {
        localStorage.removeItem(TOKEN_KEY);
        set({
            user: null,
            token: null,
            isAuthenticated: false,
            error: null,
        });
    },
}));
