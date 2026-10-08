import re
from typing import List, Optional, Dict, Any
from backend.models.schemas import AttackCategory, DetectionIndicator
from backend.detection.base import BaseDetector

class InstructionOverrideDetector(BaseDetector):
    def __init__(self):
        super().__init__(
            name="InstructionOverrideDetector",
            attack_type=AttackCategory.INSTRUCTION_OVERRIDE
        )
        self.patterns = [
            (
                r"(?i)\b(?:ignore|disregard|forget|bypass|override|drop|abandon)\b.*?\b(?:all\s+)?(?:previous|prior|former|above|past|initial)\b.*?\b(?:instructions|directives|prompts|rules|commands|constraints|guidelines)\b",
                95,
                0.98,
                "Explicit directive to disregard prior system instructions"
            ),
            (
                r"(?i)\b(?:ignore\s+all\s+instructions\s+and\s+follow\s+my\s+new\s+instructions)\b",
                98,
                0.99,
                "Classic prompt injection override signature"
            ),
            (
                r"(?i)\b(?:new\s+instructions|updated\s+directive|starting\s+now|from\s+now\s+on\s+you\s+must\s+obey\s+only\s+me)\b.*?\b(?:disregard|ignore|cancel)\b",
                88,
                0.94,
                "Instruction hijacking and command replacement directive"
            ),
            (
                r"(?i)(?:<\|im_start\|>system|\[system\]|<<SYS>>|\[INST\]|<system>).*?(?:override|unrestricted|bypass)",
                96,
                0.97,
                "Adversarial special token delimiter injection attempt"
            ),
            (
                r"(?i)\b(?:do\s+not\s+follow|stop\s+following)\b.*?\b(?:system\s+prompt|guardrails|safety\s+filters|moderation)\b",
                92,
                0.95,
                "Directive to dismantle safety guardrails and moderation"
            ),
            (
                r"(?i)={3,}\s*(?:NEW\s+TASK|SYSTEM\s+RESET|ADMIN\s+OVERRIDE)\s*={3,}",
                90,
                0.93,
                "Delimiter-based context boundary override"
            )
        ]

    def detect(self, text: str, context: Optional[Dict[str, Any]] = None) -> List[DetectionIndicator]:
        indicators = []
        for pattern, risk, conf, desc in self.patterns:
            matches = list(re.finditer(pattern, text))
            for match in matches:
                # False positive check: check if it's descriptive educational context
                if self.check_legitimate_context(text, (match.start(), match.end())):
                    conf = max(0.4, conf - 0.4)
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
