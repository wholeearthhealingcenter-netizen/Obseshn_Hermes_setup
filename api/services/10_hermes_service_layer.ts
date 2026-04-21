/**
 * 10_hermes_service_layer.ts
 *
 * Service layer for Hermes v1.
 * Responsibilities:
 * - sessions
 * - question/answer submission
 * - extraction + follow-up generation
 * - approvals
 * - rule promotion
 * - packet creation
 *
 * This file intentionally includes in-memory placeholder repository methods so
 * you can wire structure first and replace persistence second.
 */

type UUID = string;

// ---------------------------------------------------------
// Input types
// ---------------------------------------------------------

export type StartSessionInput = {
  subjectType: "person" | "role" | "department" | "system";
  subjectId?: UUID | null;
  title: string;
  mode: "guided" | "fast_capture" | "validation" | "replay";
  layer?: "operating_rhythm" | "decision_logic" | "inputs" | "dependencies" | "friction" | null;
  startedBy?: UUID | null;
  assignedReviewer?: UUID | null;
};

export type SubmitAnswerInput = {
  sessionId: UUID;
  questionId?: UUID | null;
  answerText: string;
  answerFormat?: "text" | "voice_transcript" | "structured_form";
  speakerId?: UUID | null;
};

export type ApproveExtractionInput = {
  extractionId: UUID;
  approverId: UUID;
  decision: "approve" | "reject" | "return" | "hold";
  notes?: string | null;
};

export type PromoteRuleInput = {
  extractionId: UUID;
  ruleFamily: string;
  subjectType: string;
  subjectId?: UUID | null;
  title: string;
  description?: string | null;
  createdBy?: UUID | null;
};

export type BuildPacketInput = {
  packetType: "user_profile" | "operating_rhythm" | "decision_pack" | "friction_pack" | "role_pack";
  subjectType: string;
  subjectId?: UUID | null;
  title: string;
  sourceRuleIds?: UUID[];
  sourceSessionId?: UUID | null;
};

export type BindPacketInput = {
  agentKey: string;
  packetId: UUID;
  priority?: number;
  visibilityScope?: "agent_only" | "shared" | "global";
};

export type FollowUpPrompt = {
  type: "threshold" | "exception" | "counterexample" | "frequency" | "clarification";
  prompt: string;
};

export type ExtractionRecord = {
  id: UUID;
  sessionId: UUID;
  answerId: UUID | null;
  extractionType: "rule" | "rhythm" | "entity" | "dependency" | "friction" | "metric" | "threshold";
  layer: string;
  rawJson: Record<string, unknown>;
  normalizedJson: Record<string, unknown>;
  confidenceScore: number;
  needsReview: boolean;
};

export type RuleRecord = {
  id: UUID;
  ruleFamily: string;
  subjectType: string;
  subjectId: UUID | null;
  title: string;
  description: string | null;
  conditionJson: Record<string, unknown>;
  actionJson: Record<string, unknown>;
  exceptionJson: Record<string, unknown> | null;
  contextJson: Record<string, unknown> | null;
  status: "draft" | "approved" | "active" | "retired";
  sourceExtractionId: UUID;
};

export type PacketRecord = {
  id: UUID;
  packetType: string;
  subjectType: string;
  subjectId: UUID | null;
  title: string;
  packetJson: Record<string, unknown>;
  sourceRuleIds: UUID[];
  sourceSessionId: UUID | null;
  status: "draft" | "approved" | "active" | "superseded";
};

// ---------------------------------------------------------
// Repository placeholders
// Replace with DB implementation
// ---------------------------------------------------------

const pseudoDb = {
  sessions: [] as any[],
  answers: [] as any[],
  approvals: [] as any[],
  extractions: [] as ExtractionRecord[],
  rules: [] as RuleRecord[],
  packets: [] as PacketRecord[],
  bindings: [] as any[],
};

function newId(): UUID {
  return crypto.randomUUID();
}

// ---------------------------------------------------------
// Shared extraction helpers
// ---------------------------------------------------------

function detectRuleLikeAnswer(answerText: string) {
  const lower = answerText.toLowerCase();
  const hasIf = lower.includes("if ");
  const hasThenIntent =
    lower.includes(" then ") ||
    lower.includes(" i ") ||
    lower.includes(" we ");
  const hasThresholdSignal =
    /\b\d+\b/.test(answerText) ||
    lower.includes("percent") ||
    lower.includes(">=") ||
    lower.includes("floor") ||
    lower.includes("high");

  return hasIf || (hasThenIntent && hasThresholdSignal);
}

function buildNormalizedExtraction(answerText: string): {
  extractionType: ExtractionRecord["extractionType"];
  normalizedJson: Record<string, unknown>;
  followUps: FollowUpPrompt[];
  confidenceScore: number;
} {
  if (detectRuleLikeAnswer(answerText)) {
    return {
      extractionType: "rule",
      normalizedJson: {
        inferredRuleFamily: "unclassified",
        conditionCandidates: [],
        actionCandidates: [],
        sourceText: answerText,
      },
      followUps: [
        {
          type: "threshold",
          prompt: "What exact threshold or number should trigger this decision?",
        },
        {
          type: "exception",
          prompt: "When would you NOT do this, even if the main condition appears true?",
        },
        {
          type: "clarification",
          prompt: "What action should happen first once this condition is met?",
        },
      ],
      confidenceScore: 0.78,
    };
  }

  return {
    extractionType: "friction",
    normalizedJson: {
      sourceText: answerText,
      inferredCategory: "needs_classification",
    },
    followUps: [
      {
        type: "frequency",
        prompt: "How often does this happen in a normal week or cycle?",
      },
      {
        type: "clarification",
        prompt: "What is the main impact when this issue happens?",
      },
    ],
    confidenceScore: 0.64,
  };
}

