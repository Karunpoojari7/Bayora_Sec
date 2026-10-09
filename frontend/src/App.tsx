import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { EvaluationsPage } from './pages/EvaluationsPage';
import { RedTeamPage } from './pages/RedTeamPage';
import { BlueTeamPage } from './pages/BlueTeamPage';
import { TargetLlmPage } from './pages/TargetLlmPage';
import { EvidencePage } from './pages/EvidencePage';
import { ContaminationPage } from './pages/ContaminationPage';
import { ResourceGovernorPage } from './pages/ResourceGovernorPage';
import { PassportPage } from './pages/PassportPage';
import { SettingsPage } from './pages/SettingsPage';

import { Evaluation, TestIntegrityPassport, BlueViewData, UserProfile } from './types';
import { api } from './services/api';

export function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(api.getUser());
  const [activeTab, setActiveTab] = useState('dashboard');
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [selectedEvalId, setSelectedEvalId] = useState<string>('');
  
  // Dashboard & Shared Telemetry State
  const [activeEval, setActiveEval] = useState<Evaluation | null>(null);
  const [passport, setPassport] = useState<TestIntegrityPassport | null>(null);
  const [blueView, setBlueView] = useState<BlueViewData | null>(null);
  const [chainValid, setChainValid] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Listen for session expiry custom events
    const handleExpiry = () => {
      setCurrentUser(null);
    };
    window.addEventListener('bayora_session_expired', handleExpiry);
    return () => window.removeEventListener('bayora_session_expired', handleExpiry);
  }, []);

  useEffect(() => {
    if (currentUser) {
      loadEvaluations();
    }
  }, [currentUser]);

  useEffect(() => {
    if (selectedEvalId && currentUser) {
      loadEvaluationTelemetry(selectedEvalId);
    }
  }, [selectedEvalId, currentUser]);

  const loadEvaluations = async () => {
    try {
      const evs = await api.listEvaluations();
      setEvaluations(evs);
      if (evs.length > 0) {
        if (!selectedEvalId || !evs.some(e => e.id === selectedEvalId)) {
          setSelectedEvalId(evs[0].id);
        }
      }
    } catch (e) {
      console.error('Failed loading evaluations', e);
    }
  };

  const loadEvaluationTelemetry = async (id: string) => {
    setIsLoading(true);
    try {
      const [ev, pass, bv, evStatus] = await Promise.all([
        api.getEvaluation(id).catch(() => null),
        api.getPassport(id).catch(() => null),
        api.getBlueView(id).catch(() => null),
        api.verifyEvidence(id).catch(() => ({ is_valid: true })),
      ]);
      setActiveEval(ev);
      setPassport(pass);
      setBlueView(bv);
      setChainValid(evStatus ? evStatus.is_valid : true);
    } catch (e) {
      console.error('Failed loading telemetry', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    loadEvaluations();
  };

  const handleLogout = async () => {
    await api.logout();
    setCurrentUser(null);
  };

  // If user is not authenticated, render Login Page
  if (!currentUser) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        currentUser={currentUser}
        onLogout={handleLogout}
        evaluations={evaluations}
        selectedEvalId={selectedEvalId}
        onSelectEval={setSelectedEvalId}
        chainValid={chainValid}
      />

      <div className="flex flex-1">
        {/* Left Sidebar Navigation */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          threatCount={blueView?.threats_detected ?? 0}
          userRole={currentUser.role}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardPage
              evaluation={activeEval}
              passport={passport}
              blueView={blueView}
              onNavigate={setActiveTab}
              onStartEval={() => activeEval && api.startEvaluation(activeEval.id).then(() => loadEvaluationTelemetry(activeEval.id))}
              isLoading={isLoading}
              onRefresh={() => {
                loadEvaluations();
                if (selectedEvalId) loadEvaluationTelemetry(selectedEvalId);
              }}
            />
          )}

          {activeTab === 'evaluations' && (
            <EvaluationsPage
              evaluations={evaluations}
              selectedEvalId={selectedEvalId}
              onSelectEval={setSelectedEvalId}
              onRefresh={() => {
                loadEvaluations();
                if (selectedEvalId) loadEvaluationTelemetry(selectedEvalId);
              }}
            />
          )}

          {activeTab === 'red_team' && (
            <RedTeamPage
              evaluationId={selectedEvalId}
              currentRole={currentUser.role}
              onAttackExecuted={() => {
                if (selectedEvalId) loadEvaluationTelemetry(selectedEvalId);
              }}
            />
          )}

          {activeTab === 'blue_team' && (
            <BlueTeamPage
              evaluationId={selectedEvalId}
              currentRole={currentUser.role}
              onDefenseCreated={() => {
                if (selectedEvalId) loadEvaluationTelemetry(selectedEvalId);
              }}
            />
          )}

          {activeTab === 'target_llm' && (
            <TargetLlmPage evaluationId={selectedEvalId} />
          )}

          {activeTab === 'evidence' && (
            <EvidencePage
              evaluationId={selectedEvalId}
              onChainStatusChange={setChainValid}
            />
          )}

          {activeTab === 'contamination' && (
            <ContaminationPage evaluationId={selectedEvalId} />
          )}

          {activeTab === 'fairness' && (
            <ResourceGovernorPage evaluationId={selectedEvalId} />
          )}

          {activeTab === 'passport' && (
            <PassportPage evaluationId={selectedEvalId} />
          )}

          {activeTab === 'settings' && (
            <SettingsPage currentUser={currentUser} />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
