import React from 'react';
import { Mission } from '../types/mathGame';
import { Trophy, CheckCircle2, ChevronRight, Award, Clock } from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface Props {
  missions: Mission[];
  completedProblems: Record<string, boolean>;
  currentMissionId: number;
  onSelectMission: (id: number) => void;
  starsEarned: number;
  totalPossibleStars: number;
  onOpenCertificate: () => void;
  totalTimeFormatted?: string;
}

export const MissionsProgressBar: React.FC<Props> = ({
  missions,
  completedProblems,
  currentMissionId,
  onSelectMission,
  starsEarned,
  totalPossibleStars,
  onOpenCertificate,
  totalTimeFormatted,
}) => {
  const percentage = Math.round((starsEarned / totalPossibleStars) * 100);
  const remainingStars = totalPossibleStars - starsEarned;
  const isComplete = starsEarned === totalPossibleStars;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-4">
      {/* Top row: Status, Percentage and Motivation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg shrink-0 shadow-xs transition-colors ${
              isComplete
                ? 'bg-amber-500 text-white animate-bounce'
                : 'bg-indigo-600 text-white'
            }`}
          >
            {isComplete ? <Trophy className="w-5 h-5 text-white" /> : '📊'}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 font-display">
                Progresso das 4 Missões
              </h3>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                {percentage}%
              </span>
              {totalTimeFormatted && starsEarned > 0 && (
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-md bg-purple-50 text-purple-800 border border-purple-200 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-purple-600" />
                  <span>Tempo: {totalTimeFormatted}</span>
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {isComplete ? (
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline" />
                  Todas as 4 missões foram finalizadas com sucesso!
                </span>
              ) : (
                <span>
                  <strong className="text-slate-800">{starsEarned} de {totalPossibleStars}</strong> desafios resolvidos ·{' '}
                  <span className="text-amber-700 font-semibold">
                    Faltam {remainingStars} {remainingStars === 1 ? 'desafio' : 'desafios'} para concluir!
                  </span>
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Action button if complete or certificate shortcut */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          {isComplete ? (
            <button
              type="button"
              onClick={onOpenCertificate}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold text-xs shadow-xs transition-all flex items-center gap-1.5"
            >
              <Award className="w-4 h-4" />
              <span>Pegar Certificado Oficial</span>
            </button>
          ) : (
            <span className="text-xs text-slate-400 hidden md:inline">
              Complete todos os desafios para liberar seu certificado
            </span>
          )}
        </div>
      </div>

      {/* Main Multi-Segment Progress Bar */}
      <div className="space-y-1.5">
        <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 flex gap-1 border border-slate-200/80">
          {missions.map((m) => {
            const totalInMission = m.problems.length;
            const doneInMission = m.problems.filter((p) => completedProblems[p.id]).length;
            const missionPercentage = (doneInMission / totalInMission) * 100;

            const colorClass =
              m.id === 1
                ? 'bg-emerald-500'
                : m.id === 2
                ? 'bg-rose-500'
                : m.id === 3
                ? 'bg-amber-500'
                : 'bg-indigo-600';

            return (
              <div
                key={m.id}
                className="flex-1 bg-slate-200/70 rounded-full overflow-hidden relative"
                title={`Missão ${m.id} (${m.operationName}): ${doneInMission}/${totalInMission}`}
              >
                <div
                  className={`h-full ${colorClass} transition-all duration-500 rounded-full`}
                  style={{ width: `${missionPercentage}%` }}
                />
              </div>
            );
          })}
        </div>

        {/* Legend for the 4 segments */}
        <div className="flex justify-between items-center text-[11px] text-slate-400 font-medium px-1">
          <span>Início</span>
          <span>25%</span>
          <span>50%</span>
          <span>75%</span>
          <span>100% Meta</span>
        </div>
      </div>

      {/* 4 Interactive Mission Milestones / Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 pt-1">
        {missions.map((m) => {
          const totalInMission = m.problems.length;
          const doneInMission = m.problems.filter((p) => completedProblems[p.id]).length;
          const isMissionCompleted = doneInMission === totalInMission;
          const isCurrent = m.id === currentMissionId;

          const dotColor =
            m.id === 1
              ? 'text-emerald-600 bg-emerald-100'
              : m.id === 2
              ? 'text-rose-600 bg-rose-100'
              : m.id === 3
              ? 'text-amber-600 bg-amber-100'
              : 'text-indigo-600 bg-indigo-100';

          return (
            <button
              key={m.id}
              type="button"
              onClick={() => {
                playClickSound();
                onSelectMission(m.id);
              }}
              className={`p-2.5 rounded-xl border text-left transition-all relative ${
                isCurrent
                  ? 'border-slate-800 bg-slate-50 ring-1 ring-slate-800'
                  : isMissionCompleted
                  ? 'border-emerald-200 bg-emerald-50/40 hover:bg-emerald-50'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <span className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-xs ${dotColor}`}>
                    {m.operation === '*' ? '×' : m.operation === '/' ? '÷' : m.operation}
                  </span>
                  <span className="text-xs font-bold text-slate-800">
                    Missão {m.id}
                  </span>
                </div>

                {isMissionCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <span className="text-[11px] font-mono font-semibold text-slate-500">
                    {doneInMission}/{totalInMission}
                  </span>
                )}
              </div>

              <div className="text-[11px] font-semibold text-slate-600 truncate">
                {m.operationName}
              </div>

              {/* Mini dots for each problem */}
              <div className="flex items-center gap-1 mt-2">
                {m.problems.map((p, idx) => {
                  const isProblemDone = completedProblems[p.id];
                  return (
                    <div
                      key={idx}
                      className={`h-1.5 flex-1 rounded-full transition-all ${
                        isProblemDone
                          ? isMissionCompleted
                            ? 'bg-emerald-500'
                            : 'bg-emerald-500'
                          : 'bg-slate-200'
                      }`}
                      title={`Desafio ${idx + 1}: ${isProblemDone ? 'Concluído' : 'Pendente'}`}
                    />
                  );
                })}
              </div>

              {/* Status footer */}
              <div className="mt-1.5 flex items-center justify-between text-[10px]">
                <span
                  className={
                    isMissionCompleted
                      ? 'text-emerald-700 font-bold'
                      : doneInMission > 0
                      ? 'text-amber-700 font-semibold'
                      : 'text-slate-400'
                  }
                >
                  {isMissionCompleted
                    ? 'Concluída ✓'
                    : doneInMission > 0
                    ? `Falta ${totalInMission - doneInMission}`
                    : 'Não iniciada'}
                </span>

                <ChevronRight className={`w-3 h-3 ${isCurrent ? 'text-slate-800' : 'text-slate-300'}`} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
