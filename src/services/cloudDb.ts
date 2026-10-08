import {
  db,
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
  orderBy,
  handleFirestoreError,
  OperationType,
} from './firebase';
import { ProblemAttemptRecord } from '../types/mathGame';
import { ClassDatabaseService } from './db';

export interface CloudStudentResponse {
  id: string; // deterministic: `${studentCode}_${problemId}`
  studentCode: string;
  studentName: string; // in uppercase
  className: string;
  schoolName: string;
  problemId: string;
  missionId: number;
  skill: string;
  operation: string;
  themeContext: string;
  chosenAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
  isFirstTry: boolean; // acerto na 1ª tentativa
  isCorrectAfterCorrection: boolean; // acerto após correção
  attemptsCount: number; // total de tentativas
  timeSpentSeconds: number; // tempo de resposta
  timeSpentFormatted: string;
  answeredAt: string; // formatada
  date: string; // YYYY-MM-DD
  timestamp: number;
}

export interface CloudStudentProfile {
  studentCode: string;
  studentName: string; // in uppercase
  className: string;
  schoolName: string;
  completedCount: number;
  starsEarned: number;
  totalTimeSeconds: number;
  createdAt: string;
  updatedAt: string;
}

export type CloudSyncStatus = 'idle' | 'saving' | 'saved' | 'error';

type SyncListener = (status: CloudSyncStatus, errorMsg?: string) => void;
const syncListeners: Set<SyncListener> = new Set();
let currentSyncStatus: CloudSyncStatus = 'idle';

export function subscribeToSyncStatus(listener: SyncListener): () => void {
  syncListeners.add(listener);
  listener(currentSyncStatus);
  return () => {
    syncListeners.delete(listener);
  };
}

function notifySyncStatus(status: CloudSyncStatus, errorMsg?: string) {
  currentSyncStatus = status;
  syncListeners.forEach((l) => l(status, errorMsg));
}

// Maps mission id to respective BNCC skill
export function getMissionSkill(missionId: number): string {
  switch (missionId) {
    case 1:
      return 'EF03MA05 (Adição: juntar e acrescentar)';
    case 2:
      return 'EF03MA06 (Subtração: retirar, comparar e completar)';
    case 3:
      return 'EF03MA07 (Multiplicação: parcelas iguais e retangular)';
    case 4:
      return 'EF03MA08 (Divisão: repartição e medida)';
    default:
      return 'EF03CO02 / EF03MA06';
  }
}

export class CloudDatabaseService {
  /**
   * Saves or updates a student answer in Cloud Firestore during gameplay.
   * Deterministic ID `${studentCode}_${problemId}` avoids duplicated entries.
   */
  public static async saveResponse(
    studentCode: string,
    studentName: string,
    className: string,
    problemId: string,
    attempt: ProblemAttemptRecord,
    schoolName: string = 'Escola Municipal Educandário Nossa Senhora Aparecida'
  ): Promise<boolean> {
    const cleanCode = studentCode.trim().toUpperCase().replace(/[^A-Z0-9_\-]/g, '_');
    const cleanName = studentName.trim().toUpperCase();
    const cleanClass = className.trim().toUpperCase();

    if (!cleanCode || !cleanName) {
      return false;
    }

    notifySyncStatus('saving');

    const isFirstTry =
      attempt.completed &&
      attempt.operationFirstTrySuccess &&
      attempt.calculationFirstTrySuccess &&
      attempt.calculationAttempts <= 1 &&
      attempt.operationAttempts <= 1;

    const isCorrectAfterCorrection =
      attempt.completed && !isFirstTry;

    const totalAttempts = Math.max(
      attempt.calculationAttempts + (attempt.operationAttempts > 1 ? attempt.operationAttempts - 1 : 0),
      1
    );

    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10); // YYYY-MM-DD
    const answeredAtStr = now.toLocaleString('pt-BR');
    const deterministicId = `${cleanCode}_${problemId}`;

