import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Lock,
  LogOut,
  LogIn,
  Search,
  Filter,
  Download,
  Printer,
  FileSpreadsheet,
  FileText,
  BarChart3,
  PieChart,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  Calendar,
  GraduationCap,
  Hash,
  HelpCircle,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import {
  auth,
  googleProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
  AUTHORIZED_TEACHER_EMAIL
} from '../services/firebase';
import {
  CloudDatabaseService,
  CloudStudentResponse,
  CloudStudentProfile
} from '../services/cloudDb';
import { playClickSound } from '../utils/audio';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const TeacherDashboardModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Cloud Data
  const [responses, setResponses] = useState<CloudStudentResponse[]>([]);
  const [students, setStudents] = useState<CloudStudentProfile[]>([]);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'audit' | 'setup_guide'>('dashboard');

  // Filters
  const [studentFilter, setStudentFilter] = useState<string>('');
  const [classFilter, setClassFilter] = useState<string>('ALL');
  const [missionFilter, setMissionFilter] = useState<number>(0);
  const [dateFilter, setDateFilter] = useState<string>('');

  // Notification
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
      if (user && user.email?.toLowerCase() === AUTHORIZED_TEACHER_EMAIL.toLowerCase()) {
        loadData();
      }
    });
    return () => unsubscribe();
  }, []);

  const isAuthorized = useMemo(() => {
    if (!currentUser || !currentUser.email) return false;
    return currentUser.email.toLowerCase() === AUTHORIZED_TEACHER_EMAIL.toLowerCase();
  }, [currentUser]);

  const loadData = async () => {
    setIsLoadingData(true);
    try {
      const [fetchedResponses, fetchedStudents] = await Promise.all([
        CloudDatabaseService.fetchResponses(),
        CloudDatabaseService.fetchStudents(),
      ]);
      setResponses(fetchedResponses);
      setStudents(fetchedStudents);
    } catch (err) {
      console.error('Erro ao carregar dados do Cloud Firestore:', err);
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleGoogleLogin = async () => {
    playClickSound();
    setAuthLoading(true);
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: unknown) {
      console.error('Falha no login Google:', err);
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('popup-closed-by-user')) {
        setAuthError('Janela de login fechada antes da confirmação.');
      } else if (msg.includes('unauthorized-domain')) {
        setAuthError(
          'Domínio não autorizado no Firebase Console. Adicione o domínio atual em Authentication > Settings > Authorized domains.'
        );
      } else {
        setAuthError(`Erro no login: ${msg}`);
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleLogout = async () => {
    playClickSound();
    try {
      await signOut(auth);
      setResponses([]);
      setStudents([]);
    } catch (err) {
      console.error('Erro ao sair:', err);
    }
  };

  // Filtered responses
  const filteredResponses = useMemo(() => {
    return responses.filter((r) => {
      if (studentFilter.trim()) {
        const queryTerm = studentFilter.trim().toUpperCase();
        const matchName = r.studentName.toUpperCase().includes(queryTerm);
        const matchCode = r.studentCode.toUpperCase().includes(queryTerm);
        if (!matchName && !matchCode) return false;
      }
      if (classFilter !== 'ALL' && r.className !== classFilter) {
        return false;
      }
      if (missionFilter !== 0 && r.missionId !== missionFilter) {
        return false;
      }
      if (dateFilter && r.date !== dateFilter) {
        return false;
      }
      return true;
    });
  }, [responses, studentFilter, classFilter, missionFilter, dateFilter]);

  // Available classes for filter dropdown
  const availableClasses = useMemo(() => {
    const set = new Set<string>();
    responses.forEach((r) => r.className && set.add(r.className));
    if (set.size === 0) set.add('3° ANO B');
    return Array.from(set);
  }, [responses]);

  // Aggregate Metrics
  const metrics = useMemo(() => {
    const total = filteredResponses.length;
    const firstTryCount = filteredResponses.filter((r) => r.isFirstTry).length;
    const correctionCount = filteredResponses.filter((r) => r.isCorrectAfterCorrection).length;
    const wrongCount = filteredResponses.filter((r) => !r.isCorrect).length;
    const totalSeconds = filteredResponses.reduce((sum, r) => sum + (r.timeSpentSeconds || 0), 0);
    const avgSeconds = total > 0 ? Math.round(totalSeconds / total) : 0;
    const firstTryRate = total > 0 ? Math.round((firstTryCount / total) * 100) : 0;
    const correctionRate = total > 0 ? Math.round((correctionCount / total) * 100) : 0;

    // Operation breakdown
    const opStats = {
      '+': { name: 'Adição', count: 0, firstTry: 0, correction: 0 },
      '-': { name: 'Subtração', count: 0, firstTry: 0, correction: 0 },
      '*': { name: 'Multiplicação', count: 0, firstTry: 0, correction: 0 },
      '/': { name: 'Divisão', count: 0, firstTry: 0, correction: 0 },
    };

    filteredResponses.forEach((r) => {
      const op = r.operation as '+' | '-' | '*' | '/';
      if (opStats[op]) {
        opStats[op].count += 1;
        if (r.isFirstTry) opStats[op].firstTry += 1;
        if (r.isCorrectAfterCorrection) opStats[op].correction += 1;
      }
    });

    const uniqueStudents = new Set(filteredResponses.map((r) => r.studentCode)).size;

    return {
      total,
      firstTryCount,
      correctionCount,
      wrongCount,
      avgSeconds,
      firstTryRate,
      correctionRate,
      uniqueStudents,
      opStats,
    };
  }, [filteredResponses]);

  // CSV Export
  const handleExportCSV = () => {
    playClickSound();
    if (filteredResponses.length === 0) {
      alert('Nenhuma resposta para exportar com os filtros atuais.');
      return;
    }

    const headers = [
      'Código do Aluno',
      'Nome do Aluno',
      'Turma',
      'Escola',
      'ID da Questão',
      'Missão (Jogo)',
      'Habilidade BNCC',
      'Operação',
      'Contexto / Tema',
      'Alternativa Escolhida',
      'Resposta Correta',
      'Acertou?',
      'Acerto na 1ª Tentativa?',
      'Acerto Após Correção?',
      'Número de Tentativas',
      'Tempo de Resposta (segundos)',
      'Tempo Formatado',
      'Data da Resposta',
      'Horário Completo',
    ];

    const rows = filteredResponses.map((r) => [
      `"${r.studentCode}"`,
      `"${r.studentName}"`,
      `"${r.className}"`,
      `"${r.schoolName}"`,
      `"${r.problemId}"`,
      `"Missão ${r.missionId}"`,
      `"${r.skill}"`,
      `"${r.operation}"`,
      `"${r.themeContext}"`,
      r.chosenAnswer,
      r.correctAnswer,
      r.isCorrect ? 'SIM' : 'NÃO',
      r.isFirstTry ? 'SIM' : 'NÃO',
      r.isCorrectAfterCorrection ? 'SIM' : 'NÃO',
      r.attemptsCount,
      r.timeSpentSeconds,
      `"${r.timeSpentFormatted}"`,
      `"${r.date}"`,
      `"${r.answeredAt}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map((row) => row.join(';'))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `relatorio_turma_firestore_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setFeedbackNotice('Planilha CSV gerada com sucesso para download.');
    setTimeout(() => setFeedbackNotice(null), 4000);
  };

  // PDF Export via native print preview
  const handlePrintPDF = () => {
    playClickSound();
    window.print();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-6xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[96vh]">
        {/* Top Navbar */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-base font-display tracking-tight text-white">
                  Área do Professor · Cloud Firestore
                </h2>
                <span className="text-[10px] font-mono bg-indigo-950 text-indigo-300 border border-indigo-700/60 px-2 py-0.5 rounded-full font-bold">
                  Acesso Restrito
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Escola Municipal Educandário Nossa Senhora Aparecida · Turma 3° ANO B
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {currentUser && isAuthorized && (
              <div className="hidden sm:flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700 text-xs text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono text-[11px] truncate max-w-[180px]">
                  {currentUser.email}
                </span>
                <button
                  type="button"
                  onClick={handleGoogleLogout}
                  className="text-slate-400 hover:text-rose-400 ml-1 p-0.5 rounded transition-colors"
                  title="Sair da conta Google"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Fechar painel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* FEEDBACK NOTICE */}
        {feedbackNotice && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-2 text-xs font-bold text-emerald-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{feedbackNotice}</span>
          </div>
        )}

        {/* AUTH GATE */}
        {authLoading ? (
          <div className="p-12 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
            <p className="text-sm font-semibold text-slate-600">
              Verificando credenciais de acesso seguro do Google...
            </p>
          </div>
        ) : !currentUser ? (
          /* NOT LOGGED IN */
          <div className="p-8 sm:p-14 text-center max-w-md mx-auto space-y-6 my-auto">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 mx-auto flex items-center justify-center text-3xl shadow-sm">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black font-display text-slate-900">
                Autenticação do Professor
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Esta área contém dados pedagógicos protegidos pelo Cloud Firestore e regras de segurança que impedem o acesso dos alunos.
              </p>
              <div className="bg-amber-50 text-amber-900 border border-amber-200 p-2.5 rounded-xl text-xs font-medium text-left mt-2">
                <strong>Conta autorizada pelo sistema:</strong>
                <div className="font-mono font-bold text-amber-950 mt-0.5">
                  {AUTHORIZED_TEACHER_EMAIL}
                </div>
              </div>
            </div>

            {authError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs text-left">
                {authError}
              </div>
            )}

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Entrar com a Conta Google</span>
            </button>
          </div>
        ) : !isAuthorized ? (
          /* LOGGED IN WITH WRONG EMAIL */
          <div className="p-8 sm:p-14 text-center max-w-md mx-auto space-y-5 my-auto">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 mx-auto flex items-center justify-center text-3xl shadow-sm">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black font-display text-slate-900">
                Acesso Não Autorizado
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Você está conectado com o email <strong className="text-slate-900">{currentUser.email}</strong>, mas este painel é restrito exclusivamente ao endereço configurado pelo administrador:
              </p>
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl font-mono font-bold text-xs text-rose-950">
                {AUTHORIZED_TEACHER_EMAIL}
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogout}
              className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow transition-colors flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair e Trocar de Conta Google</span>
            </button>
          </div>
        ) : (
          /* AUTHORIZED DASHBOARD VIEW */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Navigation Tabs and Quick Actions */}
            <div className="bg-slate-100 border-b border-slate-200 px-5 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-colors flex items-center gap-1.5 ${
                    activeTab === 'dashboard'
                      ? 'bg-white text-indigo-900 shadow-xs border border-slate-300'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Visão Geral & Gráficos</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('audit')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-colors flex items-center gap-1.5 ${
                    activeTab === 'audit'
                      ? 'bg-white text-indigo-900 shadow-xs border border-slate-300'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Tabela Detalhada ({filteredResponses.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('setup_guide')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-colors flex items-center gap-1.5 ${
                    activeTab === 'setup_guide'
                      ? 'bg-white text-indigo-900 shadow-xs border border-slate-300'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Orientações & Regras</span>
                </button>
              </div>

              {/* Export actions */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={loadData}
                  disabled={isLoadingData}
                  className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors flex items-center gap-1 font-semibold"
                  title="Atualizar dados do Cloud Firestore"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingData ? 'animate-spin text-indigo-600' : ''}`} />
                  <span className="hidden sm:inline">Atualizar</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors flex items-center gap-1.5 shadow-xs"
                  title="Exportar dados para Excel e Google Planilhas"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Exportar CSV</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrintPDF}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-colors flex items-center gap-1.5 shadow-xs"
                  title="Imprimir ou Salvar em PDF"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Exportar PDF</span>
                </button>
              </div>
            </div>

            {/* FILTERS BAR */}
            <div className="no-print bg-white border-b border-slate-200 px-5 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Search student */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={studentFilter}
                    onChange={(e) => setStudentFilter(e.target.value)}
                    placeholder="Filtrar por aluno ou código..."
                    className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 bg-white font-medium text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 w-44 sm:w-56"
                  />
                </div>

                {/* Filter Class */}
                <div className="flex items-center gap-1">
                  <span className="text-slate-500 font-semibold">Turma:</span>
                  <select
                    value={classFilter}
                    onChange={(e) => setClassFilter(e.target.value)}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-medium text-xs text-slate-800 focus:outline-none"
                  >
                    <option value="ALL">Todas as Turmas</option>
                    {availableClasses.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Filter Game / Mission */}
                <div className="flex items-center gap-1">
                  <span className="text-slate-500 font-semibold">Jogo:</span>
                  <select
                    value={missionFilter}
                    onChange={(e) => setMissionFilter(Number(e.target.value))}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-medium text-xs text-slate-800 focus:outline-none"
                  >
                    <option value={0}>Todas as 4 Missões</option>
                    <option value={1}>Missão 1: Adição (+)</option>
                    <option value={2}>Missão 2: Subtração (-)</option>
                    <option value={3}>Missão 3: Multiplicação (×)</option>
                    <option value={4}>Missão 4: Divisão (÷)</option>
                  </select>
                </div>

                {/* Filter Date */}
                <div className="flex items-center gap-1">
                  <span className="text-slate-500 font-semibold">Data:</span>
                  <input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="px-2 py-1 rounded-lg border border-slate-300 bg-white font-medium text-xs text-slate-800 focus:outline-none"
                  />
                </div>
              </div>

              {(studentFilter || classFilter !== 'ALL' || missionFilter !== 0 || dateFilter) && (
                <button
                  type="button"
                  onClick={() => {
                    setStudentFilter('');
                    setClassFilter('ALL');
                    setMissionFilter(0);
                    setDateFilter('');
                  }}
                  className="text-xs text-rose-600 hover:text-rose-800 font-bold flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Limpar Filtros</span>
                </button>
              )}
            </div>

            {/* TAB CONTENTS */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {activeTab === 'dashboard' && (
                <>
                  {/* KPI STAT CARDS */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
                      <span className="text-xs font-semibold text-slate-500 block">
                        Total de Respostas
                      </span>
                      <div className="text-2xl font-black text-slate-900 font-mono mt-1">
                        {metrics.total}
                      </div>
                      <span className="text-[11px] text-slate-500 mt-0.5 block">
                        {metrics.uniqueStudents} alunos distintos
                      </span>
                    </div>

                    <div className="p-3.5 bg-emerald-50/60 border border-emerald-200 rounded-2xl">
                      <span className="text-xs font-semibold text-emerald-800 block">
                        Acerto na 1ª Tentativa
                      </span>
                      <div className="text-2xl font-black text-emerald-700 font-mono mt-1">
                        {metrics.firstTryCount}{' '}
                        <span className="text-xs font-normal">({metrics.firstTryRate}%)</span>
                      </div>
                      <span className="text-[11px] text-emerald-700 mt-0.5 block">
                        Precisão imediata
                      </span>
                    </div>

                    <div className="p-3.5 bg-blue-50/60 border border-blue-200 rounded-2xl">
                      <span className="text-xs font-semibold text-blue-800 block">
                        Acerto Após Correção
                      </span>
                      <div className="text-2xl font-black text-blue-700 font-mono mt-1">
                        {metrics.correctionCount}{' '}
                        <span className="text-xs font-normal">({metrics.correctionRate}%)</span>
                      </div>
                      <span className="text-[11px] text-blue-700 mt-0.5 block">
                        Resiliência pedagógica
                      </span>
                    </div>

                    <div className="p-3.5 bg-amber-50/60 border border-amber-200 rounded-2xl">
                      <span className="text-xs font-semibold text-amber-800 block">
                        Tempo Médio / Desafio
                      </span>
                      <div className="text-2xl font-black text-amber-900 font-mono mt-1">
                        {metrics.avgSeconds < 60
                          ? `${metrics.avgSeconds}s`
                          : `${Math.floor(metrics.avgSeconds / 60)}m ${metrics.avgSeconds % 60}s`}
                      </div>
                      <span className="text-[11px] text-amber-800 mt-0.5 block">
                        Cronômetro ativo
                      </span>
                    </div>

                    <div className="p-3.5 bg-indigo-50/60 border border-indigo-200 rounded-2xl">
                      <span className="text-xs font-semibold text-indigo-800 block">
                        Habilidade Central
                      </span>
                      <div className="text-sm font-black text-indigo-950 font-mono mt-1">
                        EF03CO02
                      </div>
                      <span className="text-[11px] text-indigo-700 mt-0.5 block">
                        4 operações básicas
                      </span>
                    </div>
                  </div>

                  {/* VISUAL CHARTS SECTION */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {/* CHART 1: DESEMPENHO POR OPERAÇÃO */}
                    <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <div className="flex items-center gap-2">
                          <BarChart3 className="w-4 h-4 text-indigo-600" />
                          <h4 className="font-bold text-sm text-slate-900 font-display">
                            Desempenho por Operação Matemática
                          </h4>
                        </div>
                        <span className="text-[11px] text-slate-500 font-mono">
                          EF03MA05 - EF03MA08
                        </span>
                      </div>

                      <div className="space-y-3 text-xs">
                        {Object.entries(metrics.opStats).map(([symbol, data]) => {
                          const totalOp = data.count;
                          const firstPct = totalOp > 0 ? Math.round((data.firstTry / totalOp) * 100) : 0;
                          const corrPct = totalOp > 0 ? Math.round((data.correction / totalOp) * 100) : 0;

                          return (
                            <div key={symbol} className="space-y-1">
                              <div className="flex justify-between font-semibold text-slate-700">
                                <span className="flex items-center gap-1.5">
                                  <span className="font-mono text-sm">{symbol}</span>
                                  <span>{data.name}</span>
                                  <span className="text-slate-400 font-normal">({totalOp} resp.)</span>
                                </span>
                                <span className="font-mono text-emerald-700 font-bold">
                                  {firstPct}% 1ª tentativa
                                </span>
                              </div>
                              <div className="h-4 bg-slate-100 rounded-full overflow-hidden flex">
                                <div
                                  className="h-full bg-emerald-500 transition-all"
                                  style={{ width: `${firstPct}%` }}
                                  title={`1ª Tentativa: ${data.firstTry} (${firstPct}%)`}
                                />
                                <div
                                  className="h-full bg-blue-400 transition-all"
                                  style={{ width: `${corrPct}%` }}
                                  title={`Após Correção: ${data.correction} (${corrPct}%)`}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="flex items-center gap-4 pt-2 text-[11px] text-slate-500 border-t border-slate-100">
                        <span className="flex items-center gap-1">
                          <span className="w-3 h-3 bg-emerald-500 rounded-sm" /> 1ª Tentativa
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="w-3 h-3 bg-blue-400 rounded-sm" /> Após Correção
                        </span>
                      </div>
                    </div>

                    {/* CHART 2: DISTRIBUIÇÃO DAS RESPOSTAS (DONUT SVG) */}
                    <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-4 flex flex-col justify-between">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <div className="flex items-center gap-2">
                          <PieChart className="w-4 h-4 text-emerald-600" />
                          <h4 className="font-bold text-sm text-slate-900 font-display">
                            Distribuição: 1ª Tentativa vs Após Correção
                          </h4>
                        </div>
                        <span className="text-[11px] text-slate-500">Proporção Geral</span>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center justify-around gap-4 py-2">
                        {/* SVG Donut */}
                        <div className="relative w-36 h-36 flex items-center justify-center">
                          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                            {/* Background circle */}
                            <path
                              className="text-slate-100"
                              strokeWidth="4"
                              stroke="currentColor"
                              fill="none"
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            {/* First try stroke */}
                            <path
                              className="text-emerald-500"
                              strokeDasharray={`${metrics.firstTryRate}, 100`}
                              strokeWidth="4"
                              stroke="currentColor"
                              fill="none"
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            {/* Correction stroke */}
                            <path
                              className="text-blue-500"
                              strokeDasharray={`${metrics.correctionRate}, 100`}
                              strokeDashoffset={`-${metrics.firstTryRate}`}
                              strokeWidth="4"
                              stroke="currentColor"
                              fill="none"
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                          </svg>
                          <div className="absolute text-center">
                            <span className="text-xl font-black font-mono text-slate-900 block">
                              {metrics.total}
                            </span>
                            <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                              Respostas
                            </span>
                          </div>
                        </div>

                        {/* Legend breakdown */}
                        <div className="space-y-3 text-xs w-full sm:w-auto">
                          <div className="flex items-center justify-between gap-4 p-2 bg-emerald-50/70 border border-emerald-200 rounded-xl">
                            <span className="font-semibold text-emerald-950 flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                              Acertos de 1ª Tentativa:
                            </span>
                            <span className="font-mono font-bold text-emerald-900">
                              {metrics.firstTryCount} ({metrics.firstTryRate}%)
                            </span>
                          </div>

                          <div className="flex items-center justify-between gap-4 p-2 bg-blue-50/70 border border-blue-200 rounded-xl">
                            <span className="font-semibold text-blue-950 flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                              Acertos Após Correção:
                            </span>
                            <span className="font-mono font-bold text-blue-900">
                              {metrics.correctionCount} ({metrics.correctionRate}%)
                            </span>
                          </div>

                          <div className="flex items-center justify-between gap-4 p-2 bg-slate-50 border border-slate-200 rounded-xl">
                            <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-slate-500" />
                              Tempo Médio:
                            </span>
                            <span className="font-mono font-bold text-slate-800">
                              {metrics.avgSeconds} segundos
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-500 border-t border-slate-100 pt-2 text-center sm:text-left">
                        O sistema diferencia automaticamente quem resolveu de primeira ou precisou de ajustes usando o Material Dourado ou Lupa.
                      </p>
                    </div>
                  </div>
                </>
              )}

              {/* AUDIT TABLE VIEW */}
              {(activeTab === 'audit' || activeTab === 'dashboard') && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-sm text-slate-900 font-display flex items-center gap-2">
                      <FileText className="w-4 h-4 text-indigo-600" />
                      <span>Registros Individuais de Respostas</span>
                      <span className="text-xs font-normal text-slate-400">
                        ({filteredResponses.length} de {responses.length} no banco)
                      </span>
                    </h4>
                  </div>

                  <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
                    <div className="overflow-x-auto max-h-[460px]">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[10px] sticky top-0 border-b border-slate-200 z-10">
                          <tr>
                            <th className="py-2.5 px-3">Aluno & Código</th>
                            <th className="py-2.5 px-3">Turma</th>
                            <th className="py-2.5 px-3">Missão / Questão</th>
                            <th className="py-2.5 px-3">Habilidade BNCC</th>
                            <th className="py-2.5 px-3">Alternativa / Correta</th>
                            <th className="py-2.5 px-3">Tipo de Acerto</th>
                            <th className="py-2.5 px-3">Tentativas</th>
                            <th className="py-2.5 px-3">Tempo</th>
                            <th className="py-2.5 px-3">Data / Horário</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredResponses.length === 0 ? (
                            <tr>
                              <td colSpan={9} className="py-8 text-center text-slate-400 italic">
                                Nenhum registro encontrado com os filtros selecionados.
                              </td>
                            </tr>
                          ) : (
                            filteredResponses.map((r) => (
                              <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                                <td className="py-2.5 px-3">
                                  <strong className="text-slate-900 font-bold uppercase tracking-wide block">
                                    {r.studentName}
                                  </strong>
                                  <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                                    {r.studentCode}
                                  </span>
                                </td>

                                <td className="py-2.5 px-3 text-slate-700 font-semibold">
                                  {r.className}
                                </td>

                                <td className="py-2.5 px-3">
                                  <span className="font-semibold text-slate-800 block">
                                    Missão {r.missionId} ({r.operation})
                                  </span>
                                  <span className="text-[10px] text-slate-500 truncate max-w-[140px] block">
                                    {r.themeContext}
                                  </span>
                                </td>

                                <td className="py-2.5 px-3 font-mono text-[11px] text-indigo-700 font-bold">
                                  {r.skill}
                                </td>

                                <td className="py-2.5 px-3 font-mono">
                                  <span className="font-bold text-slate-900">
                                    {r.chosenAnswer}
                                  </span>{' '}
                                  <span className="text-slate-400">/ correta: {r.correctAnswer}</span>
                                </td>

                                <td className="py-2.5 px-3">
                                  {r.isFirstTry ? (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                      1ª Tentativa
                                    </span>
                                  ) : r.isCorrectAfterCorrection ? (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded-full border border-blue-300">
                                      <RotateCcw className="w-3 h-3 text-blue-600" />
                                      Após Correção
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded-full border border-rose-300">
                                      <AlertTriangle className="w-3 h-3 text-rose-600" />
                                      Incorreto
                                    </span>
                                  )}
                                </td>

                                <td className="py-2.5 px-3 font-mono text-center font-bold text-slate-800">
                                  {r.attemptsCount}
                                </td>

                                <td className="py-2.5 px-3 font-mono text-slate-700">
                                  {r.timeSpentFormatted}
                                </td>

                                <td className="py-2.5 px-3 text-slate-500 text-[11px]">
                                  {r.answeredAt}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* SETUP AND ORIENTATION GUIDE TAB */}
              {activeTab === 'setup_guide' && (
                <div className="space-y-5 max-w-4xl mx-auto py-2">
                  <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-5 space-y-3">
                    <div className="flex items-center gap-2 text-indigo-950 font-extrabold text-base font-display">
                      <Sparkles className="w-5 h-5 text-indigo-600" />
                      <span>Guia de Configurações do Firebase & Segurança</span>
                    </div>
                    <p className="text-xs text-indigo-900 leading-relaxed">
                      Sua aplicação já está vinculada ao Cloud Firestore no projeto <strong>gen-lang-client-0828722333</strong>. Para garantir o pleno funcionamento do login Google e das permissões, siga as orientações abaixo:
                    </p>
                  </div>

                  {/* STEP 1 */}
                  <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-2">
                    <h5 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-mono text-xs flex items-center justify-center">
                        1
                      </span>
                      <span>Ativação do Provedor Google no Firebase Console</span>
                    </h5>
                    <p className="text-xs text-slate-600 leading-relaxed pl-8">
                      Acesse o <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" className="text-indigo-600 font-bold underline inline-flex items-center gap-0.5">Firebase Console <ExternalLink className="w-3 h-3" /></a>, selecione o projeto <strong>gen-lang-client-0828722333</strong>, vá em <strong>Authentication &gt; Sign-in method</strong>, clique em <strong>Google</strong> e marque como <strong>Ativado</strong>. Defina o email de suporte como <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">{AUTHORIZED_TEACHER_EMAIL}</code>.
                    </p>
                  </div>

                  {/* STEP 2 */}
                  <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-2">
                    <h5 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-mono text-xs flex items-center justify-center">
                        2
                      </span>
                      <span>Domínios Autorizados para o Login Google (OAuth)</span>
                    </h5>
                    <p className="text-xs text-slate-600 leading-relaxed pl-8">
                      Em <strong>Authentication &gt; Settings &gt; Authorized domains</strong>, adicione o domínio onde a aplicação está rodando:
                      <br />
                      <code className="block my-1.5 p-2 bg-slate-100 rounded-lg text-slate-800 font-mono text-[11px] select-all">
                        ais-dev-i5wi3aprscizukyfwcpkao-196633568329.us-west2.run.app
                        <br />
                        ais-pre-i5wi3aprscizukyfwcpkao-196633568329.us-west2.run.app
                      </code>
                    </p>
                  </div>

                  {/* STEP 3 */}
                  <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-2">
                    <h5 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-mono text-xs flex items-center justify-center">
                        3
                      </span>
                      <span>Regras de Segurança Implantadas no Cloud Firestore</span>
                    </h5>
                    <div className="text-xs text-slate-600 leading-relaxed pl-8 space-y-1.5">
                      <p>
                        As regras de segurança (<strong>firestore.rules</strong>) já foram publicadas diretamente no Cloud Firestore e garantem:
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-slate-700 font-medium">
                        <li><strong>Privacidade do Aluno:</strong> Alunos só conseguem gravar a sua própria resposta determinística por ID (<code className="text-[10px] bg-slate-100 px-1 rounded">codigo_problemaId</code>) e são <strong>bloqueados de listar respostas de colegas</strong>.</li>
                        <li><strong>Exclusividade do Professor:</strong> Apenas a conta autenticada com email verificado <strong>{AUTHORIZED_TEACHER_EMAIL}</strong> possui permissão de leitura completa (listagem e consultas) e auditoria pedagógica.</li>
                        <li><strong>Proteção Antifraude:</strong> Qualquer tentativa de acessar ou alterar registros de outros alunos por chamadas de API externas é rejeitada automaticamente pelo motor de segurança do Firestore.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
