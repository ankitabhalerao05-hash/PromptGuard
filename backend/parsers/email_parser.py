import re
from backend.parsers.normalizer import TextNormalizer

class EmailParser:
    @staticmethod
    def extract_text(raw_email: str) -> str:
        """
        Parses email headers (Subject, From, To) and message body,
        normalizing text for prompt injection scanning.
        """
        lines = raw_email.strip().split("\n")
        headers = []
        body_lines = []
        in_body = False

        for line in lines:
            if not in_body:
                if line.strip() == "" or (not ":" in line and not line.startswith(" ")):
                    in_body = True
                    body_lines.append(line)
                elif any(line.lower().startswith(h) for h in ["from:", "to:", "subject:", "date:", "reply-to:"]):
                    headers.append(line.strip())
                else:
                    body_lines.append(line)
            else:
                body_lines.append(line)

        header_block = "\n".join(headers)
        body_block = "\n".join(body_lines)
        consolidated = f"EMAIL HEADERS:\n{header_block}\n\nEMAIL BODY:\n{body_block}"
        return TextNormalizer.normalize(consolidated)
