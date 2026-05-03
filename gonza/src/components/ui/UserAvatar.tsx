import React from "react";
import Avatar from "boring-avatars";
import { HiUser } from "react-icons/hi";

interface UserAvatarProps {
  name?: string;
  src?: string;
  size?: number;
  variant?: "marble" | "beam" | "pixel" | "sunset" | "ring" | "bauhaus";
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ 
  name, 
  src, 
  size = 32, 
  variant = "beam" 
}) => {
  if (src) {
    return (
      <img 
        src={src} 
        alt={name || "User Avatar"} 
        style={{ width: size, height: size }}
        className="rounded-full object-cover shadow-sm border border-gray-200 dark:border-gray-700"
      />
    );
  }

  if (name) {
    return (
      <div className="rounded-full overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700">
        <Avatar
          size={size}
          name={name}
          variant={variant}
          colors={["#252861", "#f05a2b", "#80ced7", "#9b87f5", "#f1f0fb"]}
        />
      </div>
    );
  }

  return (
    <div 
      style={{ width: size, height: size }}
      className="flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-gray-700"
    >
      <HiUser style={{ width: size * 0.6, height: size * 0.6 }} />
    </div>
  );
};
