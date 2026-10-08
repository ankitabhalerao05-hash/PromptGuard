export type AttackCategory =
  | 'Instruction Override'
  | 'Role Change'
  | 'Secret Extraction'
  | 'Tool Abuse'
  | 'Credential Theft'
  | 'Context Poisoning'
  | 'Multi-Step Jailbreak'
  | 'Encoded Instructions'
  | 'Indirect Prompt Injection';

export type ActionType = 'ALLOW' | 'SANITIZE / REVIEW' | 'BLOCK';
export type SeverityLevel = 'Low' | 'Medium' | 'High' | 'Critical';
export type SourceType =
  | 'User Text'
  | 'PDF'
  | 'Web/URL'
  | 'Image/OCR'
  | 'Email'
  | 'JSON/API'
  | 'Markdown'
  | 'Source Code';

export interface DetectionIndicator {
  detector_name: string;
  attack_type: AttackCategory;
  confidence: number;
  risk_contribution: number;
  matched_pattern?: string;
  excerpt?: string;
  decoded_content?: string;
  explanation: string;
}

export interface AttackMatrixEntry {
  attack_type: string;
  detected: boolean;
  risk_score: number;
  confidence: number;
  trigger_summary?: string;
}

export interface FirewallDecision {
  action: ActionType;
  risk_score: number;
  confidence: number;
  severity: SeverityLevel;
  is_malicious: boolean;
  primary_attack?: string;
  attack_types: string[];
  explanation: string;
  sanitized_content?: string;
  untrusted_instructions_detected: string[];
  indicators: DetectionIndicator[];
  matrix_status: Record<string, AttackMatrixEntry>;
  simulated_agent_outcome: string;
}

export interface ScanResponse {
  scan_id: string;
  timestamp: string;
  source_type: SourceType;
  raw_input_preview: string;
  extracted_text: string;
  decision: FirewallDecision;
  processing_time_ms: number;
}

export interface SecurityLogEntry {
  id: string;
  timestamp: string;
  source: string;
  attack_type: string;
  risk_score: number;
  action: string;
  severity: string;
  reason: string;
  input_snippet: string;
  confidence: number;
}

export interface AnalyticsSummary {
  total_scans: number;
  safe_inputs: number;
  suspicious_inputs: number;
  blocked_inputs: number;
  avg_risk_score: number;
  most_common_attack: string;
  attack_distribution: Record<string, number>;
  source_distribution: Record<string, number>;
  recent_trend: Array<{ time: string; avg_risk: number; scans: number }>;
}

export interface DemoScenario {
  id: string;
  title: string;
  source: string;
  description: string;
  input: string;
  expected_attack: string;
  expected_action: string;
  expected_risk: string;
  badge_color: 'emerald' | 'amber' | 'rose';
}
