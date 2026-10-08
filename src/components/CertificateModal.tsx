import React from 'react';
import confetti from 'canvas-confetti';
import { X, Printer, Award, CheckCircle, Clock } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  onStudentNameChange: (name: string) => void;
  starsEarned: number;
  totalPossibleStars: number;
  totalTimeFormatted?: string;
}

export const CertificateModal: React.FC<Props> = ({
  isOpen,
  onClose,
  studentName,
  onStudentNameChange,
  starsEarned,
  totalPossibleStars,
  totalTimeFormatted,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const fireConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Bar (hidden in print) */}
        <div className="no-print p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-slate-800 text-sm font-display">
              Certificado de Conquista Oficial
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fireConfetti}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-100 text-amber-800 hover:bg-amber-200 transition-colors flex items-center gap-1"
            >
              🎉 Chuva de Confetes
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="text-xs font-bold px-3 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              Imprimir Certificado
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Name input row (hidden on print) */}
        <div className="no-print px-6 py-3 bg-amber-50/50 border-b border-amber-100 flex items-center justify-between text-xs">
          <label className="font-semibold text-amber-900 flex items-center gap-2">
            <span>Primeiro nome no certificado:</span>
            <input
              type="text"
              value={studentName}
              onChange={(e) => {
                const first = e.target.value.trim().split(/\s+/)[0] || '';
                onStudentNameChange(first);
              }}
              placeholder="Digite o 1° nome (ex: Lucas)"
              className="px-2.5 py-1 bg-white border border-amber-300 rounded-md text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500 w-44 sm:w-56"
            />
          </label>
          <span className="text-amber-800 font-medium">
            Pontuação: <strong>{starsEarned} de {totalPossibleStars} desafios</strong>
          </span>
        </div>

        {/* CERTIFICATE BODY (Formatted for printing and display) */}
        <div className="p-6 sm:p-10 overflow-y-auto">
          <div className="relative border-8 border-double border-amber-500/80 rounded-2xl p-6 sm:p-8 bg-linear-to-b from-amber-50/30 via-white to-amber-50/20 text-center shadow-inner">
            {/* Top Ornamental Ribbon */}
            <div className="flex justify-center mb-3">
              <div className="w-16 h-16 rounded-full bg-linear-to-tr from-amber-500 to-yellow-400 text-white flex items-center justify-center shadow-lg border-2 border-white ring-4 ring-amber-200">
                <Award className="w-8 h-8" />
              </div>
            </div>

            <span className="text-xs uppercase tracking-widest text-amber-900 font-extrabold block mb-0.5">
              Escola Municipal Educandário Nossa Senhora Aparecida
            </span>
            <span className="text-[11px] text-amber-700 font-semibold block mb-2">
              Turma: 3° ANO B · Turno Matutino · Professora Simone Rosa
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display tracking-tight">
              CERTIFICADO DE MÉRITO
            </h2>
            <div className="w-24 h-1 bg-amber-500 mx-auto my-3 rounded-full" />

            <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
              Certificamos com muito orgulho que o(a) dedicado(a) estudante
            </p>

            <div className="my-4 py-2 border-b-2 border-amber-400/80 max-w-md mx-auto">
              <span className="text-xl sm:text-2xl font-black text-amber-900 font-display">
                {studentName.trim() || 'Estudante Destaque'}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 max-w-xl mx-auto leading-relaxed">
              concluiu com êxito as <strong>Quatro Missões Matemáticas</strong> de interpretação de enunciados e resolução de situações-problema com as <strong>quatro operações (➕ ➖ ✖️ ➗)</strong>, atendendo à habilidade <strong>EF03CO02</strong> da Base Nacional Comum Curricular (BNCC).
            </p>

            {/* Missions checked badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-5 text-[11px] font-bold text-slate-700">
              <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-200 flex items-center justify-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>1. Adição (+)</span>
              </div>
              <div className="p-2 bg-rose-50 rounded-lg border border-rose-200 flex items-center justify-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-rose-600" />
                <span>2. Subtração (-)</span>
              </div>
              <div className="p-2 bg-amber-50 rounded-lg border border-amber-200 flex items-center justify-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-amber-600" />
                <span>3. Multiplicação (×)</span>
              </div>
              <div className="p-2 bg-indigo-50 rounded-lg border border-indigo-200 flex items-center justify-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-indigo-600" />
                <span>4. Divisão (÷)</span>
              </div>
            </div>

            {totalTimeFormatted && (
              <div className="my-3 py-1.5 px-3 bg-purple-50 text-purple-900 border border-purple-200 rounded-xl inline-flex items-center gap-1.5 text-xs font-mono font-bold shadow-2xs">
                <Clock className="w-3.5 h-3.5 text-purple-600" />
                <span>Tempo Total de Investigação: {totalTimeFormatted}</span>
              </div>
            )}

            {/* Official Signatures Row */}
            <div className="grid grid-cols-2 gap-6 mt-8 pt-6 border-t border-slate-200 text-xs">
              <div className="text-center">
                <div className="font-serif italic text-base text-slate-800 border-b border-slate-400 pb-1 max-w-[180px] mx-auto">
                  Simone Rosa
                </div>
                <span className="font-bold text-slate-800 block mt-1">Professora Simone Rosa</span>
                <span className="text-[11px] text-slate-500">Regente do 3° Ano B</span>
              </div>

              <div className="text-center">
                <div className="font-mono text-sm text-slate-800 border-b border-slate-400 pb-1 max-w-[180px] mx-auto">
                  Quinta-feira · 3ª Aula
                </div>
                <span className="font-bold text-slate-800 block mt-1">Turma 3° ANO B</span>
                <span className="text-[11px] text-slate-500">Turno Matutino</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
