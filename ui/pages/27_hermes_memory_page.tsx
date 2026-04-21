/**
 * 27_hermes_memory_page.tsx
 *
 * Full page that renders memory dashboard using 22_hermes_memory_dashboard.
 */

"use client";

import React from "react";
import HermesMemoryDashboard from "./22_hermes_memory_dashboard";

export default function HermesMemoryPage() {
  return (
    <div className="p-4">
      <HermesMemoryDashboard agentKey="ozzy" />
    </div>
  );
}
