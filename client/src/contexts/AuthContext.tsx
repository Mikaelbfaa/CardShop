'use client';

import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    useRef,
    ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import type { AuthUser, RegisterPayload } from '@/lib/types';
import {
    loginUser as apiLogin,
    registerUser as apiRegister,
    getUserProfile,
    logoutUser as apiLogout,
} from '@/lib/api';

interface AuthContextType {
    user: AuthUser | null;
    token: string | null;
    loading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (payload: RegisterPayload) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const initialized = useRef(false);

    const clearAuth = useCallback(() => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    }, []);

    // Valida o token salvo no mount
    useEffect(() => {
        if (initialized.current) return;
        initialized.current = true;

        const savedToken = localStorage.getItem('token');
        if (!savedToken) {
            // Use a microtask to avoid synchronous setState in effect body
            queueMicrotask(() => setLoading(false));
            return;
        }

        getUserProfile()
            .then((profile) => {
                if (profile) {
                    setToken(savedToken);
                    setUser(profile);
                } else {
                    clearAuth();
                }
            })
            .finally(() => setLoading(false));
    }, [clearAuth]);

    const login = async (email: string, password: string) => {
        const data = await apiLogin(email, password);
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data.user);
    };

    const register = async (payload: RegisterPayload) => {
        await apiRegister(payload);
        // Auto-login após registro
        const data = await apiLogin(payload.email, payload.password);
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data.user);
    };

    const logout = () => {
        apiLogout();
        clearAuth();
        router.push('/login');
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                isAuthenticated: !!user,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
}
