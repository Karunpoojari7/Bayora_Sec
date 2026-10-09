import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
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

import { Evaluation, TestIntegrityPassport, BlueViewData, Role } from './types';
import { api } from './services/api';

export function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentRole, setCurrentRole] = useState<Role>(api.getRole());
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [selectedEvalId, setSelectedEvalId] = useState<string>('');
  
  // Dashboard / Shared telemetry
  const [activeEval, setActiveEval] = useState<Evaluation | null>(null);
  const [passport, setPassport] = useState<TestIntegrityPassport | null>(null);
  const [blueView, setBlueView] = useState<BlueViewData | null>(null);
  const [chainValid, setChainValid] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadEvaluations();
  }, []);

  useEffect(() => {
    if (selectedEvalId) {
      loadEvaluationTelemetry(selectedEvalId);
    }
  }, [selectedEvalId]);

  const loadEvaluations = async () => {
    try {
      const evs = await api.listEvaluations();
      setEvaluations(evs);
      if (evs.length > 0 && !selectedEvalId) {
        setSelectedEvalId(evs[0].id);
      }
    } catch (e) {
      console.error('Failed loading evaluations', e);
    }
  };

  const loadEvaluationTelemetry = async (id: string) => {
    setIsLoading(true);
    try {
      const [ev, pass, bv, evStatus] = await Promise.all([
        api.getEvaluation(id),
        api.getPassport(id),
        api.getBlueView(id),
        api.verifyEvidence(id),
      ]);
      setActiveEval(ev);
      setPassport(pass);
      setBlueView(bv);
      setChainValid(evStatus.is_valid);
    } catch (e) {
      console.error('Failed loading telemetry', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = (role: Role) => {
    setCurrentRole(role);
    api.setRole(role);
  };

  return (
    <div className="min-h-screen bg-bayora-bg text-bayora-textBright flex flex-col selection:bg-bayora-accent selection:text-white">
      {/* Top Navigation */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
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
              currentRole={currentRole}
              onAttackExecuted={() => loadEvaluationTelemetry(selectedEvalId)}
            />
          )}

          {activeTab === 'blue_team' && (
            <BlueTeamPage
              evaluationId={selectedEvalId}
              currentRole={currentRole}
              onDefenseCreated={() => loadEvaluationTelemetry(selectedEvalId)}
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
            <SettingsPage
              currentRole={currentRole}
              onRoleChange={handleRoleChange}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
