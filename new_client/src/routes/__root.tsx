import { createRootRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import AnimatedBackground from "../components/AnimatedBackground";

import { useAuthStore } from "../store/authStore";
import Navigation from "../components/Common/Navigation";

export const Route = createRootRoute({
    component: RootLayout
})

function RootLayout() {

    const {matches} = useRouterState()
    const activeMatch = matches[matches.length - 1]
    const { title = "ExpenseTracker" } = activeMatch.context as { title: string }
    const { isAuthenticated } = useAuthStore();

    useEffect(() => {
        document.title = title;
    }, [title]);

    return (
        <div className="flex min-h-screen">
            <AnimatedBackground />
            
            {isAuthenticated && <Navigation />}

            {/* Shift content to the right if Sidebar is rendered */}
            <main className={`flex-1 transition-all ${isAuthenticated ? "ml-64" : ""}`}>
                <Outlet />
            </main>
        </div>
    )
}