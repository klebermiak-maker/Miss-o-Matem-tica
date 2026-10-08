import { OperationType, ProblemAttemptRecord } from '../types/mathGame';

export interface StudentProblemResponse {
  problemId: string;
  missionId: number;
  operation: OperationType;
  themeContext: string;
  correctAnswer: number;
  chosenAnswer?: number;
  isCorrect: boolean;
  operationAttempts: number;
  operationFirstTrySuccess: boolean;
  operationWrongPicks: OperationType[];
  calculationAttempts: number;
  calculationFirstTrySuccess: boolean;
  calculationWrongAnswers: number[];
  usedMasterClue: boolean;
  usedMagnifier: boolean;
  usedManipulatives: boolean;
  answeredAt: string;
  timeSpentSeconds?: number;
  timeSpentFormatted?: string;
}

export interface StudentDatabaseRecord {
  id: string;
  studentName: string;
  className: string;
  teacherName: string;
  schoolName: string;
  createdAt: string;
  updatedAt: string;
  completedProblemsCount: number;
  starsEarned: number;
  accuracyRate: number; // percentage
  totalTimeSeconds?: number;
  responses: Record<string, StudentProblemResponse>;
}

const DB_STORAGE_KEY = 'missao_matematica_database_v2';
const SCHOOL_OFFICIAL_NAME = 'Escola Municipal Educandário Nossa Senhora Aparecida';

// Seed demo students with first names for Professor Simone Rosa
const DEFAULT_SAMPLE_STUDENTS: StudentDatabaseRecord[] = [
  {
    id: 'std_lucas_1',
    studentName: 'Lucas',
    className: '3° ANO B',
    teacherName: 'Simone Rosa',
    schoolName: SCHOOL_OFFICIAL_NAME,
    createdAt: '08/10/2026, 08:15:20',
    updatedAt: '08/10/2026, 08:45:10',
    completedProblemsCount: 12,
    starsEarned: 12,
    accuracyRate: 92,
    totalTimeSeconds: 460,
    responses: {
      m1_p1: {
        problemId: 'm1_p1',
        missionId: 1,
        operation: '+',
        themeContext: 'Barraca das Frutas Vermelhas',
        correctAnswer: 39,
        chosenAnswer: 39,
        isCorrect: true,
        operationAttempts: 1,
        operationFirstTrySuccess: true,
        operationWrongPicks: [],
        calculationAttempts: 1,
        calculationFirstTrySuccess: true,
        calculationWrongAnswers: [],
        usedMasterClue: false,
        usedMagnifier: true,
        usedManipulatives: false,
        answeredAt: '08:20',
        timeSpentSeconds: 32,
        timeSpentFormatted: '32s',
      },
      m2_p2: {
        problemId: 'm2_p2',
        missionId: 2,
        operation: '-',
        themeContext: 'Coleção de Figurinhas da Turma',
        correctAnswer: 24,
        chosenAnswer: 24,
        isCorrect: true,
        operationAttempts: 2,
        operationFirstTrySuccess: false,
        operationWrongPicks: ['+'],
        calculationAttempts: 1,
        calculationFirstTrySuccess: true,
        calculationWrongAnswers: [],
        usedMasterClue: true,
        usedMagnifier: true,
        usedManipulatives: true,
        answeredAt: '08:32',
        timeSpentSeconds: 54,
        timeSpentFormatted: '54s',
      },
      m3_p1: {
        problemId: 'm3_p1',
        missionId: 3,
        operation: '*',
        themeContext: 'Caixas de Lápis de Cor para Arte',
        correctAnswer: 24,
        chosenAnswer: 24,
        isCorrect: true,
        operationAttempts: 1,
        operationFirstTrySuccess: true,
        operationWrongPicks: [],
        calculationAttempts: 1,
        calculationFirstTrySuccess: true,
        calculationWrongAnswers: [],
        usedMasterClue: false,
        usedMagnifier: false,
        usedManipulatives: false,
        answeredAt: '08:40',
        timeSpentSeconds: 28,
        timeSpentFormatted: '28s',
      },
      m4_p1: {
        problemId: 'm4_p1',
        missionId: 4,
        operation: '/',
        themeContext: 'Divisão dos Bombons de Chocolate',
        correctAnswer: 6,
        chosenAnswer: 6,
        isCorrect: true,
        operationAttempts: 1,
        operationFirstTrySuccess: true,
        operationWrongPicks: [],
        calculationAttempts: 1,
        calculationFirstTrySuccess: true,
        calculationWrongAnswers: [],
        usedMasterClue: false,
        usedMagnifier: true,
        usedManipulatives: false,
        answeredAt: '08:45',
        timeSpentSeconds: 41,
        timeSpentFormatted: '41s',
      },
    },
  },
  {
    id: 'std_marina_2',
    studentName: 'Marina',
    className: '3° ANO B',
    teacherName: 'Simone Rosa',
    schoolName: SCHOOL_OFFICIAL_NAME,
    createdAt: '08/10/2026, 08:18:00',
    updatedAt: '08/10/2026, 08:50:30',
    completedProblemsCount: 9,
    starsEarned: 9,
    accuracyRate: 100,
    totalTimeSeconds: 310,
    responses: {
      m1_p1: {
        problemId: 'm1_p1',
        missionId: 1,
        operation: '+',
        themeContext: 'Barraca das Frutas Vermelhas',
        correctAnswer: 39,
        chosenAnswer: 39,
        isCorrect: true,
        operationAttempts: 1,
        operationFirstTrySuccess: true,
        operationWrongPicks: [],
        calculationAttempts: 1,
        calculationFirstTrySuccess: true,
        calculationWrongAnswers: [],
        usedMasterClue: false,
        usedMagnifier: false,
        usedManipulatives: false,
        answeredAt: '08:22',
        timeSpentSeconds: 25,
        timeSpentFormatted: '25s',
      },
      m2_p2: {
        problemId: 'm2_p2',
        missionId: 2,
        operation: '-',
        themeContext: 'Coleção de Figurinhas da Turma',
        correctAnswer: 24,
        chosenAnswer: 24,
        isCorrect: true,
        operationAttempts: 1,
        operationFirstTrySuccess: true,
        operationWrongPicks: [],
        calculationAttempts: 1,
        calculationFirstTrySuccess: true,
        calculationWrongAnswers: [],
        usedMasterClue: true,
        usedMagnifier: true,
        usedManipulatives: false,
        answeredAt: '08:35',
        timeSpentSeconds: 38,
        timeSpentFormatted: '38s',
      },
    },
  },
  {
    id: 'std_pedro_3',
    studentName: 'Pedro',
    className: '3° ANO B',
    teacherName: 'Simone Rosa',
    schoolName: SCHOOL_OFFICIAL_NAME,
    createdAt: '08/10/2026, 08:25:00',
    updatedAt: '08/10/2026, 08:52:00',
    completedProblemsCount: 6,
    starsEarned: 6,
    accuracyRate: 83,
    totalTimeSeconds: 220,
    responses: {
      m1_p1: {
        problemId: 'm1_p1',
        missionId: 1,
        operation: '+',
        themeContext: 'Barraca das Frutas Vermelhas',
        correctAnswer: 39,
        chosenAnswer: 39,
        isCorrect: true,
        operationAttempts: 1,
        operationFirstTrySuccess: true,
        operationWrongPicks: [],
        calculationAttempts: 1,
        calculationFirstTrySuccess: true,
        calculationWrongAnswers: [],
        usedMasterClue: false,
        usedMagnifier: false,
        usedManipulatives: false,
        answeredAt: '08:30',
        timeSpentSeconds: 35,
        timeSpentFormatted: '35s',
      },
    },
  },
];

