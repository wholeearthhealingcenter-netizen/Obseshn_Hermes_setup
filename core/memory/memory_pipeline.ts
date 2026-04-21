import {
  canonicalizeMemoryInputs,
  type RawMemoryInput,
} from "./canonicalizer";

import {
  resolveFactConflicts,
} from "../conflict/conflict_resolution";

import type { CanonicalFact } from "./canonicalizer";

export interface MemoryPipelineResult {
  acceptedFacts: CanonicalFact[];
  reviewFacts: CanonicalFact[];
  resolvedFacts: CanonicalFact[];
  approvalQueue: any[];
  discardedFacts: CanonicalFact[];
  decisions: any[];
}

export function runMemoryPipeline(
  inputs: RawMemoryInput[]
): MemoryPipelineResult {
  // Step 1: Canonicalize raw inputs
  const canonicalResult = canonicalizeMemoryInputs(inputs);

  const allFacts: CanonicalFact[] = [
    ...canonicalResult.acceptedFacts,
    ...canonicalResult.reviewFacts,
  ];

  // Step 2: Resolve conflicts
  const conflictResult = resolveFactConflicts(allFacts);

  return {
    acceptedFacts: canonicalResult.acceptedFacts,
    reviewFacts: canonicalResult.reviewFacts,
    resolvedFacts: conflictResult.resolvedFacts,
    approvalQueue: conflictResult.approvalQueue,
    discardedFacts: conflictResult.discardedFacts,
    decisions: conflictResult.decisions,
  };
}

