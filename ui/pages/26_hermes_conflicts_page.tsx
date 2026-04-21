/**
 * 26_hermes_conflicts_page.tsx
 *
 * Full page that renders conflicts using 21_hermes_conflict_card.
 */

"use client";

import React from "react";
import HermesConflictCard from "./21_hermes_conflict_card";
import { useHermesConflicts } from "./24_hermes_session_api_hooks";

export default function HermesConflictsPage() {
  const { items, loading, error, resolve } = useHermesConflicts();

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Conflicts</h1>

      {loading && <div className="text-sm text-gray-500">Loading…</div>}
      {error && <div className="text-sm text-red-600">{error}</div>}

      <div className="space-y-3">
        {items.map((c: any) => (
          <HermesConflictCard
            key={c.id}
            conflict={{
              id: c.id,
              summary: c.summary,
              severity: c.severity,
              left: c.left,
              right: c.right,
            }}
            onResolve={resolve}
          />
        ))}
      </div>
    </div>
  );
}
