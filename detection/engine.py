from typing import List, Dict, Any, Optional
from backend.models.schemas import (
    AttackCategory, DetectionIndicator, AttackMatrixEntry, SourceType
)
from backend.detection.instruction_override import InstructionOverrideDetector
from backend.detection.role_change import RoleChangeDetector
from backend.detection.secret_extraction import SecretExtractionDetector
from backend.detection.tool_abuse import ToolAbuseDetector
from backend.detection.credential_theft import CredentialTheftDetector
from backend.detection.context_poisoning import ContextPoisoningDetector
from backend.detection.multi_step_jailbreak import MultiStepJailbreakDetector
from backend.detection.encoded_instructions import EncodedInstructionsDetector
from backend.detection.indirect_injection import IndirectInjectionDetector
from backend.detection.llm_classifier import LLMSecurityClassifier

class DetectionEngine:
    def __init__(self):
        self.detectors = [
            InstructionOverrideDetector(),
            RoleChangeDetector(),
            SecretExtractionDetector(),
            ToolAbuseDetector(),
            CredentialTheftDetector(),
            ContextPoisoningDetector(),
            MultiStepJailbreakDetector(),
            EncodedInstructionsDetector(),
            IndirectInjectionDetector()
        ]
        self.llm_classifier = LLMSecurityClassifier()

    def analyze(self, text: str, source_type: str = "User Text") -> Dict[str, Any]:
        context = {"source_type": source_type}
        all_indicators: List[DetectionIndicator] = []

        # 1. Run all 9 modular detectors
        for detector in self.detectors:
            indicators = detector.detect(text, context)
            all_indicators.extend(indicators)

        # 2. Check if encoded instructions were found: re-scan decoded payload!
        for ind in all_indicators:
            if ind.attack_type == AttackCategory.ENCODED_INSTRUCTIONS and ind.decoded_content:
                # Scan decoded content safely in isolation
                for detector in self.detectors:
                    if detector.attack_type != AttackCategory.ENCODED_INSTRUCTIONS:
                        sub_indicators = detector.detect(ind.decoded_content, context)
                        for sub_ind in sub_indicators:
                            sub_ind.explanation = f"[DECODED PAYLOAD THREAT]: {sub_ind.explanation}"
                            all_indicators.append(sub_ind)

        # 3. Run LLM / Deep Semantic Classifier
        llm_result = self.llm_classifier.classify(text, source_type)

        # 4. Synthesize Attack Matrix for all 9 supported attack types
        matrix_status: Dict[str, AttackMatrixEntry] = {}
        all_categories = [cat.value for cat in AttackCategory]

        detected_types_set = set()
        max_risk = 0
        conf_sum = 0.0

        for cat_name in all_categories:
            matching_inds = [ind for ind in all_indicators if ind.attack_type.value == cat_name]
            if matching_inds:
                top_ind = max(matching_inds, key=lambda x: x.risk_contribution)
                detected_types_set.add(cat_name)
                matrix_status[cat_name] = AttackMatrixEntry(
                    attack_type=cat_name,
                    detected=True,
                    risk_score=top_ind.risk_contribution,
                    confidence=top_ind.confidence,
                    trigger_summary=top_ind.explanation
                )
            else:
                matrix_status[cat_name] = AttackMatrixEntry(
                    attack_type=cat_name,
                    detected=False,
                    risk_score=0,
                    confidence=0.98,
                    trigger_summary="Clean - No indicators observed"
                )

        # 5. Composite Risk & Primary Attack Selection
        if all_indicators:
            max_indicator = max(all_indicators, key=lambda x: x.risk_contribution)
            max_risk = max_indicator.risk_contribution
            avg_conf = sum(ind.confidence for ind in all_indicators) / len(all_indicators)
            primary_attack = max_indicator.attack_type.value
            
            # Blend with LLM classifier result if LLM found higher severity
            if llm_result.get("risk_score", 0) > max_risk:
                max_risk = llm_result["risk_score"]
                avg_conf = max(avg_conf, llm_result["confidence"])
        else:
            # Clean or borderline
            max_risk = llm_result.get("risk_score", 4)
            avg_conf = llm_result.get("confidence", 0.98)
            primary_attack = None

        return {
            "indicators": all_indicators,
            "detected_types": list(detected_types_set),
            "primary_attack": primary_attack,
            "raw_risk": max_risk,
            "confidence": round(avg_conf, 2),
            "matrix_status": matrix_status,
            "llm_analysis": llm_result
        }
