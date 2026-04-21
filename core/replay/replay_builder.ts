import type { CanonicalFact } from "../memory/canonicalizer";
import type { MemoryPipelineResult } from "../memory/memory_pipeline";

export interface ReplayPacket {
  packetId: string;
  generatedAt: string;
  source: "hermes";
  summary: string;
  acceptedFacts: CanonicalFact[];
  reviewFacts: CanonicalFact[];
  resolvedFacts: CanonicalFact[];
  approvalQueue: unknown[];
  discardedFacts: CanonicalFact[];
  decisions: unknown[];
  downstreamContext: {
    recommendedAction: string;
    requiresHumanReview: boolean;
    approvalCount: number;
    resolvedCount: number;
  };
}

function buildPacketId(): string {
  return `replay_${Date.now()}`;
}

function buildSummary(result: MemoryPipelineResult): string {
  return [
    `accepted=${result.acceptedFacts.length}`,
    `review=${result.reviewFacts.length}`,
    `resolved=${result.resolvedFacts.length}`,
    `approvals=${result.approvalQueue.length}`,
    `discarded=${result.discardedFacts.length}`,
  ].join(" | ");
}

function buildRecommendedAction(result: MemoryPipelineResult): string {
  if (result.approvalQueue.length > 0) {
    return "route_to_approval_queue";
  }

  if (result.reviewFacts.length > 0) {
    return "review_low_confidence_facts";
  }

  return "dispatch_to_downstream_agents";
}

export function buildReplayPacket(
  result: MemoryPipelineResult
): ReplayPacket {
  return {
    packetId: buildPacketId(),
    generatedAt: new Date().toISOString(),
    source: "hermes",
    summary: buildSummary(result),
    acceptedFacts: result.acceptedFacts,
    reviewFacts: result.reviewFacts,
    resolvedFacts: result.resolvedFacts,
    approvalQueue: result.approvalQueue,
    discardedFacts: result.discardedFacts,
    decisions: result.decisions,
    downstreamContext: {
      recommendedAction: buildRecommendedAction(result),
      requiresHumanReview:
        result.approvalQueue.length > 0 || result.reviewFacts.length > 0,
      approvalCount: result.approvalQueue.length,
      resolvedCount: result.resolvedFacts.length,
    },
  };
}