export class ClassDatabaseService {
  private static getStoredDatabase(): Record<string, StudentDatabaseRecord> {
    try {
      const raw = localStorage.getItem(DB_STORAGE_KEY);
      if (!raw) {
        // Initialize with default samples for Profa. Simone
        const initialMap: Record<string, StudentDatabaseRecord> = {};
        DEFAULT_SAMPLE_STUDENTS.forEach((s) => {
          initialMap[s.studentName.toLowerCase().trim()] = s;
        });
        localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(initialMap));
        return initialMap;
      }
      return JSON.parse(raw);
    } catch {
      return {};
    }
  }

  private static persist(data: Record<string, StudentDatabaseRecord>): void {
    try {
      localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Storage full or unavailable
    }
  }

  public static getAllStudents(): StudentDatabaseRecord[] {
    const db = this.getStoredDatabase();
    return Object.values(db).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }

  public static getStudent(studentName: string): StudentDatabaseRecord | null {
    if (!studentName.trim()) return null;
    const db = this.getStoredDatabase();
    return db[studentName.toLowerCase().trim()] || null;
  }

  public static saveResponse(
    studentName: string,
    problemId: string,
    attempt: ProblemAttemptRecord
  ): void {
    // Solicitar apenas o primeiro nome
    const rawFirst = studentName.trim().split(/\s+/)[0];
    if (!rawFirst) return;
    const cleanName = rawFirst.charAt(0).toUpperCase() + rawFirst.slice(1);

    const db = this.getStoredDatabase();
    const key = cleanName.toLowerCase();
    const now = new Date().toLocaleString('pt-BR');

    const existing: StudentDatabaseRecord = db[key] || {
      id: `std_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      studentName: cleanName,
      className: '3° ANO B',
      teacherName: 'Simone Rosa',
      schoolName: SCHOOL_OFFICIAL_NAME,
      createdAt: now,
      updatedAt: now,
      completedProblemsCount: 0,
      starsEarned: 0,
      accuracyRate: 100,
      responses: {},
    };

    // Update response for this problem
    existing.responses[problemId] = {
      problemId: attempt.problemId,
      missionId: attempt.missionId,
      operation: attempt.operation,
      themeContext: attempt.themeContext,
      correctAnswer: 0, // determined by problems
      isCorrect: attempt.completed,
      operationAttempts: attempt.operationAttempts,
      operationFirstTrySuccess: attempt.operationFirstTrySuccess,
      operationWrongPicks: attempt.operationWrongPicks,
      calculationAttempts: attempt.calculationAttempts,
      calculationFirstTrySuccess: attempt.calculationFirstTrySuccess,
      calculationWrongAnswers: attempt.calculationWrongAnswers,
      usedMasterClue: attempt.usedMasterClue,
      usedMagnifier: attempt.usedMagnifier,
      usedManipulatives: attempt.usedManipulatives,
      answeredAt: attempt.completedAt || new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      timeSpentSeconds: attempt.timeSpentSeconds || 0,
      timeSpentFormatted: attempt.timeSpentFormatted || '00:00',
    };

    existing.updatedAt = now;
    existing.completedProblemsCount = Object.keys(existing.responses).length;
    existing.starsEarned = existing.completedProblemsCount;

    // Calculate total time in seconds
    const allResps = Object.values(existing.responses);
    existing.totalTimeSeconds = allResps.reduce((sum, r) => sum + (r.timeSpentSeconds || 0), 0);

    // Calculate accuracy percentage
    const opFirstTrySuccess = allResps.filter((r) => r.operationFirstTrySuccess).length;
    existing.accuracyRate = allResps.length > 0 ? Math.round((opFirstTrySuccess / allResps.length) * 100) : 100;

    db[key] = existing;
    this.persist(db);
  }

  public static deleteStudent(studentName: string): void {
    const db = this.getStoredDatabase();
    const key = studentName.toLowerCase().trim();
    if (db[key]) {
      delete db[key];
      this.persist(db);
    }
  }

  public static clearAll(): void {
    localStorage.removeItem(DB_STORAGE_KEY);
  }

  // Export to standard CSV format compatible with Microsoft Excel and Google Sheets
  public static exportToCSV(): string {
    const students = this.getAllStudents();
    const headers = [
      'Primeiro Nome do Aluno',
      'Escola',
      'Turma',
      'Professora',
      'Desafios Concluídos',
      'Taxa de Precisão (%)',
      'Tempo Total Gasto',
      'Tempo Médio por Desafio',
      'Data de Início',
      'Última Atividade',
      'Adição (Acertos)',
      'Subtração (Acertos)',
      'Multiplicação (Acertos)',
      'Divisão (Acertos)',
      'Dicas de Mestre Consultadas',
    ];

    const rows = students.map((std) => {
      const resps = Object.values(std.responses);
      const addCount = resps.filter((r) => r.operation === '+').length;
      const subCount = resps.filter((r) => r.operation === '-').length;
      const multCount = resps.filter((r) => r.operation === '*').length;
      const divCount = resps.filter((r) => r.operation === '/').length;
      const cluesCount = resps.filter((r) => r.usedMasterClue).length;

      const totalSec = std.totalTimeSeconds || resps.reduce((s, r) => s + (r.timeSpentSeconds || 0), 0);
      const totalMin = Math.floor(totalSec / 60);
      const remSec = totalSec % 60;
      const formattedTotal = `${totalMin}m ${remSec}s`;

      const avgSec = resps.length > 0 ? Math.round(totalSec / resps.length) : 0;
      const formattedAvg = avgSec >= 60 ? `${Math.floor(avgSec / 60)}m ${avgSec % 60}s` : `${avgSec}s`;

      return [
        `"${std.studentName}"`,
        `"${std.schoolName || SCHOOL_OFFICIAL_NAME}"`,
        `"${std.className}"`,
        `"${std.teacherName}"`,
        std.completedProblemsCount,
        `${std.accuracyRate}%`,
        `"${formattedTotal}"`,
        `"${formattedAvg}"`,
        `"${std.createdAt}"`,
        `"${std.updatedAt}"`,
        addCount,
        subCount,
        multCount,
        divCount,
        cluesCount,
      ].join(';');
    });

    return [headers.join(';'), ...rows].join('\n');
  }

  // Export full JSON database for backup
  public static exportToJSON(): string {
    const db = this.getStoredDatabase();
    return JSON.stringify(db, null, 2);
  }

  // Import JSON backup
  public static importFromJSON(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (typeof parsed === 'object' && parsed !== null) {
        this.persist(parsed);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }
}
