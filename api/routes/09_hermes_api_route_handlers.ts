/**
 * 09_hermes_api_route_handlers.ts
 *
 * Repo-ready starter route handlers for Hermes v1.
 * Intended for a Next.js app router codebase.
 *
 * Notes:
 * - Replace placeholder auth / db imports with your actual stack
 * - These handlers call service-layer methods from 10_hermes_service_layer.ts
 * - Keep approval and promotion logic out of handlers; handlers should stay thin
 */

import { NextRequest, NextResponse } from "next/server";
import {
  HermesSessionService,
  HermesRuleService,
  HermesPacketService,
  type StartSessionInput,
  type SubmitAnswerInput,
  type ApproveExtractionInput,
  type PromoteRuleInput,
  type BuildPacketInput,
  type BindPacketInput,
} from "./10_hermes_service_layer";

// ---------------------------------------------------------
// Example shared response envelope helpers
// ---------------------------------------------------------

function ok(data: unknown, init?: ResponseInit) {
  return NextResponse.json({ ok: true, data }, init);
}

function badRequest(message: string, details?: unknown) {
  return NextResponse.json(
    { ok: false, error: { code: "bad_request", message, details } },
    { status: 400 },
  );
}

function serverError(message: string, details?: unknown) {
  return NextResponse.json(
    { ok: false, error: { code: "server_error", message, details } },
    { status: 500 },
  );
}

// ---------------------------------------------------------
// POST /api/hermes/sessions
// ---------------------------------------------------------

export async function postHermesSession(req: NextRequest) {
  try {
    const body = (await req.json()) as StartSessionInput;

    if (!body.subjectType || !body.title || !body.mode) {
      return badRequest("subjectType, title, and mode are required");
    }

    const session = await HermesSessionService.startSession(body);
    return ok(session, { status: 201 });
  } catch (error) {
    return serverError("Failed to start Hermes session", {
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

// ---------------------------------------------------------
// POST /api/hermes/sessions/:id/answers
// ---------------------------------------------------------

export async function postHermesAnswer(
  req: NextRequest,
  params: { sessionId: string },
) {
  try {
    const body = (await req.json()) as Omit<SubmitAnswerInput, "sessionId">;

    if (!params.sessionId) {
      return badRequest("sessionId is required");
    }

    if (!body.answerText) {
      return badRequest("answerText is required");
    }

    const result = await HermesSessionService.submitAnswer({
      sessionId: params.sessionId,
      questionId: body.questionId,
      answerText: body.answerText,
      answerFormat: body.answerFormat ?? "text",
      speakerId: body.speakerId ?? null,
    });

    return ok(result, { status: 201 });
  } catch (error) {
    return serverError("Failed to submit Hermes answer", {
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

// ---------------------------------------------------------
// POST /api/hermes/extractions/:id/approve
// ---------------------------------------------------------

export async function postHermesApproveExtraction(
  req: NextRequest,
  params: { extractionId: string },
) {
  try {
    const body = (await req.json()) as Omit<ApproveExtractionInput, "extractionId">;

    if (!params.extractionId) {
      return badRequest("extractionId is required");
    }

    if (!body.approverId || !body.decision) {
      return badRequest("approverId and decision are required");
    }

    const result = await HermesSessionService.approveExtraction({
      extractionId: params.extractionId,
      approverId: body.approverId,
      decision: body.decision,
      notes: body.notes ?? null,
    });

    return ok(result);
  } catch (error) {
    return serverError("Failed to approve extraction", {
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

// ---------------------------------------------------------
// POST /api/hermes/extractions/:id/promote-rule
// ---------------------------------------------------------

export async function postHermesPromoteRule(
  req: NextRequest,
  params: { extractionId: string },
) {
  try {
    const body = (await req.json()) as Omit<PromoteRuleInput, "extractionId">;

    if (!params.extractionId) {
      return badRequest("extractionId is required");
    }

    if (!body.ruleFamily || !body.subjectType || !body.title) {
      return badRequest("ruleFamily, subjectType, and title are required");
    }

    const result = await HermesRuleService.promoteExtractionToRule({
      extractionId: params.extractionId,
      ruleFamily: body.ruleFamily,
      subjectType: body.subjectType,
      subjectId: body.subjectId ?? null,
      title: body.title,
      description: body.description ?? null,
      createdBy: body.createdBy ?? null,
    });

    return ok(result, { status: 201 });
  } catch (error) {
    return serverError("Failed to promote extraction to rule", {
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

// ---------------------------------------------------------
// POST /api/hermes/packets
// ---------------------------------------------------------

export async function postHermesPacket(req: NextRequest) {
  try {
    const body = (await req.json()) as BuildPacketInput;

    if (!body.packetType || !body.subjectType || !body.title) {
      return badRequest("packetType, subjectType, and title are required");
    }

    const packet = await HermesPacketService.buildPacket(body);
    return ok(packet, { status: 201 });
  } catch (error) {
    return serverError("Failed to build Hermes packet", {
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

// ---------------------------------------------------------
// POST /api/hermes/agent-bindings
// ---------------------------------------------------------

export async function postHermesAgentBinding(req: NextRequest) {
  try {
    const body = (await req.json()) as BindPacketInput;

    if (!body.agentKey || !body.packetId) {
      return badRequest("agentKey and packetId are required");
    }

    const binding = await HermesPacketService.bindPacketToAgent(body);
    return ok(binding, { status: 201 });
  } catch (error) {
    return serverError("Failed to bind packet to agent", {
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

// ---------------------------------------------------------
// GET /api/agent-memory/:agentKey
// ---------------------------------------------------------

export async function getAgentMemory(
  req: NextRequest,
  params: { agentKey: string },
) {
  try {
    const { searchParams } = new URL(req.url);
    const taskType = searchParams.get("taskType");

    if (!params.agentKey) {
      return badRequest("agentKey is required");
    }

    const packetSet = await HermesPacketService.getScopedAgentMemory({
      agentKey: params.agentKey,
      taskType,
    });

    return ok(packetSet);
  } catch (error) {
    return serverError("Failed to fetch scoped agent memory", {
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
