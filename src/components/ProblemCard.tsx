import React, { useState, useEffect } from 'react';
import { Problem, OperationType, ProblemAttemptRecord } from '../types/mathGame';
import { InteractiveManipulatives } from './InteractiveManipulatives';
import {
  Volume2,
  VolumeX,
  Search,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Lightbulb,
  Timer,
  Clock,
  Pause,
  Play
} from 'lucide-react';
import {
  playSuccessSound,
  playEncouragementSound,
  playClickSound,
  speakText,
  stopSpeaking
} from '../utils/audio';

interface Props {
  problem: Problem;
  problemIndex: number;
  totalProblems: number;
  missionId: number;
  missionOperation: OperationType;
  onProblemCompleted: (problemId: string, isCorrect: boolean, attemptRecord?: ProblemAttemptRecord) => void;
  onNextProblem: () => void;
  isLastProblem: boolean;
}

export const ProblemCard: React.FC<Props> = ({
  problem,
  problemIndex,
  totalProblems,
  missionId,
  onProblemCompleted,
  onNextProblem,
  isLastProblem
}) => {
  // Steps: 'interpret' -> 'choose_op' -> 'calculate' -> 'solved'
  const [currentStep, setCurrentStep] = useState<'interpret' | 'choose_op' | 'calculate' | 'solved'>('interpret');
  const [selectedOperation, setSelectedOperation] = useState<OperationType | null>(null);
  const [opFeedback, setOpFeedback] = useState<string | null>(null);
  const [opError, setOpError] = useState(false);

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [calcFeedback, setCalcFeedback] = useState<string | null>(null);
  const [calcError, setCalcError] = useState(false);

  const [showMagnifier, setShowMagnifier] = useState(false);
  const [isSpeakingState, setIsSpeakingState] = useState(false);
  const [showManipulatives, setShowManipulatives] = useState(false);
  const [showMasterClue, setShowMasterClue] = useState(false);
  const [isSpeakingClue, setIsSpeakingClue] = useState(false);

  // Diagnostic attempt tracking
  const [opAttempts, setOpAttempts] = useState<number>(0);
  const [opWrongPicks, setOpWrongPicks] = useState<OperationType[]>([]);
  const [calcAttempts, setCalcAttempts] = useState<number>(0);
  const [calcWrongAnswers, setCalcWrongAnswers] = useState<number[]>([]);
  const [usedMasterClue, setUsedMasterClue] = useState<boolean>(false);
  const [usedMagnifier, setUsedMagnifier] = useState<boolean>(false);
  const [usedManipulatives, setUsedManipulatives] = useState<boolean>(false);

  // Live Challenge Stopwatch Timer
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);

  // Interval timer ticks every second while active
  useEffect(() => {
    if (!isTimerRunning || currentStep === 'solved') return;
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning, currentStep]);

  useEffect(() => {
    // Reset state on problem change
    setCurrentStep('interpret');
    setSelectedOperation(null);
    setOpFeedback(null);
    setOpError(false);
    setSelectedAnswer(null);
    setCalcFeedback(null);
    setCalcError(false);
    setShowMagnifier(false);
    setShowManipulatives(false);
    setShowMasterClue(false);
    setIsSpeakingClue(false);
    setOpAttempts(0);
    setOpWrongPicks([]);
    setCalcAttempts(0);
    setCalcWrongAnswers([]);
    setUsedMasterClue(false);
    setUsedMagnifier(false);
    setUsedManipulatives(false);
    setElapsedSeconds(0);
    setIsTimerRunning(true);
    stopSpeaking();
    setIsSpeakingState(false);
  }, [problem.id]);

  const formatTimerDigits = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const formatFriendlyDuration = (secs: number) => {
    if (secs < 60) return `${secs} segundos`;
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return s > 0 ? `${m}m ${s}s` : `${m} min`;
  };

  const handleToggleMasterClue = () => {
    playClickSound();
    setUsedMasterClue(true);
    setShowMasterClue((prev) => !prev);
  };

  const handleReadClueAloud = () => {
    if (!problem.masterClue) return;
    if (isSpeakingClue) {
      stopSpeaking();
      setIsSpeakingClue(false);
    } else {
      setIsSpeakingClue(true);
      const clueText = `${problem.masterClue.title}. ${problem.masterClue.interpretationClue} Palavra-chave: ${problem.masterClue.keywordHighlight}. Dica: ${problem.masterClue.operationHint}`;
      speakText(clueText, () => setIsSpeakingClue(false));
    }
  };

  const handleReadAloud = () => {
    if (isSpeakingState) {
      stopSpeaking();
      setIsSpeakingState(false);
    } else {
      setIsSpeakingState(true);
      const fullText = `${problem.statement} Pergunta: ${problem.question}`;
      speakText(fullText, () => setIsSpeakingState(false));
    }
  };

  const handleSelectOperation = (op: OperationType) => {
    playClickSound();
    setSelectedOperation(op);
    setOpAttempts((prev) => prev + 1);

    if (op === problem.operation) {
      playSuccessSound();
      setOpError(false);
      setOpFeedback(
        `Correto! Para essa situação usamos a ${
          op === '+'
            ? 'Adição (+)'
            : op === '-'
            ? 'Subtração (-)'
            : op === '*'
            ? 'Multiplicação (×)'
            : 'Divisão (÷)'
        }. Excelente interpretação!`
      );
      setTimeout(() => {
        setCurrentStep('calculate');
      }, 1200);
    } else {
      playEncouragementSound();
      setOpError(true);
      setOpWrongPicks((prev) => [...prev, op]);
      const hint =
        problem.operation === '+'
          ? 'Observe que estamos juntando ou acrescentando quantidades!'
          : problem.operation === '-'
          ? 'Observe que estamos tirando, comparando ou completando o que falta!'
          : problem.operation === '*'
          ? 'Observe que temos grupos com quantidades iguais que se repetem!'
          : 'Observe que a quantidade está sendo repartida igualmente!';
      setOpFeedback(`Não é essa operação. Vamos tentar de novo? Dica: ${hint}`);
    }
  };

  const handleSelectAnswer = (ans: number) => {
    playClickSound();
    setSelectedAnswer(ans);
    const newCalcAttempts = calcAttempts + 1;
    setCalcAttempts(newCalcAttempts);

    if (ans === problem.correctAnswer) {
      playSuccessSound();
      setCalcError(false);
      setCalcFeedback(`Muito bem! Resposta exata: ${ans} ${problem.unit}!`);
      setCurrentStep('solved');
      setIsTimerRunning(false);

      const isOpFirstTry = opWrongPicks.length === 0;
      const isCalcFirstTry = calcWrongAnswers.length === 0;

      const record: ProblemAttemptRecord = {
        problemId: problem.id,
        missionId,
        operation: problem.operation,
        themeContext: problem.themeContext,
        operationAttempts: opAttempts + 1,
        operationWrongPicks: opWrongPicks,
        operationFirstTrySuccess: isOpFirstTry,
        calculationAttempts: newCalcAttempts,
        calculationWrongAnswers: calcWrongAnswers,
        calculationFirstTrySuccess: isCalcFirstTry,
        usedMasterClue,
        usedMagnifier,
        usedManipulatives,
        completed: true,
        completedAt: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        timeSpentSeconds: elapsedSeconds,
        timeSpentFormatted: formatFriendlyDuration(elapsedSeconds),
      };

      onProblemCompleted(problem.id, true, record);
    } else {
      playEncouragementSound();
      setCalcError(true);
      setCalcWrongAnswers((prev) => [...prev, ans]);
      setCalcFeedback(`Ops! Quase lá. Tente usar a Mesa de Investigação abaixo ou o Material Dourado para conferir!`);
      setShowManipulatives(true);
      setUsedManipulatives(true);
    }
  };

  const operationCards: {
    type: OperationType;
    symbol: string;
    label: string;
    meaning: string;
    color: string;
  }[] = [
    {
      type: '+',
      symbol: '➕',
      label: 'Adição',
      meaning: 'Juntar ou acrescentar',
      color: 'hover:border-emerald-500 hover:bg-emerald-50/50'
    },
    {
      type: '-',
      symbol: '➖',
      label: 'Subtração',
      meaning: 'Tirar, comparar ou completar',
      color: 'hover:border-rose-500 hover:bg-rose-50/50'
    },
    {
      type: '*',
      symbol: '✖️',
      label: 'Multiplicação',
      meaning: 'Adicionar parcelas iguais',
      color: 'hover:border-amber-500 hover:bg-amber-50/50'
    },
    {
      type: '/',
      symbol: '➗',
      label: 'Divisão',
      meaning: 'Repartir em partes iguais',
      color: 'hover:border-indigo-500 hover:bg-indigo-50/50'
    }
  ];

  // Highlight keywords in statement when magnifier is active
  const renderHighlightedStatement = () => {
    if (!showMagnifier) {
      return <span>{problem.statement}</span>;
    }

    let rendered = problem.statement;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    // Build regex for numbers and keywords
    const regex = new RegExp(`(${[...problem.keywords, ...problem.numbers.map(String)].join('|')})`, 'gi');
    const matches = Array.from(rendered.matchAll(regex));

    matches.forEach((match, index) => {
      const matchIndex = match.index ?? 0;
      if (matchIndex > lastIndex) {
        parts.push(rendered.substring(lastIndex, matchIndex));
      }
      parts.push(
        <mark
          key={index}
          className="bg-amber-200/90 text-amber-950 px-1 py-0.5 rounded font-semibold transition-all shadow-xs"
        >
          {match[0]}
        </mark>
      );
      lastIndex = matchIndex + match[0].length;
    });

    if (lastIndex < rendered.length) {
      parts.push(rendered.substring(lastIndex));
    }

    return <>{parts}</>;
  };

  const renderVisualClueSchema = () => {
    if (!problem.masterClue) return null;
    const schema = problem.masterClue.visualSchema;
    const [num1, num2] = problem.numbers;

    if (schema === 'combine') {
      return (
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-bold text-emerald-950">
            <div className="bg-emerald-100 border border-emerald-300 px-3 py-2 rounded-lg text-center shadow-2xs">
              <span className="block text-[10px] text-emerald-700 font-sans">Parte 1</span>
              <span className="text-sm font-mono">{num1} {problem.unit}</span>
            </div>
            <span className="text-lg text-emerald-600 font-extrabold">➕</span>
            <div className="bg-emerald-100 border border-emerald-300 px-3 py-2 rounded-lg text-center shadow-2xs">
              <span className="block text-[10px] text-emerald-700 font-sans">Parte 2</span>
              <span className="text-sm font-mono">{num2} {problem.unit}</span>
            </div>
            <span className="text-lg text-emerald-600 font-extrabold">➔</span>
            <div className="bg-emerald-600 text-white px-3 py-2 rounded-lg text-center shadow-xs">
              <span className="block text-[10px] text-emerald-200 font-sans">Total Juntos</span>
              <span className="text-sm font-mono font-black">? {problem.unit}</span>
            </div>
          </div>
          <p className="text-[11px] text-center text-slate-500">
            Reunir as partes em uma única cesta/grupo maior = <strong>Adição (+)</strong>
          </p>
        </div>
      );
    }

    if (schema === 'separate') {
      return (
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-bold text-rose-950">
            <div className="bg-rose-100 border border-rose-300 px-3 py-2 rounded-lg text-center shadow-2xs">
              <span className="block text-[10px] text-rose-700 font-sans">Total Inicial / Maior</span>
              <span className="text-sm font-mono">{num1} {problem.unit}</span>
            </div>
            <span className="text-lg text-rose-600 font-extrabold">➖</span>
            <div className="bg-rose-100 border border-rose-300 px-3 py-2 rounded-lg text-center shadow-2xs">
              <span className="block text-[10px] text-rose-700 font-sans">Retirado / Comparado</span>
              <span className="text-sm font-mono">{num2} {problem.unit}</span>
            </div>
            <span className="text-lg text-rose-600 font-extrabold">➔</span>
            <div className="bg-rose-600 text-white px-3 py-2 rounded-lg text-center shadow-xs">
              <span className="block text-[10px] text-rose-200 font-sans">Resto / Diferença</span>
              <span className="text-sm font-mono font-black">? {problem.unit}</span>
            </div>
          </div>
          <p className="text-[11px] text-center text-slate-500">
            Tirar uma quantia ou calcular a diferença entre dois grupos = <strong>Subtração (-)</strong>
          </p>
        </div>
      );
    }

    if (schema === 'repeat') {
      return (
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs font-bold text-amber-950">
            {Array.from({ length: Math.min(num1, 6) }).map((_, i) => (
              <div key={i} className="bg-amber-100 border border-amber-300 px-2 py-1.5 rounded-lg text-center">
                <span className="text-[10px] block text-amber-700">Grupo {i + 1}</span>
                <span className="text-xs font-mono">{num2}</span>
              </div>
            ))}
            <span className="text-base text-amber-600 font-extrabold px-1">➔</span>
            <div className="bg-amber-600 text-white px-3 py-1.5 rounded-lg text-center shadow-xs">
              <span className="text-[10px] block text-amber-200">{num1} grupos de {num2}</span>
              <span className="text-xs font-mono font-black">{num1} × {num2} = ?</span>
            </div>
          </div>
          <p className="text-[11px] text-center text-slate-500">
            Parcelas iguais repetidas várias vezes = <strong>Multiplicação (×)</strong>
          </p>
        </div>
      );
    }

    if (schema === 'share') {
      return (
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-bold text-indigo-950">
            <div className="bg-indigo-100 border border-indigo-300 px-3 py-2 rounded-lg text-center shadow-2xs">
              <span className="block text-[10px] text-indigo-700 font-sans">Total a Distribuir</span>
              <span className="text-sm font-mono">{num1} {problem.unit}</span>
            </div>
            <span className="text-lg text-indigo-600 font-extrabold">➗</span>
            <div className="bg-indigo-100 border border-indigo-300 px-3 py-2 rounded-lg text-center shadow-2xs">
              <span className="block text-[10px] text-indigo-700 font-sans">Entre {num2} Partes</span>
              <span className="text-sm font-mono">{num2} grupos</span>
            </div>
            <span className="text-lg text-indigo-600 font-extrabold">➔</span>
            <div className="bg-indigo-600 text-white px-3 py-2 rounded-lg text-center shadow-xs">
              <span className="block text-[10px] text-indigo-200 font-sans">Cada Parte Fica Com</span>
              <span className="text-sm font-mono font-black">? cada</span>
            </div>
          </div>
          <p className="text-[11px] text-center text-slate-500">
            Repartir igualmente em partes de mesmo tamanho = <strong>Divisão (÷)</strong>
          </p>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all">
      {/* Header Bar */}
      <div className="bg-slate-50 border-b border-slate-200/80 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Desafio {problemIndex + 1} de {totalProblems}
          </span>
          <span className="text-slate-300">·</span>
          <span className="text-xs font-semibold text-slate-700 bg-white border border-slate-200 px-2 py-0.5 rounded-md">
            {problem.themeContext}
          </span>
        </div>

        {/* Progress step indicators and Challenge Timer */}
        <div className="flex items-center gap-3">
          {/* Live Challenge Stopwatch */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-mono text-xs font-bold transition-all ${
              currentStep === 'solved'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : isTimerRunning
                ? 'bg-amber-50 text-amber-900 border-amber-300 shadow-2xs'
                : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}
            title="Cronômetro do desafio: tempo de reflexão e resolução"
          >
            <Timer className={`w-3.5 h-3.5 ${isTimerRunning && currentStep !== 'solved' ? 'text-amber-600 animate-pulse' : 'text-slate-500'}`} />
            <span>{formatTimerDigits(elapsedSeconds)}</span>
            {currentStep !== 'solved' && (
              <button
                type="button"
                onClick={() => setIsTimerRunning((prev) => !prev)}
                className="text-slate-400 hover:text-slate-700 ml-0.5 p-0.5 rounded transition-colors"
                title={isTimerRunning ? 'Pausar cronômetro' : 'Continuar cronômetro'}
              >
                {isTimerRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              </button>
            )}
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                currentStep === 'interpret'
                  ? 'bg-amber-500 ring-2 ring-amber-200'
                  : 'bg-emerald-500'
              }`}
            />
            <span>1. Ler</span>
            <span className="text-slate-300">→</span>
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                currentStep === 'choose_op'
                  ? 'bg-amber-500 ring-2 ring-amber-200'
                  : currentStep === 'calculate' || currentStep === 'solved'
                  ? 'bg-emerald-500'
                  : 'bg-slate-300'
              }`}
            />
            <span>2. Operação</span>
            <span className="text-slate-300">→</span>
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                currentStep === 'calculate'
                  ? 'bg-amber-500 ring-2 ring-amber-200'
                  : currentStep === 'solved'
                  ? 'bg-emerald-500'
                  : 'bg-slate-300'
              }`}
            />
            <span>3. Resolver</span>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-6">
        {/* ENUNCIADO DO PROBLEMA */}
        <div className="bg-gradient-to-br from-amber-50/50 to-orange-50/30 rounded-2xl border border-amber-100 p-4 sm:p-5 relative">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
              <span className="text-base">📖</span> Enunciado do Problema
            </span>

            {/* Accessibility & reading aids */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleReadAloud}
                className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg border transition-all ${
                  isSpeakingState
                    ? 'bg-rose-100 text-rose-700 border-rose-300 animate-pulse'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
                title="Ouvir leitura em voz alta"
              >
                {isSpeakingState ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5" />
                    Parar Áudio
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-amber-600" />
                    Ouvir Enunciado
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setUsedMagnifier(true);
                  setShowMagnifier(!showMagnifier);
                }}
                className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg border transition-all ${
                  showMagnifier
                    ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
                title="Destacar dados numéricos e palavras-chave"
              >
                <Search className="w-3.5 h-3.5" />
                {showMagnifier ? 'Ocultar Pistas' : 'Lupa de Pistas'}
              </button>

              {/* Botão Dica de Mestre */}
              <button
                type="button"
                onClick={handleToggleMasterClue}
                className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-lg border transition-all ${
                  showMasterClue
                    ? 'bg-amber-500 text-white border-amber-600 shadow-xs ring-2 ring-amber-300'
                    : 'bg-amber-100 text-amber-950 border-amber-300 hover:bg-amber-200'
                }`}
                title="Dica de Mestre: Ver pista textual e visual para interpretar a situação"
              >
                <Lightbulb className={`w-3.5 h-3.5 ${showMasterClue ? 'text-white' : 'text-amber-700'}`} />
                <span>Dica de Mestre</span>
              </button>
            </div>
          </div>

          {/* Statement text with highlight capability */}
          <p className="text-base sm:text-lg text-slate-800 leading-relaxed font-normal">
            {renderHighlightedStatement()}
          </p>

          {/* The main question */}
          <div className="mt-4 pt-3 border-t border-amber-200/60 flex items-start gap-2.5 bg-white/80 p-3 rounded-xl border border-amber-100">
            <span className="text-lg">❓</span>
            <div>
              <span className="text-xs font-bold text-amber-800 uppercase block tracking-wider">
                Pergunta a ser respondida:
              </span>
              <p className="text-base sm:text-lg font-bold text-slate-900 font-display">
                {problem.question}
              </p>
            </div>
          </div>

          {/* PAINEL DICA DE MESTRE (Pista Textual e Visual de Interpretação) */}
          {showMasterClue && problem.masterClue && (
            <div className="mt-4 p-4 bg-linear-to-r from-amber-50 via-yellow-50 to-orange-50 border-2 border-amber-300 rounded-2xl shadow-sm space-y-3 animate-fadeIn">
              {/* Header do Card de Dica */}
              <div className="flex items-center justify-between gap-2 border-b border-amber-200/80 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold text-base shadow-2xs">
                    💡
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-amber-950 font-display">
                      {problem.masterClue.title}
                    </h4>
                    <span className="text-[11px] text-amber-800 font-medium">
                      Pista de interpretação da Professora Simone Rosa
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleReadClueAloud}
                    className={`flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-all ${
                      isSpeakingClue
                        ? 'bg-rose-100 text-rose-700 border-rose-300 animate-pulse'
                        : 'bg-white text-amber-950 border-amber-300 hover:bg-amber-100'
                    }`}
                    title="Ouvir a Dica de Mestre em voz alta"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-amber-700" />
                    <span>{isSpeakingClue ? 'Parar Áudio' : 'Ouvir Dica'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowMasterClue(false)}
                    className="text-xs text-amber-700 hover:text-amber-950 p-1 rounded hover:bg-amber-200/60 transition-colors"
                    title="Fechar dica"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Pista Textual */}
              <div className="text-xs sm:text-sm text-slate-800 leading-relaxed space-y-2">
                <p className="font-normal text-amber-950">
                  {problem.masterClue.interpretationClue}
                </p>

                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  <span className="text-amber-900 font-bold">Palavra(s)-chave do texto:</span>
                  <span className="bg-amber-200 text-amber-950 px-2 py-0.5 rounded-md font-bold font-mono">
                    {problem.masterClue.keywordHighlight}
                  </span>
                </div>

                <div className="p-2.5 bg-white/90 rounded-xl border border-amber-200/90 text-xs text-amber-950 font-medium">
                  👉 <strong>Identificação da Operação:</strong> {problem.masterClue.operationHint}
                </div>
              </div>

              {/* Pista Visual (Esquema Gráfico) */}
              <div className="p-3 bg-white rounded-xl border border-amber-200/90 shadow-2xs">
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-amber-900 block mb-2">
                  Esquema Visual da Ação:
                </span>
                {renderVisualClueSchema()}
              </div>
            </div>
          )}
        </div>

        {/* STEP 1: INTERPRETATION PROMPT */}
        {currentStep === 'interpret' && (
          <div className="p-4 bg-blue-50/70 rounded-xl border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shrink-0">
                1
              </div>
              <div>
                <h4 className="text-sm font-bold text-blue-900 font-display">
                  Passo 1: Interpretar o Enunciado
                </h4>
                <p className="text-xs text-blue-700">
                  Leia atentamente com a turma. Quando estiver pronto para escolher a operação, clique em continuar!
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                playClickSound();
                setCurrentStep('choose_op');
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-xs transition-all flex items-center justify-center gap-2 shrink-0"
            >
              <span>Escolher Operação</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: CHOOSE THE OPERATION */}
        {(currentStep === 'choose_op' || currentStep === 'calculate' || currentStep === 'solved') && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <h4 className="text-sm font-bold text-slate-900 font-display">
                  Qual operação matemática é necessária para resolver?
                </h4>
              </div>
              {currentStep !== 'choose_op' && (
                <button
                  type="button"
                  onClick={() => {
                    setCurrentStep('choose_op');
                    setOpFeedback(null);
                  }}
                  className="text-xs text-slate-500 hover:text-slate-800 underline"
                >
                  Mudar operação
                </button>
              )}
            </div>

            {/* 4 Operation Selection Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3">
              {operationCards.map((op) => {
                const isSelected = selectedOperation === op.type;
                const isCorrect = isSelected && op.type === problem.operation;
                const isWrong = isSelected && op.type !== problem.operation;

                return (
                  <button
                    key={op.type}
                    type="button"
                    disabled={currentStep === 'solved'}
                    onClick={() => handleSelectOperation(op.type)}
                    className={`p-3 rounded-xl border-2 text-left transition-all relative ${
                      isCorrect
                        ? 'border-emerald-500 bg-emerald-50 shadow-sm'
                        : isWrong
                        ? 'border-rose-400 bg-rose-50'
                        : isSelected
                        ? 'border-slate-800 bg-slate-50'
                        : `border-slate-200 bg-white ${op.color}`
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-2xl">{op.symbol}</span>
                      {isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      )}
                      {isWrong && (
                        <AlertCircle className="w-4 h-4 text-rose-600" />
                      )}
                    </div>
                    <div className="text-sm font-bold text-slate-900 font-display">
                      {op.label}
                    </div>
                    <div className="text-[11px] text-slate-500 leading-tight mt-0.5">
                      {op.meaning}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Feedback on Operation */}
            {opFeedback && (
              <div
                className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
                  opError
                    ? 'bg-rose-50 text-rose-800 border border-rose-200'
                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                }`}
              >
                {opError ? (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                )}
                <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span>{opFeedback}</span>
                  {opError && (
                    <button
                      type="button"
                      onClick={() => {
                        playClickSound();
                        setShowMasterClue(true);
                      }}
                      className="text-xs font-bold text-rose-900 bg-rose-200/90 hover:bg-rose-300 px-2.5 py-1 rounded-md transition-colors inline-flex items-center gap-1 shrink-0 self-start sm:self-auto"
                    >
                      <Lightbulb className="w-3 h-3 text-rose-800" />
                      <span>Abrir Dica de Mestre</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 3: SOLVE THE CALCULATION */}
        {(currentStep === 'calculate' || currentStep === 'solved') && (
          <div className="space-y-4 pt-2 border-t border-slate-200/80">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
                  3
                </span>
                <h4 className="text-sm font-bold text-slate-900 font-display">
                  Resolva o cálculo e selecione a resposta correta:
                </h4>
              </div>

              {/* Toggle manipulatives */}
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setUsedManipulatives(true);
                  setShowManipulatives(!showManipulatives);
                }}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 ${
                  showManipulatives
                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                    : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                {showManipulatives ? 'Ocultar Mesa de Apoio' : 'Abrir Mesa de Apoio (Material Dourado)'}
              </button>
            </div>

            {/* Mathematical Sentence Display */}
            <div className="p-4 bg-slate-900 text-white rounded-2xl text-center shadow-inner flex flex-col items-center justify-center">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
                Sentença Matemática
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono tracking-wider text-amber-300">
                {problem.numbers[0]}{' '}
                {problem.operation === '*' ? '×' : problem.operation === '/' ? '÷' : problem.operation}{' '}
                {problem.numbers[1]} ={' '}
                <span className="underline decoration-wavy decoration-amber-400 text-white">
                  {selectedAnswer !== null ? selectedAnswer : '?'}
                </span>
              </div>
            </div>

            {/* Answer Options */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {problem.options.map((option) => {
                const isSelected = selectedAnswer === option;
                const isCorrect = option === problem.correctAnswer;
                const isSolved = currentStep === 'solved';

                return (
                  <button
                    key={option}
                    type="button"
                    disabled={isSolved}
                    onClick={() => handleSelectAnswer(option)}
                    className={`py-3 px-4 rounded-xl border-2 text-center font-mono text-lg font-bold transition-all ${
                      isSelected && isCorrect
                        ? 'border-emerald-500 bg-emerald-500 text-white shadow-md'
                        : isSelected && !isCorrect
                        ? 'border-rose-400 bg-rose-50 text-rose-700'
                        : isSolved && isCorrect
                        ? 'border-emerald-500 bg-emerald-100 text-emerald-900 font-extrabold'
                        : 'border-slate-200 bg-white text-slate-800 hover:border-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    <span>{option}</span>
                    <span className="text-xs font-sans font-normal text-slate-500 block">
                      {problem.unit}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Calculation Feedback */}
            {calcFeedback && (
              <div
                className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
                  calcError
                    ? 'bg-rose-50 text-rose-800 border border-rose-200'
                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                }`}
              >
                {calcError ? (
                  <RotateCcw className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                ) : (
                  <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                )}
                <span>{calcFeedback}</span>
              </div>
            )}

            {/* Interactive Manipulatives Section (visible on demand or error) */}
            {showManipulatives && (
              <div className="pt-2 animate-fadeIn">
                <InteractiveManipulatives problem={problem} />
              </div>
            )}
          </div>
        )}

        {/* STEP 4: SOLVED! PEDAGOGICAL SUMMARY & NEXT BUTTON */}
        {currentStep === 'solved' && (
          <div className="space-y-4 pt-4 border-t border-emerald-200 bg-emerald-50/50 p-4 sm:p-5 rounded-2xl border">
            <div className="flex flex-wrap items-center justify-between gap-2 text-emerald-800 font-bold text-sm">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                <span>Desafio Concluído com Sucesso!</span>
              </div>
              <div className="flex items-center gap-1.5 bg-emerald-100 text-emerald-950 border border-emerald-300 px-3 py-1 rounded-lg text-xs font-mono font-bold shadow-2xs">
                <Timer className="w-3.5 h-3.5 text-emerald-700" />
                <span>Tempo de Resolução: {formatFriendlyDuration(elapsedSeconds)}</span>
              </div>
            </div>

            {/* Explanation box */}
            <div className="space-y-2 text-xs text-slate-700 bg-white p-4 rounded-xl border border-emerald-200">
              <p>
                <strong>1. Interpretação:</strong> {problem.explanation.step1_interpret}
              </p>
              <p>
                <strong>2. Operação indicada:</strong> {problem.explanation.step2_operation}
              </p>
              <p>
                <strong>3. Cálculo:</strong> {problem.explanation.step3_calculation}
              </p>
              <div className="mt-3 pt-2 border-t border-slate-100 flex items-start gap-2 text-amber-900 bg-amber-50/80 p-2.5 rounded-lg">
                <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span className="font-medium">{problem.explanation.pedagogicalTip}</span>
              </div>
            </div>

            {/* Action button */}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  onNextProblem();
                }}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
              >
                <span>{isLastProblem ? 'Concluir Esta Missão! 🏆' : 'Próximo Desafio →'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
