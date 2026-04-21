/**
 * 14_hermes_question_bank.ts
 *
 * Reusable Hermes interview question bank.
 * Purpose:
 * - standardize extraction interviews
 * - make follow-ups predictable
 * - support role/department-specific packs later
 */

export type HermesLayer =
  | "operating_rhythm"
  | "decision_logic"
  | "inputs"
  | "dependencies"
  | "friction";

export type FollowUpStrategy =
  | "threshold"
  | "exception"
  | "counterexample"
  | "frequency"
  | "owner"
  | "impact"
  | "sequence"
  | "clarification";

export type HermesQuestion = {
  code: string;
  layer: HermesLayer;
  prompt: string;
  tags: string[];
  followUpStrategy: FollowUpStrategy[];
  priority: number;
  subjectTypes?: Array<"person" | "role" | "department" | "system">;
};

export const HERMES_QUESTION_BANK: HermesQuestion[] = [
  {
    code: "RHYTHM_CYCLE_001",
    layer: "operating_rhythm",
    prompt: "Walk me through the full repeating cycle in order, including what always happens versus what only sometimes happens.",
    tags: ["cycle", "cadence", "operations"],
    followUpStrategy: ["sequence", "clarification"],
    priority: 10,
  },
  {
    code: "RHYTHM_DAY_001",
    layer: "operating_rhythm",
    prompt: "What does a normal high-value workday actually look like from start to finish, not the ideal calendar version?",
    tags: ["daily_rhythm", "real_work", "cadence"],
    followUpStrategy: ["sequence", "exception", "clarification"],
    priority: 20,
  },
  {
    code: "DECISION_PRICING_001",
    layer: "decision_logic",
    prompt: "When do you decide to sell a batch early instead of holding for a better price?",
    tags: ["pricing", "allocation", "sales"],
    followUpStrategy: ["threshold", "exception", "counterexample", "frequency"],
    priority: 10,
  },
  {
    code: "DECISION_GROW_001",
    layer: "decision_logic",
    prompt: "What signs tell you to push harder on a room versus pull back and protect the crop?",
    tags: ["grow", "room_decision", "judgment"],
    followUpStrategy: ["threshold", "exception", "counterexample"],
    priority: 15,
  },
  {
    code: "INPUTS_METRICS_001",
    layer: "inputs",
    prompt: "Which measurements or observations matter most when you make this decision?",
    tags: ["metrics", "inputs", "signals"],
    followUpStrategy: ["threshold", "clarification"],
    priority: 10,
  },
  {
    code: "DEPENDENCY_PEOPLE_001",
    layer: "dependencies",
    prompt: "Who or what do you depend on before you can finish this task correctly?",
    tags: ["people", "systems", "vendors", "dependency"],
    followUpStrategy: ["owner", "sequence", "exception"],
    priority: 10,
  },
  {
    code: "FRICTION_REPEAT_001",
    layer: "friction",
    prompt: "What repeatedly wastes time or causes avoidable mistakes in this area?",
    tags: ["waste", "mistakes", "friction"],
    followUpStrategy: ["frequency", "impact", "owner"],
    priority: 10,
  },
  {
    code: "FRICTION_DELAY_001",
    layer: "friction",
    prompt: "What usually slows this process down after the decision has already been made?",
    tags: ["delay", "handoff", "friction"],
    followUpStrategy: ["frequency", "impact", "owner"],
    priority: 20,
  },
];

export function getQuestionsByLayer(layer: HermesLayer): HermesQuestion[] {
  return HERMES_QUESTION_BANK
    .filter((q) => q.layer === layer)
    .sort((a, b) => a.priority - b.priority);
}

export function getQuestionsForSubjectType(
  subjectType: "person" | "role" | "department" | "system",
): HermesQuestion[] {
  return HERMES_QUESTION_BANK
    .filter((q) => !q.subjectTypes || q.subjectTypes.includes(subjectType))
    .sort((a, b) => a.priority - b.priority);
}

export function getQuestionByCode(code: string): HermesQuestion | undefined {
  return HERMES_QUESTION_BANK.find((q) => q.code === code);
}

export function buildFollowUpPrompts(
  question: HermesQuestion,
  answerText: string,
): string[] {
  const prompts: string[] = [];

  for (const strategy of question.followUpStrategy) {
    switch (strategy) {
      case "threshold":
        prompts.push("What exact number, threshold, or trigger should define this?");
        break;
      case "exception":
        prompts.push("When would you NOT do this, even if the main condition looks true?");
        break;
      case "counterexample":
        prompts.push("Can you give an example where this logic would fail or need adjustment?");
        break;
      case "frequency":
        prompts.push("How often does this happen in a normal week, cycle, or month?");
        break;
      case "owner":
        prompts.push("Who owns this part when it goes right, and who gets stuck when it goes wrong?");
        break;
      case "impact":
        prompts.push("What is the real cost when this issue happens?");
        break;
      case "sequence":
        prompts.push("What happens immediately before and immediately after this step?");
        break;
      case "clarification":
        prompts.push("What do you mean by that in concrete operational terms?");
        break;
      default:
        prompts.push("Can you be more specific?");
        break;
    }
  }

  if (answerText.length < 40) {
    prompts.push("Please expand that with one real example.");
  }

  return prompts;
}
