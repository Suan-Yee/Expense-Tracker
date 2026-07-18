import { createRootRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import AnimatedBackground from "../components/Common/AnimatedBackground";

import { useAuthStore } from "../store/authStore";
import Navigation from "../components/Common/Navigation";
import NotificationCenter from "../components/Common/NotificationCenter";

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
            <NotificationCenter />

            {/* Shift content to the right if Sidebar is rendered */}
            <main className={`min-w-0 flex-1 overflow-x-hidden transition-all ${isAuthenticated ? "pt-16 lg:ml-64 lg:pt-0" : ""}`}>
                <Outlet />
            </main>
        </div>
    )
}
