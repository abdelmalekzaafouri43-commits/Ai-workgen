import { Worksheet, CefrLevel, ScannedStyleDna, VocabNote, VocabQuestion, GrammarQuestion } from '../types';

interface VocabItem {
  word: string;
  phonetic: string;
  def: string;
  ctx: string;
  hint: string;
  syn: string;
}

// Generate topic-tailored vocabulary based on prompt keywords
function deriveTopicVocab(topic: string): VocabItem[] {
  const lower = topic.toLowerCase();

  if (lower.includes('food') || lower.includes('cook') || lower.includes('recipe') || lower.includes('restaurant') || lower.includes('eat') || lower.includes('meal')) {
    return [
      {
        word: 'Nutritious ingredient',
        phonetic: '/njuːˈtrɪʃəs ɪnˈɡriːdiənt/',
        def: 'Food components that provide healthy vitamins and energy for the body.',
        ctx: 'Using fresh vegetables is a great way to include nutritious ingredients in every meal.',
        hint: 'Healthy food items used in cooking',
        syn: 'wholesome food',
      },
      {
        word: 'Culinary tradition',
        phonetic: '/ˈkʌlɪnəri trəˈdɪʃən/',
        def: 'Cooking styles, recipes, and food customs passed down through generations.',
        ctx: 'Making homemade pasta is a cherished culinary tradition in many Italian families.',
        hint: 'Traditional way of cooking and preparing food',
        syn: 'food heritage',
      },
      {
        word: 'Balanced diet',
        phonetic: '/ˈbælənst ˈdaɪət/',
        def: 'Eating a variety of foods that provide all essential nutrients for good health.',
        ctx: 'Pupils learn about keeping a balanced diet by eating fruits, vegetables, and grains daily.',
        hint: 'Eating healthy foods in proper proportions',
        syn: 'healthy eating plan',
      },
    ];
  }

  if (lower.includes('animal') || lower.includes('pet') || lower.includes('nature') || lower.includes('wild') || lower.includes('zoo')) {
    return [
      {
        word: 'Natural habitat',
        phonetic: '/ˈnætʃrəl ˈhæbɪtæt/',
        def: 'The environment or place where an animal or plant naturally lives and thrives.',
        ctx: 'Pond frogs swim, jump, and find food in their natural habitat.',
        hint: 'The home environment of an animal or plant',
        syn: 'native ecosystem',
      },
      {
        word: 'Animal adaptation',
        phonetic: '/ˈænɪməl ˌædæpˈteɪʃən/',
        def: 'Special traits or behaviors that help animals survive in their surroundings.',
        ctx: 'A polar bear thick fur coat is a wonderful animal adaptation for cold arctic snow.',
        hint: 'Features that help creatures survive in their environment',
        syn: 'survival feature',
      },
      {
        word: 'Wildlife conservation',
        phonetic: '/ˈwaɪldlaɪf ˌkɒnsərˈveɪʃən/',
        def: 'Protecting wild animals, plants, and their habitats from damage.',
        ctx: 'Students formed a club dedicated to local wildlife conservation and bird protection.',
        hint: 'Protecting animals and nature',
        syn: 'nature preservation',
      },
    ];
  }

  if (lower.includes('routine') || lower.includes('daily') || lower.includes('family') || lower.includes('home') || lower.includes('house')) {
    return [
      {
        word: 'Morning routine',
        phonetic: '/ˈmɔːrnɪŋ ruːˈtiːn/',
        def: 'Regular habits performed every morning, such as brushing teeth and having breakfast.',
        ctx: 'Waking up early and packing my school backpack is part of my daily morning routine.',
        hint: 'Habits you do every morning before starting your day',
        syn: 'daily schedule',
      },
      {
        word: 'Household chore',
        phonetic: '/ˈhaʊshəʊld tʃɔːr/',
        def: 'Small tasks done to keep a home clean and organized.',
        ctx: 'Drying dishes after dinner is an easy household chore everyone can help with.',
        hint: 'Task done around the home to keep it clean',
        syn: 'home task',
      },
      {
        word: 'Family tradition',
        phonetic: '/ˈfæmɪli trəˈdɪʃən/',
        def: 'Activities or celebrations that family members enjoy doing together regularly.',
        ctx: 'Reading bedtime stories together on Sunday nights is our favorite family tradition.',
        hint: 'Special activity shared by family members',
        syn: 'family custom',
      },
    ];
  }

  if (lower.includes('sport') || lower.includes('hobby') || lower.includes('game') || lower.includes('play') || lower.includes('fitness')) {
    return [
      {
        word: 'Teamwork skills',
        phonetic: '/ˈtiːmwɜːrk skɪlz/',
        def: 'Working cooperatively with classmates or teammates to reach a shared goal.',
        ctx: 'Playing basketball helps pupils build essential teamwork skills on and off the court.',
        hint: 'Ability to work together as a group',
        syn: 'cooperation',
      },
      {
        word: 'Active recreation',
        phonetic: '/ˈæktɪv ˌrɛkriˈeɪʃən/',
        def: 'Fun physical activities like cycling, swimming, and running that keep the body healthy.',
        ctx: 'Joining the weekend swimming club is a fun form of active recreation.',
        hint: 'Physical games and outdoor fun',
        syn: 'outdoor sports',
      },
      {
        word: 'Personal perseverance',
        phonetic: '/ˈpɜːrsənl ˌpɜːrsəˈvɪərəns/',
        def: 'Continuing to practice a skill or game even when it gets challenging.',
        ctx: 'Learning to play the violin takes time, patience, and personal perseverance.',
        hint: 'Continuing to try hard without giving up',
        syn: 'dedication',
      },
    ];
  }

  if (lower.includes('travel') || lower.includes('holiday') || lower.includes('weather') || lower.includes('vacation') || lower.includes('trip')) {
    return [
      {
        word: 'Scenic destination',
        phonetic: '/ˈsiːnɪk ˌdɛstɪˈneɪʃən/',
        def: 'A beautiful place visited during trips, such as mountains, beaches, or parks.',
        ctx: 'We traveled to a scenic destination in the countryside for summer holiday.',
        hint: 'Beautiful place people visit on vacation',
        syn: 'tourist location',
      },
      {
        word: 'Weather forecast',
        phonetic: '/ˈwɛðər ˈfɔːrkæst/',
        def: 'A prediction of temperature, rain, and sunshine for upcoming days.',
        ctx: 'Checking the weather forecast helps us pack the right clothes for our weekend trip.',
        hint: 'Daily weather report and prediction',
        syn: 'climate report',
      },
      {
        word: 'Cultural exchange',
        phonetic: '/ˈkʌltʃərəl ɪksˈtʃeɪndʒ/',
        def: 'Sharing food, stories, and customs with people from different countries.',
        ctx: 'Traveling abroad offers pupils a wonderful opportunity for cultural exchange.',
        hint: 'Learning about new cultures and customs',
        syn: 'intercultural learning',
      },
    ];
  }

  if (lower.includes('school') || lower.includes('subject') || lower.includes('class') || lower.includes('student') || lower.includes('pupil') || lower.includes('learn')) {
    return [
      {
        word: 'Interactive learning',
        phonetic: '/ˌɪntərˈæktɪv ˈlɜːrnɪŋ/',
        def: 'Educational activities where pupils actively participate, solve puzzles, and share ideas.',
        ctx: 'Our English teacher uses interactive learning games to make grammar fun.',
        hint: 'Learning by participating and doing activities',
        syn: 'active study',
      },
      {
        word: 'Curiosity mindset',
        phonetic: '/ˌkjʊəriˈɒsəti ˈmaɪndsɛt/',
        def: 'Being eager to ask questions, explore new topics, and discover how things work.',
        ctx: 'Having a curiosity mindset helps pupils excel in science and reading classes.',
        hint: 'Eagerness to ask questions and learn new things',
        syn: 'inquisitive attitude',
      },
      {
        word: 'Collaborative project',
        phonetic: '/kəˈlæbərətɪv ˈprɒdʒɛkt/',
        def: 'School assignments done in small groups where pupils work together.',
        ctx: 'Each group presented their poster for the classroom collaborative project.',
        hint: 'Group work assignment in school',
        syn: 'team assignment',
      },
    ];
  }

  if (lower.includes('tech') || lower.includes('ai') || lower.includes('code') || lower.includes('data') || lower.includes('software')) {
    return [
      {
        word: 'Algorithmic optimization',
        phonetic: '/ˌælɡəˈrɪðmɪk ˌɒptɪmaɪˈzeɪʃən/',
        def: 'Refining code and computational logic to maximize performance and resource efficiency.',
        ctx: 'Engineers focused on algorithmic optimization to decrease latency across globally distributed servers.',
        hint: 'Improving computational efficiency and performance',
        syn: 'code refinement',
      },
      {
        word: 'Scalable architecture',
        phonetic: '/ˈskeɪləbəl ˈɑːrkɪtekʧər/',
        def: 'Designing systems capable of handling growing workloads without structural failure.',
        ctx: 'Adopting scalable architecture allowed the platform to support millions of concurrent connections.',
        hint: 'System structure built to handle expansion seamlessly',
        syn: 'extensible system design',
      },
      {
        word: 'Predictive modeling',
        phonetic: '/prɪˈdɪktɪv ˈmɒdəlɪŋ/',
        def: 'Utilizing historical data and machine learning algorithms to forecast future outcomes.',
        ctx: 'Data scientists employed predictive modeling to anticipate shifts in network traffic demand.',
        hint: 'Forecasting trends using statistical data',
        syn: 'data forecasting',
      },
    ];
  }

  if (lower.includes('business') || lower.includes('negotiat') || lower.includes('financ') || lower.includes('market') || lower.includes('lead')) {
    return [
      {
        word: 'Fiduciary responsibility',
        phonetic: '/fɪˈdjuːʃəri rɪˌspɒnsəˈbɪlɪti/',
        def: 'The ethical and legal obligation to act solely in the best interest of another party.',
        ctx: 'Board members must uphold fiduciary responsibility when evaluating merger proposals.',
        hint: 'Legal and ethical duty of utmost trust and care',
        syn: 'stewardship duty',
      },
      {
        word: 'Strategic compromise',
        phonetic: '/strəˈtiːdʒɪk ˈkɒmprəmaɪz/',
        def: 'Conceding secondary points during negotiations to secure primary high-value objectives.',
        ctx: 'Reaching a binding contract required strategic compromise from both executive teams.',
        hint: 'Conceding minor points to gain major goals',
        syn: 'calculated concession',
      },
      {
        word: 'Market disruption',
        phonetic: '/ˈmɑːrkɪt dɪsˈrʌpʃən/',
        def: 'The transformation of an existing industry through innovative business models or tech.',
        ctx: 'The startup caused market disruption by offering automated subscription-based services.',
        hint: 'Innovation that fundamentally changes an industry',
        syn: 'industry transformation',
      },
    ];
  }

  if (lower.includes('environment') || lower.includes('climate') || lower.includes('green') || lower.includes('sustain') || lower.includes('eco')) {
    return [
      {
        word: 'Ecological equilibrium',
        phonetic: '/ˌiːkəˈlɒdʒɪkəl ˌiːkwɪˈlɪbriəm/',
        def: 'A state of dynamic balance within an ecosystem where species and habitat coexist stably.',
        ctx: 'Preserving wetlands is crucial for maintaining regional ecological equilibrium.',
        hint: 'Natural balance within biological systems',
        syn: 'ecosystem harmony',
      },
      {
        word: 'Mitigation strategy',
        phonetic: '/ˌmɪtɪˈɡeɪʃən ˈstrætədʒi/',
        def: 'A structured plan aimed at reducing the severity, impact, or likelihood of environmental hazards.',
        ctx: 'Coastal municipalities implemented a proactive mitigation strategy against rising sea levels.',
        hint: 'Plan designed to lessen harmful environmental impacts',
        syn: 'risk abatement protocol',
      },
      {
        word: 'Carbon neutrality',
        phonetic: '/ˈkɑːrbən njuːˈtrælɪti/',
        def: 'Achieving net-zero greenhouse gas emissions by balancing emissions with removal.',
        ctx: 'The international corporation pledged to reach full carbon neutrality by 2035.',
        hint: 'Net-zero carbon footprint target',
        syn: 'zero-emission balance',
      },
    ];
  }

  if (lower.includes('gramm') || lower.includes('perfect') || lower.includes('tense') || lower.includes('passiv') || lower.includes('condition')) {
    return [
      {
        word: 'Syntactic precision',
        phonetic: '/sɪnˈtæktɪk prɪˈsɪʒən/',
        def: 'Structuring clauses and phrases accurately to prevent ambiguity in formal communication.',
        ctx: 'Mastering subtle verb tenses elevates your writing to high syntactic precision.',
        hint: 'Accuracy in grammatical structure and clause arrangement',
        syn: 'structural clarity',
      },
      {
        word: 'Contextual nuance',
        phonetic: '/kənˈtɛkstʃuəl ˈnjuːɑːns/',
        def: 'Subtle shifts in meaning conveyed through modal auxiliary choice and aspectual tenses.',
        ctx: 'Choosing the present perfect over the simple past introduces vital contextual nuance.',
        hint: 'Subtle distinction in meaning derived from context',
        syn: 'shading of meaning',
      },
      {
        word: 'Cohesive transition',
        phonetic: '/kəʊˈhiːsɪv trænˈzɪʃən/',
        def: 'Using discourse markers and logical connectors to link ideas smoothly between paragraphs.',
        ctx: 'Employing cohesive transitions improves the flow of academic argumentation.',
        hint: 'Smooth linkage between sentences and paragraphs',
        syn: 'logical linking',
      },
    ];
  }

  // Dynamic custom fallback generator based directly on the provided topic words
  const words = topic.split(/\s+/).filter((w) => w.length > 2);
  const coreWord = words[0] || 'Discourse';
  const secondWord = words[1] || 'Dynamics';

  const capitalizedTopic = topic.charAt(0).toUpperCase() + topic.slice(1);

  return [
    {
      word: `${capitalizedTopic} Framework`,
      phonetic: `/${coreWord.toLowerCase()} ˈfreɪmwɜːrk/`,
      def: `The underlying principles and structured methodology governing ${topic.toLowerCase()}.`,
      ctx: `Experts analyzed the ${topic.toLowerCase()} framework to identify key operational advantages.`,
      hint: `Core structure and foundational principles of ${topic}`,
      syn: 'foundational structure',
    },
    {
      word: `Contextual Calibration`,
      phonetic: `/kənˈtɛkstʃuəl ˌkælɪˈbreɪʃən/`,
      def: `Modulating language, tone, and technical depth when communicating about ${topic.toLowerCase()}.`,
      ctx: `Effective presentation of ${topic.toLowerCase()} requires ongoing contextual calibration to engage stakeholders.`,
      hint: `Adapting message and complexity to match audience background`,
      syn: 'tailored adjustment',
    },
    {
      word: `Rhetorical Dexterity`,
      phonetic: `/rɪˈtɒrɪkəl dɛkˈstɛrɪti/`,
      def: `Skill in wielding persuasive phrasing, precise vocabulary, and logical structure.`,
      ctx: `Demonstrating rhetorical dexterity in ${topic.toLowerCase()} allows speakers to articulate complex arguments clearly.`,
      hint: `Skill and flexibility in persuasive communication`,
      syn: 'eloquent articulation',
    },
  ];
}

