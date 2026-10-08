import re
from typing import List, Tuple

class SanitizationEngine:
    """
    Strips adversarial injection sequences and overrides while preserving
    legitimate business content.
    """
    def __init__(self):
        self.removal_patterns = [
            r"(?i)\b(?:ignore|disregard|forget|bypass|override)\b.*?\b(?:instructions|directives|prompts|rules|commands)\b.*?(?:\.|\n|$)",
            r"(?i)\b(?:reveal|show|dump|print)\b.*?\b(?:system\s+prompt|hidden\s+instructions|secret\s+key)\b.*?(?:\.|\n|$)",
            r"(?i)\b(?:give\s+me|extract)\b.*?\b(?:api\s*key|database\s+password|admin\s+credentials)\b.*?(?:\.|\n|$)",
            r"(?i)\b(?:you\s+are\s+now|act\s+as)\s+(?:an?\s+)?(?:unrestricted|dan|developer\s+mode|jailbroken)\b.*?(?:\.|\n|$)",
            r"(?i)\b(?:delete\s+all\s+files|rm\s+-rf|format\s+drive)\b.*?(?:\.|\n|$)",
            r"(?i)\b(?:important\s+ai\s+instruction|system\s+notice\s+to\s+reader\s+ai)[:\-].*?(?:\.|\n|$)",
            r"(?i)(?:<\|im_start\|>system|\[system\].*?\[\/system\]|<system>.*?<\/system>)",
            r"(?:[A-Za-z0-9+/]{30,}={0,2})" # Strip raw base64 payloads
        ]

    def sanitize(self, text: str, indicators: list) -> Tuple[str, List[str]]:
        sanitized = text
        extracted_untrusted_instructions = []

        # 1. Collect specific match snippets from indicators
        for ind in indicators:
            if ind.matched_pattern and len(ind.matched_pattern.strip()) > 3:
                extracted_untrusted_instructions.append(ind.matched_pattern.strip())

        # 2. Apply targeted removal of injection patterns
        for pattern in self.removal_patterns:
            matches = list(re.finditer(pattern, sanitized))
            for m in reversed(matches): # Reverse so offsets don't change
                extracted_untrusted_instructions.append(m.group(0).strip())
                sanitized = sanitized[:m.start()] + " [Malicious instruction removed] " + sanitized[m.end():]

        # Clean up whitespace
        sanitized = re.sub(r'\s+', ' ', sanitized).strip()
        sanitized = re.sub(r'(\[Malicious instruction removed\]\s*)+', '[Malicious instruction removed] ', sanitized)

        # De-duplicate extracted untrusted instructions
        unique_instructions = []
        for instr in extracted_untrusted_instructions:
            if instr not in unique_instructions:
                unique_instructions.append(instr)

        return sanitized, unique_instructions
