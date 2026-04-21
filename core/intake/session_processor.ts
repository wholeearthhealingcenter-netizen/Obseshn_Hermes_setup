import {
  runMemoryPipeline,
  type MemoryPipelineResult,
} from "../memory/memory_pipeline";

import {
  buildReplayPacket,
  type ReplayPacket,
} from "../replay/replay_builder";

import type { RawMemoryInput } from "../memory/canonicalizer";

export interface SessionProcessorResult {
  sessionId: string;
  processedAt: string;
  pipelineResult: MemoryPipelineResult;
  replayPacket: ReplayPacket;
}

function buildSessionId(): string {
  return `session_${Date.now()}`;
}

export function processSessionInputs(
  inputs: RawMemoryInput[]
): SessionProcessorResult {
  const sessionId = buildSessionId();
  const processedAt = new Date().toISOString();

  const sessionBoundInputs: RawMemoryInput[] = inputs.map((input) => ({
    ...input,
    sessionId: input.sessionId ?? sessionId,
  }));

  const pipelineResult = runMemoryPipeline(sessionBoundInputs);
  const replayPacket = buildReplayPacket(pipelineResult);

  return {
    sessionId,
    processedAt,
    pipelineResult,
    replayPacket,
  };
}
