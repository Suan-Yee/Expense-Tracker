import { Link, useNavigate } from "@tanstack/react-router"
import { Eye, EyeOff, Lock, Mail } from "lucide-react"
import { useState } from "react"
import type { ChangeEvent } from "react"
import { useAuthStore } from "../../store/authStore"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import AuthFormField from "./AuthFormField"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const navigate = useNavigate()
  const { login, isLoading, error } = useAuthStore()

  async function handleSubmit(event: ChangeEvent<HTMLFormElement>) {
    event.preventDefault()
    await login(email, password)
    const { isAuthenticated } = useAuthStore.getState()
    if (isAuthenticated) navigate({ to: "/dashboard" })
  }

  return (
    <section className="relative flex h-[100svh] items-center justify-center overflow-hidden px-4 py-4">
      <div className="relative z-10 w-full max-w-[420px]">
        <motion.form
          layout
          transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
          onSubmit={handleSubmit}
          className="rounded-[22px] border border-white/75 bg-white/92 px-6 py-7 shadow-[0_30px_60px_-38px_rgba(8,75,54,0.55)] backdrop-blur-md sm:px-8 overflow-hidden"
        >
          <motion.header layout className="mb-6 text-center">
            <p className="text-xs font-semibold tracking-[0.14em] text-emerald-600">AUTHPORTAL</p>
            <h1 className="mt-1 text-3xl font-extrabold text-slate-800">Welcome back</h1>
            <p className="mt-1 text-sm text-slate-500">Log in to continue managing your expenses.</p>
          </motion.header>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, scale: 0.95 }}
                transition={{ duration: 0.3, ease: "anticipate" }}
                className="overflow-hidden"
              >
                <div className="mb-4 rounded-xl border border-red-200 bg-red-50/90 px-3 py-2.5 text-[13px] font-medium text-red-600 shadow-sm backdrop-blur-sm">
                  {error}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div layout className="space-y-4">
            <AuthFormField id="email" label="EMAIL">
              <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <Input
                id="email"
                type="email"
                required
                value={email}
                disabled={isLoading}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className="h-11 pl-10 text-[15px]"
              />
            </AuthFormField>

            <AuthFormField id="password" label="PASSWORD">
              <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                disabled={isLoading}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                className="h-11 pl-10 pr-10 text-[15px]"
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                disabled={isLoading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-60"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </AuthFormField>
          </motion.div>

          <motion.div layout className="mt-3 text-right">
            <button type="button" className="text-xs font-semibold text-emerald-600 transition-colors hover:text-emerald-700">
              Forgot password?
            </button>
          </motion.div>

          <motion.div layout className="mt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="h-11 w-full rounded-xl text-[15px]"
            >
              {isLoading ? "Logging in..." : "Log in"}
            </Button>
          </motion.div>

          <motion.p layout className="mt-5 text-center text-sm text-slate-500">
            New here?{" "}
            <Link to="/signup" className="font-semibold text-emerald-600 transition-colors hover:text-emerald-700">
              Create account
            </Link>
          </motion.p>
        </motion.form>
      </div>
    </section>
  )
}
