import re
from abc import ABC, abstractmethod
from typing import List, Optional, Dict, Any
from backend.models.schemas import AttackCategory, DetectionIndicator

class BaseDetector(ABC):
    def __init__(self, name: str, attack_type: AttackCategory):
        self.name = name
        self.attack_type = attack_type

    @abstractmethod
    def detect(self, text: str, context: Optional[Dict[str, Any]] = None) -> List[DetectionIndicator]:
        """
        Analyze text and return any detected indicators.
        Must use context-aware analysis to prevent false positives.
        """
        pass

    def extract_snippet(self, text: str, match_start: int, match_end: int, window: int = 40) -> str:
        start = max(0, match_start - window)
        end = min(len(text), match_end + window)
        snippet = text[start:end].strip()
        if start > 0:
            snippet = "..." + snippet
        if end < len(text):
            snippet = snippet + "..."
        return snippet

    def check_legitimate_context(self, text: str, indicator_span: tuple) -> bool:
        """
        Check if surrounding tokens indicate benign educational, narrative,
        or business discussion rather than an active command injection.
        """
        lower = text.lower()
        benign_cues = [
            "for example", "such as", "tutorial on", "how to prevent",
            "vulnerability explanation", "security audit of", "case study",
            "quoted text:", "the article discussed"
        ]
        for cue in benign_cues:
            if cue in lower:
                # If benign cue is present and text is descriptive not imperative
                return True
        return False
