"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { authApi } from "@/lib/api";

const SESSION_KEY = "authSession";
const AuthContext = createContext(null);

function readSession() {
    try {
        const raw = sessionStorage.getItem(SESSION_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export function AuthProvider({ children }) {
    const [session, setSession] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // sessionStorage is client-only, so restore after mount
    useEffect(() => {
        setSession(readSession());
        setIsLoading(false);
    }, []);

    /** Calls /partner_login and caches the token in the session. Rejects with the backend message. */
    const login = useCallback(async ({ email, password }) => {
        const userId = email.trim();
        const { accessToken, tokenType } = await authApi.partnerLogin({ email: userId, password });

        // 15482 returns no profile, so the user is built from the sign-in email
        const next = {
            user: { id: userId, name: userId, email: userId, role: "Solution Provider" },
            accessToken,
            tokenType,
            loggedInAt: new Date().toISOString(),
        };
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(next));
        setSession(next);
        return next.user;
    }, []);

    const logout = useCallback(() => {
        sessionStorage.removeItem(SESSION_KEY);
        setSession(null);
    }, []);

    const value = useMemo(
        () => ({
            user: session?.user ?? null,
            loggedInAt: session?.loggedInAt ?? null,
            accessToken: session?.accessToken ?? null,
            tokenType: session?.tokenType ?? null,
            isAuthenticated: Boolean(session?.user),
            isLoading,
            login,
            logout,
        }),
        [session, isLoading, login, logout]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/** Cached partner token for non-React code (e.g. an axios interceptor). Null when signed out. */
export function getAccessToken() {
    if (typeof window === "undefined") return null;
    return readSession()?.accessToken ?? null;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used inside <AuthProvider>");
    return context;
}
