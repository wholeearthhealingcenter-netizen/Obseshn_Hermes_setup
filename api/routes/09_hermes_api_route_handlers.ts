import type { RawMemoryInput } from "../../core/memory/canonicalizer";
import {
  processSessionInputs,
  type SessionProcessorResult,
} from "../../core/intake/session_processor";

export interface HermesProcessSessionRequest {
  inputs: RawMemoryInput[];
}

export interface HermesApiSuccessResponse {
  ok: true;
  data: SessionProcessorResult;
}

export interface HermesApiErrorResponse {
  ok: false;
  error: string;
}

export type HermesProcessSessionResponse =
  | HermesApiSuccessResponse
  | HermesApiErrorResponse;

function isValidRawMemoryInput(value: unknown): value is RawMemoryInput {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return typeof candidate.content === "string";
}

function isValidProcessSessionRequest(
  body: unknown
): body is HermesProcessSessionRequest {
  if (!body || typeof body !== "object") {
    return false;
  }

  const candidate = body as Record<string, unknown>;

  if (!Array.isArray(candidate.inputs)) {
    return false;
  }

  return candidate.inputs.every(isValidRawMemoryInput);
}

export async function handleProcessSessionRoute(
  body: unknown
): Promise<HermesProcessSessionResponse> {
  if (!isValidProcessSessionRequest(body)) {
    return {
      ok: false,
      error: "invalid_request_body_inputs_required",
    };
  }

  try {
    const result = processSessionInputs(body.inputs);

    return {
      ok: true,
      data: result,
    };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "unknown_hermes_processing_error";

    return {
      ok: false,
      error: message,
    };
  }
}