    const record: CloudStudentResponse = {
      id: deterministicId,
      studentCode: cleanCode,
      studentName: cleanName,
      className: cleanClass,
      schoolName,
      problemId: attempt.problemId,
      missionId: attempt.missionId,
      skill: attempt.skill || getMissionSkill(attempt.missionId),
      operation: attempt.operation,
      themeContext: attempt.themeContext,
      chosenAnswer: attempt.chosenAnswer ?? 0,
      correctAnswer: attempt.correctAnswer ?? 0,
      isCorrect: attempt.completed,
      isFirstTry,
      isCorrectAfterCorrection,
      attemptsCount: totalAttempts,
      timeSpentSeconds: attempt.timeSpentSeconds || 0,
      timeSpentFormatted: attempt.timeSpentFormatted || '0s',
      answeredAt: answeredAtStr,
      date: dateStr,
      timestamp: Date.now(),
    };

    // 1. Mirror locally for seamless instant responsiveness and offline fallback
    try {
      ClassDatabaseService.saveResponse(cleanName, problemId, attempt);
    } catch (e) {
      console.warn('Local mirror fallback error:', e);
    }

    // 2. Persist to Cloud Firestore
    const responsePath = `student_responses/${deterministicId}`;
    try {
      const responseDocRef = doc(db, 'student_responses', deterministicId);
      await setDoc(responseDocRef, record, { merge: true });

      // Update student profile
      const studentDocRef = doc(db, 'students', cleanCode);
      const studentSnap = await getDoc(studentDocRef).catch(() => null);
      const existingProfile = studentSnap?.exists()
        ? (studentSnap.data() as Partial<CloudStudentProfile>)
        : null;

      const profile: CloudStudentProfile = {
        studentCode: cleanCode,
        studentName: cleanName,
        className: cleanClass,
        schoolName,
        completedCount: (existingProfile?.completedCount || 0) + 1,
        starsEarned: (existingProfile?.starsEarned || 0) + 1,
        totalTimeSeconds:
          (existingProfile?.totalTimeSeconds || 0) + (attempt.timeSpentSeconds || 0),
        createdAt: existingProfile?.createdAt || answeredAtStr,
        updatedAt: answeredAtStr,
      };

      await setDoc(studentDocRef, profile, { merge: true });

      notifySyncStatus('saved');
      return true;
    } catch (error) {
      console.error('Failed to sync to Cloud Firestore:', error);
      notifySyncStatus('error', 'Erro ao salvar na nuvem');
      // Always provide error diagnosis per Firestore guidelines
      try {
        handleFirestoreError(error, OperationType.WRITE, responsePath);
      } catch {
        // Handled through notification
      }
      return false;
    }
  }

  /**
   * Fetches all responses from Cloud Firestore for the Teacher Area.
   */
  public static async fetchResponses(filters?: {
    student?: string;
    className?: string;
    missionId?: number;
    date?: string;
  }): Promise<CloudStudentResponse[]> {
    const path = 'student_responses';
    try {
      const colRef = collection(db, path);
      const q = query(colRef);
      const snap = await getDocs(q);

      let list: CloudStudentResponse[] = [];
      snap.forEach((docSnap) => {
        list.push(docSnap.data() as CloudStudentResponse);
      });

      // Filter in-memory for flexible combination
      if (filters?.student) {
        const queryTerm = filters.student.trim().toUpperCase();
        list = list.filter(
          (r) =>
            r.studentName.includes(queryTerm) ||
            r.studentCode.includes(queryTerm)
        );
      }
      if (filters?.className && filters.className !== 'ALL') {
        list = list.filter((r) => r.className === filters.className);
      }
      if (filters?.missionId && filters.missionId !== 0) {
        list = list.filter((r) => r.missionId === filters.missionId);
      }
      if (filters?.date) {
        list = list.filter((r) => r.date === filters.date);
      }

      // Sort newest first
      return list.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    } catch (error) {
      console.error('Error fetching student_responses:', error);
      handleFirestoreError(error, OperationType.LIST, path);
    }
  }

  /**
   * Fetches registered students list for Teacher Area.
   */
  public static async fetchStudents(): Promise<CloudStudentProfile[]> {
    const path = 'students';
    try {
      const colRef = collection(db, path);
      const snap = await getDocs(colRef);
      const list: CloudStudentProfile[] = [];
      snap.forEach((d) => list.push(d.data() as CloudStudentProfile));
      return list.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    } catch (error) {
      console.error('Error fetching students:', error);
      handleFirestoreError(error, OperationType.LIST, path);
    }
  }
}
