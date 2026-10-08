from typing import Dict, Any, List
from backend.models.schemas import FirewallDecision, ActionType, AttackCategory
from backend.risk_engine.scorer import RiskEngine
from backend.security.sanitizer import SanitizationEngine
from backend.security.policy import SecurityPolicyBoundary

class DecisionEngine:
    def __init__(self):
        self.risk_engine = RiskEngine()
        self.sanitizer = SanitizationEngine()
        self.policy_boundary = SecurityPolicyBoundary()

    def decide(
        self,
        text: str,
        detection_result: Dict[str, Any],
        source_type: str = "User Text",
        threshold_review: int = 30,
        threshold_block: int = 70
    ) -> FirewallDecision:
        raw_risk = detection_result["raw_risk"]
        confidence = detection_result["confidence"]
        indicators = detection_result["indicators"]
        detected_types = detection_result["detected_types"]
        primary_attack = detection_result["primary_attack"]
        matrix_status = detection_result["matrix_status"]

        action, severity, explanation = self.risk_engine.compute_decision(
            raw_risk=raw_risk,
            confidence=confidence,
            indicators=indicators,
            threshold_review=threshold_review,
            threshold_block=threshold_block
        )

        sanitized_content = None
        untrusted_instructions = []

        # If malicious or suspicious, perform sanitization for review / diff display
        if action in [ActionType.BLOCK, ActionType.SANITIZE_REVIEW]:
            sanitized_content, untrusted_instructions = self.sanitizer.sanitize(text, indicators)
            if not untrusted_instructions and indicators:
                for ind in indicators:
                    if ind.excerpt:
                        untrusted_instructions.append(ind.excerpt)

        is_malicious = (action == ActionType.BLOCK)

        decision = FirewallDecision(
            action=action,
            risk_score=raw_risk,
            confidence=confidence,
            severity=severity,
            is_malicious=is_malicious,
            primary_attack=primary_attack,
            attack_types=detected_types,
            explanation=explanation,
            sanitized_content=sanitized_content,
            untrusted_instructions_detected=untrusted_instructions,
            indicators=indicators,
            matrix_status=matrix_status,
            simulated_agent_outcome=""
        )

        decision.simulated_agent_outcome = self.policy_boundary.simulate_agent_gateway(
            decision, text, source_type
        )

        return decision
