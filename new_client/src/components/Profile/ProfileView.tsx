import { ShieldAlert, Trash2, KeyRound, Upload, X, Pencil, Check, Loader } from "lucide-react"
import { useState } from "react"
import { useAuthStore } from "../../store/authStore"
import type { User } from "../../types"
import PasswordModal from "./PasswordModal"
import DeleteAccountModal from "./DeleteAccountModal"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"

interface ProfileViewProps {
    user: User;
}

export default function ProfileView({ user }: ProfileViewProps) {
    const { updateProfile } = useAuthStore()

    const [isEditing, setIsEditing] = useState(false)
    const [username, setUsername] = useState(user?.name || "Unknown")
    const [email, setEmail] = useState(user?.email || "Unknown")
    const [profileImage, setProfileImage] = useState(user?.profileImage || "")
    const [isPasswordModalOpen, setPasswordModalOpen] = useState(false)
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onloadend = () => setProfileImage(reader.result as string)
        }
    }

    const handleSave = async () => {
        if (!isEditing) { setIsEditing(true); return }
        setIsSaving(true)
        const success = await updateProfile({ name: username, email, profileImage })
        setIsSaving(false)
        if (success) setIsEditing(false)
    }

    const accountCreated = user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
        : "October 24, 2025"

    return (
        <>
            <div className="relative z-10 w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8 mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Personal Info */}
                <div className="lg:col-span-2">
                    <div className="relative rounded-[17px] bg-border-gradient animate-border-shift p-[1px] shadow-sm hover:shadow-md h-full">
                        <section className="h-full overflow-hidden rounded-2xl bg-white/60 p-6 backdrop-blur-xl sm:p-8">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold tracking-tight text-slate-900">Personal Information</h2>
                                <Button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    variant={isEditing ? "default" : "outline"}
                                    size="sm"
                                    className="rounded-full"
                                >
                                    {isEditing
                                        ? <>{isSaving ? <Loader size={14} className="animate-spin" /> : <Check size={14} strokeWidth={3} />} Save</>
                                        : <><Pencil size={14} /> Edit</>
                                    }
                                </Button>
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
                                                <input type="file" accept="image/png, image/jpeg, image/gif" className="hidden" onChange={handleImageUpload} />
                                            </label>
                                            <button type="button" onClick={() => setProfileImage("")} className="flex items-center gap-1.5 text-slate-500 transition-colors hover:text-red-500">
                                                <X size={15} strokeWidth={2.5} /> Remove
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <form className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
                                <div>
                                    <Label htmlFor="username" className="mb-1.5">Username</Label>
                                    <Input
                                        id="username"
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        disabled={!isEditing}
                                        className="mt-1.5 h-11 rounded-[14px] text-[15px]"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="email" className="mb-1.5">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={!isEditing}
                                        className="mt-1.5 h-11 rounded-[14px] text-[15px]"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="accountCreated" className="mb-1.5">Account Created</Label>
                                    <Input
                                        id="accountCreated"
                                        type="text"
                                        value={accountCreated}
                                        disabled
                                        readOnly
                                        className="mt-1.5 h-11 rounded-[14px] text-[15px]"
                                    />
                                </div>
                            </form>
                        </section>
                    </div>
                </div>

                {/* Side Column */}
                <div className="lg:col-span-1 space-y-6 flex flex-col">
                    {/* Security */}
                    <div className="flex-1 relative rounded-[17px] bg-border-gradient animate-border-shift p-[1px] shadow-sm hover:shadow-md">
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
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setPasswordModalOpen(true)}
                                        className="w-full rounded-full border-slate-300/60 bg-white/50 text-slate-700 hover:border-emerald-400 hover:text-emerald-600 hover:bg-white/80"
                                    >
                                        <KeyRound size={15} /> Change Password
                                    </Button>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Danger Zone */}
                    <div className="relative rounded-[17px] bg-border-gradient-danger animate-border-shift p-[1px] shadow-sm hover:shadow-md">
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
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setDeleteModalOpen(true)}
                                    className="w-full rounded-full border-red-200/80 bg-white/60 text-red-600 hover:bg-red-50 hover:border-red-300"
                                >
                                    <Trash2 size={16} /> Delete Account
                                </Button>
                            </div>
                        </section>
                    </div>
                </div>
            </div>

            {isPasswordModalOpen && (
                <PasswordModal
                    onClose={() => setPasswordModalOpen(false)}
                    inputClasses="mt-1.5 block w-full rounded-[14px] border border-emerald-500 bg-white/80 px-4 py-2.5 text-[15px] font-medium outline-none transition-all focus:bg-white focus:ring-4 focus:ring-emerald-100/50 shadow-sm"
                />
            )}
            {isDeleteModalOpen && (
                <DeleteAccountModal
                    onClose={() => setDeleteModalOpen(false)}
                    onConfirm={() => setDeleteModalOpen(false)}
                />
            )}
        </>
    )
}
