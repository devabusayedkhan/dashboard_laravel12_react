import { usePage } from "@inertiajs/react";

export function AppFooter() {
  const { site } = usePage<{ site: { copyright: string; } }>().props;
  return (
    <footer className="py-4 border-t-2">
      <div className="mx-auto flex flex-col lg:flex-row justify-between items-center px-4 md:max-w-7xl">
        {/* Left side */}
        <p className="text-sm text-gray-700 dark:text-gray-300 m-0">
          {site?.copyright}
        </p>

        {/* Right side (optional links) */}
        <div className="flex">
          {/* Example: Privacy Policy */}
          <a
            href="#"
            className="text-sm text-gray-700 dark:text-gray-300 hover:text-orange-500"
          >
            Privacy Policy
          </a>
          <span className="mx-1">|</span>
          <a
            href="#"
            className="text-sm text-gray-700 dark:text-gray-300 hover:text-orange-500"
          >
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
}