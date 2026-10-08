import re
from typing import List, Optional, Dict, Any
from backend.models.schemas import AttackCategory, DetectionIndicator
from backend.detection.base import BaseDetector

class RoleChangeDetector(BaseDetector):
    def __init__(self):
        super().__init__(
            name="RoleChangeDetector",
            attack_type=AttackCategory.ROLE_CHANGE
        )
        self.patterns = [
            (
                r"(?i)\b(?:you\s+are\s+now|act\s+as|pretend\s+to\s+be|roleplay\s+as|switch\s+to|enter)\s+(?:an?\s+)?(?:unrestricted|unaligned|unfiltered|jailbroken|god-?mode|developer\s+mode|dan|evil|chaos)\b",
                96,
                0.98,
                "Attempt to switch AI agent into an unrestricted or jailbroken persona"
            ),
            (
                r"(?i)\b(?:you\s+are\s+now\s+an\s+unrestricted\s+administrator|you\s+have\s+root\s+access|you\s+are\s+superuser)\b",
                95,
                0.97,
                "Privilege escalation simulation attempting to force administrative compliance"
            ),
            (
                r"(?i)\b(?:dan\s+mode|jailbreak\s+mode|developer\s+mode\s+v\d+|aim\s+mode|stan\s+mode)\b",
                94,
                0.96,
                "Known jailbreak persona signature (DAN / AIM / Dev Mode)"
            ),
            (
                r"(?i)\b(?:forget\s+you\s+are\s+an?\s+ai|you\s+are\s+no\s+longer\s+bound\s+by|exempt\s+from\s+all\s+(?:rules|policies|ethics))\b",
                93,
                0.95,
                "Attempt to untether agent from core identity and ethical bounds"
            ),
            (
                r"(?i)\b(?:pretend\s+you\s+have\s+no\s+limits|simulate\s+an\s+ai\s+without\s+content\s+filters)\b",
                90,
                0.92,
                "Hypothetical filter-free persona simulation"
            )
        ]

    def detect(self, text: str, context: Optional[Dict[str, Any]] = None) -> List[DetectionIndicator]:
        indicators = []
        for pattern, risk, conf, desc in self.patterns:
            matches = list(re.finditer(pattern, text))
            for match in matches:
                # Check false positive: benign roleplay like "act as a python tutor" or "act as an editor"
                matched_str = match.group(0).lower()
                if "tutor" in matched_str or "teacher" in matched_str or "editor" in matched_str:
                    continue

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
                        matched_pattern=match.group(0),
                        excerpt=excerpt,
                        explanation=desc
                    )
                )
        return indicators
