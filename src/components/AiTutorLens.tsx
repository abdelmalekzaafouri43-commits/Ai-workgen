import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Worksheet, CefrLevel, ScannedStyleDna } from '../types';
import { createClientWorksheet } from '../utils/worksheetGenerator';
import { exportElementToPdf, triggerPrintWindow } from '../utils/pdfExporter';
import {
  Sparkles,
  Printer,
  FileText,
  CheckCircle2,
  Layers,
  BookOpen,
  HelpCircle,
  Clock,
  RotateCcw,
  BookmarkPlus,
  Copy,
  Check,
  Zap,
  GraduationCap,
  Volume2,
  VolumeX,
  Award,
  ArrowRight,
  Eye,
  Sliders,
  Send,
  Mail,
  Newspaper,
  Share2,
  ThumbsUp,
  MessageSquare,
  Globe,
  PenTool,
  MessageCircle,
  Download,
  FileDown,
} from 'lucide-react';

interface AiTutorLensProps {
  currentWorksheet: Worksheet;
  onUpdateWorksheet: (worksheet: Worksheet) => void;
  onSaveToLibrary: (worksheet: Worksheet) => void;
  activeDna?: ScannedStyleDna | null;
  onClearDna?: () => void;
  onNavigateToScanner?: () => void;
}

type WorksheetViewMode = 'interactive' | 'teacher-key' | 'printable';

const REAL_PUPIL_THEMES = [
  { id: 'routines', label: '⏰ Daily Routines', topic: 'Daily Routines & Present Simple Tense', grammar: 'Present Simple & Frequency Adverbs', defaultLevel: 'A2' as CefrLevel },
  { id: 'food', label: '🍕 Food & Cooking', topic: 'Food, Recipes & Noun Quantifiers', grammar: 'Countable/Uncountable Nouns & Some/Any', defaultLevel: 'A2' as CefrLevel },
  { id: 'animals', label: '🐾 Animals & Nature', topic: 'Animals, Pets & Animal Comparisons', grammar: 'Comparatives & Superlatives', defaultLevel: 'A1' as CefrLevel },
  { id: 'school', label: '🎒 School & Classroom', topic: 'Classroom Life & Prepositions of Place', grammar: 'Imperatives, Must/Should & Prepositions', defaultLevel: 'A2' as CefrLevel },
  { id: 'sports', label: '⚽ Sports & Hobbies', topic: 'Sports, Games & Expressing Ability', grammar: 'Modal Verbs (Can/Could) & Preferences', defaultLevel: 'B1' as CefrLevel },
  { id: 'travel', label: '✈️ Travel & Weather', topic: 'Travel Trips, Weather & Future Plans', grammar: 'Future Tenses (Be going to vs Will)', defaultLevel: 'B1' as CefrLevel },
  { id: 'clothes', label: '👕 Clothes & Shopping', topic: 'Clothes, Outfits & Shopping at Stores', grammar: 'Demonstratives (This/That/These/Those)', defaultLevel: 'A1' as CefrLevel },
  { id: 'environment', label: '🌳 Environment & Planet', topic: 'Protecting Nature & Ecological Action', grammar: 'First Conditional & Modal Obligations', defaultLevel: 'B2' as CefrLevel },
];

