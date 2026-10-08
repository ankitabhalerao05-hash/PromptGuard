import json
from typing import Any
from backend.parsers.normalizer import TextNormalizer

class JSONParser:
    @staticmethod
    def extract_text(raw_json: str) -> str:
        """
        Recursively extracts string values from JSON payload or API response.
        """
        try:
            data = json.loads(raw_json)
            extracted_strings = []

            def _traverse(node: Any, path: str = "root"):
                if isinstance(node, dict):
                    for k, v in node.items():
                        _traverse(v, f"{path}.{k}")
                elif isinstance(node, list):
                    for i, item in enumerate(node):
                        _traverse(item, f"{path}[{i}]")
                elif isinstance(node, str):
                    extracted_strings.append(f"[{path}]: {node}")
                elif node is not None:
                    extracted_strings.append(f"[{path}]: {str(node)}")

            _traverse(data)
            consolidated = "\n".join(extracted_strings)
            return TextNormalizer.normalize(consolidated)
        except Exception:
            # If not valid JSON, treat as raw text
            return TextNormalizer.normalize(raw_json)
