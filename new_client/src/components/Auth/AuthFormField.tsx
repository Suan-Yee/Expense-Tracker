import { type ReactNode } from "react";

interface AuthFormFieldProps {
  id: string;
  label: string;
  children: ReactNode;
}

/** A labelled field wrapper shared by Login and Signup forms. */
export default function AuthFormField({ id, label, children }: AuthFormFieldProps) {
  return (
    <div>
      <label
        className="control-label"
        htmlFor={id}
      >
        {label}
      </label>
      <div className="relative">{children}</div>
    </div>
  );
}
