/**
 * 25_hermes_approval_queue_page.tsx
 *
 * Full page that renders approval queue using 20_hermes_approval_card.
 */

"use client";

import React from "react";
import HermesApprovalCard from "./20_hermes_approval_card";
import { useHermesApprovals } from "./24_hermes_session_api_hooks";

export default function HermesApprovalQueuePage() {
  const { items, loading, error, act } = useHermesApprovals();

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Approvals</h1>

      {loading && <div className="text-sm text-gray-500">Loading…</div>}
      {error && <div className="text-sm text-red-600">{error}</div>}

      <div className="space-y-3">
        {items.map((item: any) => (
          <HermesApprovalCard
            key={item.extractionId || item.id}
            extractionId={item.extractionId || item.id}
            title={item.title || "Proposed extraction"}
            description={item.description || item.summary}
            confidenceScore={item.confidenceScore}
            onAction={act}
          />
        ))}
      </div>
    </div>
  );
}