export function createClientWorksheet(
  topic: string,
  level: CefrLevel = 'B2',
  skill: 'Vocabulary & Idioms' | 'Grammar & Syntax' | 'Reading & Synthesis' | 'Debate & Writing' = 'Vocabulary & Idioms',
  activeDna?: ScannedStyleDna | null
): Worksheet {
  const cleanTopic = topic?.trim() || 'Modern Professional Communication';
  const id = 'ws-' + Date.now();
  const timestamp = new Date().toISOString();

  const pool = deriveTopicVocab(cleanTopic);

  const readingTitle = `Analytical Overview: ${cleanTopic}`;
  const readingPassage = `Navigating ${cleanTopic} at the ${level} mastery level requires moving beyond generic vocabulary toward deliberate terminology and structural clarity. In modern discourse concerning ${cleanTopic.toLowerCase()}, communicators must seamlessly articulate nuanced positions while maintaining formal precision.

A thorough understanding of ${cleanTopic.toLowerCase()} empowers professionals to evaluate evidence critically, employ targeted collocations, and construct persuasive arguments. By mastering terms such as "${pool[0]?.word}", "${pool[1]?.word}", and "${pool[2]?.word}", learners can express complex insights with confidence in high-stakes academic and professional environments.`;

  const vocabExercises: { instruction: string; items: VocabQuestion[] } = {
    instruction: `Complete each contextual scenario by inserting the most appropriate term related to ${cleanTopic}:`,
    items: pool.map((v, idx) => ({
      id: `vq-${id}-${idx + 1}`,
      sentence: `When presenting key findings on ${cleanTopic.toLowerCase()}, specialists must rely on _______ to communicate complex ideas clearly.`,
      blankWord: v.word,
      hint: v.hint,
    })),
  };

  const grammarExercises: { instruction: string; items: GrammarQuestion[] } = {
    instruction: `Rewrite and transform each sentence using the specified advanced grammatical pattern for ${cleanTopic}:`,
    items: [
      {
        id: `gq-${id}-1`,
        prompt: `Rewrite this sentence using an inverted third conditional structure starting with "Had...": "If the team had analyzed ${cleanTopic.toLowerCase()} earlier, the project would have achieved optimal efficiency."`,
        originalSentence: `If the team had analyzed ${cleanTopic.toLowerCase()} earlier, the project would have achieved optimal efficiency.`,
        targetAnswer: `Had the team analyzed ${cleanTopic.toLowerCase()} earlier, the project would have achieved optimal efficiency.`,
        explanation: `Inverted third conditional structure ("Had + subject + past participle ... would have + past participle") provides formal academic precision.`,
      },
      {
        id: `gq-${id}-2`,
        prompt: `Transform this direct statement into a hedged academic claim using "appears to suggest": "The research proves that structured methodology leads to success in ${cleanTopic.toLowerCase()}."`,
        originalSentence: `The research proves that structured methodology leads to success in ${cleanTopic.toLowerCase()}.`,
        targetAnswer: `Preliminary empirical data appears to suggest a notable correlation between structured methodology and successful outcomes in ${cleanTopic.toLowerCase()}.`,
        explanation: `"Appears to suggest" is a classical hedging formulation used in formal academic and professional registers.`,
      },
    ],
  };

  const criticalThinking = {
    instruction: `Synthesize the core concepts of ${cleanTopic} and compose a well-reasoned analytical response:`,
    items: [
      {
        id: `cq-${id}-1`,
        question: `How do communication strategies regarding "${cleanTopic}" evolve when adapting content from a technical audience to general non-specialist stakeholders? Identify two key adjustments in vocabulary or sentence structure.`,
        suggestedPoints: [
          `Contrast specialized jargon with contextual analogies and accessible definitions.`,
          `Discuss how sentence length and clause complexity can be modulated for public clarity.`,
          `Incorporate at least two key terms from the reading passage in your response.`,
        ],
      },
    ],
  };

  const answerKey = {
    vocabAnswers: pool.map((v, idx) => ({
      questionId: `vq-${id}-${idx + 1}`,
      answer: v.word,
      synonymHint: v.syn,
    })),
    grammarAnswers: [
      {
        questionId: `gq-${id}-1`,
        correctOption: `Had the team analyzed ${cleanTopic.toLowerCase()} earlier, the project would have achieved optimal efficiency.`,
        ruleExplanation: `Inverted third conditional for counterfactual past scenarios.`,
      },
      {
        questionId: `gq-${id}-2`,
        correctOption: `Preliminary empirical data appears to suggest a notable correlation between structured methodology and successful outcomes in ${cleanTopic.toLowerCase()}.`,
        ruleExplanation: `Epistemic hedging for formal objective register.`,
      },
    ],
    criticalRubric: [
      `Clear distinction between specialist jargon and accessible general framing.`,
      `Effective incorporation of target vocabulary and hedging structures.`,
      `Logical organization and cohesive sentence connections.`,
    ],
  };

  return {
    id,
    title: `${cleanTopic}: Grammar & Everyday Life`,
    subtitle: `Level ${level} curriculum targeting ${skill} through everyday context`,
    cefrLevel: level,
    estimatedMinutes: level === 'C1' || level === 'C2' ? 45 : 30,
    status: 'Premium',
    targetSkill: skill,
    tags: [level, skill, cleanTopic],
    createdAt: timestamp,
    appliedDna: activeDna || undefined,
    content: {
      readingTitle,
      readingPassage,
      passageType: 'text',

      // Section 1: Reading Comprehension
      whQuestions: [
        {
          id: `wh-${id}-1`,
          question: `What is the main topic of the passage about ${cleanTopic.toLowerCase()}?`,
          sampleAnswer: `The passage explains how ${cleanTopic.toLowerCase()} works in daily life and key routines.`,
        },
        {
          id: `wh-${id}-2`,
          question: `Why is "${pool[0]?.word || 'planning'}" important according to the text?`,
          sampleAnswer: `It helps people stay organized and carry out their daily activities effectively.`,
        },
        {
          id: `wh-${id}-3`,
          question: `Where or when do people usually practice these habits?`,
          sampleAnswer: `Every day in their home, school, or daily environment.`,
        },
      ],
      falseStatements: [
        {
          id: `fs-${id}-1`,
          statement: `People should completely ignore their daily habits and routines when dealing with ${cleanTopic.toLowerCase()}.`,
          isTrue: false,
          correctAnswer: `Correction: People rely on consistent daily habits and routines to succeed in ${cleanTopic.toLowerCase()}.`,
        },
        {
          id: `fs-${id}-2`,
          statement: `Using ${pool[0]?.word || 'good habits'} helps people express their ideas clearly and stay organized.`,
          isTrue: true,
          correctAnswer: `Statement is TRUE. No correction needed.`,
        },
      ],
      referenceQuestions: [
        {
          id: `ref-${id}-1`,
          word: `they`,
          location: `Paragraph 2, Line 1`,
          refersTo: `Learners or people practicing ${cleanTopic.toLowerCase()}`,
        },
        {
          id: `ref-${id}-2`,
          word: `it`,
          location: `Paragraph 1, Line 3`,
          refersTo: `The daily routine / ${cleanTopic.toLowerCase()}`,
        },
      ],
      opinionQuestion: {
        id: `op-${id}-1`,
        question: `In your opinion, how can practicing ${cleanTopic.toLowerCase()} in your everyday life help you improve your English language skills?`,
        promptGuide: `Write 2-3 sentences expressing your personal opinion. Use phrases like "In my opinion...", "I believe...", or "For example...".`,
      },

      // Section 2: Language Tasks
      wordBank: pool.map((v) => v.word).concat(['daily', 'habits', 'routines', 'together']),
      vocabNotes: pool.map((v) => ({
        word: v.word,
        phonetic: v.phonetic,
        definition: v.def,
        context: v.ctx,
      })),
      vocabExercises,
      formAndTenseExercises: {
        instruction: `Put the verbs in parentheses into the correct tense or grammatical form:`,
        items: [
          {
            id: `ft-${id}-1`,
            sentence: `Every morning, Sarah (to wake) _______ up early to organize her schedule.`,
            baseVerb: `to wake`,
            correctForm: `wakes`,
            explanation: `Present Simple third-person singular (she wakes).`,
          },
          {
            id: `ft-${id}-2`,
            sentence: `They (not / to miss) _______ their morning lessons because they leave on time.`,
            baseVerb: `not miss`,
            correctForm: `do not miss`,
            explanation: `Present Simple negative with plural subject (they do not miss / don't miss).`,
          },
          {
            id: `ft-${id}-3`,
            sentence: `If we practice ${cleanTopic.toLowerCase()} every day, our English (to improve) _______ quickly.`,
            baseVerb: `to improve`,
            correctForm: `will improve`,
            explanation: `First conditional main clause (if + present -> will + verb).`,
          },
        ],
      },
      matchingExercises: {
        instruction: `Match the sentence halves in Column A with their correct endings in Column B:`,
        items: [
          {
            id: `match-${id}-1`,
            partA: `1. Having a balanced morning routine...`,
            partB: `A. helps pupils start their day feeling organized.`,
            correctMatchId: `A`,
          },
          {
            id: `match-${id}-2`,
            partA: `2. When practicing new vocabulary...`,
            partB: `B. it is helpful to use them in real everyday sentences.`,
            correctMatchId: `B`,
          },
          {
            id: `match-${id}-3`,
            partA: `3. Working together on classroom tasks...`,
            partB: `C. builds strong teamwork and communication skills.`,
            correctMatchId: `C`,
          },
        ],
      },
      grammarExercises,

      // Section 3: Writing Task with Authentic Formatting
      writingTask: {
        format: 'email',
        prompt: `Write a short e-mail (50-80 words) to your classmate telling them about your daily routine regarding ${cleanTopic.toLowerCase()}.`,
        wordCount: `50-80 words`,
        guidelines: [
          `Use the Present Simple tense and adverbs of frequency (always, usually, never).`,
          `Include at least 2 words from the vocabulary list.`,
          `Follow proper e-mail greeting and sign-off format.`,
        ],
        emailFields: {
          to: `classmate@school.edu`,
          from: `pupil@school.edu`,
          subject: `My Daily Routine & ${cleanTopic}`,
        },
        articleFields: {
          headline: `How Everyday Habits Shape Our Success in ${cleanTopic}`,
          author: `By Pupil Reporter`,
          category: `Student Life & Education`,
        },
        facebookFields: {
          authorName: `School English Club`,
          handle: `@english_pupils_daily`,
          timeAgo: `Just now • 🌐`,
          hashtags: [`#EverydayEnglish`, `#GrammarInUse`, `#DailyRoutines`],
        },
        blogFields: {
          title: `My Experience Learning English Through Real Everyday Themes`,
          category: `Language Learning Blog`,
          author: `Student Blogger`,
          date: `September 15, 2026`,
        },
      },

      criticalThinking,
      answerKey: {
        ...answerKey,
        whAnswers: [
          { questionId: `wh-${id}-1`, sampleAnswer: `The main topic is ${cleanTopic.toLowerCase()} in everyday life.` },
          { questionId: `wh-${id}-2`, sampleAnswer: `It helps maintain organization and daily efficiency.` },
          { questionId: `wh-${id}-3`, sampleAnswer: `In home, school, and community environments.` },
        ],
        falseAnswers: [
          { questionId: `fs-${id}-1`, isTrue: false, correctAnswer: `Correction: People rely on consistent daily habits and routines.` },
          { questionId: `fs-${id}-2`, isTrue: true, correctAnswer: `Statement is TRUE.` },
        ],
        refAnswers: [
          { questionId: `ref-${id}-1`, refersTo: `Learners or people practicing ${cleanTopic.toLowerCase()}` },
          { questionId: `ref-${id}-2`, refersTo: `The daily routine / ${cleanTopic.toLowerCase()}` },
        ],
        formTenseAnswers: [
          { questionId: `ft-${id}-1`, correctForm: `wakes`, explanation: `3rd person singular Present Simple.` },
          { questionId: `ft-${id}-2`, correctForm: `do not miss / don't miss`, explanation: `Plural Present Simple negative.` },
          { questionId: `ft-${id}-3`, correctForm: `will improve`, explanation: `First conditional result clause.` },
        ],
        matchingAnswers: [
          { questionId: `match-${id}-1`, match: `1 -> A` },
          { questionId: `match-${id}-2`, match: `2 -> B` },
          { questionId: `match-${id}-3`, match: `3 -> C` },
        ],
      },
    },
  };
}

