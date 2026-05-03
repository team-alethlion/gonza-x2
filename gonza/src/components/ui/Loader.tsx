import React from "react";

interface LoaderProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showText?: boolean;
}

const Loader: React.FC<LoaderProps> = ({ 
  size = "md", 
  className = "", 
  showText = true 
}) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-16 h-16",
    lg: "w-24 h-24",
    xl: "w-32 h-32"
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
      <div className={`relative ${sizeClasses[size]}`}>
        {/* Animated pulsing background effect */}
        <div className="absolute inset-0 bg-[#f05a2b]/20 rounded-full animate-ping"></div>
        
        {/* The brand icon */}
        <img
          src="/loader-icon.png"
          alt="Loading..."
          className="relative z-10 w-full h-full object-contain animate-pulse shadow-lg rounded-xl"
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
 * Full page loader overlay
 */
export const PageLoader: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/80 dark:bg-[#0B1326]/80 backdrop-blur-sm">
      <Loader size="xl" />
    </div>
  );
};

export default Loader;
