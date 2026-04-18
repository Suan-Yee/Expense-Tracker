import { useEffect } from "react";
import ProfileView from "../components/Profile/ProfileView";
import Loader from "../components/Common/Loader";
import GlobalError from "../components/Common/GlobalError";
import { useAuthStore } from "../store/authStore";

export default function ProfilePage() {

    let { getProfile, isLoading, error, user } = useAuthStore();
    useEffect(() => {
        getProfile();
    }, [getProfile]);

    return (
        <main className="min-h-screen pt-4 pb-12 w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            {isLoading && (
                <div className="pt-20">
                    <Loader text="Loading your forest tracker profile..." />
                </div>
            )}

            {error && (
                <GlobalError message={error} onRetry={() => getProfile()} />
            )}
            
            {!isLoading && !error && user && <ProfileView user={user}/>}
        </main>
    )
}