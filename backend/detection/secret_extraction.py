import re
from typing import List, Optional, Dict, Any
from backend.models.schemas import AttackCategory, DetectionIndicator
from backend.detection.base import BaseDetector

class SecretExtractionDetector(BaseDetector):
    def __init__(self):
        super().__init__(
            name="SecretExtractionDetector",
            attack_type=AttackCategory.SECRET_EXTRACTION
        )
        self.patterns = [
            (
                r"(?i)\b(?:reveal|show|print|display|dump|tell\s+me|expose|leak|repeat|output|recite)\b.*?\b(?:system\s+prompt|hidden\s+instructions|system\s+instructions|initial\s+prompt|developer\s+prompt|core\s+instructions|system\s+directives|meta\s+prompt)\b",
                96,
                0.98,
                "Command to leak or reveal confidential system prompt and instructions"
            ),
            (
                r"(?i)\b(?:reveal\s+your\s+system\s+prompt\s+and\s+hidden\s+instructions)\b",
                98,
                0.99,
                "Explicit system prompt extraction signature"
            ),
            (
                r"(?i)\b(?:what\s+(?:are|were)\s+your\s+(?:initial|exact|full|hidden)\s+(?:instructions|guidelines|system\s+messages|rules))\b",
                90,
                0.94,
                "Interrogation aiming to extract foundational system instructions"
            ),
            (
                r"(?i)\b(?:output\s+everything\s+above|print\s+text\s+above|repeat\s+words\s+above\s+verbatim)\b",
                92,
                0.95,
                "Delimiter-bleed attempt to dump preceding context window"
            ),
            (
                r"(?i)\b(?:disclose|share)\s+the\s+(?:confidential|internal|secret|private)\s+(?:guardrails|context|prompt)\b",
                91,
                0.93,
                "Directive targeting internal confidential security guardrails"
            )
        ]

    def detect(self, text: str, context: Optional[Dict[str, Any]] = None) -> List[DetectionIndicator]:
        indicators = []
        for pattern, risk, conf, desc in self.patterns:
            matches = list(re.finditer(pattern, text))
            for match in matches:
                # False positive check: "how do I write a good system prompt?" is benign
                if re.search(r"(?i)\b(?:how\s+(?:to|can\s+i|do\s+we)\s+write|definition\s+of|explain\s+what\s+is\s+a)\s+system\s+prompt\b", text):
                    continue

                if self.check_legitimate_context(text, (match.start(), match.end())):
                    conf = max(0.35, conf - 0.45)
                    risk = max(20, risk - 50)

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
