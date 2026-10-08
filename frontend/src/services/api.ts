import { ScanResponse, SecurityLogEntry, AnalyticsSummary, DemoScenario } from '../types';

const API_BASE = '/api';

export async function scanText(
  content: string,
  sourceType: string = 'User Text',
  thresholdReview: number = 30,
  thresholdBlock: number = 70
): Promise<ScanResponse> {
  const res = await fetch(`${API_BASE}/scan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      content,
      source_type: sourceType,
      threshold_review: thresholdReview,
      threshold_block: thresholdBlock,
    }),
  });
  if (!res.ok) throw new Error(`Scan failed: ${res.statusText}`);
  return res.json();
}

export async function scanPDF(
  file: File,
  thresholdReview: number = 30,
  thresholdBlock: number = 70
): Promise<ScanResponse> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('threshold_review', thresholdReview.toString());
  formData.append('threshold_block', thresholdBlock.toString());

  const res = await fetch(`${API_BASE}/scan/pdf`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error(`PDF scan failed: ${res.statusText}`);
  return res.json();
}

export async function scanImage(
  file: File,
  ocrText: string = '',
  thresholdReview: number = 30,
  thresholdBlock: number = 70
): Promise<ScanResponse> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('client_ocr_text', ocrText);
  formData.append('threshold_review', thresholdReview.toString());
  formData.append('threshold_block', thresholdBlock.toString());

  const res = await fetch(`${API_BASE}/scan/image`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error(`Image scan failed: ${res.statusText}`);
  return res.json();
}

export async function scanURL(
  url: string,
  thresholdReview: number = 30,
  thresholdBlock: number = 70
): Promise<ScanResponse> {
  const formData = new FormData();
  formData.append('url', url);
  formData.append('threshold_review', thresholdReview.toString());
  formData.append('threshold_block', thresholdBlock.toString());

  const res = await fetch(`${API_BASE}/scan/url`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error(`URL scan failed: ${res.statusText}`);
  return res.json();
}

export async function fetchDemos(): Promise<DemoScenario[]> {
  const res = await fetch(`${API_BASE}/demos`);
  if (!res.ok) throw new Error('Failed to load demo scenarios');
  return res.json();
}

export async function fetchLogs(limit: number = 50): Promise<SecurityLogEntry[]> {
  const res = await fetch(`${API_BASE}/logs?limit=${limit}`);
  if (!res.ok) throw new Error('Failed to load logs');
  return res.json();
}

export async function fetchAnalytics(): Promise<AnalyticsSummary> {
  const res = await fetch(`${API_BASE}/analytics`);
  if (!res.ok) throw new Error('Failed to load analytics');
  return res.json();
}

export async function checkHealth(): Promise<{ status: string }> {
  const res = await fetch(`${API_BASE}/health`);
  return res.json();
}
