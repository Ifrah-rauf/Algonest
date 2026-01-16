import { useState } from "react";

export default function LoadingButton({
  children,
  onClick,
  className = "",
  disabled = false,
}) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (loading) return; // prevent double click

    setLoading(true);
    try {
      await onClick(); // call parent function
    } finally {
      setLoading(false); // always turn off
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || loading}
      className={`relative flex items-center justify-center px-4 py-2 
                  rounded-md text-white bg-blue-600
                  disabled:opacity-50 disabled:cursor-not-allowed
                  ${className}`}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg
            className="animate-spin h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
