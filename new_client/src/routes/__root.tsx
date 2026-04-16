import { createRootRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import AnimatedBackground from "../components/AnimatedBackground";

export const Route = createRootRoute({
    component: RootLayout
})

function RootLayout() {

    const {matches} = useRouterState()
    const activeMatch = matches[matches.length - 1]
    const { title = "ExpenseTracker" } = activeMatch.context as { title: string }

    useEffect(() => {
        document.title = title;
    }, [title]);

    return (
        <>
            <AnimatedBackground />
            <Outlet />
        </>
    )
}