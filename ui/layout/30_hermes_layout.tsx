/**
 * 30_hermes_layout.tsx
 *
 * App shell layout for Hermes pages.
 * Assumes Tailwind + Next.js App Router.
 */

"use client";

import React from "react";
import HermesNavigation from "./31_hermes_navigation";

type Props = {
  children: React.ReactNode;
};

export default function HermesLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="grid min-h-screen grid-cols-12">
        <aside className="col-span-12 border-b bg-white md:col-span-3 md:border-b-0 md:border-r lg:col-span-2">
          <HermesNavigation />
        </aside>

        <main className="col-span-12 md:col-span-9 lg:col-span-10">
          <div className="mx-auto max-w-7xl p-4 md:p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
