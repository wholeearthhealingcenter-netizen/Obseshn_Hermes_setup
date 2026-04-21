/**
 * 16_hermes_approval_policy.ts
 *
 * Approval policy layer for Hermes promotions.
 * Goal:
 * - classify extracted logic by risk
 * - determine who can approve
 * - prevent unsafe auto-promotion
 */

export type HermesApprovalClass = "A" | "B" | "C";

export type ApprovalDecisionContext = {
  objectType: "extraction" | "rule" | "packet" | "policy";
  ruleFamily?: string | null;
  extractionType?: string | null;
  confidenceScore?: number | null;
  hasThreshold?: boolean;
  hasException?: boolean;
};

export type ApprovalRequirement = {
  approvalClass: HermesApprovalClass;
  requiresJohnApproval: boolean;
  allowsDepartmentApproval: boolean;
  allowsAutoPromotion: boolean;
  minimumConfidenceScore: number;
  notes: string;
};

export class HermesApprovalPolicy {
  static classify(context: ApprovalDecisionContext): ApprovalRequirement {
    const criticalFamilies = new Set([
      "pricing",
      "compliance",
      "financial",
      "destruction",
      "retest",
    ]);

    if (context.ruleFamily && criticalFamilies.has(context.ruleFamily)) {
      return {
        approvalClass: "A",
        requiresJohnApproval: true,
        allowsDepartmentApproval: false,
        allowsAutoPromotion: false,
        minimumConfidenceScore: 0.85,
        notes: "Critical business logic. Requires top-level approval.",
      };
    }

    if (
      context.ruleFamily &&
      ["irrigation", "inventory", "allocation", "maintenance", "workflow"].includes(
        context.ruleFamily,
      )
    ) {
      return {
        approvalClass: "B",
        requiresJohnApproval: false,
        allowsDepartmentApproval: true,
        allowsAutoPromotion: false,
        minimumConfidenceScore: 0.80,
        notes: "Operating logic. Department lead can approve.",
      };
    }

    return {
      approvalClass: "C",
      requiresJohnApproval: false,
      allowsDepartmentApproval: true,
      allowsAutoPromotion: true,
      minimumConfidenceScore: 0.70,
      notes: "Low-risk context or terminology. Eligible for controlled auto-promotion.",
    };
  }

  static canPromoteToRule(context: ApprovalDecisionContext): {
    eligible: boolean;
    reasons: string[];
  } {
    const reasons: string[] = [];
    const req = this.classify(context);

    const confidence = context.confidenceScore ?? 0;

    if (confidence < req.minimumConfidenceScore) {
      reasons.push(
        `Confidence score ${confidence.toFixed(2)} is below required threshold ${req.minimumConfidenceScore.toFixed(2)}.`,
      );
    }

    if (context.extractionType === "rule") {
      if (!context.hasThreshold) {
        reasons.push("Rule extraction is missing an explicit threshold or trigger.");
      }
      if (!context.hasException) {
        reasons.push("Rule extraction is missing an explicit exception path.");
      }
    }

    return {
      eligible: reasons.length === 0,
      reasons,
    };
  }
}
