from typing import List, Dict, Any, Tuple
from backend.models.schemas import ActionType, SeverityLevel, DetectionIndicator

class RiskEngine:
    def __init__(self, default_threshold_review: int = 30, default_threshold_block: int = 70):
        self.threshold_review = default_threshold_review
        self.threshold_block = default_threshold_block

    def compute_decision(
        self,
        raw_risk: int,
        confidence: float,
        indicators: List[DetectionIndicator],
        threshold_review: int = 30,
        threshold_block: int = 70
    ) -> Tuple[ActionType, SeverityLevel, str]:
        """
        Calculates final action, severity, and comprehensive SOC explainability text.
        """
        # Determine Action
        if raw_risk >= threshold_block:
            action = ActionType.BLOCK
        elif raw_risk >= threshold_review:
            action = ActionType.SANITIZE_REVIEW
        else:
            action = ActionType.ALLOW

        # Determine Severity
        if raw_risk >= 70:
            severity = SeverityLevel.CRITICAL if raw_risk >= 85 else SeverityLevel.HIGH
        elif raw_risk >= 40:
            severity = SeverityLevel.MEDIUM
        else:
            severity = SeverityLevel.LOW

        # Generate Explainability Rationale
        explanation = self.generate_soc_explanation(action, raw_risk, indicators)

        return action, severity, explanation

    def generate_soc_explanation(self, action: ActionType, risk_score: int, indicators: List[DetectionIndicator]) -> str:
        if action == ActionType.BLOCK:
            if indicators:
                top = max(indicators, key=lambda x: x.risk_contribution)
                return (
                    f"Blocked (Risk: {risk_score}/100) because content attempts an active "
                    f"'{top.attack_type.value}' attack. {top.explanation} "
                    f"Per security policy, untrusted instructions are prohibited from executing in the AI agent runtime."
                )
            return f"Blocked (Risk: {risk_score}/100) due to critical threat patterns violating agent security boundaries."

        elif action == ActionType.SANITIZE_REVIEW:
            reasons = [ind.explanation for ind in indicators[:2]]
            reason_str = " & ".join(reasons) if reasons else "Elevated risk syntax and ambiguous prompt boundary detected."
            return (
                f"Flagged for Sanitize/Review (Risk: {risk_score}/100). {reason_str} "
                f"Suspicious instructions were neutralized into safe passive data before agent ingestion."
            )
        else:
            return (
                f"Allowed (Risk: {risk_score}/100). Content verified as benign. "
                f"No instruction override, system extraction, credential harvesting, or tool abuse signatures found."
            )
