import unicodedata
import html
import re

class TextNormalizer:
    @staticmethod
    def normalize(text: str) -> str:
        if not text:
            return ""
        # 1. Unescape HTML entities (&lt; &gt; &amp;)
        normalized = html.unescape(text)
        # 2. Normalize Unicode (NFKC)
        normalized = unicodedata.normalize("NFKC", normalized)
        # 3. Standardize carriage returns
        normalized = normalized.replace("\r\n", "\n").replace("\r", "\n")
        # 4. Collapse excessive whitespace but keep paragraphs
        normalized = re.sub(r'[ \t]+', ' ', normalized)
        return normalized.strip()
