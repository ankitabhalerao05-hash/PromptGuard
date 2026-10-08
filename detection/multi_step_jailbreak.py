import re
from typing import List, Optional, Dict, Any
from backend.models.schemas import AttackCategory, DetectionIndicator
from backend.detection.base import BaseDetector

class MultiStepJailbreakDetector(BaseDetector):
    def __init__(self):
        super().__init__(
            name="MultiStepJailbreakDetector",
            attack_type=AttackCategory.MULTI_STEP_JAILBREAK
        )
        self.patterns = [
            (
                r"(?i)\b(?:in\s+a\s+fictional\s+(?:story|screenplay|novel|universe|script)|hypothetical\s+scenario|creative\s+writing\s+exercise|in\s+a\s+movie\s+script)\b.*?\b(?:without\s+any|with\s+no|lacking\s+any|disregards?\s+all)\s+(?:rules|filters|morals|limits|guidelines|safety)\b",
                92,
                0.95,
                "Fictional or hypothetical framing designed to bypass ethical constraints"
            ),
            (
                r"(?i)\b(?:act\s+as|roleplay\s+as|simulate)\s+(?:that|an?)\s+unfiltered\s+ai\b",
                93,
                0.96,
                "Unfiltered AI persona adoption directive"
            ),
            (
                r"(?i)\b(?:let's\s+play\s+a\s+game|play\s+a\s+roleplay\s+game)\b.*?\b(?:opposite\s+day|never\s+say\s+no|always\s+agree|no\s+restrictions)\b",
                93,
                0.95,
                "Gamification / cognitive framing exploit to elicit forbidden behavior"
            ),
            (
                r"(?i)\b(?:step\s+1[:\-].*?step\s+2[:\-].*?step\s+3)\b.*?\b(?:ignore|bypass|extract|disable|override)\b",
                88,
                0.92,
                "Multi-step phased escalation targeting alignment boundaries"
            ),
            (
                r"(?i)\b(?:my\s+grandmother\s+used\s+to\s+read\s+me|as\s+a\s+bedtime\s+story)\b.*?\b(?:napalm|malware|exploit|bypass|credential)\b",
                95,
                0.97,
                "Grandmother / emotional manipulation jailbreak archetype"
            ),
            (
                r"(?i)\b(?:for\s+purely\s+academic\s+and\s+authorized\s+research\s+purposes\s+in\s+an\s+air-gapped\s+lab)\b.*?\b(?:provide\s+the\s+exploit|override\s+filters)\b",
                87,
                0.90,
                "Plausible academic pretense framing to coax unauthorized disclosure"
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
