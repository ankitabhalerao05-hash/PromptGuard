from enum import Enum
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class AttackCategory(str, Enum):
    INSTRUCTION_OVERRIDE = "Instruction Override"
    ROLE_CHANGE = "Role Change"
    SECRET_EXTRACTION = "Secret Extraction"
    TOOL_ABUSE = "Tool Abuse"
    CREDENTIAL_THEFT = "Credential Theft"
    CONTEXT_POISONING = "Context Poisoning"
    MULTI_STEP_JAILBREAK = "Multi-Step Jailbreak"
    ENCODED_INSTRUCTIONS = "Encoded Instructions"
    INDIRECT_INJECTION = "Indirect Prompt Injection"

class ActionType(str, Enum):
    ALLOW = "ALLOW"
    SANITIZE_REVIEW = "SANITIZE / REVIEW"
    BLOCK = "BLOCK"

class SeverityLevel(str, Enum):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"
    CRITICAL = "Critical"

class SourceType(str, Enum):
    USER_TEXT = "User Text"
    PDF = "PDF"
    WEB_URL = "Web/URL"
    IMAGE_OCR = "Image/OCR"
    EMAIL = "Email"
    JSON_API = "JSON/API"
    MARKDOWN = "Markdown"
    SOURCE_CODE = "Source Code"

class DetectionIndicator(BaseModel):
    detector_name: str
    attack_type: AttackCategory
    confidence: float = Field(ge=0.0, le=1.0)
    risk_contribution: int = Field(ge=0, le=100)
    matched_pattern: Optional[str] = None
    excerpt: Optional[str] = None
    decoded_content: Optional[str] = None
    explanation: str

class AttackMatrixEntry(BaseModel):
    attack_type: str
    detected: bool
    risk_score: int
    confidence: float
    trigger_summary: Optional[str] = None

class FirewallDecision(BaseModel):
    action: ActionType
    risk_score: int = Field(ge=0, le=100)
    confidence: float = Field(ge=0.0, le=1.0)
    severity: SeverityLevel
    is_malicious: bool
    primary_attack: Optional[str] = None
    attack_types: List[str] = []
    explanation: str
    sanitized_content: Optional[str] = None
    untrusted_instructions_detected: List[str] = []
    indicators: List[DetectionIndicator] = []
    matrix_status: Dict[str, AttackMatrixEntry] = {}
    simulated_agent_outcome: str

class ScanRequest(BaseModel):
    source_type: SourceType = SourceType.USER_TEXT
    content: Optional[str] = None
    url: Optional[str] = None
    threshold_review: int = 30
    threshold_block: int = 70

class ScanResponse(BaseModel):
    scan_id: str
    timestamp: str
    source_type: SourceType
    raw_input_preview: str
    extracted_text: str
    decision: FirewallDecision
    processing_time_ms: float

class SecurityLogEntry(BaseModel):
    id: str
    timestamp: str
    source: str
    attack_type: str
    risk_score: int
    action: str
    severity: str
    reason: str
    input_snippet: str
    confidence: float = 0.95

class AnalyticsSummary(BaseModel):
    total_scans: int
    safe_inputs: int
    suspicious_inputs: int
    blocked_inputs: int
    avg_risk_score: float
    most_common_attack: str
    attack_distribution: Dict[str, int]
    source_distribution: Dict[str, int]
    recent_trend: List[Dict[str, Any]]
