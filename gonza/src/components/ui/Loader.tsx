import React from "react";

interface LoaderProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showText?: boolean;
}

const Loader: React.FC<LoaderProps> = ({
  size = "md",
  className = "",
  showText = true,
}) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-16 h-16",
    lg: "w-24 h-24",
    xl: "w-32 h-32",
  };

  return (
    <div
      className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
      <div className={`relative ${sizeClasses[size]}`}>
        {/* Animated pulsing background effect */}
        <div className="absolute inset-0  rounded-full animate-ping"></div>

        {/* The brand icon */}
        <img
          src="/loader-icon.png"
          alt="Loading..."
          className="relative z-10 w-full h-full object-contain animate-spin rounded-xl"
        />
      </div>

      {showText && (
        <p className="text-[#252861] dark:text-white font-medium animate-pulse">
          Loading...
        </p>
      )}
    </div>
  );
};

/**
 * Full page loader overlay with brand colors and structured layout
 */
export const PageLoader: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white dark:bg-[#0B1326] transition-colors duration-500">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#252861] via-[#f05a2b] to-[#252861] animate-pulse"></div>

      <div className="relative">
        {/* Subtle glow behind the loader */}
        <div className="absolute -inset-10 bg-[#f05a2b]/10 blur-3xl rounded-full "></div>

        <Loader size="xl" showText={false} />
      </div>

      <div className="mt-8 text-center">
        <h2 className="text-2xl font-bold text-[#252861] dark:text-white tracking-tight">
          Gonza Systems
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 animate-pulse">
          Setting up your workspace...
        </p>
      </div>

      <div className="absolute bottom-12 text-gray-400 dark:text-gray-600 text-xs font-medium uppercase tracking-widest">
        Built for Growth
      </div>
    </div>
  );
};

export default Loader;
