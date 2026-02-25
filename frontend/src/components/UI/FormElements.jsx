import React from "react";
import { Loader2 } from "lucide-react";

export function Button({ 
  children, 
  variant = 'primary', 
  isLoading, 
  disabled, 
  className = '', 
  ...props 
}) {
  const baseStyles = "inline-flex items-center justify-center gap-2 font-medium transition-all active:scale-95 disabled:active:scale-100 disabled:opacity-70 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    outline: "border border-app text-primary hover:bg-gray-50 dark:hover:bg-slate-800",
    ghost: "text-secondary hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-primary",
    danger: "bg-red-600 text-white hover:bg-red-700 shadow-sm"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}

export function Input({ label, error, className = '', ...props }) {
    return (
      <div className={`space-y-1.5 ${className}`}>
        {label && (
          <label className="block text-sm font-medium text-secondary">
            {label}
          </label>
        )}
        <input
          className={`input-field
            ${error ? 'border-red-500 focus:ring-red-200 dark:border-red-500' : ''}
          `}
          {...props}
        />
        {error && (
          <p className="text-xs text-red-500">{error.message || error}</p>
        )}
      </div>
    );
  }
  
export function TextArea({ label, error, className = '', ...props }) {
    return (
      <div className={`space-y-1.5 ${className}`}>
        {label && (
          <label className="block text-sm font-medium text-secondary">
            {label}
          </label>
        )}
        <textarea
          className={`input-field min-h-[100px] py-3
            ${error ? 'border-red-500 focus:ring-red-200 dark:border-red-500' : ''}
          `}
          {...props}
        />
        {error && (
          <p className="text-xs text-red-500">{error.message || error}</p>
        )}
      </div>
    );
}
