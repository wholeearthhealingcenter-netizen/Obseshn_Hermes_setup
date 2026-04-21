/**
 * 32_hermes_dashboard_page.tsx
 *
 * Dashboard landing page for Hermes.
 */

"use client";

import Link from "next/link";
import React from "react";

type SummaryCardProps = {
  title: string;
  value: string;
  subtitle: string;
  href?: string;
};

function SummaryCard({ title, value, subtitle, href }: SummaryCardProps) {
  const content = (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
      <div className="mt-1 text-sm text-gray-600">{subtitle}</div>
    </div>
  );

  if (!href) return content;

  return (
    <Link href={href} className="block transition hover:-translate-y-0.5">
      {content}
    </Link>
  );
}

export default function HermesDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-sm uppercase tracking-wide text-gray-500">
          Hermes
        </div>
        <h1 className="mt-1 text-2xl font-semibold">
          Operational Intelligence Dashboard
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-gray-600">
          Capture tacit knowledge, validate extracted logic, resolve conflicts,
          and control what memory packets agents can use.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Active Sessions"
          value="3"
          subtitle="Brain extraction interviews in progress"
          href="/hermes/sessions/test-session"
        />
        <SummaryCard
          title="Pending Approvals"
          value="7"
          subtitle="Rules and extractions waiting for review"
          href="/hermes/approvals"
        />
        <SummaryCard
          title="Open Conflicts"
          value="2"
          subtitle="Rule collisions that need resolution"
          href="/hermes/conflicts"
        />
        <SummaryCard
          title="Active Memory Packs"
          value="12"
          subtitle="Packets currently available to agents"
          href="/hermes/memory"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-lg border bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold">Continue Working</h2>
          <div className="mt-3 space-y-3">
            <Link
              href="/hermes/sessions/test-session"
              className="block rounded-md border p-3 hover:bg-gray-50"
            >
              <div className="font-medium">John pricing logic extraction</div>
              <div className="text-sm text-gray-600">
                Decision logic session · needs follow-up on thresholds
              </div>
            </Link>
            <Link
              href="/hermes/approvals"
              className="block rounded-md border p-3 hover:bg-gray-50"
            >
              <div className="font-medium">Review approval queue</div>
              <div className="text-sm text-gray-600">
                Several rule proposals are waiting for signoff
              </div>
            </Link>
          </div>
        </section>

        <section className="rounded-lg border bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold">System Focus</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-700">
            <li>Convert tacit decisions into explicit rule packs.</li>
            <li>Prevent conflicting memory from reaching agents.</li>
            <li>Keep approvals tight on pricing and compliance logic.</li>
            <li>Scope memory so each agent sees only what it needs.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