export const AiTutorLens: React.FC<AiTutorLensProps> = ({
  currentWorksheet,
  onUpdateWorksheet,
  onSaveToLibrary,
  activeDna,
  onClearDna,
  onNavigateToScanner,
}) => {
  const { theme } = useTheme();

  // Mode Selection: Student interactive, Teacher key, Printable exam preview
  const [viewMode, setViewMode] = useState<WorksheetViewMode>('interactive');

  // Generator State
  const [topicPrompt, setTopicPrompt] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<CefrLevel>(currentWorksheet.cefrLevel || 'B2');
  const [selectedSkill, setSelectedSkill] = useState<'Vocabulary & Idioms' | 'Grammar & Syntax' | 'Reading & Synthesis' | 'Debate & Writing'>(
    (currentWorksheet.targetSkill as any) || 'Vocabulary & Idioms'
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRefining, setIsRefining] = useState(false);

  // Student Input & Grading State
  const [studentName, setStudentName] = useState('Alex Rivera');
  const [studentDate, setStudentDate] = useState(new Date().toISOString().slice(0, 10));
  const [userVocabAnswers, setUserVocabAnswers] = useState<Record<string, string>>({});
  const [userGrammarAnswers, setUserGrammarAnswers] = useState<Record<string, number>>({});
  const [userGrammarTextAnswers, setUserGrammarTextAnswers] = useState<Record<string, string>>({});
  const [userWhAnswers, setUserWhAnswers] = useState<Record<string, string>>({});
  const [userFalseAnswers, setUserFalseAnswers] = useState<Record<string, { choice?: boolean; correction?: string }>>({});
  const [userRefAnswers, setUserRefAnswers] = useState<Record<string, string>>({});
  const [userOpinionText, setUserOpinionText] = useState('');
  const [userFormTenseAnswers, setUserFormTenseAnswers] = useState<Record<string, string>>({});
  const [userMatchingAnswers, setUserMatchingAnswers] = useState<Record<string, string>>({});
  const [userWritingText, setUserWritingText] = useState('');
  const [writingFormat, setWritingFormat] = useState<'email' | 'article' | 'facebook' | 'blog'>(
    currentWorksheet.content?.writingTask?.format || 'email'
  );
  const [facebookLiked, setFacebookLiked] = useState(false);
  const [facebookLikeCount, setFacebookLikeCount] = useState(24);
  const [showFormulaVault, setShowFormulaVault] = useState(true);
  const [aiWritingAnalysis, setAiWritingAnalysis] = useState<{
    scoreGrade: string;
    wordCount: number;
    checklistResults: { item: string; check: boolean; note: string }[];
    feedbackTip: string;
  } | null>(null);
  const [isAnalyzingWriting, setIsAnalyzingWriting] = useState(false);
  const [insertedPhraseToast, setInsertedPhraseToast] = useState<string | null>(null);

  const [userCriticalText, setUserCriticalText] = useState('');
  const [checkedAnswers, setCheckedAnswers] = useState(false);
  const [gradeResult, setGradeResult] = useState<{ score: number; maxScore: number; percentage: number; badge: string } | null>(null);

  // Helper function to insert formulas/phrases
  const handleInsertPhrase = (phrase: string) => {
    setUserWritingText((prev) => (prev ? prev + ' ' + phrase : phrase));
    setInsertedPhraseToast(`Inserted: "${phrase.slice(0, 24)}..."`);
    setTimeout(() => setInsertedPhraseToast(null), 2500);
  };

  // Helper function to analyze writing structure and grammar
  const handleAnalyzeWriting = () => {
    setIsAnalyzingWriting(true);
    setTimeout(() => {
      const words = userWritingText.trim() ? userWritingText.trim().split(/\s+/).length : 0;
      const lower = userWritingText.toLowerCase();

      let checklistResults: { item: string; check: boolean; note: string }[] = [];
      let grade = 'B+ (Good Start)';
      let feedbackTip = 'Great draft! Try adding more frequency adverbs and discourse connectors to polish your composition.';

      if (writingFormat === 'email') {
        const hasGreeting = lower.includes('dear') || lower.includes('hi') || lower.includes('hello');
        const hasClosing = lower.includes('regards') || lower.includes('sincerely') || lower.includes('best') || lower.includes('thanks');
        const wordCountOk = words >= 35 && words <= 120;
        const hasGrammar = lower.includes('always') || lower.includes('usually') || lower.includes('never') || lower.includes('every') || lower.includes('because');

        checklistResults = [
          { item: 'Proper Email Greeting (Dear / Hi)', check: hasGreeting, note: hasGreeting ? 'Formal greeting present' : 'Missing greeting line' },
          { item: 'Target Word Count (35-120 words)', check: wordCountOk, note: `Current length: ${words} words` },
          { item: 'Target Grammar / Adverbs', check: hasGrammar, note: hasGrammar ? 'Frequency adverbs / Present Tense detected' : 'Add frequency adverbs (always, usually)' },
          { item: 'Formal Sign-off (Best regards, etc.)', check: hasClosing, note: hasClosing ? 'Sign-off line present' : 'Missing closing line' },
        ];
        if (hasGreeting && hasClosing && wordCountOk && hasGrammar) {
          grade = 'A+ (Excellent E-Mail Structure!)';
          feedbackTip = 'Outstanding! Your e-mail follows proper communicative format, correct sign-offs, and target grammar.';
        }
      } else if (writingFormat === 'article') {
        const hasHook = lower.includes('have you') || lower.includes('in today') || lower.includes('is important') || words > 15;
        const wordCountOk = words >= 40 && words <= 150;
        const hasConnectors = lower.includes('first') || lower.includes('furthermore') || lower.includes('in conclusion') || lower.includes('because');

        checklistResults = [
          { item: 'Engaging Headline / Hook Opening', check: hasHook, note: hasHook ? 'Hook opening detected' : 'Start with a question or compelling statement' },
          { item: 'Substantial Body Content', check: words >= 40, note: words >= 40 ? 'Sufficient detail' : 'Elaborate on your main arguments' },
          { item: 'Target Word Count (40-150 words)', check: wordCountOk, note: `Current word count: ${words} words` },
          { item: 'Discourse Connectors (First, Furthermore)', check: hasConnectors, note: hasConnectors ? 'Connectors used effectively' : 'Add linking expressions' },
        ];
        if (hasHook && wordCountOk && hasConnectors) {
          grade = 'A+ (Journalistic Quality!)';
          feedbackTip = 'Superb press article draft! High clarity, good structural flow, and persuasive register.';
        }
      } else if (writingFormat === 'facebook') {
        const hasHashtag = userWritingText.includes('#');
        const hasEngagement = lower.includes('?') || lower.includes('👋') || lower.includes('☀️') || lower.includes('👇') || lower.includes('you');
        const wordCountOk = words >= 20 && words <= 90;

        checklistResults = [
          { item: 'Conversational Hook / Reader Question', check: hasEngagement, note: hasEngagement ? 'Engaging social hook present' : 'Add a question or emoji to engage followers' },
          { item: 'Target Length (20-90 words)', check: wordCountOk, note: `Current length: ${words} words` },
          { item: 'Relevant Hashtags (#EverydayEnglish)', check: hasHashtag, note: hasHashtag ? 'Hashtags included' : 'Add at least one hashtag' },
        ];
        if (hasEngagement && wordCountOk && hasHashtag) {
          grade = 'A+ (Highly Engaging Social Post!)';
          feedbackTip = 'Great social tone! Conversational, interactive, and includes hashtags.';
        }
      } else if (writingFormat === 'blog') {
        const hasIntro = words >= 15;
        const hasSubheadingOrList = lower.includes('1.') || lower.includes('-') || lower.includes('first') || lower.includes('tip') || lower.includes('key');
        const wordCountOk = words >= 40 && words <= 150;

        checklistResults = [
          { item: 'Catchy Blog Opening / Teaser', check: hasIntro, note: hasIntro ? 'Solid opening' : 'Elaborate on your blog intro' },
          { item: 'Structured Key Takeaways / Points', check: hasSubheadingOrList, note: hasSubheadingOrList ? 'Structured list/points used' : 'Use numbered points or bullet lists' },
          { item: 'Target Length (40-150 words)', check: wordCountOk, note: `Current word count: ${words} words` },
        ];
        if (hasIntro && hasSubheadingOrList && wordCountOk) {
          grade = 'A+ (Top Blog Entry!)';
          feedbackTip = 'Excellent blog post! Well organized, easy to scan, and engaging for readers.';
        }
      }

      setAiWritingAnalysis({
        scoreGrade: grade,
        wordCount: words,
        checklistResults,
        feedbackTip,
      });
      setIsAnalyzingWriting(false);
    }, 500);
  };

  // Audio Speech Synthesis
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Notification Toasts & PDF Export state
  const [copySuccess, setCopySuccess] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [pdfToast, setPdfToast] = useState<string | null>(null);

  // Level selector list
  const cefrLevels: CefrLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  const skillTargets = [
    'Vocabulary & Idioms',
    'Grammar & Syntax',
    'Reading & Synthesis',
    'Debate & Writing',
  ] as const;

  // Audio speech synthesis handler
  const handleToggleAudio = () => {
    if (isPlayingAudio) {
      window.speechSynthesis?.cancel();
      setIsPlayingAudio(false);
      return;
    }
    if (!('speechSynthesis' in window) || !currentWorksheet.content?.readingPassage) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(currentWorksheet.content.readingPassage);
    utterance.rate = 0.92;
    utterance.pitch = 1.0;
    utterance.lang = 'en-US';
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);
    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  // Generate new worksheet (Gemini API with instant client-side fallback)
  const handleGenerate = async () => {
    setIsGenerating(true);
    const targetTopic = topicPrompt.trim() || currentWorksheet.title.split(':')[0] || 'Modern English Communication';

    try {
      const res = await fetch('/api/generate-worksheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: targetTopic,
          cefrLevel: selectedLevel,
          targetSkill: selectedSkill,
          activeDna: activeDna || undefined,
        }),
      });

      if (res.ok) {
        const responseJson = await res.json();
        const payload = responseJson.data || responseJson;

        let finalWorksheet: Worksheet;
        if (payload.content && payload.content.readingPassage) {
          finalWorksheet = payload;
        } else if (payload.readingPassage) {
          finalWorksheet = {
            id: payload.id || 'ws-' + Date.now(),
            title: payload.title || `${targetTopic}: Core Mastery`,
            subtitle: payload.subtitle || `Level ${selectedLevel} curriculum worksheet targeting ${selectedSkill}`,
            cefrLevel: selectedLevel,
            estimatedMinutes: selectedLevel === 'C1' || selectedLevel === 'C2' ? 45 : 30,
            status: 'Premium',
            targetSkill: selectedSkill,
            tags: [selectedLevel, selectedSkill, targetTopic],
            createdAt: new Date().toISOString(),
            appliedDna: activeDna || undefined,
            content: {
              readingTitle: payload.readingTitle || `Analytical Overview: ${targetTopic}`,
              readingPassage: payload.readingPassage,
              vocabNotes: payload.vocabNotes || [],
              vocabExercises: payload.vocabExercises || { instruction: '', items: [] },
              grammarExercises: payload.grammarExercises || { instruction: '', items: [] },
              criticalThinking: payload.criticalThinking || { instruction: '', items: [] },
              answerKey: payload.answerKey || { vocabAnswers: [], grammarAnswers: [], criticalRubric: [] },
            },
          };
        } else {
          throw new Error('Unrecognized response structure');
        }

        onUpdateWorksheet(finalWorksheet);
        onSaveToLibrary(finalWorksheet);
        resetStudentWork();
        setIsGenerating(false);
        return;
      }
    } catch (err) {
      console.warn('API error during generation; applying resilient client-side generator', err);
    }

    // Instant resilient fallback
    const fallbackSheet = createClientWorksheet(targetTopic, selectedLevel, selectedSkill, activeDna);
    onUpdateWorksheet(fallbackSheet);
    onSaveToLibrary(fallbackSheet);
    resetStudentWork();
    setIsGenerating(false);
  };

  // Quick 1-click AI adjustments
  const handleQuickRefine = async (instruction: string, newLevel?: CefrLevel) => {
    setIsRefining(true);
    try {
      const res = await fetch('/api/refine-worksheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          worksheet: currentWorksheet,
          refinementPrompt: instruction,
          newCefrLevel: newLevel,
        }),
      });
      if (res.ok) {
        const refined = await res.json();
        onUpdateWorksheet(refined);
        resetStudentWork();
        setIsRefining(false);
        return;
      }
    } catch (e) {
      console.warn('Refinement fallback', e);
    }

    const lvl = newLevel || currentWorksheet.cefrLevel;
    const baseTopic = currentWorksheet.title.split(':')[0] || 'Modern Discourse';
    const updated = createClientWorksheet(`${baseTopic} (${instruction.slice(0, 15)})`, lvl, currentWorksheet.targetSkill, activeDna);
    onUpdateWorksheet(updated);
    resetStudentWork();
    setIsRefining(false);
  };

  const resetStudentWork = () => {
    setCheckedAnswers(false);
    setGradeResult(null);
    setUserVocabAnswers({});
    setUserGrammarAnswers({});
    setUserCriticalText('');
  };

  // Grade student work in real time
  const handleGradeWorksheet = () => {
    setCheckedAnswers(true);

    let vocabScore = 0;
    const vocabItems = currentWorksheet.content?.vocabExercises?.items || [];
    vocabItems.forEach((it) => {
      const userAns = userVocabAnswers[it.id]?.trim().toLowerCase();
      if (userAns && userAns === it.blankWord.trim().toLowerCase()) {
        vocabScore += 10;
      }
    });

    let grammarScore = 0;
    const grammarItems = currentWorksheet.content?.grammarExercises?.items || [];
    grammarItems.forEach((g) => {
      if (userGrammarAnswers[g.id] === g.correctIndex) {
        grammarScore += 15;
      }
    });

    const criticalScore = userCriticalText.trim().length > 40 ? 25 : userCriticalText.trim().length > 10 ? 15 : 0;
    const maxScore = Math.max(1, vocabItems.length * 10 + grammarItems.length * 15 + 25);
    const totalScore = vocabScore + grammarScore + criticalScore;
    const percentage = Math.round((totalScore / maxScore) * 100);

    let badge = 'Proficient Scholar';
    if (percentage >= 90) badge = 'Mastery Level Distinction';
    else if (percentage >= 75) badge = 'Advanced Competence';
    else if (percentage >= 60) badge = 'Developing Fluency';
    else badge = 'Needs Structured Review';

    setGradeResult({
      score: totalScore,
      maxScore,
      percentage,
      badge,
    });
  };

  const handleExportPdf = async () => {
    if (isExportingPdf) return;
    setIsExportingPdf(true);
    setPdfToast('Preparing high-resolution PDF document...');

    const previousViewMode = viewMode;
    setViewMode('printable');
    await new Promise((resolve) => setTimeout(resolve, 350));

    const cleanTitle = (currentWorksheet.title || 'Worksheet')
      .replace(/[^a-zA-Z0-9\s_-]/g, '')
      .trim()
      .replace(/\s+/g, '_');
    const filename = `${cleanTitle}_CEFR_${currentWorksheet.cefrLevel || 'B2'}.pdf`;

    const success = await exportElementToPdf(
      'printable-worksheet-node',
      filename,
      (msg) => setPdfToast(msg)
    );

    if (success) {
      setPdfToast('✓ PDF File Downloaded Successfully!');
      setTimeout(() => setPdfToast(null), 3500);
    } else {
      setPdfToast('⚠️ Direct PDF capture failed; opening browser print window...');
      triggerPrintWindow();
      setTimeout(() => setPdfToast(null), 4000);
    }

    setIsExportingPdf(false);
    setViewMode(previousViewMode);
  };

  const handlePrint = () => {
    const ok = triggerPrintWindow();
    if (!ok) {
      setPdfToast('⚠️ Iframe blocks print window. Downloading PDF file directly...');
      handleExportPdf();
    }
  };

  const handleCopy = () => {
    const ws = currentWorksheet;
    const markdown = `# ${ws.title}
**Level:** ${ws.cefrLevel} | **Skill:** ${ws.targetSkill} | **Duration:** ${ws.estimatedMinutes}m | **Student:** ${studentName} | **Date:** ${studentDate}

## 1. Contextual Reading: ${ws.content.readingTitle}
${ws.content.readingPassage}

### Key Vocabulary:
${ws.content.vocabNotes.map((v) => `- **${v.word}** (${v.phonetic || ''}): ${v.definition}`).join('\n')}

## 2. Vocabulary Exercises
*${ws.content.vocabExercises.instruction}*
${ws.content.vocabExercises.items.map((it, i) => `${i + 1}. ${it.sentence} (Hint: ${it.hint})`).join('\n')}

## 3. Grammar & Syntax Analysis
*${ws.content.grammarExercises.instruction}*
${ws.content.grammarExercises.items
  .map(
    (g, i) => `${i + 1}. ${g.prompt}\n` + g.options.map((opt, idx) => `   [${String.fromCharCode(65 + idx)}] ${opt}`).join('\n')
  )
  .join('\n\n')}

## 4. Critical Thinking & Reflection
*${ws.content.criticalThinking.instruction}*
${ws.content.criticalThinking.items.map((c, i) => `${i + 1}. ${c.question}`).join('\n')}
`;

    navigator.clipboard.writeText(markdown);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleSave = () => {
    onSaveToLibrary(currentWorksheet);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div id="ai-tutor-lens-view" className="flex flex-col lg:flex-row gap-6 items-start h-full pb-10">
      {/* 
        LEFT DASHBOARD / CONTROLS PANEL
        Requirement: "The dashboard is always on the left of the screen"
        Clean, focused, reduced complexity.
      */}
      <div className="w-full lg:w-84 lg:shrink-0 space-y-4 no-print">
        {/* Generator Controls Card with High-Visibility Animated Border */}
        <div
          id="ai-generator-main-card"
          className={`relative rounded-2xl border p-5 shadow-2xl space-y-4 transition-all duration-300 ai-generator-animated-card ${
            isGenerating ? 'is-generating animate-border-generating' : ''
          }`}
          style={{
            backgroundColor: theme.bgCard,
            borderColor: 'transparent',
          }}
        >
          {/* Animated Reticle Corners for High Precision Visual Cue */}
          <div className="reticle-corner-tl animate-reticle-pulse" />
          <div className="reticle-corner-tr animate-reticle-pulse" />
          <div className="reticle-corner-bl animate-reticle-pulse" />
          <div className="reticle-corner-br animate-reticle-pulse" />

          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div
                className="relative flex h-8 w-8 items-center justify-center rounded-lg text-white shadow-md overflow-hidden"
                style={{ background: theme.accentGradient }}
              >
                <Sparkles className={`w-4 h-4 text-white ${isGenerating ? 'animate-spin' : 'animate-pulse'}`} />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h2 className="text-sm font-extrabold text-white tracking-tight">AI GENERATOR</h2>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
                  </span>
                </div>
                <p className="text-[10px] text-cyan-300/80 font-medium">Instantly creates & updates sheet</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {activeDna && (
                <span className="rounded px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  DNA Active
                </span>
              )}
              <span className="rounded-full px-2 py-0.5 text-[9px] font-mono font-bold bg-cyan-950/90 text-cyan-300 border border-cyan-400/50 shadow-sm animate-pulse">
                AI READY
              </span>
            </div>
          </div>

          {/* Prompt Input & Pupil Themes */}
          <div className="space-y-2">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Topic or Theme
            </label>
            <input
              id="tutor-direct-prompt-input"
              type="text"
              value={topicPrompt}
              onChange={(e) => setTopicPrompt(e.target.value)}
              placeholder="e.g. Daily Routines, Animals & Nature, Food..."
              onKeyDown={(e) => e.key === 'Enter' && !isGenerating && handleGenerate()}
              className="w-full rounded-xl border px-3 py-2.5 text-xs text-white placeholder:text-slate-500 bg-black/60 focus:outline-none transition-all"
              style={{ borderColor: theme.borderSubtle }}
            />

            {/* Pupil Everyday Themes with Grammar Focus */}
            <div className="space-y-1.5">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Everyday Themes & Grammar Targets:
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto pr-1">
                {REAL_PUPIL_THEMES.map((th) => {
                  const isSelected = topicPrompt === th.topic;
                  return (
                    <button
                      key={th.id}
                      type="button"
                      onClick={() => {
                        setTopicPrompt(th.topic);
                        setSelectedLevel(th.defaultLevel);
                      }}
                      className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? 'border-cyan-400 bg-cyan-950/90 text-cyan-200 shadow-sm'
                          : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/15 hover:text-white'
                      }`}
                    >
                      <span>{th.label}</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                        isSelected ? 'bg-cyan-500/30 text-cyan-200' : 'bg-black/40 text-slate-400'
                      }`}>
                        {th.grammar}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* CEFR Level Selector */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                CEFR Target Level
              </label>
              <span className="text-[10px] font-bold text-cyan-400">{selectedLevel}</span>
            </div>
            <div className="grid grid-cols-6 gap-1">
              {cefrLevels.map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setSelectedLevel(lvl)}
                  className={`py-1.5 rounded-lg border text-center font-bold text-xs transition-all cursor-pointer ${
                    selectedLevel === lvl
                      ? 'border-cyan-400 bg-cyan-950/60 text-cyan-300 shadow-sm'
                      : 'border-white/10 text-slate-400 hover:text-white bg-black/30'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Target Skill Selector */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Target Skill
            </label>
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value as any)}
              className="w-full rounded-xl border border-white/15 bg-black/60 px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
            >
              {skillTargets.map((sk) => (
                <option key={sk} value={sk} className="bg-slate-900 text-white">
                  {sk}
                </option>
              ))}
            </select>
          </div>

          {/* Primary Action Button */}
          <button
            id="generate-worksheet-action-btn"
            type="button"
            disabled={isGenerating}
            onClick={handleGenerate}
            className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold text-white transition-all cursor-pointer shadow-lg disabled:opacity-50"
            style={{
              background: theme.accentGradient,
              boxShadow: theme.accentGlow,
            }}
          >
            {isGenerating ? (
              <>
                <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                <span>Generating Worksheet...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate Worksheet</span>
              </>
            )}
          </button>
        </div>

        {/* View Mode Switcher Card */}
        <div
          className="rounded-2xl border p-4 bg-black/40 space-y-2.5"
          style={{ borderColor: theme.borderSubtle }}
        >
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Worksheet Mode
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => setViewMode('interactive')}
              className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all cursor-pointer ${
                viewMode === 'interactive'
                  ? 'border-cyan-400 bg-cyan-950/40 text-cyan-300'
                  : 'border-white/10 text-slate-400 hover:text-white bg-black/20'
              }`}
            >
              <GraduationCap className="w-4 h-4 mb-1" />
              <span className="text-[11px] font-bold">Student</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('teacher-key')}
              className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all cursor-pointer ${
                viewMode === 'teacher-key'
                  ? 'border-emerald-400 bg-emerald-950/40 text-emerald-300'
                  : 'border-white/10 text-slate-400 hover:text-white bg-black/20'
              }`}
            >
              <HelpCircle className="w-4 h-4 mb-1" />
              <span className="text-[11px] font-bold">Answer Key</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('printable')}
              className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all cursor-pointer ${
                viewMode === 'printable'
                  ? 'border-white bg-white text-black'
                  : 'border-white/10 text-slate-400 hover:text-white bg-black/20'
              }`}
            >
              <FileText className="w-4 h-4 mb-1" />
              <span className="text-[11px] font-bold">Paper Look</span>
            </button>
          </div>
        </div>

        {/* Quick 1-Click AI Adjustments */}
        <div
          className="rounded-2xl border p-4 bg-black/40 space-y-2.5"
          style={{ borderColor: theme.borderSubtle }}
        >
          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
              Quick AI Adjustments
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={isRefining}
              onClick={() => handleQuickRefine('Elevate vocabulary nuance to C2', 'C2')}
              className="px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/5 text-[11px] font-medium text-slate-300 hover:text-white hover:border-cyan-400/40 transition-all text-left truncate cursor-pointer disabled:opacity-50"
            >
              🚀 Elevate to C2
            </button>
            <button
              type="button"
              disabled={isRefining}
              onClick={() => handleQuickRefine('Simplify linguistic structure for B1', 'B1')}
              className="px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/5 text-[11px] font-medium text-slate-300 hover:text-white hover:border-emerald-400/40 transition-all text-left truncate cursor-pointer disabled:opacity-50"
            >
              🌱 Simplify for B1
            </button>
            <button
              type="button"
              disabled={isRefining}
              onClick={() => handleQuickRefine('Inject 3 idiomatic phrasal verbs')}
              className="px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/5 text-[11px] font-medium text-slate-300 hover:text-white hover:border-amber-400/40 transition-all text-left truncate cursor-pointer disabled:opacity-50"
            >
              💬 +3 Phrasal Verbs
            </button>
            <button
              type="button"
              disabled={isRefining}
              onClick={() => handleQuickRefine('Add debate roleplay scenario')}
              className="px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/5 text-[11px] font-medium text-slate-300 hover:text-white hover:border-purple-400/40 transition-all text-left truncate cursor-pointer disabled:opacity-50"
            >
              🎭 +Debate Prompt
            </button>
          </div>
        </div>

        {/* Output Actions (PDF Export, Print, Copy, Audio, Save) */}
        <div
          className="rounded-2xl border p-4 bg-black/40 space-y-2.5"
          style={{ borderColor: theme.borderSubtle }}
        >
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Worksheet Actions
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              id="export-pdf-action-btn"
              type="button"
              disabled={isExportingPdf}
              onClick={handleExportPdf}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-cyan-500/50 bg-cyan-950/60 py-2 text-xs font-bold text-cyan-300 hover:text-white hover:bg-cyan-900/80 transition-all cursor-pointer disabled:opacity-50 col-span-2 shadow-sm"
            >
              <Download className={`w-4 h-4 text-cyan-400 ${isExportingPdf ? 'animate-bounce' : ''}`} />
              <span>{isExportingPdf ? 'Generating PDF...' : 'Export PDF Document (.pdf)'}</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 py-2 text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-cyan-400" />
              <span>Print Window</span>
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 py-2 text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            >
              {copySuccess ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
              <span>{copySuccess ? 'Copied!' : 'Copy Text'}</span>
            </button>

            <button
              type="button"
              onClick={handleToggleAudio}
              className={`flex items-center justify-center gap-1.5 rounded-xl border py-2 text-xs font-semibold transition-all cursor-pointer ${
                isPlayingAudio
                  ? 'border-amber-400 bg-amber-500/20 text-amber-300'
                  : 'border-white/10 bg-white/5 text-slate-200 hover:text-white hover:bg-white/10'
              }`}
            >
              {isPlayingAudio ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-400" />}
              <span>{isPlayingAudio ? 'Stop Voice' : 'Read Aloud'}</span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 py-2 text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            >
              {saveSuccess ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <BookmarkPlus className="w-3.5 h-3.5 text-cyan-400" />}
              <span>{saveSuccess ? 'Saved!' : 'Save Sheet'}</span>
            </button>
          </div>

          {pdfToast && (
            <div className="mt-2 p-2.5 rounded-xl bg-cyan-950/90 border border-cyan-400/50 text-cyan-200 text-xs font-medium flex items-center justify-between shadow-lg animate-in fade-in">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>{pdfToast}</span>
              </span>
            </div>
          )}
        </div>

        {/* Real-time Assessment Card (when graded) */}
        {gradeResult && viewMode === 'interactive' && (
          <div
            className="rounded-2xl border p-4 animate-in fade-in zoom-in-95 space-y-2.5"
            style={{
              backgroundColor: gradeResult.percentage >= 75 ? 'rgba(5, 150, 105, 0.2)' : 'rgba(217, 119, 6, 0.2)',
              borderColor: gradeResult.percentage >= 75 ? 'rgba(52, 211, 153, 0.5)' : 'rgba(251, 191, 36, 0.5)',
            }}
          >
            <div className="flex items-center gap-2.5">
              <Award className="w-5 h-5 text-emerald-400" />
              <div>
                <h4 className="text-xs font-bold text-white">Score: {gradeResult.percentage}%</h4>
                <p className="text-[10px] text-emerald-300 font-medium">{gradeResult.badge}</p>
              </div>
            </div>
            <p className="text-[11px] text-slate-300">
              Points: {gradeResult.score} / {gradeResult.maxScore}
            </p>
            <button
              type="button"
              onClick={() => {
                resetStudentWork();
              }}
              className="w-full py-1.5 rounded-lg border border-white/15 bg-white/10 text-[11px] font-bold text-white hover:bg-white/20 transition-all cursor-pointer"
            >
              Retake / Clear Answers
            </button>
          </div>
        )}
      </div>

      {/* 
        RIGHT MAIN WORKSPACE: THE GENERATED WORKSHEET DISPLAYED PROMINENTLY
        Requirement: "display generated worksheet"
        Clean, high-contrast, fully visible without scrolling through forms!
      */}
      <div className="flex-1 w-full min-w-0">
        <div
          id="printable-worksheet-node"
          className={`printable-worksheet rounded-2xl border p-6 md:p-10 shadow-2xl transition-all relative overflow-hidden ${
            isGenerating ? 'border-beam-active animate-border-generating shadow-cyan-500/20' : 'interactive-border-card'
          } ${
            viewMode === 'printable'
              ? 'bg-white text-slate-900 border-slate-300 shadow-none'
              : 'bg-card text-slate-100'
          }`}
          style={{
            backgroundColor: viewMode === 'printable' ? '#ffffff' : theme.bgCard,
            borderColor: viewMode === 'printable' ? '#cbd5e1' : isGenerating ? theme.borderFocus : theme.borderSubtle,
            color: viewMode === 'printable' ? '#0f172a' : undefined,
          }}
        >
          {/* Subtle CEFR Watermark in corner */}
          <div
            className="absolute -right-8 -top-8 select-none pointer-events-none opacity-5 text-9xl font-black uppercase font-mono tracking-tighter"
            style={{ color: viewMode === 'printable' ? '#0f172a' : theme.highlightMint }}
          >
            {currentWorksheet.cefrLevel}
          </div>

          {/* Mode Pill & PDF Download in top right */}
          <div className="absolute top-4 right-4 no-print flex items-center gap-2">
            <button
              type="button"
              disabled={isExportingPdf}
              onClick={handleExportPdf}
              className="px-2.5 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow transition-all cursor-pointer disabled:opacity-50"
              title="Download PDF Document"
            >
              <Download className={`w-3.5 h-3.5 ${isExportingPdf ? 'animate-bounce' : ''}`} />
              <span>{isExportingPdf ? 'Exporting...' : 'Export PDF'}</span>
            </button>

            {viewMode === 'teacher-key' && (
              <span className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                Answer Key Mode Active
              </span>
            )}
            {viewMode === 'interactive' && (
              <span className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                Student Interactive Mode
              </span>
            )}
          </div>

          {/* Institutional Header & Student Info Fields */}
          <div className="border-b pb-6 mb-6 space-y-4" style={{ borderColor: viewMode === 'printable' ? '#e2e8f0' : 'rgba(255,255,255,0.1)' }}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span
                  className="rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider"
                  style={{
                    backgroundColor: viewMode === 'printable' ? '#0f172a' : theme.highlightMint,
                    color: viewMode === 'printable' ? '#ffffff' : '#000000',
                  }}
                >
                  CEFR {currentWorksheet.cefrLevel}
                </span>
                <span className={`text-xs font-semibold ${viewMode === 'printable' ? 'text-slate-600' : 'text-slate-400'}`}>
                  {currentWorksheet.targetSkill} • ~{currentWorksheet.estimatedMinutes} mins
                </span>
              </div>
              <span className={`text-[11px] font-mono ${viewMode === 'printable' ? 'text-slate-500' : 'text-slate-500'}`}>
                LexiLens Pedagogical Standard
              </span>
            </div>

            {/* Title & Subtitle */}
            <div>
              <h1 className={`text-xl md:text-2xl font-black tracking-tight ${viewMode === 'printable' ? 'text-slate-900' : 'text-white'}`}>
                {currentWorksheet.title}
              </h1>
              <p className={`text-xs md:text-sm mt-1 ${viewMode === 'printable' ? 'text-slate-600' : 'text-slate-300'}`}>
                {currentWorksheet.subtitle}
              </p>
            </div>

            {/* Student Name & Date inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
              <div className="flex items-center gap-2">
                <span className={`font-bold ${viewMode === 'printable' ? 'text-slate-700' : 'text-slate-400'}`}>
                  Student:
                </span>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className={`flex-1 border-b px-1 py-0.5 text-xs focus:outline-none ${
                    viewMode === 'printable'
                      ? 'border-slate-400 bg-transparent text-slate-900'
                      : 'border-white/20 bg-transparent text-slate-200 focus:border-cyan-400'
                  }`}
                />
              </div>

              <div className="flex items-center gap-2">
                <span className={`font-bold ${viewMode === 'printable' ? 'text-slate-700' : 'text-slate-400'}`}>
                  Date:
                </span>
                <input
                  type="text"
                  value={studentDate}
                  onChange={(e) => setStudentDate(e.target.value)}
                  className={`flex-1 border-b px-1 py-0.5 text-xs focus:outline-none ${
                    viewMode === 'printable'
                      ? 'border-slate-400 bg-transparent text-slate-900'
                      : 'border-white/20 bg-transparent text-slate-200 focus:border-cyan-400'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* PART 1: CONTEXTUAL READING & VOCABULARY */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-between">
              <h2 className={`text-sm font-bold uppercase tracking-wider flex items-center gap-2 ${
                viewMode === 'printable' ? 'text-slate-900' : 'text-cyan-400'
              }`}>
                <BookOpen className="w-4 h-4" />
                <span>1. Contextual Reading: {currentWorksheet.content?.readingTitle}</span>
              </h2>

              <button
                type="button"
                onClick={handleToggleAudio}
                className="no-print text-xs flex items-center gap-1 text-slate-400 hover:text-white cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{isPlayingAudio ? 'Stop' : 'Listen'}</span>
              </button>
            </div>

            {/* Reading Passage */}
            <div
              className={`p-4 md:p-5 rounded-xl text-xs md:text-sm leading-relaxed border interactive-border-card ${
                viewMode === 'printable'
                  ? 'bg-slate-50 border-slate-200 text-slate-800'
                  : 'bg-black/30 border-white/10 text-slate-200'
              }`}
            >
              {currentWorksheet.content?.readingPassage}
            </div>

            {/* Vocabulary Glossary / Notes */}
            {currentWorksheet.content?.vocabNotes?.length > 0 && (
              <div className="space-y-2">
                <h3 className={`text-xs font-bold uppercase tracking-wider ${viewMode === 'printable' ? 'text-slate-700' : 'text-slate-400'}`}>
                  Key Lexicon & Discourse Markers
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                  {currentWorksheet.content.vocabNotes.map((vocab, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-xl border text-xs space-y-1 interactive-border-card ${
                        viewMode === 'printable'
                          ? 'bg-slate-100/70 border-slate-300 text-slate-800'
                          : 'bg-white/5 border-white/10 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`font-bold ${viewMode === 'printable' ? 'text-slate-900' : 'text-white'}`}>
                          {vocab.word}
                        </span>
                        {vocab.phonetic && (
                          <span className="text-[10px] font-mono text-slate-400">{vocab.phonetic}</span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug">{vocab.definition}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* A. W/H QUESTIONS FROM TEXT */}
            {currentWorksheet.content?.whQuestions && currentWorksheet.content.whQuestions.length > 0 && (
              <div className="mt-6 space-y-3">
                <h3 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${viewMode === 'printable' ? 'text-slate-800' : 'text-cyan-300'}`}>
                  <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
                  <span>A. Reading Comprehension: W/H Questions</span>
                </h3>
                <div className="space-y-3">
                  {currentWorksheet.content.whQuestions.map((wh, idx) => (
                    <div
                      key={wh.id}
                      className={`p-3.5 rounded-xl border text-xs md:text-sm space-y-2 ${
                        viewMode === 'printable'
                          ? 'bg-slate-50 border-slate-200 text-slate-900'
                          : 'bg-black/20 border-white/10 text-slate-200'
                      }`}
                    >
                      <p className="font-semibold leading-relaxed">
                        <span className="font-bold text-cyan-400 mr-1.5">Q{idx + 1}.</span> {wh.question}
                      </p>
                      {viewMode === 'teacher-key' ? (
                        <p className="text-xs text-emerald-300 font-medium bg-emerald-950/30 p-2 rounded-lg border border-emerald-500/30">
                          <strong>Sample Answer:</strong> {wh.sampleAnswer}
                        </p>
                      ) : viewMode === 'printable' ? (
                        <div className="h-10 border-b border-dashed border-slate-400 mt-2" />
                      ) : (
                        <textarea
                          rows={2}
                          value={userWhAnswers[wh.id] || ''}
                          onChange={(e) => setUserWhAnswers({ ...userWhAnswers, [wh.id]: e.target.value })}
                          placeholder="Write your complete answer here..."
                          className="w-full rounded-lg border border-white/15 bg-black/50 p-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* B. CORRECT FALSE STATEMENTS FROM TEXT */}
            {currentWorksheet.content?.falseStatements && currentWorksheet.content.falseStatements.length > 0 && (
              <div className="mt-6 space-y-3">
                <h3 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${viewMode === 'printable' ? 'text-slate-800' : 'text-amber-300'}`}>
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>B. True or False? Correct the False Statements</span>
                </h3>
                <div className="space-y-3">
                  {currentWorksheet.content.falseStatements.map((fs, idx) => (
                    <div
                      key={fs.id}
                      className={`p-3.5 rounded-xl border text-xs md:text-sm space-y-2 ${
                        viewMode === 'printable'
                          ? 'bg-slate-50 border-slate-200 text-slate-900'
                          : 'bg-black/20 border-white/10 text-slate-200'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <p className="font-medium flex-1">
                          <span className="font-bold mr-1.5">{idx + 1}.</span> "{fs.statement}"
                        </p>
                        {viewMode === 'teacher-key' && (
                          <span className={`px-2.5 py-1 rounded text-xs font-bold font-mono ${
                            fs.isTrue ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                          }`}>
                            {fs.isTrue ? 'TRUE' : 'FALSE'}
                          </span>
                        )}
                      </div>
                      {viewMode === 'teacher-key' ? (
                        <p className="text-xs text-emerald-300 font-medium bg-emerald-950/30 p-2 rounded-lg border border-emerald-500/30">
                          {fs.correctAnswer}
                        </p>
                      ) : viewMode === 'printable' ? (
                        <div className="flex items-center gap-4 text-xs pt-1">
                          <span className="font-bold">[  ] True   [  ] False</span>
                          <span className="flex-1 border-b border-dashed border-slate-400 h-5">Correction: </span>
                        </div>
                      ) : (
                        <div className="space-y-2 pt-1">
                          <div className="flex items-center gap-4">
                            <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                              <input
                                type="radio"
                                name={`fs-${fs.id}`}
                                checked={userFalseAnswers[fs.id]?.choice === true}
                                onChange={() => setUserFalseAnswers({ ...userFalseAnswers, [fs.id]: { ...userFalseAnswers[fs.id], choice: true } })}
                                className="accent-cyan-400"
                              />
                              <span className="font-semibold text-emerald-400">True</span>
                            </label>
                            <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                              <input
                                type="radio"
                                name={`fs-${fs.id}`}
                                checked={userFalseAnswers[fs.id]?.choice === false}
                                onChange={() => setUserFalseAnswers({ ...userFalseAnswers, [fs.id]: { ...userFalseAnswers[fs.id], choice: false } })}
                                className="accent-rose-400"
                              />
                              <span className="font-semibold text-rose-400">False</span>
                            </label>
                          </div>
                          <input
                            type="text"
                            value={userFalseAnswers[fs.id]?.correction || ''}
                            onChange={(e) => setUserFalseAnswers({ ...userFalseAnswers, [fs.id]: { ...userFalseAnswers[fs.id], correction: e.target.value } })}
                            placeholder="If False, write the correct statement here..."
                            className="w-full rounded-lg border border-white/15 bg-black/50 p-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* C. REFERENCE QUESTIONS */}
            {currentWorksheet.content?.referenceQuestions && currentWorksheet.content.referenceQuestions.length > 0 && (
              <div className="mt-6 space-y-3">
                <h3 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${viewMode === 'printable' ? 'text-slate-800' : 'text-purple-300'}`}>
                  <BookmarkPlus className="w-3.5 h-3.5 text-purple-400" />
                  <span>C. Pronoun Reference Questions</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {currentWorksheet.content.referenceQuestions.map((ref, idx) => (
                    <div
                      key={ref.id}
                      className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                        viewMode === 'printable'
                          ? 'bg-slate-50 border-slate-200 text-slate-900'
                          : 'bg-black/20 border-white/10 text-slate-200'
                      }`}
                    >
                      <p className="font-semibold">
                        What does the word <strong className="text-purple-400 underline font-mono px-1">"{ref.word}"</strong> ({ref.location}) refer to in the text?
                      </p>
                      {viewMode === 'teacher-key' ? (
                        <p className="text-xs text-emerald-300 font-bold bg-emerald-950/30 p-2 rounded-lg border border-emerald-500/30">
                          Refers to: {ref.refersTo}
                        </p>
                      ) : viewMode === 'printable' ? (
                        <div className="border-b border-dashed border-slate-400 h-6" />
                      ) : (
                        <input
                          type="text"
                          value={userRefAnswers[ref.id] || ''}
                          onChange={(e) => setUserRefAnswers({ ...userRefAnswers, [ref.id]: e.target.value })}
                          placeholder="Type what it refers to..."
                          className="w-full rounded-lg border border-white/15 bg-black/50 p-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* D. PERSONAL OPINION PROMPT */}
            {currentWorksheet.content?.opinionQuestion && (
              <div className="mt-6 space-y-3">
                <h3 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${viewMode === 'printable' ? 'text-slate-800' : 'text-emerald-300'}`}>
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                  <span>D. Personal Opinion & Expression</span>
                </h3>
                <div className={`p-4 rounded-xl border text-xs md:text-sm space-y-2 ${
                  viewMode === 'printable' ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-black/20 border-white/10 text-slate-200'
                }`}>
                  <p className="font-semibold leading-relaxed text-emerald-300">
                    🗣️ {currentWorksheet.content.opinionQuestion.question}
                  </p>
                  <p className={`text-[11px] italic ${viewMode === 'printable' ? 'text-slate-600' : 'text-slate-400'}`}>
                    💡 {currentWorksheet.content.opinionQuestion.promptGuide}
                  </p>
                  {viewMode === 'printable' ? (
                    <div className="h-20 border-b border-dashed border-slate-400 mt-2" />
                  ) : (
                    <textarea
                      rows={3}
                      value={userOpinionText}
                      onChange={(e) => setUserOpinionText(e.target.value)}
                      placeholder="In my opinion..."
                      className="w-full rounded-lg border border-white/15 bg-black/50 p-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                  )}
                </div>
              </div>
            )}
          </div>

          {/* PART 2: LANGUAGE TASKS (WORD BANK, FILL BLANKS, FORM & TENSE, MATCHING) */}
          <div className="space-y-6 mb-8">
            <h2 className={`text-sm font-bold uppercase tracking-wider flex items-center gap-2 ${
              viewMode === 'printable' ? 'text-slate-900' : 'text-cyan-400'
            }`}>
              <CheckCircle2 className="w-4 h-4" />
              <span>2. Language Tasks & Grammar Mechanics</span>
            </h2>

            {/* WORD BANK DISPLAY BOX */}
            {currentWorksheet.content?.wordBank && currentWorksheet.content.wordBank.length > 0 && (
              <div className={`p-4 rounded-xl border text-xs space-y-2 ${
                viewMode === 'printable' ? 'bg-slate-100 border-slate-300 text-slate-900' : 'bg-cyan-950/20 border-cyan-500/30 text-cyan-200'
              }`}>
                <p className="font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Word Bank (Use these words for fill-in-the-blanks below):</span>
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {currentWorksheet.content.wordBank.map((wbWord, i) => (
                    <span
                      key={i}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                        viewMode === 'printable'
                          ? 'bg-white border-slate-300 text-slate-800'
                          : 'bg-black/40 border-cyan-400/40 text-cyan-300 font-mono'
                      }`}
                    >
                      {wbWord}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* FORM AND TENSE EXERCISES */}
            {currentWorksheet.content?.formAndTenseExercises && (
              <div className="space-y-3">
                <h3 className={`text-xs font-bold uppercase tracking-wider ${viewMode === 'printable' ? 'text-slate-800' : 'text-cyan-300'}`}>
                  A. Form & Tense: Put verbs in parentheses into correct form
                </h3>
                <p className={`text-xs italic ${viewMode === 'printable' ? 'text-slate-600' : 'text-slate-400'}`}>
                  {currentWorksheet.content.formAndTenseExercises.instruction}
                </p>
                <div className="space-y-3">
                  {currentWorksheet.content.formAndTenseExercises.items?.map((ft, idx) => (
                    <div
                      key={ft.id}
                      className={`p-3.5 rounded-xl border text-xs md:text-sm transition-all ${
                        viewMode === 'printable'
                          ? 'bg-slate-50 border-slate-200 text-slate-800'
                          : 'bg-black/20 border-white/10 text-slate-200'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex-1 leading-relaxed">
                          <span className="font-bold mr-2">{idx + 1}.</span>
                          <span>{ft.sentence}</span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {viewMode === 'teacher-key' ? (
                            <span className="rounded-lg px-2.5 py-1 text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-mono">
                              Correct Form: {ft.correctForm}
                            </span>
                          ) : viewMode === 'printable' ? (
                            <span className="inline-block border-b-2 border-slate-500 w-32 h-5" />
                          ) : (
                            <input
                              type="text"
                              value={userFormTenseAnswers[ft.id] || ''}
                              onChange={(e) => setUserFormTenseAnswers({ ...userFormTenseAnswers, [ft.id]: e.target.value })}
                              placeholder={`Form for (${ft.baseVerb})...`}
                              className="rounded-lg border border-white/15 bg-black/50 px-2.5 py-1 text-xs text-white focus:outline-none focus:border-cyan-400 w-36"
                            />
                          )}
                        </div>
                      </div>
                      {viewMode === 'teacher-key' && ft.explanation && (
                        <p className="text-[11px] text-emerald-400 mt-2 font-medium">
                          💡 Rule: {ft.explanation}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* MATCH SENTENCE PARTS (COLUMN A TO COLUMN B) */}
            {currentWorksheet.content?.matchingExercises && (
              <div className="space-y-3">
                <h3 className={`text-xs font-bold uppercase tracking-wider ${viewMode === 'printable' ? 'text-slate-800' : 'text-purple-300'}`}>
                  B. Match Sentence Parts (Column A to Column B)
                </h3>
                <p className={`text-xs italic ${viewMode === 'printable' ? 'text-slate-600' : 'text-slate-400'}`}>
                  {currentWorksheet.content.matchingExercises.instruction}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase text-slate-400">Column A (Beginning)</h4>
                    {currentWorksheet.content.matchingExercises.items?.map((m) => (
                      <div key={m.id} className={`p-3 rounded-lg border text-xs font-medium ${
                        viewMode === 'printable' ? 'bg-white border-slate-300 text-slate-900' : 'bg-black/30 border-white/10 text-slate-200'
                      }`}>
                        {m.partA}
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase text-slate-400">Column B (Ending)</h4>
                    {currentWorksheet.content.matchingExercises.items?.map((m) => (
                      <div key={m.id} className={`p-3 rounded-lg border text-xs font-medium ${
                        viewMode === 'printable' ? 'bg-white border-slate-300 text-slate-900' : 'bg-black/30 border-white/10 text-slate-200'
                      }`}>
                        {m.partB}
                      </div>
                    ))}
                  </div>
                </div>
                {viewMode === 'teacher-key' && (
                  <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-300 font-mono space-y-1">
                    <strong>Answer Key Matching:</strong>
                    {currentWorksheet.content.matchingExercises.items?.map((m, i) => (
                      <div key={i}>Part {i+1} matches {m.correctMatchId}</div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* PART 2: VOCABULARY EXERCISES (FILL IN THE BLANKS) */}
          <div className="space-y-4 mb-8">
            <h2 className={`text-sm font-bold uppercase tracking-wider flex items-center gap-2 ${
              viewMode === 'printable' ? 'text-slate-900' : 'text-cyan-400'
            }`}>
              <CheckCircle2 className="w-4 h-4" />
              <span>2. Vocabulary Application (Fill-in-the-Blank)</span>
            </h2>
            <p className={`text-xs italic ${viewMode === 'printable' ? 'text-slate-600' : 'text-slate-400'}`}>
              {currentWorksheet.content?.vocabExercises?.instruction}
            </p>

            <div className="space-y-3">
              {currentWorksheet.content?.vocabExercises?.items?.map((item, idx) => {
                const userAns = userVocabAnswers[item.id] || '';
                const isCorrect = checkedAnswers && userAns.trim().toLowerCase() === item.blankWord.trim().toLowerCase();
                const isWrong = checkedAnswers && userAns.trim() !== '' && !isCorrect;

                return (
                  <div
                    key={item.id}
                    className={`p-3 rounded-xl border text-xs md:text-sm transition-all ${
                      viewMode === 'printable'
                        ? 'bg-slate-50 border-slate-200 text-slate-800'
                        : 'bg-black/20 border-white/10 text-slate-200'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex-1 leading-relaxed">
                        <span className="font-bold mr-2">{idx + 1}.</span>
                        <span>{item.sentence}</span>
                      </div>

                      {/* Input in Student mode, or Reveal in Answer Key */}
                      <div className="flex items-center gap-2 shrink-0">
                        {viewMode === 'teacher-key' ? (
                          <span className="rounded-lg px-2.5 py-1 text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-mono">
                            Answer: {item.blankWord}
                          </span>
                        ) : viewMode === 'printable' ? (
                          <span className="inline-block border-b-2 border-slate-500 w-32 h-5" />
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <input
                              type="text"
                              value={userAns}
                              onChange={(e) =>
                                setUserVocabAnswers({
                                  ...userVocabAnswers,
                                  [item.id]: e.target.value,
                                })
                              }
                              placeholder={item.hint || 'Type target word...'}
                              className={`rounded-lg border px-2.5 py-1 text-xs focus:outline-none w-36 ${
                                isCorrect
                                  ? 'border-emerald-500 bg-emerald-950/30 text-emerald-300'
                                  : isWrong
                                  ? 'border-rose-500 bg-rose-950/30 text-rose-300'
                                  : 'border-white/15 bg-black/50 text-white focus:border-cyan-400'
                              }`}
                            />
                            {isCorrect && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* PART 3: GRAMMAR & SYNTAX MASTERY (OPEN-ENDED SENTENCE TRANSFORMATION) */}
          <div className="space-y-4 mb-8">
            <h2 className={`text-sm font-bold uppercase tracking-wider flex items-center gap-2 ${
              viewMode === 'printable' ? 'text-slate-900' : 'text-cyan-400'
            }`}>
              <GraduationCap className="w-4 h-4" />
              <span>3. Sentence Transformation & Structural Revision</span>
            </h2>
            <p className={`text-xs italic ${viewMode === 'printable' ? 'text-slate-600' : 'text-slate-400'}`}>
              {currentWorksheet.content?.grammarExercises?.instruction || 'Rewrite and transform each sentence using the specified target structure.'}
            </p>

            <div className="space-y-4">
              {currentWorksheet.content?.grammarExercises?.items?.map((item, idx) => {
                const userSelection = userGrammarAnswers[item.id];
                const userText = userGrammarTextAnswers[item.id] || '';
                const isAnswerKey = viewMode === 'teacher-key';

                return (
                  <div
                    key={item.id}
                    className={`p-4 rounded-xl border text-xs md:text-sm space-y-3 ${
                      viewMode === 'printable'
                        ? 'bg-slate-50 border-slate-200 text-slate-800'
                        : 'bg-black/20 border-white/10 text-slate-200'
                    }`}
                  >
                    <p className="font-bold leading-relaxed">
                      <span className="text-cyan-400 font-mono mr-1.5">{idx + 1}.</span> {item.prompt}
                    </p>

                    {item.originalSentence && (
                      <div className={`p-2.5 rounded-lg border text-xs ${
                        viewMode === 'printable' ? 'bg-white border-slate-300 text-slate-700' : 'bg-black/30 border-white/10 text-slate-300'
                      }`}>
                        <span className="font-semibold text-slate-400 mr-2">Original Sentence:</span>
                        <span className="italic">"{item.originalSentence}"</span>
                      </div>
                    )}

                    {item.options && item.options.length > 0 ? (
                      /* Fallback for legacy items with options */
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {item.options.map((opt, optIdx) => {
                          const isChosen = userSelection === optIdx;
                          const isCorrectOpt = optIdx === item.correctIndex;

                          return (
                            <button
                              key={optIdx}
                              type="button"
                              disabled={viewMode === 'printable'}
                              onClick={() =>
                                setUserGrammarAnswers({
                                  ...userGrammarAnswers,
                                  [item.id]: optIdx,
                                })
                              }
                              className={`p-2 rounded-lg border text-left text-xs transition-all flex items-center gap-2 cursor-pointer ${
                                isAnswerKey && isCorrectOpt
                                  ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300 font-bold'
                                  : checkedAnswers && isChosen && !isCorrectOpt
                                  ? 'border-rose-500 bg-rose-950/40 text-rose-300'
                                  : isChosen
                                  ? 'border-cyan-400 bg-cyan-950/40 text-cyan-200'
                                  : viewMode === 'printable'
                                  ? 'border-slate-300 bg-white text-slate-800'
                                  : 'border-white/10 bg-black/40 text-slate-300 hover:border-white/20'
                              }`}
                            >
                              <span className="font-mono font-bold text-[10px] uppercase rounded px-1.5 py-0.5 bg-white/10">
                                {String.fromCharCode(65 + optIdx)}
                              </span>
                              <span className="flex-1">{opt}</span>
                              {isAnswerKey && isCorrectOpt && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      /* Standard Open-Ended Response Field */
                      <div className="space-y-2">
                        {isAnswerKey ? (
                          <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 font-mono text-xs">
                            <span className="font-bold text-emerald-400 block mb-1">Target Transformed Answer:</span>
                            {item.targetAnswer || item.explanation}
                          </div>
                        ) : viewMode === 'printable' ? (
                          <div className="pt-2 pb-1 border-b-2 border-slate-400 border-dashed text-slate-400 italic text-xs">
                            Write your revised sentence here...
                          </div>
                        ) : (
                          <input
                            type="text"
                            value={userText}
                            onChange={(e) =>
                              setUserGrammarTextAnswers({
                                ...userGrammarTextAnswers,
                                [item.id]: e.target.value,
                              })
                            }
                            placeholder="Type your transformed sentence..."
                            className="w-full rounded-lg border border-white/15 bg-black/50 px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                          />
                        )}
                      </div>
                    )}

                    {isAnswerKey && item.explanation && (
                      <p className="text-[11px] text-emerald-400 font-medium bg-emerald-950/20 p-2 rounded-lg border border-emerald-500/20 mt-1">
                        <strong>Pedagogical Explanation:</strong> {item.explanation}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* PART 5: AUTHENTIC WRITING STUDIO & STRUCTURAL GUIDANCE */}
          <div className="space-y-4 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div>
                <h2 className={`text-sm font-bold uppercase tracking-wider flex items-center gap-2 ${
                  viewMode === 'printable' ? 'text-slate-900' : 'text-cyan-400'
                }`}>
                  <PenTool className="w-4 h-4 text-cyan-400" />
                  <span>5. Writing Studio & Structural Guidance</span>
                </h2>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Real-time medium templates, discourse formula vault, and structural guidance.
                </p>
              </div>

              {/* Format Switcher Buttons */}
              <div className="no-print flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10 text-xs">
                <button
                  type="button"
                  onClick={() => { setWritingFormat('email'); setAiWritingAnalysis(null); }}
                  className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    writingFormat === 'email' ? 'bg-cyan-500 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>E-Mail</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setWritingFormat('article'); setAiWritingAnalysis(null); }}
                  className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    writingFormat === 'article' ? 'bg-cyan-500 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Newspaper className="w-3.5 h-3.5" />
                  <span>Press Article</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setWritingFormat('facebook'); setAiWritingAnalysis(null); }}
                  className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    writingFormat === 'facebook' ? 'bg-cyan-500 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Facebook Post</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setWritingFormat('blog'); setAiWritingAnalysis(null); }}
                  className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    writingFormat === 'blog' ? 'bg-cyan-500 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Blog Entry</span>
                </button>
              </div>
            </div>

            {/* Prompt Banner */}
            <div className={`p-3 rounded-xl border text-xs leading-relaxed ${
              viewMode === 'printable' ? 'bg-slate-100 border-slate-300 text-slate-800' : 'bg-cyan-950/30 border-cyan-500/20 text-cyan-200'
            }`}>
              <strong className="text-white font-semibold">Writing Task Prompt: </strong>
              <span>{currentWorksheet.content?.writingTask?.prompt || `Compose a piece using the target grammar and vocabulary. Format: ${writingFormat.toUpperCase()}`}</span>
            </div>

            {/* Inserted Toast Notification */}
            {insertedPhraseToast && (
              <div className="p-2 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono animate-fadeIn">
                ✓ {insertedPhraseToast}
              </div>
            )}

            {/* TWO-COLUMN WRITING WORKSPACE */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* LEFT COLUMN: SPECIFIC FORMAT INTERACTIVE EDITOR */}
              <div className="lg:col-span-7 space-y-4">
                <div className={`rounded-2xl border p-4 sm:p-5 space-y-4 ${
                  viewMode === 'printable'
                    ? 'bg-white border-slate-300 text-slate-900 shadow-sm'
                    : 'bg-black/30 border-white/15 text-slate-100 shadow-xl'
                }`}>
                  {/* 1. EMAIL LAYOUT */}
                  {writingFormat === 'email' && (
                    <div className="space-y-3 font-sans">
                      <div className={`p-3 rounded-xl border text-xs space-y-2 ${
                        viewMode === 'printable' ? 'bg-slate-100 border-slate-300' : 'bg-white/5 border-white/10'
                      }`}>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-400 w-16">To:</span>
                          <span className="font-mono text-cyan-400">{currentWorksheet.content?.writingTask?.emailFields?.to || 'classmate@school.edu'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-400 w-16">From:</span>
                          <span className="font-mono text-cyan-400">{currentWorksheet.content?.writingTask?.emailFields?.from || 'pupil@school.edu'}</span>
                        </div>
                        <div className="flex items-center gap-2 border-t border-white/10 pt-2">
                          <span className="font-bold text-slate-400 w-16">Subject:</span>
                          <span className="font-semibold text-white">{currentWorksheet.content?.writingTask?.emailFields?.subject || 'Everyday Routine & Learning English'}</span>
                        </div>
                      </div>

                      {/* Salutation Guidance */}
                      <div className="flex items-center justify-between text-xs pt-1">
                        <span className="font-semibold text-cyan-300">Dear [Classmate&apos;s Name],</span>
                        <span className="text-[10px] text-slate-400 bg-black/40 px-2 py-0.5 rounded border border-white/10">Register: Semi-Formal / Friendly</span>
                      </div>

                      {viewMode === 'printable' ? (
                        <div className="h-40 border-b border-dashed border-slate-400" />
                      ) : (
                        <textarea
                          rows={7}
                          value={userWritingText}
                          onChange={(e) => setUserWritingText(e.target.value)}
                          placeholder="Type your email body here... (Use formulas from the right sidebar)"
                          className="w-full rounded-xl border border-white/15 bg-black/60 p-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 leading-relaxed font-sans"
                        />
                      )}

                      {/* Sign-off Guidance */}
                      <div className="text-xs space-y-1 pt-1 border-t border-white/10">
                        <p className="font-semibold text-cyan-300">Best regards,</p>
                        <p className="italic text-slate-300 font-bold">{studentName || 'Alex Rivera'}</p>
                      </div>
                    </div>
                  )}

                  {/* 2. ARTICLE LAYOUT */}
                  {writingFormat === 'article' && (
                    <div className="space-y-4">
                      <div className={`p-4 rounded-xl border text-center space-y-2 ${
                        viewMode === 'printable' ? 'bg-slate-100 border-slate-300' : 'bg-gradient-to-r from-cyan-950/40 via-purple-950/40 to-cyan-950/40 border-cyan-500/30'
                      }`}>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 bg-cyan-950/60 px-2.5 py-0.5 rounded-full border border-cyan-500/30">
                          📰 THE STUDENT CHRONICLE • PRESS EDITION
                        </span>
                        <h3 className="text-base font-extrabold tracking-tight text-white">
                          {currentWorksheet.content?.writingTask?.articleFields?.headline || 'How Everyday Habits Shape Student Language Mastery'}
                        </h3>
                        <div className="flex items-center justify-center gap-3 text-[11px] text-slate-400 pt-1">
                          <span>By Pupil Reporter: <strong className="text-white">{studentName || 'Alex Rivera'}</strong></span>
                          <span>•</span>
                          <span>Category: {currentWorksheet.content?.writingTask?.articleFields?.category || 'Education & Life'}</span>
                        </div>
                      </div>

                      {viewMode === 'printable' ? (
                        <div className="h-44 border-b border-dashed border-slate-400" />
                      ) : (
                        <textarea
                          rows={8}
                          value={userWritingText}
                          onChange={(e) => setUserWritingText(e.target.value)}
                          placeholder="Write your article draft here... Include a hook, body arguments, and conclusion."
                          className="w-full rounded-xl border border-white/15 bg-black/60 p-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 leading-relaxed"
                        />
                      )}
                    </div>
                  )}

                  {/* 3. FACEBOOK POST LAYOUT */}
                  {writingFormat === 'facebook' && (
                    <div className={`rounded-xl border p-4 space-y-3 ${
                      viewMode === 'printable' ? 'bg-slate-50 border-slate-300' : 'bg-black/40 border-cyan-500/30'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-500 flex items-center justify-center font-bold text-white text-xs shadow-md">
                            P
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white flex items-center gap-1">
                              <span>{currentWorksheet.content?.writingTask?.facebookFields?.authorName || 'Everyday English Pupil Corner'}</span>
                              <span className="text-cyan-400">✓</span>
                            </p>
                            <p className="text-[10px] text-slate-400">
                              {currentWorksheet.content?.writingTask?.facebookFields?.handle || '@english_pupils_daily'} • {currentWorksheet.content?.writingTask?.facebookFields?.timeAgo || 'Just now • 🌐'}
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] bg-cyan-950/60 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-full font-mono">
                          Social Post Template
                        </span>
                      </div>

                      {viewMode === 'printable' ? (
                        <div className="h-32 border-b border-dashed border-slate-400" />
                      ) : (
                        <textarea
                          rows={5}
                          value={userWritingText}
                          onChange={(e) => setUserWritingText(e.target.value)}
                          placeholder="What is on your mind? Share your daily routine in English..."
                          className="w-full rounded-xl border border-white/15 bg-black/60 p-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 leading-relaxed"
                        />
                      )}

                      {/* Hashtags Bar */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[10px] text-slate-400 font-semibold">Suggested Tags:</span>
                        {(currentWorksheet.content?.writingTask?.facebookFields?.hashtags || ['#EverydayEnglish', '#GrammarInUse', '#PupilsDaily', '#MyRoutine']).map((tag, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => handleInsertPhrase(tag)}
                            className="text-[10px] font-medium text-cyan-300 bg-cyan-950/50 hover:bg-cyan-900/60 px-2 py-0.5 rounded-md border border-cyan-500/30 transition-all cursor-pointer"
                          >
                            {tag}
                          </button>
                        ))}
                      </div>

                      {/* Social Interactive Action Bar */}
                      <div className="flex items-center justify-between border-t border-white/10 pt-2.5 no-print text-xs text-slate-400">
                        <button
                          type="button"
                          onClick={() => {
                            setFacebookLiked(!facebookLiked);
                            setFacebookLikeCount(facebookLiked ? facebookLikeCount - 1 : facebookLikeCount + 1);
                          }}
                          className={`flex items-center gap-1.5 font-semibold transition-colors cursor-pointer ${
                            facebookLiked ? 'text-cyan-400' : 'hover:text-white'
                          }`}
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span>{facebookLikeCount} Likes</span>
                        </button>
                        <button type="button" className="flex items-center gap-1.5 font-semibold hover:text-white cursor-pointer">
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>3 Comments</span>
                        </button>
                        <button type="button" className="flex items-center gap-1.5 font-semibold hover:text-white cursor-pointer">
                          <Share2 className="w-3.5 h-3.5" />
                          <span>Share</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* 4. BLOG POST LAYOUT */}
                  {writingFormat === 'blog' && (
                    <div className="space-y-4">
                      <div className={`p-4 rounded-xl border space-y-2 ${
                        viewMode === 'printable' ? 'bg-slate-100 border-slate-300' : 'bg-black/40 border-purple-500/30'
                      }`}>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300 bg-purple-950/60 px-2.5 py-0.5 rounded-full border border-purple-500/30">
                            {currentWorksheet.content?.writingTask?.blogFields?.category || 'STUDENT DISCOVERY BLOG'}
                          </span>
                          <span className="text-[10px] text-slate-400">Published: September 15, 2026</span>
                        </div>
                        <h3 className="text-base font-bold text-white">
                          {currentWorksheet.content?.writingTask?.blogFields?.title || 'Learning English Through Everyday Life Themes'}
                        </h3>
                        <p className="text-[11px] text-slate-400">By Author: <strong className="text-white">{studentName || 'Alex Rivera'}</strong> • 3 min read</p>
                      </div>

                      {viewMode === 'printable' ? (
                        <div className="h-40 border-b border-dashed border-slate-400" />
                      ) : (
                        <textarea
                          rows={7}
                          value={userWritingText}
                          onChange={(e) => setUserWritingText(e.target.value)}
                          placeholder="Write your blog post entry here... Include key takeaways and a question for readers."
                          className="w-full rounded-xl border border-white/15 bg-black/60 p-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-400 leading-relaxed font-sans"
                        />
                      )}

                      <div className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                        viewMode === 'printable' ? 'bg-slate-100 border-slate-300' : 'bg-white/5 border-white/10'
                      }`}>
                        <span className="text-slate-400">Author Bio: <strong className="text-white">{studentName || 'Alex Rivera'}</strong></span>
                        <span className="text-[10px] text-purple-400">💬 Reader Comments Enabled</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT COLUMN: STRUCTURAL GUIDANCE & FORMULA VAULT SIDEBAR */}
              <div className="lg:col-span-5 space-y-4 no-print">
                {/* 1. WORD COUNT & REGISTER BAR */}
                <div className="p-4 rounded-2xl border border-white/15 bg-black/40 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-300 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Live Length & Register</span>
                    </span>
                    <span className="font-mono text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30 text-[10px]">
                      {userWritingText.trim() ? userWritingText.trim().split(/\s+/).length : 0} Words
                    </span>
                  </div>

                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-purple-500 h-full transition-all duration-300"
                      style={{
                        width: `${Math.min(
                          100,
                          ((userWritingText.trim() ? userWritingText.trim().split(/\s+/).length : 0) / 80) * 100
                        )}%`,
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>Target: 40-100 words</span>
                    <span className="capitalize font-semibold text-cyan-400">Format: {writingFormat}</span>
                  </div>
                </div>

                {/* 2. FORMULA VAULT & PHRASE BANK */}
                <div className="p-4 rounded-2xl border border-white/15 bg-black/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-yellow-400" />
                      <span>Discourse Formula Vault</span>
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowFormulaVault(!showFormulaVault)}
                      className="text-[10px] text-slate-400 hover:text-white"
                    >
                      {showFormulaVault ? 'Hide' : 'Show'}
                    </button>
                  </div>

                  {showFormulaVault && (
                    <div className="space-y-2.5 text-xs">
                      <p className="text-[11px] text-slate-400">Click any phrase to insert it directly into your writing:</p>

                      {/* EMAIL FORMULAS */}
                      {writingFormat === 'email' && (
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Opening & Courtesy:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {['I hope this email finds you well.', 'I am writing to share details about...', 'Thank you for your recent message.'].map((phrase, i) => (
                              <button
                                key={i}
                                type="button"
                                onClick={() => handleInsertPhrase(phrase)}
                                className="text-[11px] bg-white/5 hover:bg-cyan-500/20 text-slate-200 hover:text-cyan-200 p-1.5 rounded-lg border border-white/10 hover:border-cyan-500/40 transition-all text-left cursor-pointer"
                              >
                                + {phrase}
                              </button>
                            ))}
                          </div>

                          <span className="text-[10px] font-bold text-slate-400 uppercase pt-1 block">Closing Formulae:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {['Looking forward to hearing from you soon.', 'Please let me know if you have any questions.', 'Best regards,'].map((phrase, i) => (
                              <button
                                key={i}
                                type="button"
                                onClick={() => handleInsertPhrase(phrase)}
                                className="text-[11px] bg-white/5 hover:bg-cyan-500/20 text-slate-200 hover:text-cyan-200 p-1.5 rounded-lg border border-white/10 hover:border-cyan-500/40 transition-all text-left cursor-pointer"
                              >
                                + {phrase}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* ARTICLE FORMULAS */}
                      {writingFormat === 'article' && (
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Journalistic Hooks:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {['Have you ever wondered how daily habits shape success?', 'In today’s fast-paced student life, routines matter.'].map((phrase, i) => (
                              <button
                                key={i}
                                type="button"
                                onClick={() => handleInsertPhrase(phrase)}
                                className="text-[11px] bg-white/5 hover:bg-cyan-500/20 text-slate-200 hover:text-cyan-200 p-1.5 rounded-lg border border-white/10 hover:border-cyan-500/40 transition-all text-left cursor-pointer"
                              >
                                + {phrase}
                              </button>
                            ))}
                          </div>

                          <span className="text-[10px] font-bold text-slate-400 uppercase pt-1 block">Connectors & Conclusions:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {['First and foremost,', 'Furthermore, recent observations show that', 'In conclusion, establishing a habit...'].map((phrase, i) => (
                              <button
                                key={i}
                                type="button"
                                onClick={() => handleInsertPhrase(phrase)}
                                className="text-[11px] bg-white/5 hover:bg-cyan-500/20 text-slate-200 hover:text-cyan-200 p-1.5 rounded-lg border border-white/10 hover:border-cyan-500/40 transition-all text-left cursor-pointer"
                              >
                                + {phrase}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* FACEBOOK FORMULAS */}
                      {writingFormat === 'facebook' && (
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Social Engagement Starters:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {['Hey everyone! 👋 Quick question for today:', 'Guess what I learned about my morning routine? ☀️', 'What is your number one favorite daily habit?'].map((phrase, i) => (
                              <button
                                key={i}
                                type="button"
                                onClick={() => handleInsertPhrase(phrase)}
                                className="text-[11px] bg-white/5 hover:bg-cyan-500/20 text-slate-200 hover:text-cyan-200 p-1.5 rounded-lg border border-white/10 hover:border-cyan-500/40 transition-all text-left cursor-pointer"
                              >
                                + {phrase}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* BLOG FORMULAS */}
                      {writingFormat === 'blog' && (
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Blog Openers & Reader Calls:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {['Welcome back to the blog! Today we explore...', 'Key Takeaway #1:', 'What are your thoughts on this topic? Comment below!'].map((phrase, i) => (
                              <button
                                key={i}
                                type="button"
                                onClick={() => handleInsertPhrase(phrase)}
                                className="text-[11px] bg-white/5 hover:bg-cyan-500/20 text-slate-200 hover:text-cyan-200 p-1.5 rounded-lg border border-white/10 hover:border-cyan-500/40 transition-all text-left cursor-pointer"
                              >
                                + {phrase}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* 3. AI STRUCTURAL ANALYSIS BUTTON & RESULTS CARD */}
                <div className="p-4 rounded-2xl border border-white/15 bg-black/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      <span>AI Structural Coach</span>
                    </span>
                    <button
                      type="button"
                      onClick={handleAnalyzeWriting}
                      disabled={isAnalyzingWriting}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 transition-all shadow-md cursor-pointer disabled:opacity-50"
                    >
                      {isAnalyzingWriting ? 'Analyzing...' : 'Analyze Structure & Grammar'}
                    </button>
                  </div>

                  {aiWritingAnalysis && (
                    <div className="p-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 space-y-2.5 animate-fadeIn text-xs">
                      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-1.5">
                        <span className="font-bold text-cyan-300">{aiWritingAnalysis.scoreGrade}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{aiWritingAnalysis.wordCount} words verified</span>
                      </div>

                      <div className="space-y-1.5">
                        {aiWritingAnalysis.checklistResults.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-[11px]">
                            <span className={item.check ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                              {item.check ? '✓' : '⚠️'}
                            </span>
                            <div>
                              <p className={item.check ? 'text-slate-200 font-medium' : 'text-amber-200'}>{item.item}</p>
                              <p className="text-[10px] text-slate-400">{item.note}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="pt-1.5 border-t border-cyan-500/20 text-[11px] text-cyan-200 leading-snug italic">
                        💡 <strong>Coach Tip:</strong> {aiWritingAnalysis.feedbackTip}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* PART 4: CRITICAL THINKING & DISCUSSION */}
          <div className="space-y-4 mb-6">
            <h2 className={`text-sm font-bold uppercase tracking-wider flex items-center gap-2 ${
              viewMode === 'printable' ? 'text-slate-900' : 'text-cyan-400'
            }`}>
              <FileText className="w-4 h-4" />
              <span>4. Critical Reflection & Speaking Prompts</span>
            </h2>
            <p className={`text-xs italic ${viewMode === 'printable' ? 'text-slate-600' : 'text-slate-400'}`}>
              {currentWorksheet.content?.criticalThinking?.instruction}
            </p>

            <div className="space-y-3">
              {currentWorksheet.content?.criticalThinking?.items?.map((item, idx) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border text-xs md:text-sm space-y-2 ${
                    viewMode === 'printable'
                      ? 'bg-slate-50 border-slate-200 text-slate-800'
                      : 'bg-black/20 border-white/10 text-slate-200'
                  }`}
                >
                  <p className="font-semibold leading-relaxed">
                    {idx + 1}. {item.question}
                  </p>

                  {viewMode === 'printable' ? (
                    <div className="h-16 border-b border-dashed border-slate-300 mt-2" />
                  ) : (
                    <textarea
                      rows={2}
                      value={userCriticalText}
                      onChange={(e) => setUserCriticalText(e.target.value)}
                      placeholder="Student response notes or spoken talking points..."
                      className="w-full rounded-lg border border-white/15 bg-black/50 p-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 mt-1"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* SUBMIT & GRADE ACTION (Only in student interactive mode) */}
          {viewMode === 'interactive' && (
            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 no-print">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <GraduationCap className="w-4 h-4 text-cyan-400" />
                <span>Fill in your answers above and check your score.</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={resetStudentWork}
                  className="px-3 py-2 rounded-xl border border-white/10 text-xs font-semibold text-slate-300 hover:text-white cursor-pointer"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={handleGradeWorksheet}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white shadow-lg transition-transform hover:scale-[1.02] cursor-pointer"
                  style={{
                    background: theme.accentGradient,
                    boxShadow: theme.accentGlow,
                  }}
                >
                  Check My Answers & Score
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
