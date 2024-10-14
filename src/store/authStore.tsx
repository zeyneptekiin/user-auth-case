import { create } from 'zustand';
import { deleteCookie } from 'cookies-next';

type AuthState = {
    email: string;
    password: string;
    userName: string | null;
    setEmail: (email: string) => void;
    setPassword: (password: string) => void;
    setUserName: (userName: string) => void;
    clearAuth: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
    email: '',
    password: '',
    userName: null,

    setEmail: (email: string) => set({ email }),
    setPassword: (password: string) => set({ password }),
    setUserName: (userName: string) => set({ userName }),
    clearAuth: () => {
        deleteCookie('authToken');
        set({ userName: null, email: '', password: '', });
    },
}));
