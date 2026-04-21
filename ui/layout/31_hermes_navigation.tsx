/**
 * 31_hermes_navigation.tsx
 *
 * Sidebar navigation for Hermes.
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const NAV_ITEMS = [
  { href: "/hermes", label: "Dashboard" },
  { href: "/hermes/approvals", label: "Approvals" },
  { href: "/hermes/conflicts", label: "Conflicts" },
  { href: "/hermes/memory", label: "Memory" },
];

function navClass(active: boolean) {
  return [
    "block rounded-md px-3 py-2 text-sm transition",
    active ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100",
  ].join(" ");
}

export default function HermesNavigation() {
  const pathname = usePathname();

  return (
    <nav className="p-4">
      <div className="mb-6">
        <div className="text-xs uppercase tracking-wide text-gray-500">System</div>
        <div className="mt-1 text-lg font-semibold">Hermes</div>
        <div className="text-sm text-gray-500">Brain Extraction Agent</div>
      </div>

      <div className="space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className={navClass(active)}>
              {item.label}
            </Link>
          );
        })}
      </div>

      <div className="mt-8 rounded-lg border bg-white p-3">
        <div className="text-xs uppercase tracking-wide text-gray-500">
          Quick Actions
        </div>
        <div className="mt-3 space-y-2">
          <Link
            href="/hermes/sessions/test-session"
            className="block rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
          >
            Open Test Session
          </Link>
          <Link
            href="/hermes/approvals"
            className="block rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
          >
            Review Queue
          </Link>
        </div>
      </div>
    </nav>
  );
}
