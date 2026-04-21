import type { CanonicalFact } from "../memory/canonicalizer";

export type ConflictResolutionMode =
  | "auto_accept_latest"
  | "auto_accept_highest_confidence"
  | "approval_required";

export type ConflictDecisionStatus =
  | "resolved"
  | "needs_approval"
  | "discarded";

export interface FactConflict {
  conflictId: string;
  category: string;
  subject: string;
  predicate: string;
  existingFact: CanonicalFact;
  incomingFact: CanonicalFact;
  reason: string;
}

export interface ConflictDecision {
  conflictId: string;
  status: ConflictDecisionStatus;
  winningFact: CanonicalFact | null;
  losingFact: CanonicalFact | null;
  approvalRequired: boolean;
  decisionReason: string;
}

export interface ConflictResolutionResult {
  resolvedFacts: CanonicalFact[];
  approvalQueue: FactConflict[];
  discardedFacts: CanonicalFact[];
  decisions: ConflictDecision[];
}

const DEFAULT_MODE_BY_CATEGORY: Record<string, ConflictResolutionMode> = {
  approval: "approval_required",
  conflict: "approval_required",
  policy: "approval_required",
  task: "auto_accept_latest",
  general: "auto_accept_highest_confidence",
};

function normalizeValue(value: string | null | undefined): string {
  return (value ?? "").trim().toLowerCase();
}

function buildConflictKey(fact: CanonicalFact): string {
  return [
    normalizeValue(fact.category),
    normalizeValue(fact.subject),
    normalizeValue(fact.predicate),
  ].join("::");
}

function buildConflictId(existingFact: CanonicalFact, incomingFact: CanonicalFact): string {
  return [
    "conflict",
    existingFact.factId,
    incomingFact.factId,
  ].join("_");
}

function getResolutionMode(category: string): ConflictResolutionMode {
  return DEFAULT_MODE_BY_CATEGORY[category] ?? "approval_required";
}

function getTimestampValue(fact: CanonicalFact): number {
  if (!fact.timestamp) {
    return 0;
  }

  const parsed = Date.parse(fact.timestamp);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function chooseHigherConfidence(
  existingFact: CanonicalFact,
  incomingFact: CanonicalFact
): { winner: CanonicalFact; loser: CanonicalFact; reason: string } {
  if (incomingFact.confidence > existingFact.confidence) {
    return {
      winner: incomingFact,
      loser: existingFact,
      reason: "incoming_fact_has_higher_confidence",
    };
  }

  if (incomingFact.confidence < existingFact.confidence) {
    return {
      winner: existingFact,
      loser: incomingFact,
      reason: "existing_fact_has_higher_confidence",
    };
  }

  if (getTimestampValue(incomingFact) >= getTimestampValue(existingFact)) {
    return {
      winner: incomingFact,
      loser: existingFact,
      reason: "confidence_tied_incoming_is_newer_or_equal",
    };
  }

  return {
    winner: existingFact,
    loser: incomingFact,
    reason: "confidence_tied_existing_is_newer",
  };
}

function chooseLatest(
  existingFact: CanonicalFact,
  incomingFact: CanonicalFact
): { winner: CanonicalFact; loser: CanonicalFact; reason: string } {
  if (getTimestampValue(incomingFact) >= getTimestampValue(existingFact)) {
    return {
      winner: incomingFact,
      loser: existingFact,
      reason: "incoming_fact_is_newer_or_equal",
    };
  }

  return {
    winner: existingFact,
    loser: incomingFact,
    reason: "existing_fact_is_newer",
  };
}

function isTrueConflict(existingFact: CanonicalFact, incomingFact: CanonicalFact): boolean {
  return normalizeValue(existingFact.object) != normalizeValue(incomingFact.object);
}

function markSuperseded(fact: CanonicalFact): CanonicalFact {
  return {
    ...fact,
    status: "superseded",
  };
}

export function resolveFactConflicts(
  facts: CanonicalFact[]
): ConflictResolutionResult {
  const resolvedFacts: CanonicalFact[] = [];
  const approvalQueue: FactConflict[] = [];
  const discardedFacts: CanonicalFact[] = [];
  const decisions: ConflictDecision[] = [];

  const seenFacts = new Map<string, CanonicalFact>();

  facts.forEach((fact) => {
    const conflictKey = buildConflictKey(fact);
    const existingFact = seenFacts.get(conflictKey);

    if (!existingFact) {
      seenFacts.set(conflictKey, fact);
      return;
    }

    if (!isTrueConflict(existingFact, fact)) {
      const winnerSelection = chooseHigherConfidence(existingFact, fact);

      seenFacts.set(conflictKey, winnerSelection.winner);

      if (winnerSelection.loser.factId !== winnerSelection.winner.factId) {
        discardedFacts.push(markSuperseded(winnerSelection.loser));
      }

      decisions.push({
        conflictId: buildConflictId(existingFact, fact),
        status: "resolved",
        winningFact: winnerSelection.winner,
        losingFact: winnerSelection.loser,
        approvalRequired: false,
        decisionReason: "duplicate_semantic_fact_" + winnerSelection.reason,
      });
      return;
    }

    const categoryMode = getResolutionMode(fact.category);
    const conflictRecord: FactConflict = {
      conflictId: buildConflictId(existingFact, fact),
      category: fact.category,
      subject: fact.subject,
      predicate: fact.predicate,
      existingFact,
      incomingFact: fact,
      reason: "conflicting_object_values",
    };

    if (
      fact.requiresApproval ||
      existingFact.requiresApproval ||
      categoryMode === "approval_required"
    ) {
      approvalQueue.push(conflictRecord);

      decisions.push({
        conflictId: conflictRecord.conflictId,
        status: "needs_approval",
        winningFact: null,
        losingFact: null,
        approvalRequired: true,
        decisionReason: "approval_required_for_conflict_resolution",
      });
      return;
    }

    if (categoryMode === "auto_accept_latest") {
      const winnerSelection = chooseLatest(existingFact, fact);
      seenFacts.set(conflictKey, winnerSelection.winner);
      discardedFacts.push(markSuperseded(winnerSelection.loser));

      decisions.push({
        conflictId: conflictRecord.conflictId,
        status: "resolved",
        winningFact: winnerSelection.winner,
        losingFact: winnerSelection.loser,
        approvalRequired: false,
        decisionReason: winnerSelection.reason,
      });
      return;
    }

    const winnerSelection = chooseHigherConfidence(existingFact, fact);
    seenFacts.set(conflictKey, winnerSelection.winner);
    discardedFacts.push(markSuperseded(winnerSelection.loser));

    decisions.push({
      conflictId: conflictRecord.conflictId,
      status: "resolved",
      winningFact: winnerSelection.winner,
      losingFact: winnerSelection.loser,
      approvalRequired: false,
      decisionReason: winnerSelection.reason,
    });
  });

  seenFacts.forEach((fact) => {
    resolvedFacts.push(fact);
  });

  return {
    resolvedFacts,
    approvalQueue,
    discardedFacts,
    decisions,
  };
}
