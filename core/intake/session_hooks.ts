/**
 * 24_hermes_session_api_hooks.ts
 *
 * Lightweight React hooks for Hermes data flow.
 * No external deps required (works without React Query).
 */

"use client";

import { useCallback, useEffect, useState } from "react";

type Json = Record<string, any>;

async function fetchJson(url: string, options?: RequestInit) {
  const res = await fetch(url, options);
  const json = await res.json();
  if (!json.ok) {
    throw new Error(json.error?.message || "Request failed");
  }
  return json.data;
}

// ------------------------------
// Sessions
// ------------------------------

export function useHermesSession(sessionId: string) {
  const [session, setSession] = useState<Json | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!sessionId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchJson(`/api/hermes/sessions/${sessionId}`);
      setSession(data);
    } catch (e: any) {
      setError(e.message ?? "Failed to load session");
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    load();
  }, [load]);

  return { session, loading, error, reload: load };
}

export function useSubmitHermesAnswer(sessionId: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(
    async (payload: { questionId?: string | null; answerText: string }) => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchJson(`/api/hermes/sessions/${sessionId}/answers`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        return data;
      } catch (e: any) {
        setError(e.message ?? "Submit failed");
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [sessionId],
  );

  return { submit, loading, error };
}

// ------------------------------
// Approvals
// ------------------------------

export function useHermesApprovals() {
  const [items, setItems] = useState<Json[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchJson(`/api/hermes/approvals`);
      setItems(data.items ?? data);
    } catch (e: any) {
      setError(e.message ?? "Failed to load approvals");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const act = useCallback(
    async (payload: {
      extractionId: string;
      decision: "approve" | "reject" | "return" | "hold";
      notes?: string | null;
    }) => {
      await fetchJson(`/api/hermes/extractions/${payload.extractionId}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          approverId: "me", // replace with real user id
          decision: payload.decision,
          notes: payload.notes ?? null,
        }),
      });
      await load();
    },
    [load],
  );

  return { items, loading, error, reload: load, act };
}

// ------------------------------
// Conflicts
// ------------------------------

export function useHermesConflicts() {
  const [items, setItems] = useState<Json[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchJson(`/api/hermes/conflicts`);
      setItems(data.items ?? data);
    } catch (e: any) {
      setError(e.message ?? "Failed to load conflicts");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const resolve = useCallback(
    async (payload: {
      conflictId: string;
      action: "merge" | "contextualize" | "reject" | "manual_review";
      notes?: string | null;
    }) => {
      await fetchJson(`/api/hermes/conflicts/${payload.conflictId}/resolve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      await load();
    },
    [load],
  );

  return { items, loading, error, reload: load, resolve };
}

// ------------------------------
// Memory
// ------------------------------

export function useAgentMemory(agentKey: string) {
  const [packets, setPackets] = useState<Json[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!agentKey) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchJson(`/api/agent-memory/${agentKey}`);
      setPackets(data.packets ?? []);
    } catch (e: any) {
      setError(e.message ?? "Failed to load memory");
    } finally {
      setLoading(false);
    }
  }, [agentKey]);

  useEffect(() => {
    load();
  }, [load]);

  const bind = useCallback(
    async (packetId: string) => {
      await fetchJson(`/api/hermes/agent-bindings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentKey,
          packetId,
        }),
      });
      await load();
    },
    [agentKey, load],
  );

  return { packets, loading, error, reload: load, bind };
}
