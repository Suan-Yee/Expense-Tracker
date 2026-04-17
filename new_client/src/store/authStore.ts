import { create } from "zustand";
import type { AuthState } from "../types/auth.types";
import { login as loginService, signup as signupService } from "../services/authService";
import { TOKEN_KEY } from "../services/api";
import type { AxiosError } from "axios";

interface AuthStore extends AuthState {
    login: (email: string, password: string) => Promise<void>
    signup: (name: string, email: string, password: string) => Promise<boolean>
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
