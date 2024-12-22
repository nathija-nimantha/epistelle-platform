"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

interface SideNavBarProps {
  hasPremium: boolean;
}

const SideNavBar: React.FC<SideNavBarProps> = ({ hasPremium }) => {
  const router = useRouter();
  const { theme } = useTheme();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const bgClass =
    theme === "dark"
      ? "bg-gray-800 border-gray-700 text-white"
      : "bg-white border-gray-300 text-gray-800";

  const hoverClass =
    theme === "dark"
      ? "hover:bg-gray-700 hover:text-gray-200"
      : "hover:bg-gray-100 hover:text-gray-600";

  return (
    <div
      className={`fixed top-1/4 left-0 w-20 border shadow-lg rounded-r-lg flex flex-col items-center py-6 space-y-6 transition-colors duration-300 ${bgClass}`}
    >
      <button
        onClick={() => handleNavigation("/profile")}
        className={`flex flex-col items-center space-y-1 group ${hoverClass}`}
      >
        <div
          className={`w-10 h-10 flex items-center justify-center rounded-full transition ${hoverClass}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 12c2.485 0 4.5-2.015 4.5-4.5S14.485 3 12 3 7.5 5.015 7.5 7.5 9.515 12 12 12zM12 12c-3.315 0-6 2.685-6 6v1h12v-1c0-3.315-2.685-6-6-6z"
            />
          </svg>
        </div>
        <span className="text-xs font-medium">Profile</span>
      </button>

      {hasPremium && (
        <button
          onClick={() => handleNavigation("/payments")}
          className={`flex flex-col items-center space-y-1 group ${hoverClass}`}
        >
          <div
            className={`w-10 h-10 flex items-center justify-center rounded-full transition ${hoverClass}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 10h18M3 6h18M10 14h4m-2 4v-4m-4 0H4m0 0v-4h16v4H4z"
              />
            </svg>
          </div>
          <span className="text-xs font-medium">Payments</span>
        </button>
      )}

      {!hasPremium && (
        <button
          onClick={() => handleNavigation("/upgrade")}
          className={`flex flex-col items-center space-y-1 group ${hoverClass}`}
        >
          <div
            className={`w-10 h-10 flex items-center justify-center rounded-full transition ${hoverClass}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 20v-6a2 2 0 012-2h4a2 2 0 012 2v6m-6-10V4m0 0L7 8m5-4l5 4"
              />
            </svg>
          </div>
          <span className="text-xs font-medium">Upgrade</span>
        </button>
      )}

      <button
        onClick={() => handleNavigation("/your-blogs")}
        className={`flex flex-col items-center space-y-1 group ${hoverClass}`}
      >
        <div
          className={`w-10 h-10 flex items-center justify-center rounded-full transition ${hoverClass}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 8h18M3 16h18M7 4h10M7 20h10"
            />
          </svg>
        </div>
        <span className="text-xs font-medium">Blogs</span>
      </button>

      <button
        onClick={() => handleNavigation("/public-blogs")}
        className={`flex flex-col items-center space-y-1 group ${hoverClass}`}
      >
        <div
          className={`w-10 h-10 flex items-center justify-center rounded-full transition ${hoverClass}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12h6M12 15V9m-9 6h18m-2 6H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <span className="text-xs font-medium">Public Blogs</span>
      </button>
    </div>
  );
};

export default SideNavBar;