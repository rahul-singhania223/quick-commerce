// app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center">
      {/* Optional icon */}
      <div className="mb-4 text-gray-400">
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 21l-6-6" />
          <circle cx="10" cy="10" r="7" />
        </svg>
      </div>

      <h1 className="mb-2 text-xl font-semibold text-gray-900">
        Page not found
      </h1>

      <p className="mb-6 max-w-70 text-sm text-gray-500">
        The page you’re looking for doesn’t exist or has been moved.
      </p>

      <Link
        href="/"
        className="w-full max-w-xs rounded-lg bg-primary py-3 text-sm font-semibold text-white transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        Go to Home
      </Link>
    </div>
  );
}
