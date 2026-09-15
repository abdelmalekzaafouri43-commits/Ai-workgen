import { Worksheet, ScannedStyleDna, UserStats } from '../types';

export const INITIAL_SCANNED_DNA_LIST: ScannedStyleDna[] = [
  {
    id: 'dna-oxford-1',
    sourceName: 'Oxford_Exam_Paper_Format_C1.pdf',
    layoutStyle: 'Two-Column Split',
    colorPalette: {
      primary: '#0284c7',
      accent: '#38bdf8',
      background: '#090d16',
      surface: '#0f172a',
    },
    fontStructure: {
      headingFont: 'Space Grotesk, Georgia, serif',
      bodyFont: 'Plus Jakarta Sans, sans-serif',
      lineHeight: '1.65',
      density: 'Compact Academic',
    },
    detectedModules: [
      'Two-Column Text Grid',
      'Contextual Footnote Callouts',
      'Lettered Multiple Choice Pills',
      'Formal Grading Ledger',
    ],
    confidence: 98.4,
    extractedAt: '2 hours ago',
  },
  {
    id: 'dna-bento-2',
    sourceName: 'Modern_Infographic_Matrix_B2.png',
    layoutStyle: 'Modular Bento Grid',
    colorPalette: {
      primary: '#059669',
      accent: '#34d399',
      background: '#04100b',
      surface: '#0a261a',
    },
    fontStructure: {
      headingFont: 'Plus Jakarta Sans, sans-serif',
      bodyFont: 'Plus Jakarta Sans, sans-serif',
      lineHeight: '1.6',
      density: 'Balanced Modern',
    },
    detectedModules: [
      'Modular Vocabulary Cards',
      'Highlighted Lexicon Chips',
      'Sentence Completion Boxes',
      'Self-Check Progress Bar',
    ],
    confidence: 96.8,
    extractedAt: 'Yesterday at 4:15 PM',
  },
  {
    id: 'dna-cambridge-3',
    sourceName: 'Cambridge_Assessment_Grammar_Lab.jpg',
    layoutStyle: 'Matching Anchor Columns',
    colorPalette: {
      primary: '#9333ea',
      accent: '#c084fc',
      background: '#0d0618',
      surface: '#231140',
    },
    fontStructure: {
      headingFont: 'Space Grotesk, sans-serif',
      bodyFont: 'Plus Jakarta Sans, sans-serif',
      lineHeight: '1.7',
      density: 'Generous Open',
    },
    detectedModules: [
      'Dual Parallel Connecting Blocks',
      'Syntax Verification Rules',
      'Critical Writing Scratchpad',
      'Master Answer Crypt Key',
    ],
    confidence: 99.1,
    extractedAt: '3 days ago',
  },
];

