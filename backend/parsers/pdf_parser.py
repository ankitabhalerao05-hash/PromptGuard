import io
from typing import Tuple, List
import pypdf
from backend.parsers.normalizer import TextNormalizer

class PDFParser:
    @staticmethod
    def extract_text(file_bytes: bytes) -> Tuple[str, List[str]]:
        """
        Extracts raw text from a PDF byte stream.
        Returns:
            normalized_text: Consolidated document text
            pages: List of text per page for granular inspection
        """
        try:
            reader = pypdf.PdfReader(io.BytesIO(file_bytes))
            pages_text = []
            for i, page in enumerate(reader.pages):
                extracted = page.extract_text() or ""
                pages_text.append(f"--- [Page {i+1}] ---\n{extracted.strip()}")

            full_text = "\n\n".join(pages_text)
            normalized = TextNormalizer.normalize(full_text)
            return normalized, pages_text
        except Exception as e:
            return f"[PDF Parsing Error: {str(e)}]", []
