/Users/johnhoward/Downloads/canonicalizer.ts
export type CanonicalFactSource =
  | "user_input"
  | "system_note"
  | "derived"
  | "imported"
  | "unknown";

export type CanonicalFactStatus =
  | "accepted"
  | "needs_review"
  | "rejected"
  | "superseded";

export interface RawMemoryInput {
  id?: string;
  sessionId?: string;
  source?: CanonicalFactSource;
  timestamp?: string;
  author?: string;
  content: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
}

export interface CanonicalFact {
  factId: string;
  sessionId: string | null;
  source: CanonicalFactSource;
  timestamp: string | null;
  author: string | null;
  category: string;
  subject: string;
  predicate: string;
  object: string;
  confidence: number;
  status: CanonicalFactStatus;
  requiresApproval: boolean;
  reviewReason: string | null;
  rawContent: string;
  tags: string[];
  metadata: Record<string, unknown>;
}

export interface CanonicalizationResult {
  acceptedFacts: CanonicalFact[];
  reviewFacts: CanonicalFact[];
  rejectedFacts: CanonicalFact[];
}

const DEFAULT_SESSION_ID = null;
const DEFAULT_TIMESTAMP = null;
const DEFAULT_AUTHOR = null;

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function sanitizeText(value: string): string {
  return normalizeWhitespace(value)
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'");
}

function inferCategory(content: string, tags: string[] = []): string {
  const lower = content.toLowerCase();
  const joinedTags = tags.join(" ").toLowerCase();

  if (
    lower.includes("approval") ||
    lower.includes("approve") ||
    joinedTags.includes("approval")
  ) {
    return "approval";
  }

  if (
    lower.includes("conflict") ||
    lower.includes("contradiction") ||
    joinedTags.includes("conflict")
  ) {
    return "conflict";
  }

  if (
    lower.includes("task") ||
    lower.includes("todo") ||
    lower.includes("action item") ||
    joinedTags.includes("task")
  ) {
    return "task";
  }

  if (
    lower.includes("policy") ||
    lower.includes("rule") ||
    joinedTags.includes("policy")
  ) {
    return "policy";
  }

  return "general";
}

function inferRequiresApproval(content: string, category: string): boolean {
  const lower = content.toLowerCase();

  if (category === "approval") {
    return true;
  }

  return (
    lower.includes("delete") ||
    lower.includes("overwrite") ||
    lower.includes("replace") ||
    lower.includes("schema change") ||
    lower.includes("destructive")
  );
}

function inferConfidence(content: string): number {
  const lower = content.toLowerCase();

  if (
    lower.includes("maybe") ||
    lower.includes("possibly") ||
    lower.includes("might") ||
    lower.includes("unsure")
  ) {
    return 0.45;
  }

  if (
    lower.includes("confirmed") ||
    lower.includes("final") ||
    lower.includes("approved")
  ) {
    return 0.95;
  }

  return 0.75;
}

function buildFactId(input: RawMemoryInput, index: number): string {
  if (input.id && input.id.trim().length > 0) {
    return input.id.trim();
  }

  return `fact_${Date.now()}_${index}`;
}

function splitContent(content: string): string[] {
  return content
    .split(/[\n.;]+/)
    .map((part) => sanitizeText(part))
    .filter((part) => part.length > 0);
}

function buildFactFromStatement(
  statement: string,
  input: RawMemoryInput,
  index: number
): CanonicalFact {
  const normalized = sanitizeText(statement);
  const category = inferCategory(normalized, input.tags ?? []);
  const requiresApproval = inferRequiresApproval(normalized, category);
  const confidence = inferConfidence(normalized);

  return {
    factId: buildFactId(input, index),
    sessionId: input.sessionId ?? DEFAULT_SESSION_ID,
    source: input.source ?? "unknown",
    timestamp: input.timestamp ?? DEFAULT_TIMESTAMP,
    author: input.author ?? DEFAULT_AUTHOR,
    category,
    subject: "memory_entry",
    predicate: "states",
    object: normalized,
    confidence,
    status: requiresApproval || confidence < 0.6 ? "needs_review" : "accepted",
    requiresApproval,
    reviewReason:
      requiresApproval
        ? "approval_sensitive"
        : confidence < 0.6
        ? "low_confidence"
        : null,
    rawContent: input.content,
    tags: input.tags ?? [],
    metadata: input.metadata ?? {},
  };
}

export function canonicalizeMemoryInputs(
  inputs: RawMemoryInput[]
): CanonicalizationResult {
  const acceptedFacts: CanonicalFact[] = [];
  const reviewFacts: CanonicalFact[] = [];
  const rejectedFacts: CanonicalFact[] = [];

  inputs.forEach((input, inputIndex) => {
    const content = sanitizeText(input.content);

    if (!content) {
      rejectedFacts.push({
        factId: `rejected_${Date.now()}_${inputIndex}`,
        sessionId: input.sessionId ?? DEFAULT_SESSION_ID,
        source: input.source ?? "unknown",
        timestamp: input.timestamp ?? DEFAULT_TIMESTAMP,
        author: input.author ?? DEFAULT_AUTHOR,
        category: "general",
        subject: "memory_entry",
        predicate: "states",
        object: "",
        confidence: 0,
        status: "rejected",
        requiresApproval: false,
        reviewReason: "empty_content",
        rawContent: input.content,
        tags: input.tags ?? [],
        metadata: input.metadata ?? {},
      });
      return;
    }

    const statements = splitContent(content);

    statements.forEach((statement, statementIndex) => {
      const fact = buildFactFromStatement(
        statement,
        input,
        inputIndex * 1000 + statementIndex
      );

      if (fact.status === "accepted") {
        acceptedFacts.push(fact);
      } else if (fact.status === "needs_review") {
        reviewFacts.push(fact);
      } else {
        rejectedFacts.push(fact);
      }
    });
  });

  return {
    acceptedFacts,
    reviewFacts,
    rejectedFacts,
  };
}
