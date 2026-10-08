import React from 'react';
import { Star, Award, BookOpen, User, BarChart3, Database, ShieldCheck, Cloud, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { CloudSyncStatus } from '../services/cloudDb';

interface Props {
  studentName: string;
  studentCode?: string;
  studentClass?: string;
  syncStatus?: CloudSyncStatus;
  onStudentNameChange: (name: string) => void;
  starsEarned: number;
  totalPossibleStars: number;
  onOpenCertificate: () => void;
  onOpenTeacherCorner: () => void;
  onOpenReport: () => void;
  onOpenDatabase: () => void;
  onOpenWelcome: () => void;
  onOpenTeacherDashboard: () => void;
  currentMissionId: number;
  onSelectMission: (id: number) => void;
}

export const ClassHeader: React.FC<Props> = ({
  studentName,
  studentCode,
  studentClass = '3° ANO B',
  syncStatus = 'idle',
  onStudentNameChange,
  starsEarned,
  totalPossibleStars,
  onOpenCertificate,
  onOpenTeacherCorner,
  onOpenReport,
  onOpenDatabase,
  onOpenWelcome,
  onOpenTeacherDashboard,
  currentMissionId,
  onSelectMission,
}) => {
  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-xs">
      {/* 3-Zone Top Navigation Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand title, single element */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onSelectMission(1);
          }}
          className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 font-display flex items-center gap-2 whitespace-nowrap shrink-0"
        >
          <span className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-extrabold text-base shadow-xs">
            3B
          </span>
          <span>Missão Matemática</span>
        </a>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-600">
          <button
            type="button"
            onClick={() => onSelectMission(1)}
            className={`transition-colors whitespace-nowrap ${
              currentMissionId === 1 ? 'text-emerald-700 underline underline-offset-8 decoration-2' : 'hover:text-slate-900'
            }`}
          >
            1. Adição ➕
          </button>
          <button
            type="button"
            onClick={() => onSelectMission(2)}
            className={`transition-colors whitespace-nowrap ${
              currentMissionId === 2 ? 'text-rose-700 underline underline-offset-8 decoration-2' : 'hover:text-slate-900'
            }`}
          >
            2. Subtração ➖
          </button>
          <button
            type="button"
            onClick={() => onSelectMission(3)}
            className={`transition-colors whitespace-nowrap ${
              currentMissionId === 3 ? 'text-amber-700 underline underline-offset-8 decoration-2' : 'hover:text-slate-900'
            }`}
          >
            3. Multiplicação ✖️
          </button>
          <button
            type="button"
            onClick={() => onSelectMission(4)}
            className={`transition-colors whitespace-nowrap ${
              currentMissionId === 4 ? 'text-indigo-700 underline underline-offset-8 decoration-2' : 'hover:text-slate-900'
            }`}
          >
            4. Divisão ➗
          </button>
        </nav>

        {/* Zone 3: Primary actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Dedicated Teacher Area with Google Auth */}
          <button
            type="button"
            onClick={onOpenTeacherDashboard}
            className="px-2.5 sm:px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shadow-xs"
            title="Área do Professor: Login Google restrito, gráficos e relatórios na nuvem"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Área do Professor</span>
            <span className="sm:hidden">Professor</span>
          </button>

          <button
            type="button"
            onClick={onOpenDatabase}
            className="px-2.5 sm:px-3 py-1.5 text-xs font-bold text-indigo-950 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shadow-2xs"
            title="Abrir Banco de Dados da turma"
          >
            <Database className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden md:inline">Banco</span>
          </button>

          <button
            type="button"
            onClick={onOpenReport}
            className="hidden md:flex px-2.5 sm:px-3 py-1.5 text-xs font-bold text-emerald-950 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors items-center gap-1.5 whitespace-nowrap shadow-2xs"
            title="Acompanhar desempenho e diagnóstico da Profa. Simone"
          >
            <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Desempenho</span>
          </button>

          <button
            type="button"
            onClick={onOpenTeacherCorner}
            className="hidden lg:flex px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors items-center gap-1.5 whitespace-nowrap"
            title="Guia da Professora Simone"
          >
            <BookOpen className="w-3.5 h-3.5 text-slate-600" />
            <span>Guia Profa.</span>
          </button>

          <button
            type="button"
            onClick={onOpenCertificate}
            className="px-3 py-1.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs whitespace-nowrap"
          >
            <Award className="w-3.5 h-3.5" />
            <span>Certificado</span>
          </button>
        </div>
      </div>

      {/* Classroom Official Context Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white px-4 sm:px-6 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Class metadata with clean typographic separators */}
          <div className="flex flex-wrap items-center gap-2 text-slate-300 font-medium">
            <span className="text-white font-bold bg-slate-800 border border-slate-700 px-2 py-0.5 rounded">
              Escola Municipal Educandário Nossa Senhora Aparecida
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-amber-300 font-bold">Turma: {studentClass}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>Professora: Simone Rosa</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-emerald-400 font-mono">EF03CO02</span>
          </div>

          {/* Student Profile & Cloud Sync & Stars Tally */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Cloud Sync State Pill */}
            <div
              className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold border transition-colors ${
                syncStatus === 'saving'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : syncStatus === 'saved'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : syncStatus === 'error'
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}
              title="Status da conexão com Cloud Firestore"
            >
              {syncStatus === 'saving' ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin text-amber-300" />
                  <span className="hidden sm:inline">Salvando...</span>
                </>
              ) : syncStatus === 'saved' ? (
                <>
                  <Cloud className="w-3 h-3 text-emerald-400" />
                  <span className="hidden sm:inline">Nuvem OK</span>
                </>
              ) : syncStatus === 'error' ? (
                <>
                  <AlertCircle className="w-3 h-3 text-rose-400" />
                  <span className="hidden sm:inline">Offline</span>
                </>
              ) : (
                <>
                  <Cloud className="w-3 h-3 text-slate-400" />
                  <span className="hidden sm:inline">Nuvem Conectada</span>
                </>
              )}
            </div>

            {/* Student profile tag */}
            <div className="flex items-center gap-1.5 bg-slate-800/90 border border-slate-700 rounded-lg px-2.5 py-1">
              <User className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <div className="flex items-center gap-1 font-bold">
                <span className="text-white text-xs uppercase tracking-wide">
                  {studentName.trim() || 'ALUNO'}
                </span>
                {studentCode && (
                  <span className="text-[10px] font-mono text-amber-300 bg-slate-900 px-1 py-0.2 rounded border border-slate-700">
                    {studentCode}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={onOpenWelcome}
                className="text-[10px] text-amber-300 hover:text-amber-200 font-bold bg-slate-700/80 px-1.5 py-0.5 rounded transition-colors ml-1"
                title="Trocar dados do aluno (nome, turma, código)"
              >
                Trocar
              </button>
            </div>

            {/* Visual mini progress pill in header */}
            <div className="hidden md:flex items-center gap-2 bg-slate-800/90 border border-slate-700/80 px-2.5 py-1 rounded-lg">
              <span className="text-[11px] text-slate-300">
                {starsEarned === totalPossibleStars ? (
                  <span className="text-emerald-400 font-bold">100% Concluído! 🎉</span>
                ) : (
                  <span>
                    Progresso: <strong className="text-white">{Math.round((starsEarned / totalPossibleStars) * 100)}%</strong>
                  </span>
                )}
              </span>
              <div className="w-14 h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-amber-400 to-emerald-400 rounded-full transition-all duration-300"
                  style={{ width: `${(starsEarned / totalPossibleStars) * 100}%` }}
                />
              </div>
            </div>

            <div
              className="flex items-center gap-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-1 rounded-lg font-bold font-mono"
              title={`${starsEarned} de ${totalPossibleStars} desafios completados`}
            >
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{starsEarned}/{totalPossibleStars}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Global Visual Progress Line at the bottom edge of sticky header */}
      <div
        className="h-1.5 w-full bg-slate-200 overflow-hidden relative"
        title={`Progresso geral: ${starsEarned} de ${totalPossibleStars} (${Math.round((starsEarned / totalPossibleStars) * 100)}%)`}
      >
        <div
          className="h-full bg-linear-to-r from-emerald-500 via-amber-500 to-indigo-600 transition-all duration-500"
          style={{ width: `${(starsEarned / totalPossibleStars) * 100}%` }}
        />
      </div>
    </header>
  );
};
