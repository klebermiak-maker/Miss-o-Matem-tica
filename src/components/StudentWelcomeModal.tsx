import React, { useState } from 'react';
import { User, Sparkles, ArrowRight, BookOpen, Check, X, Hash, GraduationCap, RefreshCw } from 'lucide-react';
import { ClassDatabaseService, StudentDatabaseRecord } from '../services/db';
import { playClickSound, playSuccessSound } from '../utils/audio';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentStudentName: string;
  currentStudentCode?: string;
  currentStudentClass?: string;
  onConfirmStudent: (data: {
    studentName: string;
    studentCode: string;
    studentClass: string;
  }) => void;
}

export const StudentWelcomeModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentStudentName,
  currentStudentCode = '',
  currentStudentClass = '3° ANO B',
  onConfirmStudent,
}) => {
  const [inputName, setInputName] = useState(currentStudentName.toUpperCase());
  const [inputCode, setInputCode] = useState(
    currentStudentCode || `3B-${Math.floor(10 + Math.random() * 89)}`
  );
  const [inputClass, setInputClass] = useState(currentStudentClass || '3° ANO B');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const existingStudents: StudentDatabaseRecord[] = ClassDatabaseService.getAllStudents();

  const handleGenerateNewCode = () => {
    playClickSound();
    const newCode = `3B-${Math.floor(10 + Math.random() * 89)}`;
    setInputCode(newCode);
  };

  const handleStart = () => {
    const cleanName = inputName.trim().toUpperCase();
    const cleanCode = inputCode.trim().toUpperCase().replace(/[^A-Z0-9_\-]/g, '_');
    const cleanClass = inputClass.trim().toUpperCase();

    if (!cleanName || cleanName.length < 2) {
      setErrorMsg('Por favor, digite seu nome em CAIXA ALTA (mínimo de 2 letras).');
      return;
    }
    if (!cleanCode || cleanCode.length < 2) {
      setErrorMsg('Por favor, informe seu código individual do aluno (ex: 3B-15 ou ALUNO-01).');
      return;
    }
    if (!cleanClass) {
      setErrorMsg('Por favor, selecione ou digite a sua turma.');
      return;
    }

    playSuccessSound();
    onConfirmStudent({
      studentName: cleanName,
      studentCode: cleanCode,
      studentClass: cleanClass,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[95vh]">
        {/* Top Header Banner */}
        <div className="p-6 bg-linear-to-br from-amber-500 via-orange-500 to-amber-600 text-white text-center relative">
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
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md mx-auto flex items-center justify-center text-3xl shadow-lg ring-4 ring-white/30 mb-2">
            🎓
          </div>
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-100 block mb-1">
            Escola Municipal Educandário Nossa Senhora Aparecida
          </span>
          <h2 className="text-xl sm:text-2xl font-black font-display tracking-tight text-white">
            Missão Matemática · Identificação do Aluno
          </h2>
          <p className="text-xs text-amber-100 mt-0.5">
            Professora Simone Rosa · Cloud Firestore Integrado
          </p>
        </div>

        {/* Modal Form Content */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto">
          <div className="text-center space-y-1">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 font-display flex items-center justify-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Credenciais do Aluno para a Nuvem</span>
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Seus dados registrarão cada resposta, tempo e tentativas em tempo real no Cloud Firestore!
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleStart();
            }}
            className="space-y-3.5"
          >
            {/* 1. Nome em CAIXA ALTA */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="student-input-name" className="block text-xs font-bold text-slate-800">
                  Nome do Aluno:
                </label>
                <span className="text-[10px] font-black uppercase text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded">
                  Em Caixa Alta
                </span>
              </div>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="student-input-name"
                  type="text"
                  autoFocus
                  value={inputName}
                  onChange={(e) => {
                    setInputName(e.target.value.toUpperCase());
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="EX: LUCAS GABRIEL, MARINA SILVA..."
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border-2 border-slate-200 focus:border-amber-500 focus:ring-3 focus:ring-amber-100 font-bold text-sm text-slate-800 placeholder-slate-400 uppercase tracking-wide transition-all focus:outline-none"
                />
              </div>
            </div>

            {/* 2. Turma */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="student-input-class" className="block text-xs font-bold text-slate-800">
                  Turma:
                </label>
                <span className="text-[10px] font-semibold text-slate-500">
                  Turno Matutino
                </span>
              </div>
              <div className="relative">
                <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <select
                  id="student-input-class"
                  value={inputClass}
                  onChange={(e) => setInputClass(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border-2 border-slate-200 focus:border-amber-500 focus:ring-3 focus:ring-amber-100 font-bold text-sm text-slate-800 bg-white transition-all focus:outline-none"
                >
                  <option value="3° ANO B">3° ANO B (Professora Simone Rosa)</option>
                  <option value="3° ANO A">3° ANO A</option>
                  <option value="3° ANO C">3° ANO C</option>
                  <option value="3° ANO D">3° ANO D</option>
                </select>
              </div>
            </div>

            {/* 3. Código Individual do Aluno */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="student-input-code" className="block text-xs font-bold text-slate-800">
                  Código Individual do Aluno:
                </label>
                <button
                  type="button"
                  onClick={handleGenerateNewCode}
                  className="text-[10px] font-bold text-amber-700 hover:text-amber-900 flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 transition-colors"
                  title="Gerar um código individual aleatório"
                >
                  <RefreshCw className="w-2.5 h-2.5" />
                  <span>Gerar Código</span>
                </button>
              </div>
              <div className="relative">
                <Hash className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="student-input-code"
                  type="text"
                  value={inputCode}
                  onChange={(e) => {
                    setInputCode(e.target.value.toUpperCase());
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="EX: 3B-15, MAT-01..."
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border-2 border-slate-200 focus:border-amber-500 focus:ring-3 focus:ring-amber-100 font-mono font-bold text-sm text-slate-800 uppercase transition-all focus:outline-none"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Identificador único para evitar duplicidades e gravar com segurança na nuvem.
              </p>
            </div>

            {errorMsg && (
              <p className="text-xs text-rose-600 font-semibold bg-rose-50 p-2 rounded-lg border border-rose-200">
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-slate-950 font-black text-sm tracking-wide shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-2"
            >
              <span>Entrar nas Missões</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick pick from students already in local memory */}
          {existingStudents.length > 0 && (
            <div className="pt-2 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                Alunos registrados anteriormente:
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1">
                {existingStudents.map((std) => (
                  <button
                    key={std.id}
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setInputName(std.studentName.toUpperCase());
                      setInputCode(`3B-${std.studentName.slice(0, 3).toUpperCase()}`);
                    }}
                    className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-amber-100 hover:text-amber-900 text-slate-700 border border-slate-200 transition-colors flex items-center gap-1"
                  >
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span>{std.studentName.toUpperCase()}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Pedagogical Note */}
          <div className="bg-amber-50/70 p-2.5 rounded-xl border border-amber-200/80 flex items-start gap-2 text-[11px] text-amber-900">
            <BookOpen className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              Suas respostas serão sincronizadas em tempo real com o <strong>Cloud Firestore</strong> para análise da <strong>Professora Simone Rosa</strong>.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
