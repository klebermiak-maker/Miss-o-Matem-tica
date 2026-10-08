import React from 'react';
import { Mission } from '../types/mathGame';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface Props {
  missions: Mission[];
  currentMissionId: number;
  onSelectMission: (id: number) => void;
  completedProblems: Record<string, boolean>;
}

export const MissionSelector: React.FC<Props> = ({
  missions,
  currentMissionId,
  onSelectMission,
  completedProblems,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {missions.map((m) => {
        const isCurrent = m.id === currentMissionId;
        const totalInMission = m.problems.length;
        const solvedInMission = m.problems.filter((p) => completedProblems[p.id]).length;
        const isCompleted = solvedInMission === totalInMission;

        return (
          <button
            key={m.id}
            type="button"
            onClick={() => {
              playClickSound();
              onSelectMission(m.id);
            }}
            className={`p-3.5 rounded-2xl border-2 text-left transition-all relative overflow-hidden group flex flex-col justify-between ${
              isCurrent
                ? `${m.accentColor.bg} border-slate-900 shadow-md ring-2 ring-slate-900/10`
                : 'bg-white border-slate-200/90 hover:border-slate-400 hover:shadow-xs'
            }`}
          >
            <div>
              {/* Mission header */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span
                  className={`text-xs font-extrabold uppercase px-2 py-0.5 rounded-md ${
                    isCurrent ? m.accentColor.badge : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  Missão {m.id}
                </span>

                {isCompleted ? (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Concluída
                  </span>
                ) : (
                  <span className="text-[11px] font-mono font-semibold text-slate-500">
                    {solvedInMission}/{totalInMission} resolvidas
                  </span>
                )}
              </div>

              {/* Title & operation */}
              <h3 className="text-sm font-bold text-slate-900 font-display group-hover:text-amber-800 transition-colors line-clamp-1">
                {m.title.replace(`Missão ${m.id}: `, '')}
              </h3>
              <p className="text-xs font-semibold text-slate-600 mt-0.5 line-clamp-1">
                {m.subtitle}
              </p>
            </div>

            {/* Bottom progress bar & arrow */}
            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
              {/* Mini progress ticks */}
              <div className="flex items-center gap-1">
                {m.problems.map((p, idx) => {
                  const done = completedProblems[p.id];
                  return (
                    <div
                      key={idx}
                      className={`h-1.5 w-4 rounded-full transition-all ${
                        done
                          ? 'bg-emerald-500'
                          : isCurrent
                          ? 'bg-slate-300'
                          : 'bg-slate-200'
                      }`}
                    />
                  );
                })}
              </div>

              <span
                className={`text-xs font-bold flex items-center gap-0.5 transition-transform group-hover:translate-x-0.5 ${
                  isCurrent ? m.accentColor.text : 'text-slate-400'
                }`}
              >
                <span>{isCurrent ? 'Jogando' : 'Entrar'}</span>
                <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
};
