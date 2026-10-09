import {
  Evaluation, Attack, AttackPayload, AttackLibraryItem,
  Defense, SecurityFinding, BlueViewData, EvidenceEvent,
  EvidenceVerification, ContaminationCheck, ResourceFairness,
  TestIntegrityPassport, Role
} from '../types';

const API_BASE = '/api/v1';

class ApiClient {
  private currentRole: Role = 'ADMIN';
  private authToken: string = '';

  setRole(role: Role) {
    this.currentRole = role;
    localStorage.setItem('bayora_role', role);
  }

  getRole(): Role {
    const saved = localStorage.getItem('bayora_role') as Role;
    if (saved) this.currentRole = saved;
    return this.currentRole;
  }

  setToken(token: string) {
    this.authToken = token;
    localStorage.setItem('bayora_token', token);
  }

  getToken(): string {
    return this.authToken || localStorage.getItem('bayora_token') || '';
  }

  private getHeaders(): HeadersInit {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Role-based capability token for sandbox simulation
    const role = this.getRole();
    if (role === 'RED_TEAM') {
      headers['X-Bayora-Capability'] = 'red-demo-token';
    } else if (role === 'BLUE_TEAM') {
      headers['X-Bayora-Capability'] = 'blue-demo-token';
    } else if (role === 'ADMIN') {
      headers['X-Bayora-Capability'] = 'admin-demo-token';
    }

    return headers;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...(options.headers || {}),
      },
    });

    if (!response.ok) {
      let errorDetail = `HTTP ${response.status}: ${response.statusText}`;
      try {
        const json = await response.json();
        if (json.error && json.error.message) {
          errorDetail = json.error.message;
        } else if (json.detail) {
          errorDetail = typeof json.detail === 'string' ? json.detail : JSON.stringify(json.detail);
        }
      } catch (e) {}
      throw new Error(errorDetail);
    }

    return response.json();
  }

  // Auth
  async login(username: string, password: string) {
    const res = await this.request<{ access_token: string; role: Role }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    this.setToken(res.access_token);
    this.setRole(res.role);
    return res;
  }

  // Evaluations
  async listEvaluations(): Promise<Evaluation[]> {
    return this.request<Evaluation[]>('/evaluations');
  }

  async getEvaluation(id: string): Promise<Evaluation> {
    return this.request<Evaluation>(`/evaluations/${id}`);
  }

  async createEvaluation(data: Partial<Evaluation>): Promise<Evaluation> {
    return this.request<Evaluation>('/evaluations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async startEvaluation(id: string) {
    return this.request(`/evaluations/${id}/start`, { method: 'POST' });
  }

  async pauseEvaluation(id: string) {
    return this.request(`/evaluations/${id}/pause`, { method: 'POST' });
  }

  async resumeEvaluation(id: string) {
    return this.request(`/evaluations/${id}/resume`, { method: 'POST' });
  }

  async terminateEvaluation(id: string) {
    return this.request(`/evaluations/${id}/terminate`, { method: 'POST' });
  }

  async getDashboard(id: string) {
    return this.request<{ evaluation: Evaluation; passport: TestIntegrityPassport; evidence_integrity: EvidenceVerification }>(
      `/evaluations/${id}/dashboard`
    );
  }

  // Red Team
  async getAttackLibrary(id: string): Promise<AttackLibraryItem[]> {
    return this.request<AttackLibraryItem[]>(`/evaluations/${id}/attacks/library`);
  }

  async submitAttack(id: string, data: { prompt: string; category?: string; severity?: string }) {
    return this.request<{
      attack_id: string;
      payload_id: string;
      payload_hash: string;
      status: string;
      result_class: string;
      response: string;
      blocked_by?: string;
      latency_ms: number;
    }>(`/evaluations/${id}/attacks`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async listAttacks(id: string): Promise<Attack[]> {
    return this.request<Attack[]>(`/evaluations/${id}/attacks`);
  }

  async getConfidentialPayload(id: string, attackId: string): Promise<AttackPayload> {
    return this.request<AttackPayload>(`/evaluations/${id}/attacks/${attackId}/payload`);
  }

  // Blue Team
  async getBlueView(id: string): Promise<BlueViewData> {
    return this.request<BlueViewData>(`/evaluations/${id}/blue-view`);
  }

  async createDefense(id: string, data: { name: string; rule_type: string; pattern: string; action: string }): Promise<Defense> {
    return this.request<Defense>(`/evaluations/${id}/defenses`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async listDefenses(id: string): Promise<Defense[]> {
    return this.request<Defense[]>(`/evaluations/${id}/defenses`);
  }

  async testDefense(id: string, defenseId: string, testInput: string) {
    return this.request<{ matched: boolean; action_taken: string; sanitized_output: string; latency_ms: number }>(
      `/evaluations/${id}/defenses/${defenseId}/test`,
      {
        method: 'POST',
        body: JSON.stringify({ defense_id: defenseId, test_input: testInput }),
      }
    );
  }

  async listFindings(id: string): Promise<SecurityFinding[]> {
    return this.request<SecurityFinding[]>(`/evaluations/${id}/findings`);
  }

  // Target LLM
  async infer(id: string, prompt: string, applyDefenses = true) {
    return this.request<{ response: string; result_class: string; blocked_by?: string; latency_ms: number; provider_name: string }>(
      `/evaluations/${id}/inference`,
      {
        method: 'POST',
        body: JSON.stringify({ prompt, apply_defenses: applyDefenses }),
      }
    );
  }

  async resetModelSession(id: string) {
    return this.request<{ status: string; message: string }>(`/evaluations/${id}/reset`, { method: 'POST' });
  }

  async getLlmHealth() {
    return this.request<{ service: string; status: string; provider: string }>(`/evaluations/BAY-2026-00001/llm-health`);
  }

  // Evidence
  async getEvidenceChain(id: string): Promise<EvidenceEvent[]> {
    return this.request<EvidenceEvent[]>(`/evaluations/${id}/evidence`);
  }

  async verifyEvidence(id: string): Promise<EvidenceVerification> {
    return this.request<EvidenceVerification>(`/evaluations/${id}/evidence/verify`, { method: 'POST' });
  }

  async simulateTamper(id: string) {
    return this.request<{ status: string; message: string; tampered_event_seq: number }>(
      `/evaluations/${id}/evidence/simulate-tamper`,
      { method: 'POST' }
    );
  }

  // Contamination
  async runContaminationCheck(id: string, customProbe?: string): Promise<ContaminationCheck> {
    return this.request<ContaminationCheck>(`/evaluations/${id}/contamination/check`, {
      method: 'POST',
      body: JSON.stringify({ probe_query: customProbe }),
    });
  }

  async listContaminationChecks(id: string): Promise<ContaminationCheck[]> {
    return this.request<ContaminationCheck[]>(`/evaluations/${id}/contamination/checks`);
  }

  // Trust & Passport
  async getPassport(id: string): Promise<TestIntegrityPassport> {
    return this.request<TestIntegrityPassport>(`/evaluations/${id}/passport`);
  }

  async getResourceFairness(id: string): Promise<ResourceFairness> {
    return this.request<ResourceFairness>(`/evaluations/${id}/fairness`);
  }
}

export const api = new ApiClient();
