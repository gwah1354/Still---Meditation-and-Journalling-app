import { forwardRef, type InputHTMLAttributes } from "react";

interface GlassInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
}

const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
  ({ label, icon, className = "", ...props }, ref) => {
    return (
      <div className="relative">
        {label && (
          <label className="block text-sm text-gray-400 mb-2 font-medium">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            {...props}
            className={`
              w-full glass
              px-4 py-3
              ${icon ? "pl-11" : ""}
              text-white placeholder-gray-500
              outline-none
              transition-all duration-200
              focus:border-amber-500/30 focus:shadow-[0_0_25px_rgba(251,191,36,0.08)]
              ${className}
            `}
          />
        </div>
      </div>
    );
  },
);

GlassInput.displayName = "GlassInput";
export default GlassInput;
