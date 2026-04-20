import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = { title: "404 — Page Not Found" };

export default function NotFound() {
  return (
    <div className="min-h-screen bg-ink-900 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Big 404 */}
        <p className="font-display text-[8rem] sm:text-[12rem] leading-none text-ink-600 select-none mb-4">
          404
        </p>
        <h1 className="font-display text-3xl text-cream-100 mb-4">Page not found</h1>
        <p className="text-cream-200/50 font-mono text-sm mb-10">
          This page doesn't exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-mono text-sm text-electric-400
                     border border-electric-400/30 px-6 py-3 rounded-lg hover:bg-electric-400/10 transition-all"
        >
          <ArrowLeft size={14} />
          Back to home
        </Link>
      </div>
    </div>
  );
}
