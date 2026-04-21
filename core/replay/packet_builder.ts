/**
 * 12_hermes_packet_builder.ts
 *
 * Packet builder for converting approved Hermes rules + context into
 * agent-consumable memory packets.
 */

export type ApprovedRule = {
  id: string;
  ruleFamily: string;
  title: string;
  description: string | null;
  conditionJson: Record<string, unknown>;
  actionJson: Record<string, unknown>;
  exceptionJson: Record<string, unknown> | null;
  contextJson: Record<string, unknown> | null;
};

export type FrictionPoint = {
  id: string;
  area: string;
  issue: string;
  impact: string | null;
  severityScore: number | null;
};

export type PacketBuildInput = {
  packetType: "decision_pack" | "friction_pack" | "role_pack" | "operating_rhythm" | "user_profile";
  title: string;
  subjectType: string;
  subjectId: string | null;
  rules?: ApprovedRule[];
  frictionPoints?: FrictionPoint[];
  metadata?: Record<string, unknown>;
};

export type BuiltPacket = {
  packetType: string;
  title: string;
  subjectType: string;
  subjectId: string | null;
  packetJson: Record<string, unknown>;
};

export class HermesPacketBuilder {
  static build(input: PacketBuildInput): BuiltPacket {
    switch (input.packetType) {
      case "decision_pack":
        return {
          packetType: input.packetType,
          title: input.title,
          subjectType: input.subjectType,
          subjectId: input.subjectId,
          packetJson: {
            kind: "decision_pack",
            ruleCount: input.rules?.length ?? 0,
            rules: (input.rules ?? []).map((rule) => ({
              id: rule.id,
              family: rule.ruleFamily,
              title: rule.title,
              description: rule.description,
              conditions: rule.conditionJson,
              actions: rule.actionJson,
              exceptions: rule.exceptionJson,
              context: rule.contextJson,
            })),
            metadata: input.metadata ?? {},
          },
        };

      case "friction_pack":
        return {
          packetType: input.packetType,
          title: input.title,
          subjectType: input.subjectType,
          subjectId: input.subjectId,
          packetJson: {
            kind: "friction_pack",
            count: input.frictionPoints?.length ?? 0,
            frictionPoints: (input.frictionPoints ?? []).map((point) => ({
              id: point.id,
              area: point.area,
              issue: point.issue,
              impact: point.impact,
              severityScore: point.severityScore,
            })),
            metadata: input.metadata ?? {},
          },
        };

      case "role_pack":
        return {
          packetType: input.packetType,
          title: input.title,
          subjectType: input.subjectType,
          subjectId: input.subjectId,
          packetJson: {
            kind: "role_pack",
            decisions: (input.rules ?? []).map((rule) => ({
              title: rule.title,
              conditions: rule.conditionJson,
              actions: rule.actionJson,
            })),
            frictions: (input.frictionPoints ?? []).map((point) => ({
              issue: point.issue,
              area: point.area,
            })),
            metadata: input.metadata ?? {},
          },
        };

      case "operating_rhythm":
      case "user_profile":
      default:
        return {
          packetType: input.packetType,
          title: input.title,
          subjectType: input.subjectType,
          subjectId: input.subjectId,
          packetJson: {
            kind: input.packetType,
            metadata: input.metadata ?? {},
          },
        };
    }
  }
}
