import re
from typing import List, Optional, Dict, Any
from backend.models.schemas import AttackCategory, DetectionIndicator
from backend.detection.base import BaseDetector

class ContextPoisoningDetector(BaseDetector):
    def __init__(self):
        super().__init__(
            name="ContextPoisoningDetector",
            attack_type=AttackCategory.CONTEXT_POISONING
        )
        self.patterns = [
            (
                r"(?i)(?:\[SYSTEM(?:\s+NOTE|\s+ALERT|\s+UPDATE)?:\s*.*?(?:authorized|disabled|exempt|ignore|trust|override).*?\])",
                94,
                0.96,
                "Counterfeit [SYSTEM] metadata tag injected to deceive context or memory"
            ),
            (
                r"(?i)(?:<context_override>|<memory_injection>|<system_update>).*?(?:<\/context_override>|<\/memory_injection>|<\/system_update>)",
                95,
                0.97,
                "XML-style context encapsulation spoofing"
            ),
            (
                r"(?i)\b(?:FACT:\s*(?:the\s+admin\s+has\s+authorized|all\s+confidential\s+data\s+is\s+public|security\s+rules\s+no\s+longer\s+apply))\b",
                89,
                0.92,
                "Adversarial fact assertion designed to poison agent epistemic grounding"
            ),
            (
                r"(?i)(?:(?:Human|User|Customer):\s*.*?\n(?:Assistant|AI|Bot):\s*.*?(?:Certainly|Here\s+is\s+the\s+secret|I\s+will\s+override))",
                93,
                0.95,
                "Simulated conversational dialogue history injected to condition model output"
            ),
            (
                r"(?i)\b(?:store\s+in\s+memory|remember\s+for\s+all\s+future\s+sessions)\b.*?\b(?:always\s+comply|never\s+refuse|ignore\s+safety)\b",
                91,
                0.93,
                "Persistent memory poisoning directive"
            )
        ]

    def detect(self, text: str, context: Optional[Dict[str, Any]] = None) -> List[DetectionIndicator]:
        indicators = []
        for pattern, risk, conf, desc in self.patterns:
            matches = list(re.finditer(pattern, text, re.DOTALL))
            for match in matches:
                if self.check_legitimate_context(text, (match.start(), match.end())):
                    conf = max(0.4, conf - 0.4)
                    risk = max(25, risk - 45)

                excerpt = self.extract_snippet(text, match.start(), match.end())
                indicators.append(
                    DetectionIndicator(
                        detector_name=self.name,
                        attack_type=self.attack_type,
                        confidence=conf,
                        risk_contribution=risk,
                        matched_pattern=match.group(0)[:80],
                        excerpt=excerpt,
                        explanation=desc
                    )
                )
        return indicators
