import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { MISSIONS_DATA } from './data/missionsData';
import { ProblemAttemptRecord, Mission } from './types/mathGame';
import { ProblemCard } from './components/ProblemCard';
import { ClassHeader } from './components/ClassHeader';
import { MissionSelector } from './components/MissionSelector';
import { MissionsProgressBar } from './components/MissionsProgressBar';
import { CertificateModal } from './components/CertificateModal';
import { TeacherCornerModal } from './components/TeacherCornerModal';
import { StudentReportModal } from './components/StudentReportModal';
import { ClassDatabaseModal } from './components/ClassDatabaseModal';
import { StudentWelcomeModal } from './components/StudentWelcomeModal';
import { MissionCompletedModal } from './components/MissionCompletedModal';
import { ClassDatabaseService } from './services/db';
import {
  Trophy,
  Award,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  BarChart3,
  Database
} from 'lucide-react';
import { playVictoryFanfare, playClickSound } from './utils/audio';

export default function App() {
  const [studentName, setStudentName] = useState<string>(() => {
    const saved = localStorage.getItem('missao_matematica_aluno') || '';
    const first = saved.trim().split(/\s+/)[0] || '';
    return first ? first.charAt(0).toUpperCase() + first.slice(1) : '';
  });

  const [currentMissionId, setCurrentMissionId] = useState<number>(1);
  const [currentProblemIndex, setCurrentProblemIndex] = useState<number>(0);
  const [completedProblems, setCompletedProblems] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('missao_matematica_concluidos');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Diagnostic history of hits & misses
  const [attemptHistory, setAttemptHistory] = useState<Record<string, ProblemAttemptRecord>>(() => {
    try {
      const saved = localStorage.getItem('missao_matematica_tentativas');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [isTeacherCornerOpen, setIsTeacherCornerOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isDatabaseModalOpen, setIsDatabaseModalOpen] = useState(false);
  const [isMissionCompletedModalOpen, setIsMissionCompletedModalOpen] = useState(false);
  const [completedMissionToCelebrate, setCompletedMissionToCelebrate] = useState<Mission | null>(null);
  // Solicit student name upfront if not already provided
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState<boolean>(() => {
    return !localStorage.getItem('missao_matematica_aluno')?.trim();
  });
  const [showMissionSuccessToast, setShowMissionSuccessToast] = useState(false);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('missao_matematica_aluno', studentName);
  }, [studentName]);

  useEffect(() => {
    localStorage.setItem('missao_matematica_concluidos', JSON.stringify(completedProblems));
  }, [completedProblems]);

  useEffect(() => {
    localStorage.setItem('missao_matematica_tentativas', JSON.stringify(attemptHistory));
  }, [attemptHistory]);

  const currentMission = MISSIONS_DATA.find((m) => m.id === currentMissionId) || MISSIONS_DATA[0];
  const totalPossibleStars = MISSIONS_DATA.reduce((acc, m) => acc + m.problems.length, 0);
  const starsEarned = Object.values(completedProblems).filter(Boolean).length;

  // Total time accumulated across all answered challenges
  const totalAccumulatedTimeSeconds = Object.values(attemptHistory).reduce(
    (sum, a) => sum + (a.timeSpentSeconds || 0),
    0
  );
  const formatTotalTime = (sec: number) => {
    if (sec < 60) return `${sec}s`;
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return s > 0 ? `${m}m ${s}s` : `${m}m`;
  };
  const totalTimeFormatted = formatTotalTime(totalAccumulatedTimeSeconds);

  const currentProblem = currentMission.problems[currentProblemIndex] || currentMission.problems[0];

  const handleSelectMission = (id: number) => {
    setCurrentMissionId(id);
    // Find first uncompleted problem in this mission or default to 0
    const mission = MISSIONS_DATA.find((m) => m.id === id);
    if (mission) {
      const firstUncompleted = mission.problems.findIndex((p) => !completedProblems[p.id]);
      setCurrentProblemIndex(firstUncompleted !== -1 ? firstUncompleted : 0);
    }
  };

  const handleSelectStudentToPlay = (name: string) => {
    const rawFirst = name.trim().split(/\s+/)[0] || '';
    const cleanFirstName = rawFirst ? rawFirst.charAt(0).toUpperCase() + rawFirst.slice(1) : '';
    setStudentName(cleanFirstName);
    const stdRecord = ClassDatabaseService.getStudent(cleanFirstName);
    if (stdRecord) {
      const completedMap: Record<string, boolean> = {};
      const attemptMap: Record<string, ProblemAttemptRecord> = {};
      Object.values(stdRecord.responses).forEach((resp) => {
        completedMap[resp.problemId] = resp.isCorrect;
        attemptMap[resp.problemId] = {
          problemId: resp.problemId,
          missionId: resp.missionId,
          operation: resp.operation,
          themeContext: resp.themeContext,
          operationAttempts: resp.operationAttempts,
          operationWrongPicks: resp.operationWrongPicks,
          operationFirstTrySuccess: resp.operationFirstTrySuccess,
          calculationAttempts: resp.calculationAttempts,
          calculationWrongAnswers: resp.calculationWrongAnswers,
          calculationFirstTrySuccess: resp.calculationFirstTrySuccess,
          usedMasterClue: resp.usedMasterClue,
          usedMagnifier: resp.usedMagnifier,
          usedManipulatives: resp.usedManipulatives,
          completed: resp.isCorrect,
          completedAt: resp.answeredAt,
        };
      });
      setCompletedProblems(completedMap);
      setAttemptHistory(attemptMap);
    } else {
      // Novo aluno sem respostas prévias
      setCompletedProblems({});
      setAttemptHistory({});
    }
  };

  const handleProblemCompleted = (
    problemId: string,
    isCorrect: boolean,
    attemptRecord?: ProblemAttemptRecord
  ) => {
    if (isCorrect) {
      if (attemptRecord) {
        setAttemptHistory((prev) => ({
          ...prev,
          [problemId]: attemptRecord,
        }));
        // Persist response to Class Database
        ClassDatabaseService.saveResponse(
          studentName || 'Estudante 3° B',
          problemId,
          attemptRecord
        );
      }

      setCompletedProblems((prev) => {
        const updated = { ...prev, [problemId]: true };
        // Check if all problems in this mission are completed
        const allInMissionDone = currentMission.problems.every((p) => p.id === problemId || updated[p.id]);
        if (allInMissionDone) {
          playVictoryFanfare();
          setShowMissionSuccessToast(true);
          setCompletedMissionToCelebrate(currentMission);
          setIsMissionCompletedModalOpen(true);
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.5 },
          });
        }
        return updated;
      });
    }
  };

  const handleResetHistory = () => {
    if (
      window.confirm(
        'Tem certeza de que deseja reiniciar o histórico de tentativas e desafios deste aluno?'
      )
    ) {
      setAttemptHistory({});
      setCompletedProblems({});
      localStorage.removeItem('missao_matematica_tentativas');
      localStorage.removeItem('missao_matematica_concluidos');
    }
  };

  const handleNextProblem = () => {
    if (currentProblemIndex < currentMission.problems.length - 1) {
      setCurrentProblemIndex((prev) => prev + 1);
    } else {
      // Reached the end of this mission!
      if (currentMissionId < 4) {
        // Offer move to next mission
        setCurrentMissionId((prev) => prev + 1);
        setCurrentProblemIndex(0);
      } else {
        // Completed all 4 missions!
        setIsCertificateOpen(true);
      }
    }
  };

  const isAllGameCompleted = starsEarned === totalPossibleStars;

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
      {/* 1. Header with class specifications and top bar contract */}
      <ClassHeader
        studentName={studentName}
        onStudentNameChange={setStudentName}
        starsEarned={starsEarned}
        totalPossibleStars={totalPossibleStars}
        onOpenCertificate={() => setIsCertificateOpen(true)}
        onOpenTeacherCorner={() => setIsTeacherCornerOpen(true)}
        onOpenReport={() => setIsReportModalOpen(true)}
        onOpenDatabase={() => setIsDatabaseModalOpen(true)}
        onOpenWelcome={() => setIsWelcomeModalOpen(true)}
        currentMissionId={currentMissionId}
        onSelectMission={handleSelectMission}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Welcome Classroom Banner */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-linear-to-bl from-amber-100/50 via-emerald-100/30 to-transparent rounded-full -mr-20 -mt-20 pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-3xl space-y-2">
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
                <span className="text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md font-bold">
                  Quinta-feira · 3ª Aula
                </span>
                <span>Professora Simone Rosa</span>
                <span aria-hidden="true">·</span>
                <span>Turma 3° ANO B</span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 font-display tracking-tight leading-tight">
                Detetives das Quatro Operações Matemáticas
              </h1>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
                Ajude nossa turma a interpretar cada situação-problema, descobrir as palavras-chave do texto, identificar se usamos <strong>Adição (+)</strong>, <strong>Subtração (-)</strong>, <strong>Multiplicação (×)</strong> ou <strong>Divisão (÷)</strong> e resolver os desafios com apoio de material manipulativo!
              </p>
            </div>

            {/* Quick stats box with direct report shortcut */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
              <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 flex flex-col gap-2 w-full sm:w-auto shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-xl shadow-xs">
                    🏆
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-500">Progresso Geral</div>
                    <div className="text-xl font-bold font-mono text-slate-900">
                      {starsEarned} <span className="text-xs font-normal text-slate-400">/ {totalPossibleStars} estrelas</span>
                    </div>
                    <div className="text-[11px] text-emerald-700 font-bold mt-0.5">
                      {isAllGameCompleted ? 'Todas as missões concluídas!' : `${totalPossibleStars - starsEarned} desafios restantes`}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-1.5 mt-1">
                  <button
                    type="button"
                    onClick={() => setIsReportModalOpen(true)}
                    className="text-[11px] font-bold text-emerald-900 bg-emerald-100/90 hover:bg-emerald-200 border border-emerald-300 py-1 px-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                    title="Ver histórico detalhado de acertos e erros do aluno"
                  >
                    <BarChart3 className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Desempenho</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsDatabaseModalOpen(true)}
                    className="text-[11px] font-bold text-indigo-900 bg-indigo-100/90 hover:bg-indigo-200 border border-indigo-300 py-1 px-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                    title="Acessar banco de dados com respostas da turma"
                  >
                    <Database className="w-3.5 h-3.5 text-indigo-700" />
                    <span>Banco de Dados</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. The 4 Missions Selector Tabs */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 font-display flex items-center gap-2">
              <span>As 4 Missões da Aula</span>
              <span className="text-xs font-normal text-slate-500">
                (Clique para navegar entre as operações)
              </span>
            </h2>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsReportModalOpen(true)}
                className="text-xs font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
                title="Acompanhar desempenho por operação da Profa. Simone"
              >
                <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Desempenho por Operação</span>
              </button>

              {isAllGameCompleted && (
                <button
                  type="button"
                  onClick={() => setIsCertificateOpen(true)}
                  className="text-xs font-bold text-amber-700 hover:text-amber-900 bg-amber-100/80 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Ver Certificado</span>
                </button>
              )}
            </div>
          </div>

          <MissionSelector
            missions={MISSIONS_DATA}
            currentMissionId={currentMissionId}
            onSelectMission={handleSelectMission}
            completedProblems={completedProblems}
          />

          {/* Visual Progress Bar Component below Mission Selector */}
          <div className="mt-4">
            <MissionsProgressBar
              missions={MISSIONS_DATA}
              completedProblems={completedProblems}
              currentMissionId={currentMissionId}
              onSelectMission={handleSelectMission}
              starsEarned={starsEarned}
              totalPossibleStars={totalPossibleStars}
              onOpenCertificate={() => setIsCertificateOpen(true)}
              totalTimeFormatted={totalTimeFormatted}
            />
          </div>
        </div>

        {/* 3. Current Mission Showcase and Active Problem */}
        <section className="space-y-4">
          {/* Mission header card */}
          <div className={`${currentMission.accentColor.bg} border ${currentMission.accentColor.border} rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4`}>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-md ${currentMission.accentColor.badge}`}>
                  Missão Ativa #{currentMission.id}
                </span>
                <span className="text-xs font-bold text-slate-600">
                  Operação Alvo: {currentMission.operationName} ({currentMission.operation === '*' ? '×' : currentMission.operation === '/' ? '÷' : currentMission.operation})
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display">
                {currentMission.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 mt-1">
                {currentMission.storyIntro}
              </p>
              <div className="mt-2 text-xs font-medium text-slate-800 bg-white/70 p-2 rounded-lg border border-slate-200/60 inline-block">
                💡 <strong>Conceito Chave:</strong> {currentMission.operationConcept}
              </div>
            </div>

            {/* Problem step pills within current mission */}
            <div className="flex flex-col items-end gap-2 shrink-0">
              <span className="text-xs font-semibold text-slate-500">
                Escolha o desafio da missão:
              </span>
              <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
                {currentMission.problems.map((prob, idx) => {
                  const isDone = completedProblems[prob.id];
                  const isSelected = idx === currentProblemIndex;
                  return (
                    <button
                      key={prob.id}
                      type="button"
                      onClick={() => {
                        playClickSound();
                        setCurrentProblemIndex(idx);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                        isSelected
                          ? 'bg-slate-900 text-white shadow-xs'
                          : isDone
                          ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span>Desafio {idx + 1}</span>
                      {isDone && <span className="text-emerald-500">✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ACTIVE PROBLEM CARD */}
          <ProblemCard
            key={currentProblem.id}
            problem={currentProblem}
            problemIndex={currentProblemIndex}
            totalProblems={currentMission.problems.length}
            missionId={currentMissionId}
            missionOperation={currentMission.operation}
            onProblemCompleted={handleProblemCompleted}
            onNextProblem={handleNextProblem}
            isLastProblem={currentProblemIndex === currentMission.problems.length - 1}
          />

          {/* Navigation footer between problems */}
          <div className="flex items-center justify-between text-xs text-slate-600 px-1 pt-2">
            <button
              type="button"
              disabled={currentProblemIndex === 0}
              onClick={() => {
                playClickSound();
                setCurrentProblemIndex((p) => Math.max(0, p - 1));
              }}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 font-semibold"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Desafio Anterior</span>
            </button>

            <span className="font-medium text-slate-500">
              Turma 3° B · Professora Simone Rosa · Matemática
            </span>

            <button
              type="button"
              disabled={currentProblemIndex === currentMission.problems.length - 1}
              onClick={() => {
                playClickSound();
                setCurrentProblemIndex((p) => Math.min(currentMission.problems.length - 1, p + 1));
              }}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 font-semibold"
            >
              <span>Próximo Desafio</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </section>

        {/* Mission Complete Toast notification */}
        {showMissionSuccessToast && (
          <div className="fixed bottom-6 right-6 z-40 bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-slate-700 max-w-sm flex items-start gap-3 animate-bounce">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-xl shrink-0">
              🎉
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold font-display text-amber-300">
                Parabéns! Missão {currentMission.id} Concluída!
              </h4>
              <p className="text-xs text-slate-300">
                Você decifrou todas as situações-problema de {currentMission.operationName}!
              </p>
              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowMissionSuccessToast(false);
                    setCompletedMissionToCelebrate(currentMission);
                    setIsMissionCompletedModalOpen(true);
                  }}
                  className="px-3 py-1 rounded-lg bg-amber-500 text-slate-900 text-xs font-bold hover:bg-amber-400"
                >
                  Ver Resumo de Tempo ⏱️
                </button>
                <button
                  type="button"
                  onClick={() => setShowMissionSuccessToast(false)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Quiet educational footer */}
      <footer className="mt-12 border-t border-slate-200 bg-white py-6 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-slate-800">Turma: 3° ANO B (Matutino)</span>
            <span aria-hidden="true">·</span>
            <span>Professora: Simone Rosa</span>
            <span aria-hidden="true">·</span>
            <span>Aula: Quinta-feira, 3ª aula</span>
            <span aria-hidden="true">·</span>
            <span>Habilidade BNCC: EF03CO02</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsDatabaseModalOpen(true)}
              className="text-indigo-700 hover:text-indigo-900 font-bold flex items-center gap-1"
            >
              <Database className="w-3.5 h-3.5 text-indigo-600" />
              Banco de Respostas
            </button>
            <button
              type="button"
              onClick={() => setIsReportModalOpen(true)}
              className="text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1"
            >
              <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
              Desempenho por Operação
            </button>
            <button
              type="button"
              onClick={() => setIsTeacherCornerOpen(true)}
              className="text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-1"
            >
              <BookOpen className="w-3.5 h-3.5" />
              Guia Pedagógico
            </button>
            <button
              type="button"
              onClick={() => setIsCertificateOpen(true)}
              className="text-amber-700 hover:text-amber-900 font-bold flex items-center gap-1"
            >
              <Trophy className="w-3.5 h-3.5" />
              Certificado da Turma
            </button>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      <CertificateModal
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
        studentName={studentName}
        onStudentNameChange={setStudentName}
        starsEarned={starsEarned}
        totalPossibleStars={totalPossibleStars}
        totalTimeFormatted={totalTimeFormatted}
      />

      <MissionCompletedModal
        isOpen={isMissionCompletedModalOpen}
        onClose={() => setIsMissionCompletedModalOpen(false)}
        mission={completedMissionToCelebrate || currentMission}
        studentName={studentName}
        attemptHistory={attemptHistory}
        onNextMission={() => {
          setIsMissionCompletedModalOpen(false);
          if (currentMissionId < 4) {
            handleSelectMission(currentMissionId + 1);
          } else {
            setIsCertificateOpen(true);
          }
        }}
        onOpenCertificate={() => {
          setIsMissionCompletedModalOpen(false);
          setIsCertificateOpen(true);
        }}
        isLastMission={currentMissionId === 4}
      />

      <TeacherCornerModal
        isOpen={isTeacherCornerOpen}
        onClose={() => setIsTeacherCornerOpen(false)}
        onOpenReport={() => setIsReportModalOpen(true)}
      />

      <StudentReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        studentName={studentName}
        attemptHistory={attemptHistory}
        completedProblems={completedProblems}
        onResetHistory={handleResetHistory}
      />

      <ClassDatabaseModal
        isOpen={isDatabaseModalOpen}
        onClose={() => setIsDatabaseModalOpen(false)}
        onSelectStudentToPlay={(name) => {
          handleSelectStudentToPlay(name);
          setIsDatabaseModalOpen(false);
        }}
        onOpenNewStudentModal={() => {
          setIsDatabaseModalOpen(false);
          setIsWelcomeModalOpen(true);
        }}
      />

      <StudentWelcomeModal
        isOpen={isWelcomeModalOpen}
        onClose={() => setIsWelcomeModalOpen(false)}
        currentStudentName={studentName}
        onConfirmName={(name) => {
          setStudentName(name);
          handleSelectStudentToPlay(name);
        }}
      />
    </div>
  );
}

