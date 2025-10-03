import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "outline" | "solid";
}

export const Button: React.FC<ButtonProps> = ({ children, variant = "solid", ...props }) => {
  const base = "px-4 py-2 rounded text-white font-medium";
  const styles =
    variant === "outline"
      ? "border border-blue-600 text-blue-600 bg-white hover:bg-blue-50"
      : "bg-blue-600 hover:bg-blue-700";

  return <button className={`${base} ${styles}`} {...props}>{children}</button>;
};
