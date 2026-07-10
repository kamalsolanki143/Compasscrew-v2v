"use client";

export default function Loader() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-950">
      <div className="relative flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-700 border-t-rose-500" />
        <p className="text-sm text-gray-400">Loading…</p>
      </div>
    </div>
  );
}
