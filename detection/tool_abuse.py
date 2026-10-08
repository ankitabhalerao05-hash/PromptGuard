import re
from typing import List, Optional, Dict, Any
from backend.models.schemas import AttackCategory, DetectionIndicator
from backend.detection.base import BaseDetector

class ToolAbuseDetector(BaseDetector):
    def __init__(self):
        super().__init__(
            name="ToolAbuseDetector",
            attack_type=AttackCategory.TOOL_ABUSE
        )
        self.patterns = [
            (
                r"(?i)\b(?:delete\s+all\s+files|wipe\s+the\s+disk|format\s+drive|destroy\s+all\s+records)\b",
                98,
                0.99,
                "Destructive filesystem wipe or mass file deletion request"
            ),
            (
                r"(?i)\b(?:rm\s+-rf\s+[/~*]|del\s+/[sS]\s+/[qQ]|format\s+[c-z]:|dd\s+if=/dev/zero|mkfs\.)\b",
                99,
                0.99,
                "Lethal OS command execution signature"
            ),
            (
                r"(?i)\b(?:drop\s+(?:database|table|schema)|truncate\s+table)\s+[a-zA-Z0-9_*]+\s*;",
                95,
                0.97,
                "Destructive SQL injection / database drop directive"
            ),
            (
                r"(?i)\b(?:run\s+tool|execute\s+command|invoke\s+function|call\s+bash|launch\s+subprocess)\b.*?\b(?:without\s+confirmation|silently|as\s+root|with\s+elevated)\b",
                92,
                0.94,
                "Attempt to trigger unconfirmed or unauthorized tool execution"
            ),
            (
                r"(?i)\b(?:curl|wget|nc|netcat|ncat|bash\s+-i|powershell\s+-enc)\b.*?\b(?:http://|https://|ftp://|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\b",
                94,
                0.96,
                "Outbound data exfiltration or reverse shell utility invocation"
            ),
            (
                r"(?i)\b(?:kill\s+-9|shutdown\s+-h|reboot\s+now|pkill\s+-9|taskkill\s+/f)\b",
                89,
                0.93,
                "System service termination or denial of service command"
            )
        ]

    def detect(self, text: str, context: Optional[Dict[str, Any]] = None) -> List[DetectionIndicator]:
        indicators = []
        for pattern, risk, conf, desc in self.patterns:
            matches = list(re.finditer(pattern, text))
            for match in matches:
                # False positive check: Documentation talking about commands (e.g. "Do not run rm -rf /")
                if re.search(r"(?i)\b(?:warning|never|do\s+not\s+run|avoid\s+using|example\s+of\s+bad)\b", text):
                    conf = max(0.35, conf - 0.5)
                    risk = max(20, risk - 60)

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
