/**
 * 21_hermes_conflict_card.tsx
 *
 * Displays a conflict between two rules/entities and lets user resolve.
 */

"use client";

import React, { useState } from "react";

type Conflict = {
  id: string;
  summary: string;
  severity: "low" | "medium" | "high";
  left: { id: string; title: string; json: any };
  right: { id: string; title: string; json: any };
};

type Props = {
  conflict: Conflict;
  onResolve?: (payload: {
    conflictId: string;
    action: "merge" | "contextualize" | "reject" | "manual_review";
    notes?: string | null;
  }) => Promise<void> | void;
};

export default function HermesConflictCard({ conflict, onResolve }: Props) {
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  async function resolve(action: Props["onResolve"] extends Function ? Parameters<NonNullable<Props["onResolve"]>>[0]["action"] : never) {
    try {
      setLoading(true);
      await onResolve?.({
        conflictId: conflict.id,
        action,
        notes: notes || null,
      });
      setNotes("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold">Conflict</h4>
        <span className="text-xs text-gray-500">{conflict.severity}</span>
      </div>

      <p className="text-sm text-gray-700 mt-1">{conflict.summary}</p>

      <div className="grid grid-cols-2 gap-3 mt-3">
        <div className="border rounded-md p-2">
          <div className="text-xs text-gray-500 mb-1">Left</div>
          <div className="text-sm font-medium">{conflict.left.title}</div>
          <pre className="text-xs mt-1 overflow-auto">
{JSON.stringify(conflict.left.json, null, 2)}
          </pre>
        </div>

        <div className="border rounded-md p-2">
          <div className="text-xs text-gray-500 mb-1">Right</div>
          <div className="text-sm font-medium">{conflict.right.title}</div>
          <pre className="text-xs mt-1 overflow-auto">
{JSON.stringify(conflict.right.json, null, 2)}
          </pre>
        </div>
      </div>

      <textarea
        className="w-full mt-3 border rounded-md p-2 text-sm"
        placeholder="Resolution notes…"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          onClick={() => resolve("merge")}
          disabled={loading}
          className="px-3 py-2 rounded-md bg-green-600 text-white"
        >
          Merge
        </button>
        <button
          onClick={() => resolve("contextualize")}
          disabled={loading}
          className="px-3 py-2 rounded-md bg-blue-600 text-white"
        >
          Contextualize
        </button>
        <button
          onClick={() => resolve("reject")}
          disabled={loading}
          className="px-3 py-2 rounded-md bg-red-600 text-white"
        >
          Reject
        </button>
        <button
          onClick={() => resolve("manual_review")}
          disabled={loading}
          className="px-3 py-2 rounded-md border"
        >
          Manual Review
        </button>
      </div>
    </div>
  );
}
