from typing import Dict, Any
from backend.models.schemas import ActionType, FirewallDecision

class SecurityPolicyBoundary:
    """
    Enforces the fundamental architectural axiom:
    'Untrusted content must never automatically become trusted instructions.'
    """
    @staticmethod
    def simulate_agent_gateway(decision: FirewallDecision, original_text: str, source_type: str) -> str:
        if decision.action == ActionType.BLOCK:
            return (
                f"[FIREWALL INTERCEPT - 0 TRUST EXECUTED]\n"
                f"Action: BLOCK (Score: {decision.risk_score}/100, Threat: {decision.primary_attack})\n"
                f"Agent Status: Fully Isolated. The untrusted instruction was neutralized at perimeter. "
                f"No tool execution, filesystem access, credential disclosure, or system override was permitted."
            )
        elif decision.action == ActionType.SANITIZE_REVIEW:
            return (
                f"[FIREWALL REVIEW - SANITIZED PASSAGE]\n"
                f"Action: SANITIZE / REVIEW (Score: {decision.risk_score}/100)\n"
                f"Agent Context: Agent receives sanitized content tagged as passive data:\n"
                f"\"\"\"{decision.sanitized_content}\"\"\"\n"
                f"Note: All detected adversarial directives were replaced with safe placeholders."
            )
        else: # ALLOW
            return (
                f"[FIREWALL VERIFIED - SAFE PASS-THROUGH]\n"
                f"Action: ALLOW (Score: {decision.risk_score}/100, Clean)\n"
                f"Agent Context: Clean text forwarded to AI Agent workspace:\n"
                f"\"\"\"{original_text}\"\"\""
            )
