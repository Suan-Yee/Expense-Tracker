import { ShieldAlert, Trash2, KeyRound, Upload, X, Pencil, Check, Loader } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import type { User } from "../../types";
import PasswordModal from "./PasswordModal";
import DeleteAccountModal from "./DeleteAccountModal";

interface ProfileViewProps {
    user: User;
}

const BASE_INPUT = "mt-1.5 block w-full rounded-[14px] border px-4 py-2.5 text-[15px] font-medium transition-all duration-200 outline-none";
const ACTIVE_INPUT = "border-emerald-500 bg-white/80 text-slate-800 placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:ring-emerald-100/50 shadow-sm";
const DISABLED_INPUT = "border-transparent bg-slate-100/40 text-slate-600 cursor-not-allowed";
const LOCKED_INPUT = `${BASE_INPUT} border-transparent bg-slate-100/40 text-slate-500 cursor-not-allowed`;
const MODAL_INPUT = `${BASE_INPUT} ${ACTIVE_INPUT}`;

export default function ProfileView({ user }: ProfileViewProps) {
    const { updateProfile } = useAuthStore();

    const [isEditing, setIsEditing] = useState(false);
    const [username, setUsername] = useState(user?.name || "Unknown");
    const [email, setEmail] = useState(user?.email || "Unknown");
    const [profileImage, setProfileImage] = useState(user?.profileImage || "");
    const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => setProfileImage(reader.result as string);
        }
    };

    const handleSave = async () => {
        if (!isEditing) { setIsEditing(true); return; }
        setIsSaving(true);
        const success = await updateProfile({ name: username, email, profileImage });
        setIsSaving(false);
        if (success) setIsEditing(false);
    };

    const handleDeleteConfirm = () => {
        // TODO: call delete account action
        setDeleteModalOpen(false);
    };

    const accountCreated = user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
        : "October 24, 2025";

    const inputClasses = `${BASE_INPUT} ${isEditing ? ACTIVE_INPUT : DISABLED_INPUT}`;

    return (
        <>
            <div className="relative z-10 w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8 mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* ── 1. Main Column: Personal Info ── */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="relative rounded-[17px] bg-border-gradient animate-border-shift p-[1px] shadow-sm transition-all hover:shadow-md h-full">
                        <section className="h-full overflow-hidden rounded-2xl bg-white/60 p-6 backdrop-blur-xl sm:p-8">

                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold tracking-tight text-slate-900">Personal Information</h2>
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-bold transition-all ${
                                        isEditing
                                            ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20 hover:bg-emerald-600 disabled:opacity-70 disabled:cursor-wait"
                                            : "bg-slate-200/60 text-slate-700 hover:bg-slate-200"
                                    }`}
                                >
                                    {isEditing ? (
                                        <>{isSaving ? <Loader size={14} className="animate-spin" /> : <Check size={14} strokeWidth={3} />} Save</>
                                    ) : (
                                        <><Pencil size={14} /> Edit</>
                                    )}
                                </button>
                            </div>

                            {/* Avatar */}
                            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                                <div className="relative size-20 shrink-0 overflow-hidden rounded-full bg-slate-100/50 p-[2px] bg-border-gradient animate-border-shift shadow-sm">
                                    <div className="h-full w-full overflow-hidden rounded-full bg-white">
                                        <img
                                            src={profileImage || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150"}
                                            alt="Profile"
                                            className="size-full object-cover"
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col text-sm">
                                    <h3 className="font-bold text-slate-800">Profile Picture</h3>
                                    <p className="mt-0.5 text-slate-500">Support PNG, JPG or GIF under 5MB.</p>
                                    {isEditing && (
                                        <div className="mt-2.5 flex items-center gap-4 font-semibold animate-in fade-in duration-300">
                                            <label className="flex cursor-pointer items-center gap-1.5 text-emerald-600 transition-colors hover:text-emerald-700">
                                                <Upload size={14} strokeWidth={2.5} />
                                                <span>Upload new picture</span>
                                                <input
                                                    type="file"
                                                    accept="image/png, image/jpeg, image/gif"
                                                    className="hidden"
                                                    onChange={handleImageUpload}
                                                />
                                            </label>
                                            <button
                                                type="button"
                                                onClick={() => setProfileImage("")}
                                                className="flex items-center gap-1.5 text-slate-500 transition-colors hover:text-red-500"
                                            >
                                                <X size={15} strokeWidth={2.5} /> Remove
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Form */}
                            <form className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
                                <div>
                                    <label htmlFor="username" className="block text-xs font-bold tracking-wide text-slate-600">Username</label>
                                    <input
                                        type="text"
                                        id="username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        disabled={!isEditing}
                                        className={inputClasses}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-xs font-bold tracking-wide text-slate-600">Email Address</label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={!isEditing}
                                        className={inputClasses}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="accountCreated" className="block text-xs font-bold tracking-wide text-slate-600">Account Created</label>
                                    <input
                                        type="text"
                                        id="accountCreated"
                                        value={accountCreated}
                                        disabled
                                        readOnly
                                        className={LOCKED_INPUT}
                                    />
                                </div>
                            </form>
                        </section>
                    </div>
                </div>

                {/* ── 2. Side Column: Security & Danger ── */}
                <div className="lg:col-span-1 space-y-6 flex flex-col">

                    {/* Security */}
                    <div className="flex-1 relative rounded-[17px] bg-border-gradient animate-border-shift p-[1px] shadow-sm transition-all hover:shadow-md">
                        <section className="h-full overflow-hidden rounded-2xl bg-white/60 p-6 backdrop-blur-xl">
                            <div className="flex flex-col gap-4">
                                <div>
                                    <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight text-slate-900">
                                        <KeyRound size={20} className="text-emerald-500" />
                                        Security Settings
                                    </h2>
                                    <p className="mt-2 text-sm text-slate-600">
                                        Keep your account secure by using a strong password. You must re-enter your old password before setting a new one.
                                    </p>
                                </div>
                                <div className="mt-auto pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setPasswordModalOpen(true)}
                                        className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-300/60 bg-white/50 px-5 py-2.5 text-sm font-bold text-slate-700 shadow-sm backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-emerald-400 hover:text-emerald-600 hover:bg-white/80 hover:shadow-md"
                                    >
                                        <KeyRound size={15} /> Change Password
                                    </button>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Danger Zone */}
                    <div className="relative rounded-[17px] bg-border-gradient-danger animate-border-shift p-[1px] shadow-sm transition-all hover:shadow-md">
                        <section className="overflow-hidden rounded-2xl bg-red-50/40 p-6 backdrop-blur-xl">
                            <div className="flex flex-col gap-4">
                                <div>
                                    <h2 className="flex items-center gap-2 text-lg font-bold tracking-tight text-red-700">
                                        <ShieldAlert size={20} /> Danger Zone
                                    </h2>
                                    <p className="mt-1 text-sm font-medium text-red-600/80">
                                        Permanently delete your account and all data. Irreversible.
                                    </p>
                                </div>
                                <div className="mt-2">
                                    <button
                                        type="button"
                                        onClick={() => setDeleteModalOpen(true)}
                                        className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-full border border-red-200/80 bg-white/60 px-5 py-2.5 text-sm font-bold text-red-600 shadow-sm backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:bg-red-50 hover:border-red-300 hover:shadow-md"
                                    >
                                        <Trash2 size={16} /> Delete Account
                                    </button>
                                </div>
                            </div>
                        </section>
                    </div>

                </div>
            </div>

            {/* ── Modals ── */}
            {isPasswordModalOpen && (
                <PasswordModal
                    onClose={() => setPasswordModalOpen(false)}
                    inputClasses={MODAL_INPUT}
                />
            )}

            {isDeleteModalOpen && (
                <DeleteAccountModal
                    onClose={() => setDeleteModalOpen(false)}
                    onConfirm={handleDeleteConfirm}
                />
            )}
        </>
    );
}