// ---------------------------------------------------------
// Hermes session service
// ---------------------------------------------------------

export class HermesSessionService {
  static async startSession(input: StartSessionInput) {
    const session = {
      id: newId(),
      subjectType: input.subjectType,
      subjectId: input.subjectId ?? null,
      title: input.title,
      mode: input.mode,
      layer: input.layer ?? null,
      status: "active",
      startedBy: input.startedBy ?? null,
      assignedReviewer: input.assignedReviewer ?? null,
      startedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    pseudoDb.sessions.push(session);
    return session;
  }

  static async submitAnswer(input: SubmitAnswerInput) {
    const answer = {
      id: newId(),
      sessionId: input.sessionId,
      questionId: input.questionId ?? null,
      answerText: input.answerText,
      answerFormat: input.answerFormat ?? "text",
      speakerId: input.speakerId ?? null,
      createdAt: new Date().toISOString(),
    };

    pseudoDb.answers.push(answer);

    const extractionBuild = buildNormalizedExtraction(input.answerText);

    const extraction: ExtractionRecord = {
      id: newId(),
      sessionId: input.sessionId,
      answerId: answer.id,
      extractionType: extractionBuild.extractionType,
      layer: "decision_logic",
      rawJson: { sourceText: input.answerText },
      normalizedJson: extractionBuild.normalizedJson,
      confidenceScore: extractionBuild.confidenceScore,
      needsReview: true,
    };

    pseudoDb.extractions.push(extraction);

    return {
      answer,
      extractions: [extraction],
      followUps: extractionBuild.followUps,
    };
  }

  static async approveExtraction(input: ApproveExtractionInput) {
    const extraction = pseudoDb.extractions.find((e) => e.id === input.extractionId);
    if (!extraction) {
      throw new Error("Extraction not found");
    }

    const approval = {
      id: newId(),
      objectType: "extraction",
      objectId: input.extractionId,
      approverId: input.approverId,
      decision: input.decision,
      notes: input.notes ?? null,
      createdAt: new Date().toISOString(),
    };

    pseudoDb.approvals.push(approval);

    if (input.decision === "approve") {
      extraction.needsReview = false;
    }

    return {
      extraction,
      approval,
    };
  }
}

// ---------------------------------------------------------
// Hermes rule service
// ---------------------------------------------------------

export class HermesRuleService {
  static async promoteExtractionToRule(input: PromoteRuleInput) {
    const extraction = pseudoDb.extractions.find((e) => e.id === input.extractionId);
    if (!extraction) {
      throw new Error("Extraction not found");
    }

    if (extraction.extractionType !== "rule") {
      throw new Error("Only rule-type extractions can be promoted to rules");
    }

    const rule: RuleRecord = {
      id: newId(),
      ruleFamily: input.ruleFamily,
      subjectType: input.subjectType,
      subjectId: input.subjectId ?? null,
      title: input.title,
      description: input.description ?? null,
      conditionJson: {
        extracted: extraction.normalizedJson["conditionCandidates"] ?? [],
      },
      actionJson: {
        extracted: extraction.normalizedJson["actionCandidates"] ?? [],
      },
      exceptionJson: null,
      contextJson: {
        sourceExtractionId: extraction.id,
      },
      status: "draft",
      sourceExtractionId: extraction.id,
    };

    pseudoDb.rules.push(rule);
    return rule;
  }
}

// ---------------------------------------------------------
// Hermes packet service
// ---------------------------------------------------------

export class HermesPacketService {
  static async buildPacket(input: BuildPacketInput) {
    const rules = (input.sourceRuleIds ?? [])
      .map((id) => pseudoDb.rules.find((r) => r.id === id))
      .filter(Boolean) as RuleRecord[];

    const packet: PacketRecord = {
      id: newId(),
      packetType: input.packetType,
      subjectType: input.subjectType,
      subjectId: input.subjectId ?? null,
      title: input.title,
      packetJson: {
        ruleCount: rules.length,
        rules: rules.map((rule) => ({
          id: rule.id,
          title: rule.title,
          ruleFamily: rule.ruleFamily,
          conditionJson: rule.conditionJson,
          actionJson: rule.actionJson,
          contextJson: rule.contextJson,
        })),
      },
      sourceRuleIds: input.sourceRuleIds ?? [],
      sourceSessionId: input.sourceSessionId ?? null,
      status: "draft",
    };

    pseudoDb.packets.push(packet);
    return packet;
  }

  static async bindPacketToAgent(input: BindPacketInput) {
    const packet = pseudoDb.packets.find((p) => p.id === input.packetId);
    if (!packet) {
      throw new Error("Packet not found");
    }

    const binding = {
      id: newId(),
      agentKey: input.agentKey,
      packetId: input.packetId,
      priority: input.priority ?? 100,
      visibilityScope: input.visibilityScope ?? "agent_only",
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    pseudoDb.bindings.push(binding);
    return binding;
  }

  static async getScopedAgentMemory(input: { agentKey: string; taskType?: string | null }) {
    const bindings = pseudoDb.bindings
      .filter((binding) => binding.agentKey === input.agentKey && binding.isActive)
      .sort((a, b) => a.priority - b.priority);

    const packets = bindings
      .map((binding) => {
        const packet = pseudoDb.packets.find((p) => p.id === binding.packetId);
        if (!packet) return null;
        return {
          packetId: packet.id,
          title: packet.title,
          packetType: packet.packetType,
          priority: binding.priority,
          visibilityScope: binding.visibilityScope,
          taskType: input.taskType ?? null,
          packet: packet.packetJson,
        };
      })
      .filter(Boolean);

    return {
      agentKey: input.agentKey,
      taskType: input.taskType ?? null,
      packets,
    };
  }
}
