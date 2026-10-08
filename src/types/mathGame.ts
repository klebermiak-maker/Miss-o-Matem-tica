export type OperationType = '+' | '-' | '*' | '/';

export interface VisualRepresentation {
  type: 'counters' | 'groups' | 'sharing' | 'golden_beads';
  total: number;
  part1?: number;
  part2?: number;
  groups?: number;
  itemsPerGroup?: number;
  unitEmoji: string;
}

export interface ProblemExplanation {
  step1_interpret: string;
  step2_operation: string;
  step3_calculation: string;
  pedagogicalTip: string;
}

export interface MasterClue {
  title: string;
  interpretationClue: string;
  keywordHighlight: string;
  operationHint: string;
  visualSchema: 'combine' | 'separate' | 'repeat' | 'share';
}

export interface Problem {
  id: string;
  themeContext: string;
  statement: string;
  question: string;
  keywords: string[];
  operation: OperationType;
  numbers: [number, number];
  correctAnswer: number;
  unit: string;
  options: number[];
  visual: VisualRepresentation;
  explanation: ProblemExplanation;
  masterClue?: MasterClue;
}

export interface Mission {
  id: number;
  title: string;
  subtitle: string;
  operation: OperationType;
  operationName: string;
  operationConcept: string;
  accentColor: {
    bg: string;
    border: string;
    badge: string;
    text: string;
    gradient: string;
    button: string;
  };
  iconName: string;
  themeBanner: string;
  storyIntro: string;
  problems: Problem[];
}

export interface ProblemAttemptRecord {
  problemId: string;
  missionId: number;
  operation: OperationType;
  skill?: string;
  themeContext: string;
  operationAttempts: number;
  operationWrongPicks: OperationType[];
  operationFirstTrySuccess: boolean;
  calculationAttempts: number;
  calculationWrongAnswers: number[];
  calculationFirstTrySuccess: boolean;
  chosenAnswer?: number;
  correctAnswer?: number;
  isFirstTry?: boolean;
  isCorrectAfterCorrection?: boolean;
  usedMasterClue: boolean;
  usedMagnifier: boolean;
  usedManipulatives: boolean;
  completed: boolean;
  completedAt?: string;
  timeSpentSeconds?: number;
  timeSpentFormatted?: string;
}

export interface StudentProgress {
  studentName: string;
  completedProblems: Record<string, boolean>;
  starsEarned: number;
  currentMissionId: number;
  missionScores: Record<number, number>; // mission id -> correct count
  attemptHistory?: Record<string, ProblemAttemptRecord>;
}

