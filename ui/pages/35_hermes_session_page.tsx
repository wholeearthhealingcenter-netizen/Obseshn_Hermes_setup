/**
 * 35_hermes_session_page.tsx
 *
 * Direct App Router page wrapper for:
 * /app/hermes/sessions/[id]/page.tsx
 */

import HermesSessionWorkspace from "../../../../19_hermes_session_workspace";

export default async function HermesSessionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <HermesSessionWorkspace sessionId={id} />;
}
