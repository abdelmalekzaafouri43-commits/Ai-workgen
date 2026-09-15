export type ThemeId = 'dark-blue' | 'sapphire' | 'emerald' | 'violet' | 'light-blue' | 'light-emerald' | 'light-warm';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  tagline: string;
  badge: string;
  isDark: boolean;
  bgBase: string;
  bgSidebar: string;
  bgCard: string;
  bgCardHover: string;
  borderSubtle: string;
  borderFocus: string;
  accentPrimary: string;
  accentHover: string;
  accentGlow: string;
  accentGradient: string;
  highlightMint: string;
  textPrimary: string;
  textMuted: string;
  textAccent: string;
  swatchBg: string;
  swatchDot: string;
}

export type CefrLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export type WritingFormat = 'email' | 'article' | 'facebook' | 'blog';

export interface WhQuestion {
  id: string;
  question: string;
  sampleAnswer: string;
  userAnswer?: string;
}

export interface FalseStatementQuestion {
  id: string;
  statement: string;
  isTrue: boolean;
  correctAnswer: string;
  userCorrection?: string;
  userIsTrueChoice?: boolean;
}

export interface ReferenceQuestion {
  id: string;
  word: string; // e.g. "they"
  location: string; // e.g. "Line 4"
  refersTo: string;
  userAnswer?: string;
}

export interface OpinionQuestion {
  id: string;
  question: string;
  promptGuide: string;
  userAnswer?: string;
}

export interface FormAndTenseItem {
  id: string;
  sentence: string; // e.g. "Every morning, Sarah (to wake) _______ at 7 AM."
  baseVerb: string;
  correctForm: string;
  explanation: string;
  userAnswer?: string;
}

export interface MatchingItem {
  id: string;
  partA: string;
  partB: string;
  correctMatchId: string;
}

export interface WritingTaskSpec {
  format: WritingFormat;
  prompt: string;
  wordCount: string;
  guidelines: string[];
  emailFields?: { to: string; from: string; subject: string };
  articleFields?: { headline: string; author: string; category: string };
  facebookFields?: { authorName: string; handle: string; timeAgo: string; hashtags: string[] };
  blogFields?: { title: string; category: string; author: string; date: string };
}

export interface VocabNote {
  word: string;
  phonetic?: string;
  definition: string;
  context: string;
}

export interface VocabQuestion {
  id: string;
  sentence: string;
  blankWord: string;
  hint: string;
  userAnswer?: string;
}

export interface GrammarQuestion {
  id: string;
  prompt: string;
  options?: string[];
  correctIndex?: number;
  originalSentence?: string;
  targetAnswer?: string;
  explanation: string;
  userSelectedIndex?: number;
  userTextAnswer?: string;
}

export interface CriticalQuestion {
  id: string;
  question: string;
  suggestedPoints: string[];
  userResponse?: string;
}

export interface WorksheetAnswerKey {
  vocabAnswers: { questionId: string; answer: string; synonymHint: string }[];
  grammarAnswers: { questionId: string; correctOption: string; ruleExplanation: string }[];
  whAnswers?: { questionId: string; sampleAnswer: string }[];
  falseAnswers?: { questionId: string; isTrue: boolean; correctAnswer: string }[];
  refAnswers?: { questionId: string; refersTo: string }[];
  formTenseAnswers?: { questionId: string; correctForm: string; explanation: string }[];
  matchingAnswers?: { questionId: string; match: string }[];
  criticalRubric: string[];
}

export interface WorksheetContent {
  readingTitle: string;
  readingPassage: string;
  passageType?: 'text' | 'dialogue';
  
  // Section 1: Reading Comprehension
  whQuestions?: WhQuestion[];
  falseStatements?: FalseStatementQuestion[];
  referenceQuestions?: ReferenceQuestion[];
  opinionQuestion?: OpinionQuestion;

  // Section 2: Language Tasks
  wordBank?: string[];
  vocabNotes?: VocabNote[];
  vocabExercises?: {
    instruction: string;
    items: VocabQuestion[];
  };
  formAndTenseExercises?: {
    instruction: string;
    items: FormAndTenseItem[];
  };
  matchingExercises?: {
    instruction: string;
    items: MatchingItem[];
  };
  grammarExercises?: {
    instruction: string;
    items: GrammarQuestion[];
  };

  // Section 3: Writing with Specific Visual Layout
  writingTask?: WritingTaskSpec;

  criticalThinking?: {
    instruction: string;
    items: CriticalQuestion[];
  };
  answerKey: WorksheetAnswerKey;
}

export interface ScannedStyleDna {
  id: string;
  sourceName: string;
  thumbnailUrl?: string;
  layoutStyle: 'Two-Column Split' | 'Modular Bento Grid' | 'Matching Anchor Columns' | 'Linear Exam Block';
  colorPalette: {
    primary: string;
    accent: string;
    background: string;
    surface: string;
  };
  fontStructure: {
    headingFont: string;
    bodyFont: string;
    lineHeight: string;
    density: 'Compact Academic' | 'Balanced Modern' | 'Generous Open';
  };
  detectedModules: string[];
  confidence: number;
  extractedAt: string;
}

export interface Worksheet {
  id: string;
  title: string;
  subtitle: string;
  cefrLevel: CefrLevel;
  estimatedMinutes: number;
  status: 'Premium' | 'Draft' | 'Completed';
  targetSkill: 'Vocabulary & Idioms' | 'Grammar & Syntax' | 'Reading & Synthesis' | 'Debate & Writing';
  tags: string[];
  createdAt: string;
  appliedDna?: ScannedStyleDna;
  content: WorksheetContent;
}

export interface UserStats {
  worksheetsGenerated: number;
  hoursSaved: number;
  studentsActive: number;
  averageMasteryRate: number;
  weeklyActivity: { day: string; count: number; minutes: number }[];
}
