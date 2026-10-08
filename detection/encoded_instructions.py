import re
import base64
import codecs
import urllib.parse
from typing import List, Optional, Dict, Any
from backend.models.schemas import AttackCategory, DetectionIndicator
from backend.detection.base import BaseDetector

class EncodedInstructionsDetector(BaseDetector):
    def __init__(self):
        super().__init__(
            name="EncodedInstructionsDetector",
            attack_type=AttackCategory.ENCODED_INSTRUCTIONS
        )
        self.b64_pattern = re.compile(r'(?:[A-Za-z0-9+/]{20,}={0,2})')
        self.hex_pattern = re.compile(r'(?:(?:0x|\\x)?[0-9a-fA-F]{2}[\s,:\\]*){10,}')
        self.zero_width_chars = ['\u200b', '\u200c', '\u200d', '\ufeff', '\u200e', '\u200f']
        
        # Malicious keywords to look for once decoded
        self.trigger_keywords = [
            "ignore", "system prompt", "reveal", "password", "credential",
            "admin", "root", "unrestricted", "delete", "override", "secret", "hack", "bypass"
        ]

    def _decode_b64(self, s: str) -> Optional[str]:
        try:
            # Pad if needed
            pad_len = 4 - (len(s) % 4)
            if pad_len and pad_len < 4:
                s += '=' * pad_len
            decoded = base64.b64decode(s, validate=True).decode('utf-8', errors='ignore')
            # Check if it has readable ASCII text
            printable = sum(1 for c in decoded if c.isprintable() and not c.isspace())
            if len(decoded) > 8 and printable / len(decoded) > 0.7:
                return decoded
        except Exception:
            pass
        return None

    def _decode_hex(self, s: str) -> Optional[str]:
        try:
            clean_hex = re.sub(r'[^0-9a-fA-F]', '', s)
            if len(clean_hex) >= 16 and len(clean_hex) % 2 == 0:
                decoded = bytes.fromhex(clean_hex).decode('utf-8', errors='ignore')
                printable = sum(1 for c in decoded if c.isprintable() and not c.isspace())
                if len(decoded) > 6 and printable / len(decoded) > 0.7:
                    return decoded
        except Exception:
            pass
        return None

    def _decode_rot13(self, s: str) -> Optional[str]:
        try:
            decoded = codecs.decode(s, 'rot_13')
            # Check if decoded contains explicit instructions while original did not
            lower_dec = decoded.lower()
            if any(k in lower_dec for k in ["ignore all previous", "reveal system", "admin password"]):
                return decoded
        except Exception:
            pass
        return None

    def _decode_leetspeak(self, s: str) -> Optional[str]:
        leet_map = {
            '0': 'o', '1': 'i', '3': 'e', '4': 'a',
            '5': 's', '7': 't', '@': 'a', '$': 's'
        }
        converted = "".join(leet_map.get(c, c) for c in s.lower())
        if converted != s.lower():
            if any(k in converted for k in ["ignore", "password", "system prompt", "unrestricted"]):
                return converted
        return None

    def detect(self, text: str, context: Optional[Dict[str, Any]] = None) -> List[DetectionIndicator]:
        indicators = []

        # 1. Zero-width character inspection (Steganography)
        zwc_count = sum(text.count(c) for c in self.zero_width_chars)
        if zwc_count > 3:
            indicators.append(
                DetectionIndicator(
                    detector_name=self.name,
                    attack_type=self.attack_type,
                    confidence=0.96,
                    risk_contribution=92,
                    matched_pattern=f"[{zwc_count} zero-width hidden characters]",
                    excerpt=text[:60],
                    explanation=f"Steganographic zero-width character hiding detected ({zwc_count} obfuscated tokens)"
                )
            )

        # 2. Base64 payload inspection
        for match in self.b64_pattern.finditer(text):
            candidate = match.group(0)
            decoded = self._decode_b64(candidate)
            if decoded:
                decoded_lower = decoded.lower()
                matched_threats = [k for k in self.trigger_keywords if k in decoded_lower]
                if matched_threats:
                    indicators.append(
                        DetectionIndicator(
                            detector_name=self.name,
                            attack_type=self.attack_type,
                            confidence=0.98,
                            risk_contribution=96,
                            matched_pattern=candidate[:35] + "...",
                            excerpt=f"Base64 Encoded Block: {candidate[:30]}...",
                            decoded_content=decoded,
                            explanation=f"Base64 obfuscated payload detected. Safely decoded in security layer: '{decoded[:70]}...'. Contains malicious keywords: {', '.join(matched_threats)}."
                        )
                    )

        # 3. Hexadecimal payload inspection
        for match in self.hex_pattern.finditer(text):
            candidate = match.group(0)
            decoded = self._decode_hex(candidate)
            if decoded:
                decoded_lower = decoded.lower()
                matched_threats = [k for k in self.trigger_keywords if k in decoded_lower]
                if matched_threats:
                    indicators.append(
                        DetectionIndicator(
                            detector_name=self.name,
                            attack_type=self.attack_type,
                            confidence=0.95,
                            risk_contribution=93,
                            matched_pattern=candidate[:30] + "...",
                            excerpt=f"Hex Encoded: {candidate[:30]}...",
                            decoded_content=decoded,
                            explanation=f"Hexadecimal obfuscated payload detected. Decoded content: '{decoded[:60]}...'"
                        )
                    )

        # 4. ROT13 / Cipher text detection
        rot_decoded = self._decode_rot13(text)
        if rot_decoded:
            indicators.append(
                DetectionIndicator(
                    detector_name=self.name,
                    attack_type=self.attack_type,
                    confidence=0.94,
                    risk_contribution=90,
                    matched_pattern="ROT13 Cipher stream",
                    excerpt=text[:50],
                    decoded_content=rot_decoded[:100],
                    explanation=f"ROT13 obfuscation detected. Decoded threat: '{rot_decoded[:60]}...'"
                )
            )

        # 5. Leetspeak obfuscation
        leet_normalized = self._decode_leetspeak(text)
        if leet_normalized:
            indicators.append(
                DetectionIndicator(
                    detector_name=self.name,
                    attack_type=self.attack_type,
                    confidence=0.88,
                    risk_contribution=82,
                    matched_pattern="Leetspeak / Character Substitution",
                    excerpt=text[:50],
                    decoded_content=leet_normalized[:100],
                    explanation=f"Leetspeak character substitution detected. Normalized directive: '{leet_normalized[:60]}...'"
                )
            )

        return indicators
