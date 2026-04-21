/**
 * 19_hermes_session_workspace.tsx
 *
 * Interview workspace scaffold for Hermes.
 * - Left: progress/layers
 * - Center: question + answer
 * - Right: structure preview + ambiguity
 *
 * Assumes React + TypeScript + Tailwind.
 */

"use client";

import React, { useEffect, useMemo, useState } from "react";

type Question = {
  id: string;
  code: string;
  prompt: string;
  layer: string;
};

type ExtractionPreview = {
  id: string;
  extractionType: string;
  confidenceScore: number;
  needsReview: boolean;
  normalizedJson: Record<string, unknown>;
};

type SubmitResult = {
  answer: { id: string };
  extractions: ExtractionPreview[];
  followUps: string[];
};

type Props = {
  sessionId: string;
};

export default function HermesSessionWorkspace({ sessionId }: Props) {
  const [question, setQuestion] = useState<Question | null>(null);
  const [answerText, setAnswerText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Placeholder: load first question (replace with real API)
  useEffect(() => {
    setQuestion({
      id: "q1",
      code: "DECISION_PRICING_001",
      prompt:
        "When do you decide to sell a batch early instead of holding for a better price?",
      layer: "decision_logic",
    });
  }, [sessionId]);

  const canSubmit = useMemo(() => answerText.trim().length > 0, [answerText]);

  async function submitAnswer() {
    if (!canSubmit || !question) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/hermes/sessions/${sessionId}/answers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId: question.id, answerText }),
      });

      const json = await res.json();
      if (!json.ok) throw new Error(json.error?.message || "Failed");

      setResult(json.data);
      setAnswerText("");
    } catch (e: any) {
      setError(e.message ?? "Error submitting answer");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full h-full grid grid-cols-12 gap-4 p-4">
      {/* Left rail */}
      <aside className="col-span-3 border rounded-lg p-3 bg-white">
        <h3 className="font-semibold mb-2">Progress</h3>
        <ul className="text-sm space-y-1">
          <li>✓ Operating Rhythm</li>
          <li className="font-semibold">• Decision Logic</li>
          <li>○ Inputs</li>
          <li>○ Dependencies</li>
          <li>○ Friction</li>
        </ul>
      </aside>

      {/* Center */}
      <main className="col-span-6 border rounded-lg p-4 bg-white">
        <div className="mb-3">
          <div className="text-xs text-gray-500">
            Layer: {question?.layer ?? "-"} · {question?.code ?? "-"}
          </div>
          <h2 className="text-lg font-semibold mt-1">
            {question?.prompt ?? "Loading question..."}
          </h2>
        </div>

        <textarea
          className="w-full min-h-[140px] border rounded-md p-3 text-sm"
          placeholder="Answer in natural language. Hermes will structure it."
          value={answerText}
          onChange={(e) => setAnswerText(e.target.value)}
        />

        {error && (
          <div className="mt-2 text-sm text-red-600">{error}</div>
        )}

        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={submitAnswer}
            disabled={!canSubmit || loading}
            className="px-4 py-2 rounded-md bg-black text-white disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Answer"}
          </button>
          <button
            onClick={() => setAnswerText("")}
            className="px-3 py-2 rounded-md border"
          >
            Clear
          </button>
        </div>

        {/* Follow-ups */}
        {result?.followUps?.length ? (
          <div className="mt-4">
            <h4 className="font-semibold text-sm mb-1">Follow-ups</h4>
            <ul className="list-disc pl-5 text-sm space-y-1">
              {result.followUps.map((f, idx) => (
                <li key={idx}>{f}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </main>

      {/* Right rail */}
      <aside className="col-span-3 border rounded-lg p-3 bg-white">
        <h3 className="font-semibold mb-2">Structure Preview</h3>
        {result?.extractions?.length ? (
          <div className="space-y-3">
            {result.extractions.map((ex) => (
              <div key={ex.id} className="border rounded-md p-2">
                <div className="text-xs text-gray-500">
                  {ex.extractionType} · conf {ex.confidenceScore.toFixed(2)}
                </div>
                <pre className="text-xs mt-2 overflow-auto">
{JSON.stringify(ex.normalizedJson, null, 2)}
                </pre>
                {ex.needsReview && (
                  <div className="mt-2 text-xs text-amber-600">
                    Needs review
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-gray-500">
            Submit an answer to see structure.
          </div>
        )}
      </aside>
    </div>
  );
}
