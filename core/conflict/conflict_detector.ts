/**
 * 15_hermes_conflict_detector.ts
 *
 * Detects conflicts between Hermes rules, terminology, and packet claims.
 * This is intentionally simple-first so it can be upgraded without
 * overcomplicating the early repo.
 */

export type RuleLike = {
  id: string;
  title: string;
  ruleFamily: string;
  subjectType: string;
  subjectId: string | null;
  conditionJson: Record<string, unknown>;
  actionJson: Record<string, unknown>;
  contextJson?: Record<string, unknown> | null;
};

export type ConflictRecord = {
  conflictType: "rule_conflict" | "entity_conflict" | "terminology_conflict";
  leftObjectId: string;
  rightObjectId: string;
  summary: string;
  severity: "low" | "medium" | "high";
  recommendedAction: "merge" | "contextualize" | "reject" | "manual_review";
};

export class HermesConflictDetector {
  static detectRuleConflicts(rules: RuleLike[]): ConflictRecord[] {
    const conflicts: ConflictRecord[] = [];

    for (let i = 0; i < rules.length; i += 1) {
      for (let j = i + 1; j < rules.length; j += 1) {
        const left = rules[i];
        const right = rules[j];

        const sameFamily = left.ruleFamily === right.ruleFamily;
        const sameSubject =
          left.subjectType === right.subjectType &&
          (left.subjectId ?? null) === (right.subjectId ?? null);

        if (!sameFamily || !sameSubject) {
          continue;
        }

        const conditionTextLeft = JSON.stringify(left.conditionJson);
        const conditionTextRight = JSON.stringify(right.conditionJson);
        const actionTextLeft = JSON.stringify(left.actionJson);
        const actionTextRight = JSON.stringify(right.actionJson);

        const sameCondition = conditionTextLeft === conditionTextRight;
        const sameAction = actionTextLeft === actionTextRight;

        if (sameCondition && !sameAction) {
          conflicts.push({
            conflictType: "rule_conflict",
            leftObjectId: left.id,
            rightObjectId: right.id,
            summary:
              "Rules appear to trigger under the same condition but propose different actions.",
            severity: "high",
            recommendedAction: "manual_review",
          });
        }

        if (!sameCondition && sameAction) {
          conflicts.push({
            conflictType: "rule_conflict",
            leftObjectId: left.id,
            rightObjectId: right.id,
            summary:
              "Rules converge on the same action but use different trigger conditions; may need contextual separation.",
            severity: "medium",
            recommendedAction: "contextualize",
          });
        }

        if (!sameCondition && !sameAction && left.title === right.title) {
          conflicts.push({
            conflictType: "rule_conflict",
            leftObjectId: left.id,
            rightObjectId: right.id,
            summary:
              "Rules share the same title but differ in both condition and action logic.",
            severity: "high",
            recommendedAction: "manual_review",
          });
        }
      }
    }

    return conflicts;
  }

  static detectTerminologyConflicts(
    entities: Array<{ id: string; canonicalName: string; aliases: string[]; entityType: string }>,
  ): ConflictRecord[] {
    const conflicts: ConflictRecord[] = [];

    for (let i = 0; i < entities.length; i += 1) {
      for (let j = i + 1; j < entities.length; j += 1) {
        const left = entities[i];
        const right = entities[j];

        if (left.entityType !== right.entityType) continue;

        const leftNames = new Set([left.canonicalName.toLowerCase(), ...left.aliases.map(a => a.toLowerCase())]);
        const rightNames = new Set([right.canonicalName.toLowerCase(), ...right.aliases.map(a => a.toLowerCase())]);

        const overlap = [...leftNames].some((name) => rightNames.has(name));

        if (overlap && left.canonicalName !== right.canonicalName) {
          conflicts.push({
            conflictType: "terminology_conflict",
            leftObjectId: left.id,
            rightObjectId: right.id,
            summary:
              "Two entities share overlapping names or aliases and may need merge or alias cleanup.",
            severity: "medium",
            recommendedAction: "merge",
          });
        }
      }
    }

    return conflicts;
  }
}
