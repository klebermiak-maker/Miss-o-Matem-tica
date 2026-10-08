import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Mission, ProblemAttemptRecord } from '../types/mathGame';
import {
  Trophy,
  Timer,
  Clock,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  X,
  Award
} from 'lucide-react';
import { playClickSound, playVictoryFanfare } from '../utils/audio';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  mission: Mission;
  studentName: string;
  attemptHistory: Record<string, ProblemAttemptRecord>;
  onNextMission: () => void;
  onOpenCertificate: () => void;
  isLastMission: boolean;
}

function formatMinutesSeconds(totalSeconds: number): string {
  if (totalSeconds < 60) {
    return `${totalSeconds} segundos`;
  }
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;
  return remainingSeconds > 0
    ? `${minutes} min e ${remainingSeconds} seg`
    : `${minutes} minutos`;
}

function formatShortDuration(totalSeconds: number): string {
  if (totalSeconds < 60) {
    return `${totalSeconds}s`;
  }
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return seconds > 0 ? `${minutes}m ${seconds}s` : `${minutes}m`;
}

export const MissionCompletedModal: React.FC<Props> = ({
  isOpen,
  onClose,
  mission,
  studentName,
  attemptHistory,
  onNextMission,
  onOpenCertificate,
  isLastMission,
}) => {
  useEffect(() => {
    if (isOpen) {
      playVictoryFanfare();
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.5 },
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const missionAttempts = mission.problems.map((p) => attemptHistory[p.id]).filter(Boolean);
  const totalMissionSeconds = missionAttempts.reduce(
    (acc, att) => acc + (att.timeSpentSeconds || 0),
    0
  );
  const avgSeconds =
    missionAttempts.length > 0 ? Math.round(totalMissionSeconds / missionAttempts.length) : 0;
  const firstTrySuccessCount = missionAttempts.filter((a) => a.operationFirstTrySuccess).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[94vh]">
        {/* Top Header Banner */}
        <div className={`p-6 sm:p-7 ${mission.accentColor.bg} ${mission.accentColor.border} border-b text-center relative overflow-hidden`}>
          <div className="absolute top-2 right-2">
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-500 hover:text-slate-900 hover:bg-white/60 transition-colors"
              title="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="w-16 h-16 rounded-2xl bg-white shadow-md mx-auto flex items-center justify-center text-3xl ring-4 ring-amber-300/60 mb-3 animate-bounce">
            🏆
          </div>

          <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-900 block mb-0.5">
            Escola Municipal Educandário Nossa Senhora Aparecida
          </span>
          <span className="text-xs font-bold text-amber-800 block mb-1">
            Missão {mission.id} Concluída com Sucesso!
          </span>
          <h2 className="text-2xl font-black font-display text-slate-900 tracking-tight">
            {mission.title}
          </h2>
          <p className="text-xs font-semibold text-slate-700 mt-1">
            {mission.operationName} · Turma 3° ANO B Matutino · Professora Simone Rosa
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-slate-800">
          {/* Cronômetro da Missão - Destaque Central */}
          <div className="bg-linear-to-br from-amber-50 via-orange-50 to-amber-100/70 border-2 border-amber-300 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-amber-200/80 pb-2 mb-3">
              <div className="flex items-center gap-2">
                <Timer className="w-5 h-5 text-amber-700 animate-pulse" />
                <h3 className="text-sm font-black font-display text-amber-950 uppercase tracking-wide">
                  Cronômetro Oficial da Missão
                </h3>
              </div>
              <span className="text-[11px] font-bold text-amber-800 bg-amber-200/70 px-2 py-0.5 rounded-full">
                3 Desafios Concluídos
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-white/90 p-3 rounded-xl border border-amber-200 shadow-2xs">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Tempo Total da Missão
                </span>
                <div className="text-2xl font-black text-amber-900 font-mono mt-0.5">
                  {formatMinutesSeconds(totalMissionSeconds)}
                </div>
                <span className="text-[10px] text-slate-500">
                  Soma de todos os desafios
                </span>
              </div>

              <div className="bg-white/90 p-3 rounded-xl border border-amber-200 shadow-2xs">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Média por Desafio
                </span>
                <div className="text-2xl font-black text-slate-800 font-mono mt-0.5">
                  {formatShortDuration(avgSeconds)}
                </div>
                <span className="text-[10px] text-slate-500">
                  {firstTrySuccessCount}/3 acertados de 1ª
                </span>
              </div>
            </div>
          </div>

          {/* Breakdown por Desafio da Missão */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
              <span>Tempos Individuais por Desafio:</span>
              <span className="font-mono text-slate-500 font-normal">
                {mission.problems.length} situações-problema
              </span>
            </h4>

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs text-xs">
              {mission.problems.map((prob, idx) => {
                const attempt = attemptHistory[prob.id];
                const timeSec = attempt?.timeSpentSeconds || 0;
                const formattedTime = attempt?.timeSpentFormatted || `${timeSec}s`;

                return (
                  <div
                    key={prob.id}
                    className="p-3 flex items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 font-mono font-bold flex items-center justify-center text-xs shrink-0">
                        {idx + 1}
                      </span>
                      <div className="min-w-0">
                        <strong className="text-slate-900 font-semibold truncate block">
                          {prob.themeContext}
                        </strong>
                        <span className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                          {attempt?.operationFirstTrySuccess ? (
                            <span className="text-emerald-700 font-medium flex items-center gap-0.5">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600 inline" />
                              1ª tentativa
                            </span>
                          ) : (
                            <span className="text-amber-700 font-medium flex items-center gap-0.5">
                              <AlertTriangle className="w-3 h-3 text-amber-600 inline" />
                              {attempt?.operationAttempts || 1} tentativas
                            </span>
                          )}
                          {attempt?.usedMasterClue && (
                            <span className="text-amber-800 bg-amber-50 px-1 rounded border border-amber-200 text-[10px]">
                              💡 Dica
                            </span>
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/90 font-mono font-bold text-slate-800">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>{formattedTime}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Elogio Pedagógico da Professora Simone */}
          <div className="bg-emerald-50/70 border border-emerald-200/90 p-3.5 rounded-xl flex items-start gap-2.5 text-xs text-emerald-950">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">
                Parabéns, {studentName.trim() || 'Detetive'}!
              </p>
              <p className="text-emerald-900 mt-0.5 leading-relaxed">
                Você demonstrou excelente interpretação dos enunciados na {mission.operationName}. Resolver problemas no seu próprio ritmo com foco e atenção é a melhor estratégia da matemática!
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors order-2 sm:order-1"
            >
              Revisar Desafios
            </button>

            {isLastMission ? (
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  onClose();
                  onOpenCertificate();
                }}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-extrabold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 order-1 sm:order-2"
              >
                <Award className="w-4 h-4" />
                <span>Abrir Certificado Oficial! 🎓</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  onClose();
                  onNextMission();
                }}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 order-1 sm:order-2"
              >
                <span>Avançar para a Missão {mission.id + 1}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
