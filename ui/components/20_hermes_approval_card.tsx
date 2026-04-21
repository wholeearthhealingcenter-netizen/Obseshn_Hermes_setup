/**
 * 20_hermes_approval_card.tsx
 *
 * Approval card with actions:
 * - Approve
 * - Reject
 * - Return with notes
 * - Hold
 */

"use client";

import React, { useState } from "react";

type Props = {
  extractionId: string;
  title: string;
  description?: string | null;
  confidenceScore?: number;
  onAction?: (payload: {
    extractionId: string;
    decision: "approve" | "reject" | "return" | "hold";
    notes?: string | null;
  }) => Promise<void> | void;
};

export default function HermesApprovalCard({
  extractionId,
  title,
  description,
  confidenceScore,
  onAction,
}: Props) {
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  async function act(decision: "approve" | "reject" | "return" | "hold") {
    try {
      setLoading(true);
      await onAction?.({ extractionId, decision, notes: notes || null });
      setNotes("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h4 className="font-semibold">{title}</h4>
          {description ? (
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          ) : null}
        </div>
        {typeof confidenceScore === "number" && (
          <div className="text-xs text-gray-500">
            conf {confidenceScore.toFixed(2)}
          </div>
        )}
      </div>

      <textarea
        className="w-full mt-3 border rounded-md p-2 text-sm"
        placeholder="Optional notes…"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          onClick={() => act("approve")}
          disabled={loading}
          className="px-3 py-2 rounded-md bg-green-600 text-white"
        >
          Approve
        </button>
        <button
          onClick={() => act("reject")}
          disabled={loading}
          className="px-3 py-2 rounded-md bg-red-600 text-white"
        >
          Reject
        </button>
        <button
          onClick={() => act("return")}
          disabled={loading}
          className="px-3 py-2 rounded-md bg-amber-500 text-white"
        >
          Return
        </button>
        <button
          onClick={() => act("hold")}
          disabled={loading}
          className="px-3 py-2 rounded-md border"
        >
          Hold
        </button>
      </div>
    </div>
  );
}
