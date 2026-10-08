import React, { useState } from 'react';
import { User, Sparkles, ArrowRight, BookOpen, Check, X } from 'lucide-react';
import { ClassDatabaseService, StudentDatabaseRecord } from '../services/db';
import { playClickSound, playSuccessSound } from '../utils/audio';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentStudentName: string;
  onConfirmName: (name: string) => void;
}

export const StudentWelcomeModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentStudentName,
  onConfirmName,
}) => {
  const [inputName, setInputName] = useState(currentStudentName);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const existingStudents: StudentDatabaseRecord[] = ClassDatabaseService.getAllStudents();

  const handleStart = (nameToUse?: string) => {
    const rawInput = (nameToUse || inputName).trim();
    // Solicitar apenas o primeiro nome
    const rawFirst = rawInput.split(/\s+/)[0];
    if (!rawFirst || rawFirst.length < 2) {
      setErrorMsg('Por favor, digite seu primeiro nome (mínimo de 2 letras).');
      return;
    }

    const finalName = rawFirst.charAt(0).toUpperCase() + rawFirst.slice(1);
    playSuccessSound();
    onConfirmName(finalName);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Playful Top Banner */}
        <div className="p-6 bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 text-white text-center relative">
          {currentStudentName.trim() && (
            <button
              type="button"
              onClick={onClose}
              className="absolute top-3 right-3 p-1.5 rounded-full text-amber-100 hover:text-white hover:bg-white/20 transition-colors"
              title="Fechar sem alterar"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md mx-auto flex items-center justify-center text-3xl shadow-lg ring-4 ring-white/30 mb-3">
            🎓
          </div>
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-100 block mb-1">
            Escola Municipal Educandário Nossa Senhora Aparecida
          </span>
          <h2 className="text-2xl font-black font-display tracking-tight text-white">
            Missão Matemática · 3° ANO B
          </h2>
          <p className="text-xs text-amber-100 mt-1">
            Professora Simone Rosa · Quinta-feira, 3ª aula (Matutino)
          </p>
        </div>

        {/* Modal Form Content */}
        <div className="p-6 space-y-5">
          <div className="text-center space-y-1">
            <h3 className="text-base font-bold text-slate-900 font-display flex items-center justify-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Identificação do(a) Detetive</span>
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Digite apenas o seu <strong>primeiro nome</strong> para registrar suas respostas e cronômetro no banco de dados da turma!
            </p>
          </div>

          {/* Name Input Field */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleStart();
            }}
            className="space-y-3"
          >
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="student-input-name" className="block text-xs font-bold text-slate-700">
                  Seu Primeiro Nome:
                </label>
                <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                  Apenas o 1° nome
                </span>
              </div>
              <div className="relative">
                <User className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="student-input-name"
                  type="text"
                  autoFocus
                  value={inputName}
                  onChange={(e) => {
                    setInputName(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="Ex: Lucas, Sofia, Pedro, Marina..."
                  className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-100 font-bold text-sm text-slate-800 placeholder-slate-400 transition-all focus:outline-none"
                />
              </div>
              {errorMsg ? (
                <p className="text-xs text-rose-600 font-semibold mt-1.5">
                  {errorMsg}
                </p>
              ) : (
                <p className="text-[11px] text-slate-500 mt-1">
                  Não é necessário colocar sobrenome. Exemplo: se for <em>Lucas Gabriel</em>, digite apenas <strong>Lucas</strong>.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-slate-950 font-black text-sm tracking-wide shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <span>Entrar nas Missões</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick pick from students already in the database */}
          {existingStudents.length > 0 && (
            <div className="pt-3 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Ou selecione um aluno já cadastrado no banco:
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-1">
                {existingStudents.map((std) => (
                  <button
                    key={std.id}
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setInputName(std.studentName);
                      handleStart(std.studentName);
                    }}
                    className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-amber-100 hover:text-amber-900 text-slate-700 border border-slate-200 transition-colors flex items-center gap-1"
                  >
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span>{std.studentName}</span>
                    <span className="text-[10px] text-slate-400 font-mono">({std.completedProblemsCount}/12)</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Pedagogical Note */}
          <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200/80 flex items-start gap-2 text-[11px] text-amber-900">
            <BookOpen className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              Suas escolhas de operação e respostas calculadas serão salvas no <strong>Banco de Dados da Professora Simone</strong> para acompanhamento pedagógico da habilidade <strong>EF03CO02</strong>.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
