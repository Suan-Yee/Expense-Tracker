import { createRootRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import AnimatedBackground from "../components/Common/AnimatedBackground";

import { useAuthStore } from "../store/authStore";
import Navigation from "../components/Common/Navigation";

export const Route = createRootRoute({
    component: RootLayout
})

function RootLayout() {

    const {matches} = useRouterState()
    const activeMatch = matches[matches.length - 1]
    const { title = "ExpenseTracker" } = activeMatch.context as { title: string }
    const { isAuthenticated, user, getProfile } = useAuthStore();

    useEffect(() => {
        document.title = title;
    }, [title]);

    useEffect(() => {
        if (isAuthenticated && !user) void getProfile();
    }, [getProfile, isAuthenticated, user]);

    return (
        <div className="flex min-h-screen">
            <AnimatedBackground />
            
            {isAuthenticated && <Navigation />}

            {/* Shift content to the right if Sidebar is rendered */}
            <main className={`flex-1 min-w-0 overflow-x-hidden transition-all ${isAuthenticated ? "pb-20 lg:ml-64 lg:pb-0" : ""}`}>
                <Outlet />
            </main>
        </div>
    )
}
