/**
 * 40_hermes_layout_wrapper.tsx
 *
 * Direct App Router wrapper for:
 * /app/hermes/layout.tsx
 *
 * This keeps the route file thin and delegates the real shell
 * to the previously generated layout component.
 */

import HermesLayout from "../../30_hermes_layout";

export default function HermesLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <HermesLayout>{children}</HermesLayout>;
}
