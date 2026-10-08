import React, { useState } from 'react';
import {
  StudentDatabaseRecord,
  ClassDatabaseService,
} from '../services/db';
import { MISSIONS_DATA } from '../data/missionsData';
import {
  X,
  Database,
  Download,
  FileSpreadsheet,
  Printer,
  Trash2,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Search,
  RefreshCw,
  Plus,
  Clock,
  Timer
} from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectStudentToPlay: (studentName: string) => void;
  onOpenNewStudentModal: () => void;
}

export const ClassDatabaseModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSelectStudentToPlay,
  onOpenNewStudentModal,
}) => {
  const [selectedStudentFilter, setSelectedStudentFilter] = useState<string>('all');
  const [selectedOpFilter, setSelectedOpFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [studentsList, setStudentsList] = useState<StudentDatabaseRecord[]>(() =>
    ClassDatabaseService.getAllStudents()
  );
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const refreshList = () => {
    setStudentsList(ClassDatabaseService.getAllStudents());
  };

  const handleDownloadCSV = () => {
    playClickSound();
    const csvContent = ClassDatabaseService.exportToCSV();
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `turma_3B_banco_de_respostas_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setExportNotice('Planilha CSV gerada com sucesso! Você pode abri-la no Microsoft Excel ou Google Planilhas.');
    setTimeout(() => setExportNotice(null), 4000);
  };

  const handleDownloadJSON = () => {
    playClickSound();
    const jsonContent = ClassDatabaseService.exportToJSON();
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `banco_de_dados_turma_3B_backup.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setExportNotice('Arquivo de backup JSON gerado e salvo com sucesso.');
    setTimeout(() => setExportNotice(null), 4000);
  };

  const handleDelete = (name: string) => {
    if (window.confirm(`Deseja realmente remover os dados do aluno "${name}" do banco de dados?`)) {
      ClassDatabaseService.deleteStudent(name);
      refreshList();
    }
  };

  // Filter students
  const filteredStudents = studentsList.filter((s) => {
    const matchesSearch = s.studentName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStudent = selectedStudentFilter === 'all' || s.studentName === selectedStudentFilter;
    return matchesSearch && matchesStudent;
  });

  // Calculate totals across database
  const totalStudentsCount = studentsList.length;
  const totalResponsesStored = studentsList.reduce(
    (acc, s) => acc + Object.keys(s.responses).length,
    0
  );
  const averageAccuracy =
    studentsList.length > 0
      ? Math.round(
          studentsList.reduce((acc, s) => acc + s.accuracyRate, 0) / studentsList.length
        )
      : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-5xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[94vh]">
        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-slate-950 text-white flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-xs">
              <Database className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base font-display">
                  Banco de Dados de Respostas · Turma 3° B
                </h3>
                <span className="text-[10px] font-mono bg-indigo-950 text-indigo-300 border border-indigo-700/60 px-2 py-0.5 rounded">
                  Professora Simone Rosa
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 font-medium">
                Escola Municipal Educandário Nossa Senhora Aparecida · Turno Matutino
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleDownloadCSV}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
              title="Baixar planilha compatível com Excel e Google Sheets"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Exportar Excel (CSV)</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadJSON}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
              title="Baixar backup completo em JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Backup JSON</span>
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Imprimir</span>
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

        {/* Notice feedback if exported */}
        {exportNotice && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-2 text-xs font-bold text-emerald-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{exportNotice}</span>
          </div>
        )}

        {/* Body content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-slate-800">
          {/* 1. Database Overview KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Alunos Registrados
              </span>
              <div className="text-2xl font-black text-slate-900 font-mono mt-0.5">
                {totalStudentsCount}
              </div>
              <span className="text-[11px] text-slate-500">Turma 3° ANO B</span>
            </div>

            <div className="p-3 bg-indigo-50/60 border border-indigo-200 rounded-2xl">
              <span className="text-[11px] font-semibold text-indigo-800 uppercase tracking-wider block">
                Total de Respostas
              </span>
              <div className="text-2xl font-black text-indigo-900 font-mono mt-0.5">
                {totalResponsesStored}
              </div>
              <span className="text-[11px] text-indigo-700">Registros no banco</span>
            </div>

            <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-2xl">
              <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider block">
                Precisão Média
              </span>
              <div className="text-2xl font-black text-emerald-700 font-mono mt-0.5">
                {averageAccuracy}%
              </div>
              <span className="text-[11px] text-emerald-800">Acertos de 1ª tentativa</span>
            </div>

            <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-2xl flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider block">
                  Cadastrar Aluno
                </span>
                <span className="text-xs text-amber-900 font-medium block mt-0.5">
                  Iniciar novo estudante
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenNewStudentModal();
                }}
                className="mt-2 text-xs font-bold px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg flex items-center justify-center gap-1 shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Novo Aluno</span>
              </button>
            </div>
          </div>

          {/* 2. Filters Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar pelo primeiro nome..."
                  className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 bg-white font-medium text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 w-44 sm:w-56"
                />
              </div>

              <select
                value={selectedOpFilter}
                onChange={(e) => setSelectedOpFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-medium text-xs text-slate-700 focus:outline-none"
              >
                <option value="all">Todas as Operações (➕ ➖ ✖️ ➗)</option>
                <option value="+">Apenas Adição (+)</option>
                <option value="-">Apenas Subtração (-)</option>
                <option value="*">Apenas Multiplicação (×)</option>
                <option value="/">Apenas Divisão (÷)</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={refreshList}
                className="px-2.5 py-1.5 rounded-lg text-slate-600 hover:bg-slate-200 transition-colors flex items-center gap-1 font-semibold"
                title="Atualizar lista"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Atualizar</span>
              </button>
            </div>
          </div>

          {/* 3. Table of Students and Performance */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-900 font-display flex items-center gap-2">
              <span>Registros de Estudantes no Banco</span>
              <span className="text-xs font-normal text-slate-500">
                ({filteredStudents.length} encontrados)
              </span>
            </h4>

            <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100/80 text-slate-700 border-b border-slate-200 font-bold">
                      <th className="py-2.5 px-3">Nome do Aluno</th>
                      <th className="py-2.5 px-3">Desafios Concluídos</th>
                      <th className="py-2.5 px-3">Precisão de 1ª</th>
                      <th className="py-2.5 px-3">Última Atividade</th>
                      <th className="py-2.5 px-3 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredStudents.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-slate-400 italic">
                          Nenhum estudante encontrado com os filtros atuais.
                        </td>
                      </tr>
                    ) : (
                      filteredStudents.map((std) => (
                        <tr key={std.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-2.5 px-3">
                            <strong className="text-slate-900 font-display text-sm block">
                              {std.studentName}
                            </strong>
                            <span className="text-[11px] text-slate-500">
                              Turma 3° ANO B · Matutino
                            </span>
                          </td>

                          <td className="py-2.5 px-3 font-mono">
                            <span className="font-bold text-slate-800">
                              {std.completedProblemsCount}
                            </span>{' '}
                            <span className="text-slate-400">/ 12</span>
                            <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1">
                              <div
                                className="h-full bg-emerald-500 rounded-full"
                                style={{
                                  width: `${(std.completedProblemsCount / 12) * 100}%`,
                                }}
                              />
                            </div>
                          </td>

                          <td className="py-2.5 px-3 font-mono font-bold">
                            <span
                              className={
                                std.accuracyRate >= 80
                                  ? 'text-emerald-700'
                                  : std.accuracyRate >= 60
                                  ? 'text-amber-700'
                                  : 'text-rose-600'
                              }
                            >
                              {std.accuracyRate}%
                            </span>
                          </td>

                          <td className="py-2.5 px-3 text-slate-500 text-[11px]">
                            {std.updatedAt}
                          </td>

                          <td className="py-2.5 px-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  onSelectStudentToPlay(std.studentName);
                                  onClose();
                                }}
                                className="px-2.5 py-1 rounded-md bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-[11px] transition-colors flex items-center gap-1"
                                title="Carregar este aluno na tela do jogo"
                              >
                                <UserCheck className="w-3 h-3 text-amber-700" />
                                <span>Carregar</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDelete(std.studentName)}
                                className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                title="Excluir aluno do banco"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* 4. Complete Audit of Responses by Problem */}
          <div className="space-y-3 pt-2">
            <h4 className="text-sm font-bold text-slate-900 font-display flex items-center justify-between">
              <span>Respostas Gravadas por Desafio no Banco de Dados</span>
              <span className="text-xs text-slate-500 font-normal">
                Verificação da interpretação e cálculo
              </span>
            </h4>

            <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100/80 text-slate-700 border-b border-slate-200 font-bold">
                      <th className="py-2.5 px-3">Aluno</th>
                      <th className="py-2.5 px-3">Desafio / Tema</th>
                      <th className="py-2.5 px-3">Operação</th>
                      <th className="py-2.5 px-3">Interpretação (Passo 2)</th>
                      <th className="py-2.5 px-3">Cálculo (Passo 3)</th>
                      <th className="py-2.5 px-3">Tempo</th>
                      <th className="py-2.5 px-3">Pistas Usadas</th>
                      <th className="py-2.5 px-3 text-right">Data/Hora</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredStudents.flatMap((std) =>
                      Object.values(std.responses)
                        .filter((resp) => selectedOpFilter === 'all' || resp.operation === selectedOpFilter)
                        .map((resp) => {
                          const prob = MISSIONS_DATA.flatMap((m) => m.problems).find(
                            (p) => p.id === resp.problemId
                          );

                          return (
                            <tr key={`${std.id}_${resp.problemId}`} className="hover:bg-slate-50/70">
                              <td className="py-2.5 px-3 font-bold text-slate-900">
                                {std.studentName}
                              </td>

                              <td className="py-2.5 px-3">
                                <span className="font-semibold text-slate-800">
                                  {resp.themeContext || prob?.themeContext || resp.problemId}
                                </span>
                                <span className="text-[10px] text-slate-400 block font-mono">
                                  Missão {resp.missionId}
                                </span>
                              </td>

                              <td className="py-2.5 px-3">
                                <span
                                  className={`px-2 py-0.5 rounded font-mono font-bold text-xs ${
                                    resp.operation === '+'
                                      ? 'bg-emerald-100 text-emerald-900'
                                      : resp.operation === '-'
                                      ? 'bg-rose-100 text-rose-900'
                                      : resp.operation === '*'
                                      ? 'bg-amber-100 text-amber-900'
                                      : 'bg-indigo-100 text-indigo-900'
                                  }`}
                                >
                                  {resp.operation === '*' ? '×' : resp.operation === '/' ? '÷' : resp.operation}
                                </span>
                              </td>

                              <td className="py-2.5 px-3">
                                {resp.operationFirstTrySuccess ? (
                                  <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                    1ª Tentativa
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-rose-700 font-semibold bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                                    <AlertTriangle className="w-3 h-3 text-rose-600" />
                                    {resp.operationAttempts} tentativas (errou: {resp.operationWrongPicks.join(', ')})
                                  </span>
                                )}
                              </td>

                              <td className="py-2.5 px-3">
                                {resp.calculationFirstTrySuccess ? (
                                  <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                    Cálculo Exato
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                                    <AlertTriangle className="w-3 h-3 text-amber-600" />
                                    {resp.calculationAttempts} tentativas
                                  </span>
                                )}
                              </td>

                              <td className="py-2.5 px-3 font-mono text-[11px] font-semibold text-slate-700">
                                <span className="inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                  <Clock className="w-3 h-3 text-amber-600" />
                                  <span>{resp.timeSpentFormatted || `${resp.timeSpentSeconds || 0}s`}</span>
                                </span>
                              </td>

                              <td className="py-2.5 px-3 text-[11px] text-slate-500">
                                <div className="flex items-center gap-1">
                                  {resp.usedMasterClue && (
                                    <span
                                      className="p-1 rounded bg-amber-100 text-amber-800 border border-amber-200"
                                      title="Usou Dica de Mestre"
                                    >
                                      <Lightbulb className="w-3 h-3" />
                                    </span>
                                  )}
                                  {resp.usedMagnifier && (
                                    <span
                                      className="p-1 rounded bg-slate-100 text-slate-700 border border-slate-200"
                                      title="Usou Lupa de Pistas"
                                    >
                                      <Search className="w-3 h-3" />
                                    </span>
                                  )}
                                  {!resp.usedMasterClue && !resp.usedMagnifier && (
                                    <span className="text-slate-400">Sem ajuda</span>
                                  )}
                                </div>
                              </td>

                              <td className="py-2.5 px-3 text-right text-slate-400 font-mono text-[11px]">
                                {resp.answeredAt}
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
        </div>
      </div>
    </div>
  );
};
