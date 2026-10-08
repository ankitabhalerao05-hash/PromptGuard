import re
from typing import List, Optional, Dict, Any
from backend.models.schemas import AttackCategory, DetectionIndicator
from backend.detection.base import BaseDetector

class CredentialTheftDetector(BaseDetector):
    def __init__(self):
        super().__init__(
            name="CredentialTheftDetector",
            attack_type=AttackCategory.CREDENTIAL_THEFT
        )
        self.patterns = [
            (
                r"(?i)\b(?:give\s+me|tell\s+me|send\s+me|provide|extract|show|dump|print)\b.*?\b(?:api\s*key|database\s+password|db\s+password|admin\s+credentials|secret\s+key|private\s+key|master\s+password)\b",
                97,
                0.98,
                "Direct solicitation of sensitive API keys or database passwords"
            ),
            (
                r"(?i)\b(?:give\s+me\s+the\s+api\s+key\s+and\s+database\s+password)\b",
                98,
                0.99,
                "Explicit credential theft signature"
            ),
            (
                r"(?i)\b(?:read|dump|cat|access)\b.*?\b(?:\.env|wp-config\.php|id_rsa|id_ed25519|/etc/shadow|/etc/passwd|credentials\.json)\b",
                95,
                0.97,
                "File exfiltration targeting credential configuration files"
            ),
            (
                r"(?i)\b(?:AKIA[0-9A-Z]{16}|ghp_[a-zA-Z0-9]{36}|sk_live_[a-zA-Z0-9]{24,}|-----BEGIN\s+(?:RSA\s+)?PRIVATE\s+KEY-----)",
                96,
                0.98,
                "Hardcoded cryptographic token or secret key detected in payload"
            ),
            (
                r"(?i)\b(?:export|printenv|set)\b.*?\b(?:AWS_SECRET_ACCESS_KEY|OPENAI_API_KEY|DATABASE_URL|GITHUB_TOKEN|AUTH_TOKEN)\b",
                93,
                0.95,
                "Attempt to access sensitive environment credential variables"
            ),
            (
                r"(?i)\b(?:steal|harvest|sniff|exfiltrate)\b.*?\b(?:credentials|session\s+cookie|bearer\s+token|passwords)\b",
                94,
                0.96,
                "Malicious credential harvesting directive"
            )
        ]

    def detect(self, text: str, context: Optional[Dict[str, Any]] = None) -> List[DetectionIndicator]:
        indicators = []
        for pattern, risk, conf, desc in self.patterns:
            matches = list(re.finditer(pattern, text))
            for match in matches:
                # False positive check: "how do I set up a strong password?" or "user password reset policy"
                if re.search(r"(?i)\b(?:password\s+policy|reset\s+password|password\s+complexity|forgot\s+password|create\s+a\s+password)\b", text):
                    # Only discount if it wasn't an imperative demand for secrets
                    if not re.search(r"(?i)\b(?:give\s+me|dump|leak|extract)\b", text):
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
