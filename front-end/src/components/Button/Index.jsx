import { Loader2 } from "lucide-react";

function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  disabled = false,
  onClick,
  className = "",
  type = "button",
}) {
  const baseClasses =
    "font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center";

  // Palet warna yang lebih menarik
  const variantClasses = {
    primary: "bg-blue-300 hover:bg-blue-700 text-white focus:ring-blue-500",
    secondary:
      "bg-purple-600 hover:bg-purple-700 text-white focus:ring-purple-500",
    success:
      "bg-emerald-500 hover:bg-emerald-600 text-white focus:ring-emerald-400",
    danger: "bg-red-500 hover:bg-red-600 text-white focus:ring-red-400",
    warning:
      "bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-400",
    info: "bg-sky-500 hover:bg-sky-600 text-white focus:ring-sky-400",
    dark: "bg-gray-800 hover:bg-gray-900 text-white focus:ring-gray-700",
    light:
      "bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 focus:ring-gray-400",
    outlinePrimary:
      "bg-transparent border border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500",
    outlineSecondary:
      "bg-transparent border border-purple-600 text-purple-600 hover:bg-purple-50 focus:ring-purple-500",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const widthClass = fullWidth ? "w-full" : "";

  const isLoading = loading || disabled;

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${
        sizeClasses[size]
      } ${widthClass} ${className} ${
        isLoading ? "opacity-70 cursor-not-allowed" : "cursor-pointer"
      }`}
      onClick={onClick}
      disabled={isLoading}
    >
      {loading ? (
        <><Loader2 className="h-5 w-5 animate-spin" /> Loading...</>
      ) : (
        children
      )}
    </button>
  );
}

export default Button;
