import React from 'react';
import { MISSIONS_DATA } from '../data/missionsData';
import { ProblemAttemptRecord, OperationType } from '../types/mathGame';
import {
  X,
  Printer,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Search,
  Layers,
  Sparkles,
  RotateCcw,
  Timer,
  Clock
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  attemptHistory: Record<string, ProblemAttemptRecord>;
  completedProblems: Record<string, boolean>;
  onResetHistory: () => void;
}

export const StudentReportModal: React.FC<Props> = ({
  isOpen,
  onClose,
  studentName,
  attemptHistory,
  completedProblems,
  onResetHistory,
}) => {
  if (!isOpen) return null;

  const totalPossibleProblems = MISSIONS_DATA.reduce((acc, m) => acc + m.problems.length, 0);
  const solvedCount = Object.values(completedProblems).filter(Boolean).length;

  // Aggregate statistics
  const attemptsArray = Object.values(attemptHistory);

  // Interpretation accuracy (first try success rate)
  const totalOpAttempted = attemptsArray.length;
  const opFirstTrySuccessCount = attemptsArray.filter((a) => a.operationFirstTrySuccess).length;
  const opAccuracyPercent =
    totalOpAttempted > 0 ? Math.round((opFirstTrySuccessCount / totalOpAttempted) * 100) : 0;

  // Calculation accuracy (first try success rate)
  const calcFirstTrySuccessCount = attemptsArray.filter((a) => a.calculationFirstTrySuccess).length;
  const calcAccuracyPercent =
    totalOpAttempted > 0 ? Math.round((calcFirstTrySuccessCount / totalOpAttempted) * 100) : 0;

  // Clue usages
  const masterClueUsedCount = attemptsArray.filter((a) => a.usedMasterClue).length;
  const manipulativesUsedCount = attemptsArray.filter((a) => a.usedManipulatives).length;

  // Time metrics
  const totalTimeSeconds = attemptsArray.reduce((acc, a) => acc + (a.timeSpentSeconds || 0), 0);
  const avgTimeSeconds =
    attemptsArray.length > 0 ? Math.round(totalTimeSeconds / attemptsArray.length) : 0;

  const formatMinSec = (sec: number) => {
    if (sec < 60) return `${sec}s`;
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return s > 0 ? `${m}m ${s}s` : `${m}m`;
  };

  // Performance breakdown by operation
  const operationStats: Record<
    OperationType,
    {
      name: string;
      symbol: string;
      color: string;
      badgeColor: string;
      total: number;
      solved: number;
      opFirstTry: number;
      calcFirstTry: number;
      opErrors: number;
      calcErrors: number;
      wrongOpPicks: OperationType[];
    }
  > = {
    '+': {
      name: 'Adição',
      symbol: '➕',
      color: 'bg-emerald-500',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      total: 3,
      solved: 0,
      opFirstTry: 0,
      calcFirstTry: 0,
      opErrors: 0,
      calcErrors: 0,
      wrongOpPicks: [],
    },
    '-': {
      name: 'Subtração',
      symbol: '➖',
      color: 'bg-rose-500',
      badgeColor: 'bg-rose-50 text-rose-800 border-rose-200',
      total: 3,
      solved: 0,
      opFirstTry: 0,
      calcFirstTry: 0,
      opErrors: 0,
      calcErrors: 0,
      wrongOpPicks: [],
    },
    '*': {
      name: 'Multiplicação',
      symbol: '✖️',
      color: 'bg-amber-500',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
      total: 3,
      solved: 0,
      opFirstTry: 0,
      calcFirstTry: 0,
      opErrors: 0,
      calcErrors: 0,
      wrongOpPicks: [],
    },
    '/': {
      name: 'Divisão',
      symbol: '➗',
      color: 'bg-indigo-600',
      badgeColor: 'bg-indigo-50 text-indigo-800 border-indigo-200',
      total: 3,
      solved: 0,
      opFirstTry: 0,
      calcFirstTry: 0,
      opErrors: 0,
      calcErrors: 0,
      wrongOpPicks: [],
    },
  };

  attemptsArray.forEach((att) => {
    const op = att.operation;
    if (operationStats[op]) {
      if (att.completed) operationStats[op].solved += 1;
      if (att.operationFirstTrySuccess) operationStats[op].opFirstTry += 1;
      if (att.calculationFirstTrySuccess) operationStats[op].calcFirstTry += 1;
      operationStats[op].opErrors += att.operationAttempts > 1 ? att.operationAttempts - 1 : 0;
      operationStats[op].calcErrors += att.calculationAttempts > 1 ? att.calculationAttempts - 1 : 0;
      if (att.operationWrongPicks?.length) {
        operationStats[op].wrongOpPicks.push(...att.operationWrongPicks);
      }
    }
  });

  // Pedagogical Diagnostic Generator for Professor Simone Rosa
  const generatePedagogicalDiagnosis = () => {
    if (totalOpAttempted === 0) {
      return 'O aluno ainda não iniciou os desafios desta aula. Incentive a abertura da Missão 1 (Adição) para registrar os primeiros dados diagnósticos.';
    }

    const observations: string[] = [];
    const interventions: string[] = [];

    // Addition evaluation
    if (operationStats['+'].solved > 0) {
      if (operationStats['+'].opErrors === 0) {
        observations.push('Excelente compreensão intuitiva das ideias de juntar e acrescentar na Adição.');
      } else {
        interventions.push('Adição: explorar com blocos concretos a junção de duas coleções distintas.');
      }
    }

    // Subtraction evaluation (specifically checking the "quantas a mais" comparative trap)
    if (operationStats['-'].solved > 0) {
      if (operationStats['-'].opErrors > 0) {
        observations.push(
          'Apresentou dúvida na interpretação de enunciados de Subtração (especialmente problemas com "quantas a mais", confundindo com soma).'
        );
        interventions.push(
          'Subtração: fazer mediação no quadro enfatizando que "quantas a mais" compara duas alturas ou coleções para achar a diferença, e não para juntar.'
        );
      } else {
        observations.push('Forte domínio na interpretação da Subtração, inclusive nas situações comparativas de diferença.');
      }
    }

    // Multiplication evaluation
    if (operationStats['*'].solved > 0) {
      if (operationStats['*'].opErrors === 0 && operationStats['*'].calcErrors === 0) {
        observations.push('Ótima identificação de parcelas iguais repetidas e organização em fileiras (Multiplicação).');
      } else if (operationStats['*'].calcErrors > 0) {
        interventions.push('Multiplicação: reforçar as contagens puladas (tabuada do 4, 5 e 6) no Material Dourado.');
      }
    }

    // Division evaluation
    if (operationStats['/'].solved > 0) {
      if (operationStats['/'].opErrors === 0) {
        observations.push('Compreendeu com clareza o significado de repartição equitativa e de medida da Divisão.');
      } else {
        interventions.push('Divisão: usar a dinâmica de distribuição em pratos ou caixas para visualizar a divisão exata.');
      }
    }

    return {
      observations: observations.length > 0 ? observations : ['Desempenho inicial em desenvolvimento positivo.'],
      interventions:
        interventions.length > 0
          ? interventions
          : ['Continuar incentivando o aluno a ler os enunciados com a Lupa de Pistas e a Mesa de Investigação.'],
    };
  };

  const diagnosis = generatePedagogicalDiagnosis();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top bar (hidden in print) */}
        <div className="no-print p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-lg shrink-0">
              📈
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base font-display">
                  Painel de Desempenho por Operação
                </h3>
                <span className="text-[11px] font-semibold bg-slate-800 text-amber-300 border border-slate-700 px-2 py-0.5 rounded">
                  Professora Simone Rosa
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 font-medium">
                Escola Municipal Educandário Nossa Senhora Aparecida · 3° ANO B Matutino
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
              title="Imprimir relatório diagnóstico do aluno"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Imprimir Relatório</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body / Report Printable Area */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-slate-800">
          {/* Printable Header */}
          <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">
                Escola Municipal Educandário Nossa Senhora Aparecida · Ficha Diagnóstica EF03CO02
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
                Aluno(a): {studentName.trim() || 'Estudante Não Identificado(a)'}
              </h2>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-1">
                <span>Turma: <strong>3° ANO B (Matutino)</strong></span>
                <span>·</span>
                <span>Professora: <strong>Simone Rosa</strong></span>
                <span>·</span>
                <span>Aula: <strong>Quinta-feira, 3ª aula</strong></span>
              </div>
            </div>

            <div className="no-print self-start sm:self-center">
              <button
                type="button"
                onClick={onResetHistory}
                className="text-[11px] font-semibold text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
                title="Limpar histórico de tentativas deste aluno"
              >
                <RotateCcw className="w-3 h-3" />
                Reiniciar Tentativas
              </button>
            </div>
          </div>

          {/* 1. Global KPI Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
              <span className="text-xs font-semibold text-slate-500 block">
                Desafios Concluídos
              </span>
              <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono mt-1">
                {solvedCount}{' '}
                <span className="text-xs font-normal text-slate-400">/ {totalPossibleProblems}</span>
              </div>
              <span className="text-[11px] text-emerald-700 font-semibold block mt-0.5">
                {Math.round((solvedCount / totalPossibleProblems) * 100)}% das missões
              </span>
            </div>

            <div className="p-3.5 bg-emerald-50/60 border border-emerald-200 rounded-2xl">
              <span className="text-xs font-semibold text-emerald-800 block">
                Precisão na Operação
              </span>
              <div className="text-xl sm:text-2xl font-black text-emerald-700 font-mono mt-1">
                {opAccuracyPercent}%
              </div>
              <span className="text-[11px] text-emerald-800 font-medium block mt-0.5">
                Acertos de 1ª tentativa
              </span>
            </div>

            <div className="p-3.5 bg-blue-50/60 border border-blue-200 rounded-2xl">
              <span className="text-xs font-semibold text-blue-800 block">
                Precisão no Cálculo
              </span>
              <div className="text-xl sm:text-2xl font-black text-blue-700 font-mono mt-1">
                {calcAccuracyPercent}%
              </div>
              <span className="text-[11px] text-blue-800 font-medium block mt-0.5">
                Resolução numérica correta
              </span>
            </div>

            <div className="p-3.5 bg-purple-50/60 border border-purple-200 rounded-2xl">
              <span className="text-xs font-semibold text-purple-800 block">
                Tempo Total Gasto
              </span>
              <div className="text-xl sm:text-2xl font-black text-purple-900 font-mono mt-1">
                {formatMinSec(totalTimeSeconds)}
              </div>
              <span className="text-[11px] text-purple-700 font-medium block mt-0.5">
                Média: {formatMinSec(avgTimeSeconds)}/desafio
              </span>
            </div>

            <div className="p-3.5 bg-amber-50/60 border border-amber-200 rounded-2xl col-span-2 sm:col-span-1">
              <span className="text-xs font-semibold text-amber-800 block">
                Apoio e Pistas
              </span>
              <div className="text-xl sm:text-2xl font-black text-amber-700 font-mono mt-1">
                {masterClueUsedCount}
              </div>
              <span className="text-[11px] text-amber-800 font-medium block mt-0.5">
                Dicas consultadas
              </span>
            </div>
          </div>

          {/* 2. Breakdown by Operation (The 4 Missions) */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-900 font-display flex items-center gap-1.5">
              <span>Desempenho Individual por Operação</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {(['+', '-', '*', '/'] as OperationType[]).map((op) => {
                const stat = operationStats[op];
                const opAccuracy =
                  stat.total > 0 && stat.solved > 0
                    ? Math.round((stat.opFirstTry / stat.solved) * 100)
                    : 0;

                return (
                  <div
                    key={op}
                    className="p-3.5 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-base">{stat.symbol}</span>
                        <strong className="text-xs text-slate-900 font-display">
                          {stat.name}
                        </strong>
                      </div>
                      <span className="text-[11px] font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        {stat.solved}/{stat.total} feitos
                      </span>
                    </div>

                    {/* Progress visual bar */}
                    <div>
                      <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                        <span>Interpretação</span>
                        <strong className="font-mono text-slate-800">
                          {stat.solved > 0 ? `${opAccuracy}%` : 'Pendente'}
                        </strong>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${stat.color} transition-all duration-300`}
                          style={{ width: `${stat.solved > 0 ? opAccuracy : 0}%` }}
                        />
                      </div>
                    </div>

                    {/* Error tallies & diagnostics */}
                    <div className="text-[11px] text-slate-600 space-y-1 pt-1 border-t border-slate-100">
                      <div className="flex justify-between">
                        <span>Erros de interpretação:</span>
                        <strong className={stat.opErrors > 0 ? 'text-rose-600' : 'text-emerald-700'}>
                          {stat.opErrors}
                        </strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Erros de cálculo:</span>
                        <strong className={stat.calcErrors > 0 ? 'text-rose-600' : 'text-emerald-700'}>
                          {stat.calcErrors}
                        </strong>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. Detailed Problem-by-Problem Audit Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900 font-display">
                Histórico Detalhado dos 12 Desafios da Turma
              </h4>
              <span className="text-xs text-slate-500">
                Detalhamento de cada situação-problema
              </span>
            </div>

            <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold">
                      <th className="py-2.5 px-3">Desafio & Operação</th>
                      <th className="py-2.5 px-3">Interpretação (Passo 2)</th>
                      <th className="py-2.5 px-3">Cálculo (Passo 3)</th>
                      <th className="py-2.5 px-3">Tempo</th>
                      <th className="py-2.5 px-3">Recursos Usados</th>
                      <th className="py-2.5 px-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {MISSIONS_DATA.flatMap((mission) =>
                      mission.problems.map((prob) => {
                        const att = attemptHistory[prob.id];
                        const isDone = completedProblems[prob.id];

                        return (
                          <tr key={prob.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="py-2.5 px-3">
                              <div className="font-bold text-slate-900">
                                {mission.operation === '*' ? '×' : mission.operation === '/' ? '÷' : mission.operation}{' '}
                                {prob.themeContext}
                              </div>
                              <span className="text-[11px] text-slate-500 block">
                                Missão {mission.id} ({mission.operationName})
                              </span>
                            </td>

                            <td className="py-2.5 px-3">
                              {att ? (
                                att.operationFirstTrySuccess ? (
                                  <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                    Acertou de 1ª
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-rose-700 font-semibold bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                                    <AlertTriangle className="w-3 h-3 text-rose-600" />
                                    {att.operationAttempts} tentativas
                                  </span>
                                )
                              ) : (
                                <span className="text-slate-400 italic">Não testado</span>
                              )}
                            </td>

                            <td className="py-2.5 px-3">
                              {att ? (
                                att.calculationFirstTrySuccess ? (
                                  <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                    Cálculo exato de 1ª
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                                    <AlertTriangle className="w-3 h-3 text-amber-600" />
                                    {att.calculationAttempts} tentativas
                                  </span>
                                )
                              ) : (
                                <span className="text-slate-400 italic">Não testado</span>
                              )}
                            </td>

                            <td className="py-2.5 px-3 font-mono text-[11px] font-semibold text-slate-700">
                              {att ? (
                                <span className="inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                  <Clock className="w-3 h-3 text-amber-600" />
                                  <span>{att.timeSpentFormatted || `${att.timeSpentSeconds || 0}s`}</span>
                                </span>
                              ) : (
                                <span className="text-slate-400 font-sans italic">-</span>
                              )}
                            </td>

                            <td className="py-2.5 px-3">
                              <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                                {att?.usedMasterClue && (
                                  <span
                                    title="Usou Dica de Mestre"
                                    className="p-1 rounded bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-0.5"
                                  >
                                    <Lightbulb className="w-3 h-3" />
                                    <span>Dica</span>
                                  </span>
                                )}
                                {att?.usedMagnifier && (
                                  <span
                                    title="Usou Lupa de Pistas"
                                    className="p-1 rounded bg-slate-100 text-slate-700 border border-slate-200"
                                  >
                                    <Search className="w-3 h-3" />
                                  </span>
                                )}
                                {att?.usedManipulatives && (
                                  <span
                                    title="Usou Mesa de Apoio / Material Dourado"
                                    className="p-1 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-0.5"
                                  >
                                    <Layers className="w-3 h-3" />
                                    <span>Mesa</span>
                                  </span>
                                )}
                                {!att?.usedMasterClue && !att?.usedMagnifier && !att?.usedManipulatives && (
                                  <span className="text-slate-400">Autônomo</span>
                                )}
                              </div>
                            </td>

                            <td className="py-2.5 px-3 text-right">
                              {isDone ? (
                                <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-100/70 px-2.5 py-0.5 rounded-full">
                                  Concluído ✓
                                </span>
                              ) : (
                                <span className="text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                                  Pendente
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* 4. Automated Pedagogical Diagnosis for Professora Simone */}
          <div className="p-4 sm:p-5 bg-linear-to-br from-amber-50/70 via-white to-orange-50/50 rounded-2xl border border-amber-200 space-y-3">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Parecer Diagnóstico da Professora Simone Rosa</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white/90 rounded-xl border border-amber-200/80">
                <strong className="text-emerald-800 block mb-1.5 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Pontos Fortes & Evidências Observadas:
                </strong>
                <ul className="list-disc list-inside space-y-1 text-slate-700 leading-relaxed">
                  {typeof diagnosis !== 'string' ? (
                    diagnosis.observations.map((obs, i) => <li key={i}>{obs}</li>)
                  ) : (
                    <li>{diagnosis}</li>
                  )}
                </ul>
              </div>

              <div className="p-3 bg-white/90 rounded-xl border border-amber-200/80">
                <strong className="text-amber-900 block mb-1.5 flex items-center gap-1">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                  Sugestões de Intervenção Pedagógica:
                </strong>
                <ul className="list-disc list-inside space-y-1 text-slate-700 leading-relaxed">
                  {typeof diagnosis !== 'string' ? (
                    diagnosis.interventions.map((intv, i) => <li key={i}>{intv}</li>)
                  ) : (
                    <li>Incentivar a leitura coletiva dos enunciados no quadro.</li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* Signature row for printing */}
          <div className="pt-6 border-t border-slate-200 grid grid-cols-2 gap-8 text-center text-xs">
            <div>
              <div className="font-serif italic text-sm text-slate-800 border-b border-slate-400 pb-1 max-w-[200px] mx-auto">
                Simone Rosa
              </div>
              <span className="font-bold text-slate-800 block mt-1">Professora Simone Rosa</span>
              <span className="text-[11px] text-slate-500">Regente · 3° ANO B Matutino</span>
            </div>

            <div>
              <div className="font-mono text-xs text-slate-700 border-b border-slate-400 pb-1 max-w-[200px] mx-auto">
                {new Date().toLocaleDateString('pt-BR')} · 3ª Aula
              </div>
              <span className="font-bold text-slate-800 block mt-1">Registro Pedagógico Oficial</span>
              <span className="text-[11px] text-slate-500">Habilidade EF03CO02</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
