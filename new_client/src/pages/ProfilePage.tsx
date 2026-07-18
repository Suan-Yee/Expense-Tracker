import { useEffect } from "react";
import ProfileView from "../components/Profile/ProfileView";
import Loader from "../components/Common/Loader";
import GlobalError from "../components/Common/GlobalError";
import { useAuthStore } from "../store/authStore";
import PageHeader from "../components/Common/PageHeader";

export default function ProfilePage() {

    const { getProfile, isLoading, error, user } = useAuthStore();
    useEffect(() => {
        getProfile();
    }, [getProfile]);

    return (
        <main className="page-shell max-w-7xl">
            <PageHeader eyebrow="Account" title="Profile & security" description="Keep your personal details current and review sensitive account controls." />
            {isLoading && (
                <div className="pt-20">
                    <Loader text="Loading your profile…" />
                </div>
            )}

            {error && (
                <GlobalError message={error} onRetry={() => getProfile()} />
            )}
            
            {!isLoading && !error && user && <ProfileView user={user}/>}
        </main>
    )
}
