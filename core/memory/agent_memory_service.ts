/**
 * 11_agent_memory_service.ts
 *
 * Focused memory loader for Hermes / Ozzy / OpenClaw.
 * Goal:
 * - never dump all memory into every task
 * - scope packets by agent, task family, subject, and priority
 */

export type AgentMemoryBinding = {
  packetId: string;
  agentKey: string;
  priority: number;
  visibilityScope: "agent_only" | "shared" | "global";
  isActive: boolean;
};

export type MemoryPacket = {
  id: string;
  packetType: string;
  title: string;
  status: "draft" | "approved" | "active" | "superseded";
  subjectType: string;
  subjectId: string | null;
  packetJson: Record<string, unknown>;
};

export type TaskMemoryRequest = {
  agentKey: string;
  taskType: string;
  subjectType?: string | null;
  subjectId?: string | null;
  includeDrafts?: boolean;
};

export type ScopedMemoryResult = {
  agentKey: string;
  taskType: string;
  selectedPackets: Array<{
    id: string;
    title: string;
    packetType: string;
    priority: number;
    packetJson: Record<string, unknown>;
  }>;
};

export class AgentMemoryService {
  constructor(
    private readonly loadBindings: (agentKey: string) => Promise<AgentMemoryBinding[]>,
    private readonly loadPacketsByIds: (packetIds: string[]) => Promise<MemoryPacket[]>,
  ) {}

  async getScopedMemory(request: TaskMemoryRequest): Promise<ScopedMemoryResult> {
    const bindings = await this.loadBindings(request.agentKey);

    const activeBindings = bindings
      .filter((binding) => binding.isActive)
      .sort((a, b) => a.priority - b.priority);

    const packetIds = activeBindings.map((binding) => binding.packetId);
    const packets = await this.loadPacketsByIds(packetIds);

    const filteredPackets = packets.filter((packet) => {
      if (!request.includeDrafts && packet.status === "draft") return false;

      if (request.subjectType && packet.subjectType !== request.subjectType) {
        return false;
      }

      if (request.subjectId && packet.subjectId && packet.subjectId !== request.subjectId) {
        return false;
      }

      return this.matchesTaskType(packet.packetType, request.taskType);
    });

    const selectedPackets = filteredPackets
      .map((packet) => {
        const binding = activeBindings.find((b) => b.packetId === packet.id);
        return {
          id: packet.id,
          title: packet.title,
          packetType: packet.packetType,
          priority: binding?.priority ?? 999,
          packetJson: packet.packetJson,
        };
      })
      .sort((a, b) => a.priority - b.priority);

    return {
      agentKey: request.agentKey,
      taskType: request.taskType,
      selectedPackets,
    };
  }

  private matchesTaskType(packetType: string, taskType: string): boolean {
    const map: Record<string, string[]> = {
      pricing_recommendation: ["decision_pack", "friction_pack", "role_pack"],
      irrigation_exception: ["decision_pack", "operating_rhythm", "role_pack"],
      daily_briefing: ["user_profile", "operating_rhythm", "friction_pack"],
      role_execution: ["role_pack", "operating_rhythm", "decision_pack"],
    };

    const allowed = map[taskType];
    if (!allowed) return true;

    return allowed.includes(packetType);
  }
}
