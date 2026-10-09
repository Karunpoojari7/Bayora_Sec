import {
  Evaluation, Attack, AttackPayload, AttackLibraryItem,
  Defense, SecurityFinding, BlueViewData, EvidenceEvent,
  EvidenceVerification, ContaminationCheck, ResourceFairness,
  TestIntegrityPassport, Role, UserProfile
} from '../types';

const API_BASE = '/api/v1';

class ApiClient {
  private accessToken: string = '';
  private refreshTokenVal: string = '';
  private userProfile: UserProfile | null = null;

  constructor() {
    this.accessToken = localStorage.getItem('bayora_access_token') || '';
    this.refreshTokenVal = localStorage.getItem('bayora_refresh_token') || '';
    const storedUser = localStorage.getItem('bayora_user_profile');
    if (storedUser) {
      try {
        this.userProfile = JSON.parse(storedUser);
      } catch (e) {
        this.userProfile = null;
      }
    }
  }

  isAuthenticated(): boolean {
    return !!this.accessToken && !!this.userProfile;
  }

  getUser(): UserProfile | null {
    return this.userProfile;
  }

  getRole(): Role {
    return this.userProfile?.role || 'VIEWER';
  }

  setSession(accessToken: string, refreshToken: string, user: UserProfile) {
    this.accessToken = accessToken;
    this.refreshTokenVal = refreshToken;
    this.userProfile = user;
    localStorage.setItem('bayora_access_token', accessToken);
    localStorage.setItem('bayora_refresh_token', refreshToken);
    localStorage.setItem('bayora_user_profile', JSON.stringify(user));
  }

  clearSession() {
    this.accessToken = '';
    this.refreshTokenVal = '';
    this.userProfile = null;
    localStorage.removeItem('bayora_access_token');
    localStorage.removeItem('bayora_refresh_token');
    localStorage.removeItem('bayora_user_profile');
    localStorage.removeItem('bayora_role');
  }

  private getHeaders(): HeadersInit {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    return headers;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`;
    
    let response = await fetch(url, {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...(options.headers || {}),
      },
    });

    // Handle 401: attempt refresh token if available
    if (response.status === 401 && this.refreshTokenVal && !endpoint.includes('/auth/')) {
      try {
        const refreshed = await this.refreshToken();
        if (refreshed) {
          // Retry original request with new access token
          response = await fetch(url, {
            ...options,
            headers: {
              ...this.getHeaders(),
              ...(options.headers || {}),
            },
          });
        }
      } catch (err) {
        this.clearSession();
        window.dispatchEvent(new CustomEvent('bayora_session_expired'));
      }
    }

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

  // --- Auth Endpoints ---
  async login(username: string, password: string): Promise<UserProfile> {
    const res = await this.request<{
      access_token: string;
      refresh_token: string;
      role: Role;
      user_id: string;
      username: string;
      capabilities: string[];
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });

    const userProfile: UserProfile = {
      user_id: res.user_id,
      username: res.username,
      role: res.role,
      capabilities: res.capabilities || []
    };

    this.setSession(res.access_token, res.refresh_token, userProfile);
    return userProfile;
  }

  async refreshToken(): Promise<boolean> {
    if (!this.refreshTokenVal) return false;
    try {
      const res = await fetch(`${API_BASE}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: this.refreshTokenVal }),
      });
      if (!res.ok) {
        this.clearSession();
        return false;
      }
      const data = await res.json();
      this.accessToken = data.access_token;
      this.refreshTokenVal = data.refresh_token;
      localStorage.setItem('bayora_access_token', data.access_token);
      localStorage.setItem('bayora_refresh_token', data.refresh_token);
      return true;
    } catch (e) {
      this.clearSession();
      return false;
    }
  }

  async logout(): Promise<void> {
    try {
      if (this.refreshTokenVal) {
        await fetch(`${API_BASE}/auth/logout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh_token: this.refreshTokenVal }),
        });
      }
    } catch (e) {
      // Ignore network errors during logout
    } finally {
      this.clearSession();
    }
  }

  async getMe(): Promise<UserProfile> {
    const res = await this.request<UserProfile>('/auth/me');
    if (this.userProfile) {
      this.userProfile.capabilities = res.capabilities;
      this.userProfile.role = res.role;
      localStorage.setItem('bayora_user_profile', JSON.stringify(this.userProfile));
    }
    return res;
  }

  // --- Evaluations ---
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

  // --- Red Team ---
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

  // --- Blue Team ---
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

  // --- Target LLM ---
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

  // --- Evidence ---
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

  // --- Contamination ---
  async runContaminationCheck(id: string, customProbe?: string): Promise<ContaminationCheck> {
    return this.request<ContaminationCheck>(`/evaluations/${id}/contamination/check`, {
      method: 'POST',
      body: JSON.stringify({ probe_query: customProbe }),
    });
  }

  async listContaminationChecks(id: string): Promise<ContaminationCheck[]> {
    return this.request<ContaminationCheck[]>(`/evaluations/${id}/contamination/checks`);
  }

  // --- Trust & Passport ---
  async getPassport(id: string): Promise<TestIntegrityPassport> {
    return this.request<TestIntegrityPassport>(`/evaluations/${id}/passport`);
  }

  async getResourceFairness(id: string): Promise<ResourceFairness> {
    return this.request<ResourceFairness>(`/evaluations/${id}/fairness`);
  }
}

export const api = new ApiClient();
