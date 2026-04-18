import { type ReactNode } from "react";
import { motion } from "framer-motion";

interface AuthFormFieldProps {
  id: string;
  label: string;
  children: ReactNode;
}

/** A labelled field wrapper shared by Login and Signup forms. */
export default function AuthFormField({ id, label, children }: AuthFormFieldProps) {
  return (
    <motion.div layout className="space-y-2">
      <label
        className="text-[10px] font-bold tracking-[0.08em] text-slate-500"
        htmlFor={id}
      >
        {label}
      </label>
      <div className="relative">{children}</div>
    </motion.div>
  );
}
