/**
 * 22_hermes_memory_dashboard.tsx
 *
 * Displays memory packets and lets user activate/bind to agents.
 */

"use client";

import React, { useEffect, useState } from "react";

type Packet = {
  id: string;
  title: string;
  packetType: string;
  status: "draft" | "approved" | "active" | "superseded";
  packetJson: any;
};

type Props = {
  agentKey: string;
};

export default function HermesMemoryDashboard({ agentKey }: Props) {
  const [packets, setPackets] = useState<Packet[]>([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      // Placeholder: replace with real endpoint
      const res = await fetch(`/api/agent-memory/${agentKey}`);
      const json = await res.json();
      if (json.ok) {
        setPackets(
          (json.data?.packets ?? []).map((p: any) => ({
            id: p.packetId,
            title: p.title,
            packetType: p.packetType,
            status: "active",
            packetJson: p.packet,
          })),
        );
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [agentKey]);

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-3">Agent Memory</h2>

      {loading ? (
        <div className="text-sm text-gray-500">Loading…</div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {packets.map((packet) => (
          <div key={packet.id} className="border rounded-lg p-3 bg-white">
            <div className="flex items-center justify-between">
              <div className="font-medium">{packet.title}</div>
              <div className="text-xs text-gray-500">
                {packet.packetType}
              </div>
            </div>

            <div className="text-xs text-gray-500 mt-1">
              status: {packet.status}
            </div>

            <pre className="text-xs mt-2 max-h-48 overflow-auto">
{JSON.stringify(packet.packetJson, null, 2)}
            </pre>

            <div className="mt-3 flex gap-2">
              <button className="px-3 py-2 rounded-md bg-black text-white">
                Activate
              </button>
              <button className="px-3 py-2 rounded-md border">
                Bind to Agent
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