export const INITIAL_WORKSHEETS: Worksheet[] = [
  {
    id: 'ws-a2-routines',
    title: 'Everyday Life: Daily Morning Routines & Present Simple Tense',
    subtitle: 'Mastering present simple habits, frequency adverbs (always, usually, never), and morning schedules',
    cefrLevel: 'A2',
    estimatedMinutes: 25,
    status: 'Premium',
    targetSkill: 'Grammar & Syntax',
    tags: ['Daily Life', 'A2 Elementary', 'Present Simple', 'Everyday Routines'],
    createdAt: '2026-09-15T01:00:00Z',
    appliedDna: INITIAL_SCANNED_DNA_LIST[1],
    content: {
      readingTitle: 'A Busy Morning at Willow Tree House',
      passageType: 'text',
      readingPassage: `Every weekday morning, Leo wakes up at 7:00 AM when his alarm rings. He usually makes his bed, brushes his teeth, and eats a warm bowl of oatmeal with fresh berries. His younger sister, Mia, always drinks orange juice while checking her school schedule. 

At 8:00 AM, Leo and Mia walk to school together. They rarely miss the morning bell because they leave the house on time. In the evening, after finishing their homework, the family sits together at the dinner table to share stories from their day.`,

      // Section 1: Reading Comprehension
      whQuestions: [
        {
          id: 'wh-r1',
          question: 'What time does Leo wake up every weekday morning?',
          sampleAnswer: 'Leo wakes up at 7:00 AM every weekday morning.',
        },
        {
          id: 'wh-r2',
          question: 'What does Mia always drink while checking her school schedule?',
          sampleAnswer: 'Mia always drinks fresh orange juice.',
        },
        {
          id: 'wh-r3',
          question: 'Why do Leo and Mia rarely miss the morning school bell?',
          sampleAnswer: 'Because they leave their house on time every morning.',
        },
        {
          id: 'wh-r4',
          question: 'Where does the family sit together in the evening?',
          sampleAnswer: 'They sit together at the dinner table to share stories.',
        },
      ],
      falseStatements: [
        {
          id: 'fs-r1',
          statement: 'Leo wakes up at 9:30 AM on weekday mornings.',
          isTrue: false,
          correctAnswer: 'False. Correction: Leo wakes up at 7:00 AM on weekday mornings.',
        },
        {
          id: 'fs-r2',
          statement: 'Leo and Mia walk to school together at 8:00 AM.',
          isTrue: true,
          correctAnswer: 'Statement is TRUE.',
        },
        {
          id: 'fs-r3',
          statement: 'Mia usually drinks coffee before going to school.',
          isTrue: false,
          correctAnswer: 'False. Correction: Mia always drinks orange juice while checking her school schedule.',
        },
      ],
      referenceQuestions: [
        {
          id: 'ref-r1',
          word: 'His',
          location: 'Paragraph 1, Line 3',
          refersTo: 'Leo (Leo\'s younger sister)',
        },
        {
          id: 'ref-r2',
          word: 'They',
          location: 'Paragraph 2, Line 1',
          refersTo: 'Leo and Mia',
        },
      ],
      opinionQuestion: {
        id: 'op-r1',
        question: 'In your opinion, why is having a regular morning routine helpful for pupils before going to school?',
        promptGuide: 'Write 2-3 sentences expressing your opinion. Use phrases like "In my opinion...", "I think...", or "For example...".',
      },

      // Section 2: Language Tasks
      wordBank: ['usually', 'teeth', 'never', 'alarm', 'homework', 'together', 'schedule'],
      vocabNotes: [
        {
          word: 'Morning routine',
          phonetic: '/ˈmɔːrnɪŋ ruːˈtiːn/',
          definition: 'Regular habits performed every morning before starting school or work.',
          context: 'Leo wakes up at 7:00 AM and completes his daily morning routine.',
        },
        {
          word: 'Adverb of frequency',
          phonetic: '/ˈædvɜːrb ɒv ˈfriːkwənsi/',
          definition: 'Words like always, usually, often, sometimes, and never that tell how frequently an action happens.',
          context: 'Mia always drinks orange juice, while they rarely miss the morning bell.',
        },
      ],
      vocabExercises: {
        instruction: 'Fill in the blanks using words from the Word Bank above:',
        items: [
          {
            id: 'vq-r1',
            sentence: 'Leo _______ eats a healthy breakfast before leaving for school.',
            blankWord: 'usually',
            hint: 'An adverb meaning most of the time.',
          },
          {
            id: 'vq-r2',
            sentence: 'Mia puts on her uniform and brushes her _______ before breakfast.',
            blankWord: 'teeth',
            hint: 'Part of hygiene routine after waking up.',
          },
          {
            id: 'vq-r3',
            sentence: 'They always leave on time so they _______ miss the school bus.',
            blankWord: 'never',
            hint: 'An adverb meaning 0% of the time.',
          },
        ],
      },
      formAndTenseExercises: {
        instruction: 'Put the verbs in parentheses into the correct Present Simple tense form:',
        items: [
          {
            id: 'ft-r1',
            sentence: 'Every morning, Sarah (to wake) _______ up at 6:30 AM.',
            baseVerb: 'to wake',
            correctForm: 'wakes',
            explanation: 'Present Simple 3rd person singular verb ending with -s.',
          },
          {
            id: 'ft-r2',
            sentence: 'Tom and his brother (not / to like) _______ drinking cold milk in winter.',
            baseVerb: 'not like',
            correctForm: 'do not like',
            explanation: 'Present Simple negative with plural subject (do not like / don\'t like).',
          },
          {
            id: 'ft-r3',
            sentence: 'What time (to do) _______ your lessons start every morning?',
            baseVerb: 'to do',
            correctForm: 'do',
            explanation: 'Present Simple auxiliary question verb for plural subject "lessons".',
          },
        ],
      },
      matchingExercises: {
        instruction: 'Match the sentence halves in Column A with Column B:',
        items: [
          {
            id: 'm-r1',
            partA: '1. Leo wakes up at 7:00 AM...',
            partB: 'A. when his morning alarm rings.',
            correctMatchId: 'A',
          },
          {
            id: 'm-r2',
            partA: '2. Mia always drinks orange juice...',
            partB: 'B. while checking her daily school schedule.',
            correctMatchId: 'B',
          },
          {
            id: 'm-r3',
            partA: '3. In the evening, the family sits...',
            partB: 'C. together at the table to share their stories.',
            correctMatchId: 'C',
          },
        ],
      },
      grammarExercises: {
        instruction: 'Choose the correct Present Simple or frequency adverb position in these everyday sentences.',
        items: [
          {
            id: 'gq-r1',
            prompt: 'Which sentence correctly places the adverb of frequency before the main verb?',
            options: [
              'Leo wakes usually up early.',
              'Leo usually wakes up early for school.',
              'Usually Leo waking early up.',
              'Leo wakes early up usually.',
            ],
            correctIndex: 1,
            explanation: 'Frequency adverbs (usually, always) go BEFORE main verbs (wakes up).',
          },
          {
            id: 'gq-r2',
            prompt: 'Choose the correct third-person singular present simple verb form:',
            options: [
              'Mia finish her homework at 5:00 PM.',
              'Mia finishes her homework at 5:00 PM.',
              'Mia finishing her homework at 5:00 PM.',
              'Mia is finish her homework at 5:00 PM.',
            ],
            correctIndex: 1,
            explanation: 'Verbs ending in -sh add -es in third-person singular present simple (finishes).',
          },
        ],
      },

      // Section 3: Writing Task with Formatting
      writingTask: {
        format: 'email',
        prompt: 'Write an e-mail (50-80 words) to your classmate describing your daily morning routine before coming to school.',
        wordCount: '50-80 words',
        guidelines: [
          'Use the Present Simple tense and adverbs of frequency (always, usually, sometimes, never).',
          'Mention at least 3 actions you do every morning.',
          'Include an appropriate greeting and sign-off line.',
        ],
        emailFields: {
          to: 'classmate@school.edu',
          from: 'pupil@school.edu',
          subject: 'My Everyday Morning Routine',
        },
        articleFields: {
          headline: 'A Day in the Life of a Student: Morning Routines',
          author: 'By Student Reporter',
          category: 'School Life & Daily Habits',
        },
        facebookFields: {
          authorName: 'Everyday English Pupil Corner',
          handle: '@school_english_daily',
          timeAgo: 'Just now • 🌐',
          hashtags: ['#MorningRoutine', '#PresentSimple', '#EnglishGrammar'],
        },
        blogFields: {
          title: 'How I Organize My Morning Schedule Every Day',
          category: 'Pupil Learning Blog',
          author: 'Student Blogger',
          date: 'September 15, 2026',
        },
      },

      criticalThinking: {
        instruction: 'Write 3 sentences about your own everyday morning routine using frequency adverbs (always, usually, sometimes, never).',
        items: [
          {
            id: 'cq-r1',
            question: 'Describe what you do when you wake up. Include at least two frequency adverbs and present simple verbs.',
            suggestedPoints: [
              'Use first-person present simple ("I wake up", "I eat").',
              'Correct adverb placement ("I always brush my teeth", "I sometimes walk to school").',
            ],
          },
        ],
      },
      answerKey: {
        vocabAnswers: [
          { questionId: 'vq-r1', answer: 'usually', synonymHint: 'most times' },
          { questionId: 'vq-r2', answer: 'teeth', synonymHint: 'dental care' },
          { questionId: 'vq-r3', answer: 'never', synonymHint: 'at no time' },
        ],
        grammarAnswers: [
          { questionId: 'gq-r1', correctOption: 'Leo usually wakes up early for school.', ruleExplanation: 'Frequency adverb before main verb.' },
          { questionId: 'gq-r2', correctOption: 'Mia finishes her homework at 5:00 PM.', ruleExplanation: 'Present simple 3rd-person singular -es suffix.' },
        ],
        whAnswers: [
          { questionId: 'wh-r1', sampleAnswer: 'Leo wakes up at 7:00 AM every weekday morning.' },
          { questionId: 'wh-r2', sampleAnswer: 'Mia always drinks fresh orange juice.' },
          { questionId: 'wh-r3', sampleAnswer: 'Because they leave their house on time every morning.' },
          { questionId: 'wh-r4', sampleAnswer: 'They sit together at the dinner table to share stories.' },
        ],
        falseAnswers: [
          { questionId: 'fs-r1', isTrue: false, correctAnswer: 'False. Correction: Leo wakes up at 7:00 AM on weekday mornings.' },
          { questionId: 'fs-r2', isTrue: true, correctAnswer: 'Statement is TRUE.' },
          { questionId: 'fs-r3', isTrue: false, correctAnswer: 'False. Correction: Mia always drinks orange juice while checking her school schedule.' },
        ],
        refAnswers: [
          { questionId: 'ref-r1', refersTo: 'Leo (Leo\'s younger sister)' },
          { questionId: 'ref-r2', refersTo: 'Leo and Mia' },
        ],
        formTenseAnswers: [
          { questionId: 'ft-r1', correctForm: 'wakes', explanation: 'Present Simple 3rd person singular.' },
          { questionId: 'ft-r2', correctForm: 'do not like / don\'t like', explanation: 'Present Simple negative plural.' },
          { questionId: 'ft-r3', correctForm: 'do', explanation: 'Auxiliary verb for questions.' },
        ],
        matchingAnswers: [
          { questionId: 'm-r1', match: '1 -> A' },
          { questionId: 'm-r2', match: '2 -> B' },
          { questionId: 'm-r3', match: '3 -> C' },
        ],
        criticalRubric: [
          'Accurate usage of Present Simple verbs.',
          'Correct placement of frequency adverbs.',
        ],
      },
    },
  },
  {
    id: 'ws-b2-coral',
    title: 'The Vanishing Coral: Marine Ecology, Passive Voice & Causative Verbs',
    subtitle: 'Examining thermal bleaching events, conservation science, and structural syntax transformations',
    cefrLevel: 'B2',
    estimatedMinutes: 35,
    status: 'Premium',
    targetSkill: 'Grammar & Syntax',
    tags: ['Ecology', 'B2 Upper-Int', 'Passive Voice', 'Academic Syntax'],
    createdAt: '2026-09-13T14:20:00Z',
    appliedDna: INITIAL_SCANNED_DNA_LIST[1],
    content: {
      readingTitle: 'Thermal Stress in the Mesophotic Reef Habitats',
      readingPassage: `Over the past three decades, extensive swathes of the Great Barrier Reef have been severely degraded by repeated marine heatwaves. When water temperatures exceed ambient thresholds by just 1.5°C, the symbiotic microalgae known as zooxanthellae are expelled by their coral hosts. Without these photosynthesizing partners, corals turn stark white and face imminent starvation.

Fortunately, researchers are having autonomous submersibles deployed across deep-water shelves. These deep mesophotic reefs, buffered from surface heat, are believed to serve as genetic lifeboats. By having nursery colonies artificially propagated in temperature-controlled bioreactors, marine biologists hope to have resilient strains seeded along decimated reef flats before irreversible collapse ensues.`,
      vocabNotes: [
        {
          word: 'Symbiotic expulsion',
          phonetic: '/ˌsɪmbaɪˈɒtɪk ɪkˈspʌlʃən/',
          definition: 'The involuntary discharge of mutualistic organisms due to environmental physiological shock.',
          context: 'zooxanthellae are expelled by their coral hosts...',
        },
        {
          word: 'Mesophotic buffer',
          phonetic: '/ˌmɛzəˈfoʊtɪk ˈbʌfər/',
          definition: 'Middle-depth ocean zones (30m to 150m) that receive limited sunlight and are partially shielded from surface temperature swings.',
          context: 'These deep mesophotic reefs, buffered from surface heat...',
        },
      ],
      vocabExercises: {
        instruction: 'Complete the scientific report with the precise ecological terminology from the reading.',
        items: [
          {
            id: 'vq-b2-1',
            sentence: 'The severe bleaching event caused coral to suffer from _______ due to lack of algal nutrients.',
            blankWord: 'starvation',
            hint: 'The state of extreme nutritional deprivation leading to demise.',
          },
          {
            id: 'vq-b2-2',
            sentence: 'Researchers are optimistic that deep reef zones will act as genetic _______ for damaged shallows.',
            blankWord: 'lifeboats',
            hint: 'A sanctuary or reservoir preserving biodiversity (metaphorical vessel).',
          },
        ],
      },
      grammarExercises: {
        instruction: 'Convert and identify the correct passive or causative syntax structure.',
        items: [
          {
            id: 'gq-b2-1',
            prompt: 'Which sentence correctly implements the causative structure (have/get something done)?',
            options: [
              'Biologists had deployed the submersibles yesterday morning.',
              'The research institute had autonomous submersibles deployed across the shelf.',
              'Autonomous submersibles were having deployed by scientists.',
              'Biologists got having deployed submersibles across the reef.',
            ],
            correctIndex: 1,
            explanation: 'Causative formula: Subject + have/get + object + past participle ("had submersibles deployed").',
          },
          {
            id: 'gq-b2-2',
            prompt: 'Identify the impersonal passive construction frequently used in academic scientific discourse:',
            options: [
              'We believe that deep reefs serve as lifeboats.',
              'Deep reefs are believed to serve as genetic lifeboats.',
              'Deep reefs serve believing as genetic lifeboats.',
              'It is believing that reefs serve as lifeboats.',
            ],
            correctIndex: 1,
            explanation: 'Subject + passive reporting verb ("are believed") + to-infinitive ("to serve").',
          },
        ],
      },
      criticalThinking: {
        instruction: 'Scientific synthesis and evaluation task.',
        items: [
          {
            id: 'cq-b2-1',
            question: 'Explain why human intervention through artificial propagation bioreactors might raise ethical or ecological concerns. Cite at least two environmental considerations.',
            suggestedPoints: [
              'Potential loss of natural genetic diversity through monoculture breeding.',
              'Risk of introducing lab-mutated pathogens into wild reefs.',
              'Diverting funding and urgency away from curbing fossil fuel emissions.',
            ],
          },
        ],
      },
      answerKey: {
        vocabAnswers: [
          { questionId: 'vq-b2-1', answer: 'starvation', synonymHint: 'deprivation / necrosis' },
          { questionId: 'vq-b2-2', answer: 'lifeboats', synonymHint: 'refugia / reservoirs' },
        ],
        grammarAnswers: [
          { questionId: 'gq-b2-1', correctOption: 'The research institute had autonomous submersibles deployed across the shelf.', ruleExplanation: 'Causative structure: have + noun + past participle.' },
          { questionId: 'gq-b2-2', correctOption: 'Deep reefs are believed to serve as genetic lifeboats.', ruleExplanation: 'Impersonal passive with infinitive complement.' },
        ],
        criticalRubric: [
          'Clear identification of ecological trade-offs.',
          'Use of scientific vocabulary (biodiversity, thermal tolerance, genetic monoculture).',
        ],
      },
    },
  },
  {
    id: 'ws-a2-transit',
    title: 'Urban Expeditions: Navigating Transit, Modal Verbs & Directions',
    subtitle: 'Practical metro maps, train boarding etiquette, and expressing obligation with must, have to, and can',
    cefrLevel: 'A2',
    estimatedMinutes: 25,
    status: 'Completed',
    targetSkill: 'Reading & Synthesis',
    tags: ['Travel', 'A2 Elementary', 'Modal Verbs', 'Daily Life'],
    createdAt: '2026-09-12T10:00:00Z',
    appliedDna: INITIAL_SCANNED_DNA_LIST[2],
    content: {
      readingTitle: 'First Day on the London Underground',
      readingPassage: `Travelling on the London Underground is fast and exciting, but there are important rules every traveler must remember. First, you must tap your contactless card or Oyster card at the yellow reader before you walk through the ticket gates. 

When you stand on the escalator, you must always stand on the right side so that people who are in a hurry can walk on the left. You do not have to buy a paper ticket because cards and smartphones work automatically. However, you must not forget to tap out at your destination, or you will be charged the maximum fare!`,
      vocabNotes: [
        {
          word: 'Contactless card',
          phonetic: '/ˈkɒntæktləs kɑːd/',
          definition: 'A payment card that pays for travel by touching a sensor without entering a PIN.',
          context: 'tap your contactless card or Oyster card at the yellow reader...',
        },
        {
          word: 'Escalator etiquette',
          phonetic: '/ˈɛskəleɪtər ˈɛtɪkɛt/',
          definition: 'The customary social behavior of standing on one side to let walking passengers pass.',
          context: 'you must always stand on the right side so people in a hurry can walk on the left.',
        },
      ],
      vocabExercises: {
        instruction: 'Choose the correct transit word to complete the direction instructions.',
        items: [
          {
            id: 'vq-a2-1',
            sentence: 'Remember to look at the signs above the platform to check which _______ the train is going.',
            blankWord: 'direction',
            hint: 'The course along which someone or something moves (e.g., Northbound, Southbound).',
          },
          {
            id: 'vq-a2-2',
            sentence: 'Wait behind the yellow line on the _______ until the train stops completely.',
            blankWord: 'platform',
            hint: 'The flat raised area where passengers wait to board a train.',
          },
        ],
      },
      grammarExercises: {
        instruction: 'Choose the correct modal verb (must, must not, or do not have to) based on obligation rules.',
        items: [
          {
            id: 'gq-a2-1',
            prompt: 'Paper tickets are optional because contactless cards work. You _______ buy a paper ticket.',
            options: ['must not', 'do not have to', 'can not', 'must'],
            correctIndex: 1,
            explanation: '"Do not have to" expresses absence of obligation (it is not necessary).',
          },
          {
            id: 'gq-a2-2',
            prompt: 'Smoking is strictly forbidden on all trains and stations. You _______ smoke on the subway.',
            options: ['do not have to', 'must not', 'might not', 'could not'],
            correctIndex: 1,
            explanation: '"Must not" expresses strict prohibition / forbidden action.',
          },
        ],
      },
      criticalThinking: {
        instruction: 'Practical roleplay scenario writing.',
        items: [
          {
            id: 'cq-a2-1',
            question: 'A tourist looks lost at King’s Cross Station. Write a friendly 3-line dialogue giving them directions to get on the Piccadilly line to Heathrow Airport.',
            suggestedPoints: [
              'Polite greeting and offer of assistance ("Can I help you?").',
              'Directional instruction using clear imperatives ("Follow the dark blue signs", "Take the escalator down").',
              'Helpful modal tip ("You can board any westbound train").',
            ],
          },
        ],
      },
      answerKey: {
        vocabAnswers: [
          { questionId: 'vq-a2-1', answer: 'direction', synonymHint: 'way / heading' },
          { questionId: 'vq-a2-2', answer: 'platform', synonymHint: 'dock / boarding area' },
        ],
        grammarAnswers: [
          { questionId: 'gq-a2-1', correctOption: 'do not have to', ruleExplanation: 'Lack of necessity.' },
          { questionId: 'gq-a2-2', correctOption: 'must not', ruleExplanation: 'Total prohibition.' },
        ],
        criticalRubric: [
          'Simple, accurate present tense and imperatives.',
          'Clear, helpful directional vocabulary.',
        ],
      },
    },
  },
];

export const INITIAL_USER_STATS: UserStats = {
  worksheetsGenerated: 48,
  hoursSaved: 26.5,
  studentsActive: 142,
  averageMasteryRate: 91.2,
  weeklyActivity: [
    { day: 'Mon', count: 6, minutes: 120 },
    { day: 'Tue', count: 9, minutes: 180 },
    { day: 'Wed', count: 12, minutes: 240 },
    { day: 'Thu', count: 8, minutes: 160 },
    { day: 'Fri', count: 11, minutes: 210 },
    { day: 'Sat', count: 4, minutes: 90 },
    { day: 'Sun', count: 5, minutes: 110 },
  ],
};
