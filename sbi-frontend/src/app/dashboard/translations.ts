export type Language = "English" | "Hindi" | "Tamil";

export interface TranslationDict {
  sidebar: {
    overview: string;
    console: string;
    insights: string;
    health: string;
    agents: string;
    compliance: string;
    whatsapp: string;
    analytics: string;
    investments: string;
    logout: string;
    savings: string;
    loans: string;
    caseStudy: string;
    backToPortal: string;
    title: string;
    tutor: string;
  };
  header: {
    activeAudit: string;
    evaluateWellness: string;
    evaluateWellnessOverview: string;
    evaluateWellnessConsole: string;
    evaluateWellnessInsights: string;
    evaluateWellnessHealth: string;
    evaluateWellnessAgents: string;
    evaluateWellnessCompliance: string;
    evaluateWellnessWhatsapp: string;
    evaluateWellnessAnalytics: string;
    selectCaseStudyMsg: string;
    reviewingLedgerMsg: string;
  };
  overview: {
    ratingIndex: string;
    safetyIndex: string;
    availableBalance: string;
    savingsTag: string;
    savingsDesc: string;
    socialSecurityScan: string;
    auditReportTag: string;
    scanningLedger: string;
    auditComplete: string;
    diagnosticsRequired: string;
    evaluateInstructions: string;
    blackboardTitle: string;
    blackboardTips: string;
    cashFlowTitle: string;
    cashFlowDesc: string;
    noLedgerMsg: string;
    sandboxTitle: string;
    sandboxDesc: string;
    pmsbyBtn: string;
    pmjjbyBtn: string;
    mudraBtn: string;
    sweepBtn: string;
    lessonFarmerTitle: string;
    lessonFarmerBody: string;
    lessonPoliceTitle: string;
    lessonPoliceBody: string;
    lessonMerchantTitle: string;
    lessonMerchantBody: string;
    lessonSalariedTitle: string;
    lessonSalariedBody: string;
  };
  console: {
    title: string;
    desc: string;
    voiceEngine: string;
    narratorStatus: string;
    activeListening: string;
    mutedPaused: string;
    muteBtn: string;
    unmuteBtn: string;
    readLessonBtn: string;
    stopVoiceBtn: string;
    speakingIndicator: string;
    lessonHighlights: string;
    activeTopic: string;
    description: string;
    suitabilityStatus: string;
    requiredAction: string;
    interactiveDialogue: string;
    studentLabel: string;
    emptyAuditMsg: string;
    inputPlaceholder: string;
    sendBtn: string;
  };
  insights: {
    discoveriesTitle: string;
    discoveriesDesc: string;
    lifecycleTitle: string;
    lifecycleDesc: string;
    confidence: string;
    probability: string;
    signals: {
      dormant: string;
      zeroUpi: string;
      highUpi: string;
      healthyCash: string;
      stableSalary: string;
      heavyDebt: string;
      highCard: string;
    };
    events: {
      cropCycleTitle: string;
      cropCycleDesc: string;
      scaleUpTitle: string;
      scaleUpDesc: string;
      highExpenditureTitle: string;
      highExpenditureDesc: string;
    };
  };
  health: {
    radarTitle: string;
    radarDesc: string;
    scorecardTitle: string;
    scorecardDesc: string;
    parameters: {
      savingsTitle: string;
      savingsDesc: string;
      insuranceTitle: string;
      insuranceDesc: string;
      investmentTitle: string;
      investmentDesc: string;
      digitalTitle: string;
      digitalDesc: string;
      debtTitle: string;
      debtDesc: string;
    };
    gapTitle: string;
    gapDesc: string;
    gaps: {
      lifeGap: string;
      lifeRequired: string;
      healthGap: string;
      healthRequired: string;
      accidentalCover: string;
      accidentalScheme: string;
      accidentalDesc: string;
      microLife: string;
      microLifeScheme: string;
      microLifeDesc: string;
      activeCover: string;
      inactiveCover: string;
      fullyCovered: string;
      gapLabel: string;
    };
    tableTitle: string;
    tableDesc: string;
    loadingMsg: string;
    emptyTableMsg: string;
    headers: {
      id: string;
      name: string;
      type: string;
      sum: string;
      premium: string;
      status: string;
      expiry: string;
    };
  };
  compliance: {
    approvedTitle: string;
    vetoedTitle: string;
    emptyApproved: string;
    zeroBlocked: string;
    unloadedAudit: string;
    altLabel: string;
    tableTitle: string;
    tableDesc: string;
    emptyTable: string;
    tableHeaders: {
      timestamp: string;
      clientId: string;
      agent: string;
      decision: string;
      reasoning: string;
    };
  };
  agents: {
    title: string;
    desc: string;
    step: string;
    decisionsHeader: string;
    emptyLogs: string;
  };
  whatsapp: {
    botName: string;
    online: string;
    statementBtn: string;
    loanBtn: string;
    entitlementsBtn: string;
    typingPlaceholder: string;
    consoleTitle: string;
    consoleDesc: string;
    targetPhone: string;
    tipMsg: string;
    emptyLogs: string;
    payloadHeader: string;
    apiResponseCode: string;
  };
  analytics: {
    assetsTitle: string;
    digitalTitle: string;
    uninsuredTitle: string;
    assetsDesc: string;
    digitalDesc: string;
    uninsuredDesc: string;
    dtiTitle: string;
    dtiDesc: string;
    leaderboardTitle: string;
    leaderboardDesc: string;
    dtiLabels: {
      noDebt: string;
      safe: string;
      moderate: string;
      leveraged: string;
    };
  };
  login: {
    secureNetbanking: string;
    portalTitle: string;
    portalDesc: string;
    designSpotlightTitle: string;
    designSpotlightBody: string;
    dbNoticeTitle: string;
    farmerRouting: string;
    supabaseRouting: string;
    fallbackRouting: string;
    loginTitle: string;
    usernameLabel: string;
    usernamePlaceholder: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    forgotPin: string;
    submitBtn: string;
    quickSelectTitle: string;
  };
  investments: {
    title: string;
    desc: string;
    profileSection: string;
    riskProfileLabel: string;
    recommendedSipLabel: string;
    fundsTitle: string;
    fundsDesc: string;
    calculatorTitle: string;
    calculatorDesc: string;
    monthlyInv: string;
    duration: string;
    returnRate: string;
    investedAmount: string;
    estReturns: string;
    totalValue: string;
    years: string;
    sipFormulaNotice: string;
    executeActionBtn: string;
  };
}

export const translations: Record<Language, TranslationDict> = {
  English: {
    sidebar: {
      overview: "Overview Dashboard",
      console: "Professor S-FIA Console",
      insights: "Cash Discoveries",
      health: "My Wellness Report",
      agents: "S-FIA Agent Map",
      compliance: "Trust Locker",
      whatsapp: "WhatsApp Simulator",
      analytics: "Bank Analytics",
      investments: "SIP & Mutual Funds",
      logout: "Secure Logout",
      savings: "Savings",
      loans: "Loans",
      caseStudy: "Select Case Study",
      backToPortal: "Back to SBI Portal",
      title: "YONO S-FIA",
      tutor: "Tutor V3.0"
    },
    header: {
      activeAudit: "ACTIVE",
      evaluateWellness: "Evaluate Wellness",
      evaluateWellnessOverview: "Evaluate Wellness",
      evaluateWellnessConsole: "Analyze Discussion",
      evaluateWellnessInsights: "Audit Cash Flow",
      evaluateWellnessHealth: "Assess Cover Gaps",
      evaluateWellnessAgents: "Trace Agent Flow",
      evaluateWellnessCompliance: "Review Vetoes",
      evaluateWellnessWhatsapp: "Audit Chat Logs",
      evaluateWellnessAnalytics: "Compile Branch Data",
      selectCaseStudyMsg: "Please select a case study to begin.",
      reviewingLedgerMsg: "Reviewing ledger of"
    },
    overview: {
      ratingIndex: "Wellness Rating Index",
      safetyIndex: "S-FIA Financial Safety Index",
      availableBalance: "Available Account Balance",
      savingsTag: "Savings",
      savingsDesc: "Your active cash reserves. Idle savings yield 3.0% interest. Activating fixed sweep MODS can grow this to 6.8% yield.",
      socialSecurityScan: "Social Security Scan",
      auditReportTag: "Audit Report",
      scanningLedger: "Professor Scanning Ledger...",
      auditComplete: "Audit Complete",
      diagnosticsRequired: "Diagnostics Required",
      evaluateInstructions: "Click the Evaluate Wellness button in the header to run the agent diagnostics check.",
      blackboardTitle: "Professor's Blackboard",
      blackboardTips: "Focus on building assets, not serving high-interest debt cycles.",
      cashFlowTitle: "Cash Flow Dynamics",
      cashFlowDesc: "Weekly net deposits and spending balances from active ledger",
      noLedgerMsg: "No transaction ledger entries available.",
      sandboxTitle: "Quick Core Banking Sandbox Operations",
      sandboxDesc: "Test how S-FIA agents respond dynamically to live core banking transactions and policy changes",
      pmsbyBtn: "Simulate PMSBY Activation",
      pmjjbyBtn: "Simulate PMJJBY Activation",
      mudraBtn: "Disburse MSME Mudra Loan",
      sweepBtn: "Configure FD Sweep MODS",
      lessonFarmerTitle: "📖 Lesson: PM Suraksha Bima (PMSBY)",
      lessonFarmerBody: '"For just ₹20 a year (less than the price of a single cup of tea!), the government provides ₹2 Lakhs of accidental insurance security. This is the cheapest shield in India. S-FIA helps you claim it instantly."',
      lessonPoliceTitle: "👮 Lesson: Mitigating High-Risk Gaps",
      lessonPoliceBody: '"As a police officer, your service carries daily occupational hazards. While your savings and home loan structures are healthy, carrying zero life insurance cover leaves your dependents vulnerable. Let us activate PMJJBY."',
      lessonMerchantTitle: "🏪 Lesson: MSME Mudra Loans",
      lessonMerchantBody: '"When your kirana store has consistent UPI credits, it shows your business is growing! Instead of borrowing from local lenders at 24% interest, SBI Mudra provides safe, collateral-free credit at 9.5%."',
      lessonSalariedTitle: "⚠️ Lesson: Vetoing the Debt Trap",
      lessonSalariedBody: '"Imagine carrying a heavy backpack. A small water bottle (micro-loan) is fine. A giant boulder (₹5 Lakh loan) when you are already tired will break your back! S-FIA vetoes loans that exceed a DTI safety ceiling of 50%."'
    },
    console: {
      title: "Professor S-FIA Console",
      desc: "Your personal AI Wellness Relationship Manager. Ask questions, receive interactive financial suggestions, and listen to spoken instructions in your preferred language.",
      voiceEngine: "S-FIA Voice Engine",
      narratorStatus: "Narrator Status",
      activeListening: "🔈 ACTIVE & LISTENING",
      mutedPaused: "🔇 MUTED / PAUSED",
      muteBtn: "Mute",
      unmuteBtn: "Unmute",
      readLessonBtn: "Read Lesson",
      stopVoiceBtn: "Stop Voice",
      speakingIndicator: "🔊 Professor S-FIA is speaking...",
      lessonHighlights: "Latest Lesson Highlights",
      activeTopic: "Active Topic",
      description: "Description",
      suitabilityStatus: "Suitability Status",
      requiredAction: "Required Action",
      interactiveDialogue: "Interactive Dialogue",
      studentLabel: "Student",
      emptyAuditMsg: "Audit ledger to initiate conversation session.",
      inputPlaceholder: "Type your answer or question...",
      sendBtn: "Send"
    },
    insights: {
      discoveriesTitle: "🔍 Cash Flow Discoveries",
      discoveriesDesc: "Clear indicators audited from your transaction ledger",
      lifecycleTitle: "🎯 Upcoming Lifecycle Needs",
      lifecycleDesc: "Smart predictions mapping out potential cash requirements",
      confidence: "Confidence",
      probability: "Probability",
      signals: {
        dormant: "🌾 Sleepy Account (Dormant)",
        zeroUpi: "📱 No Digital Payments Setup",
        highUpi: "⚡ Growing Digital Shop Payments",
        healthyCash: "📈 Solid Retail Earnings",
        stableSalary: "💼 Regular Salaried Income",
        heavyDebt: "⚠️ Heavy Monthly Debt Burden",
        highCard: "💳 High Credit Card Spends"
      },
      events: {
        cropCycleTitle: "🚜 Seasonal Harvest Season",
        cropCycleDesc: "Seasonal cultivation capital requirements based on farming profile.",
        scaleUpTitle: "🏪 Shop Expansion & Restocking",
        scaleUpDesc: "Consistently rising digital storefront credits indicate readiness for retail store expansion.",
        highExpenditureTitle: "💍 High Spend Milestone (Wedding/Car)",
        highExpenditureDesc: "Loan request and card utilization surges point toward a high-cost lifestyle milestone."
      }
    },
    health: {
      radarTitle: "Wellness Profile Radar Chart",
      radarDesc: "Visual scorecard mapping savings, debt safety, and safety shields",
      scorecardTitle: "Wellness Parameter Scorecard",
      scorecardDesc: "Individual parameters translated into easy layman language",
      parameters: {
        savingsTitle: "💵 Cash Reserves (Savings)",
        savingsDesc: "Do you have enough backup cash reserves?",
        insuranceTitle: "🛡️ Safety Shields (Insurance)",
        insuranceDesc: "Are you covered against accidents & life events?",
        investmentTitle: "📈 Wealth Multipliers (Investments)",
        investmentDesc: "Is your money compounding and growing in FDs/SIPs?",
        digitalTitle: "📱 Mobile Banking Onboarding",
        digitalDesc: "Are you using UPI, YONO, or online portals?",
        debtTitle: "⚖️ Debt Safety Burden",
        debtDesc: "Is your debt safe or devouring your income?"
      },
      gapTitle: "⚠️ Insurance Coverage Gap Audit",
      gapDesc: "Mathematical gap audit comparing active safety covers against recommended guardrails",
      gaps: {
        lifeGap: "Life Cover Gap",
        lifeRequired: "Required: 10x Annual Income",
        healthGap: "Health Cover Gap",
        healthRequired: "Recommended Cover: ₹5 Lakhs",
        accidentalCover: "Accidental Cover",
        accidentalScheme: "PM Suraksha Bima Yojana (PMSBY)",
        accidentalDesc: "Provides ₹2 Lakhs cover for ₹20/year.",
        microLife: "Micro Life Security",
        microLifeScheme: "PM Jeevan Jyoti Bima / APY",
        microLifeDesc: "Provides ₹2 Lakhs life cover for ₹436/year.",
        activeCover: "Active Cover",
        inactiveCover: "Inactive / Lapsed",
        fullyCovered: "Fully Covered",
        gapLabel: "Gap"
      },
      tableTitle: "📋 Active & Historical Insurance Policies",
      tableDesc: "Database audit log of customer insurance portfolios",
      loadingMsg: "Loading insurance portfolio...",
      emptyTableMsg: "No policies found for this customer.",
      headers: {
        id: "Policy ID",
        name: "Scheme Name",
        type: "Type",
        sum: "Sum Assured",
        premium: "Annual Premium",
        status: "Status",
        expiry: "Expiry Date"
      }
    },
    compliance: {
      approvedTitle: "Approved Options",
      vetoedTitle: "Vetoed / Blocked Products",
      emptyApproved: "No approved bank products.",
      zeroBlocked: "Zero recommendations blocked. Fully safe ledger practices.",
      unloadedAudit: "No audit records loaded. Run evaluation to fetch details.",
      altLabel: "Professor Wellness Alternative",
      tableTitle: "Compliance & Banking Audit Ledger",
      tableDesc: "Live regulatory checks showing compliance decisions made by S-FIA agents",
      emptyTable: "No compliance audit logs tracked. Click Evaluate to generate.",
      tableHeaders: {
        timestamp: "Timestamp",
        clientId: "Client ID",
        agent: "Agent/System",
        decision: "Decision",
        reasoning: "Audit Reasoning"
      }
    },
    agents: {
      title: "🎓 S-FIA Agent Transit Map",
      desc: "Watch how the Orchestrator, Trust, and Compliance agents review your case step-by-step",
      step: "Audit Step",
      decisionsHeader: "Agent Decisions & Reasoning Trails",
      emptyLogs: "Auditor logs will generate here. Start the Evaluate check from top header bar."
    },
    whatsapp: {
      botName: "Professor S-FIA Bot",
      online: "Online",
      statementBtn: "📄 Get 1 Yr Statement",
      loanBtn: "💰 Apply Personal Loan",
      entitlementsBtn: "🛡️ Scan Entitlements",
      typingPlaceholder: "Type a message...",
      consoleTitle: "Meta API Auditor Console",
      consoleDesc: "Real-time webhook and Graph API payload inspector",
      targetPhone: "Target Phone",
      tipMsg: "Simulates incoming triggers. Meta delivers actual WhatsApps to target using credentials loaded from `.env`.",
      emptyLogs: "No logs tracked. Try clicking quick actions inside mobile mockup!",
      payloadHeader: "PAYLOAD",
      apiResponseCode: "API Response Code"
    },
    analytics: {
      assetsTitle: "Branch Assets (AUM)",
      digitalTitle: "Digital Gateway Adoption",
      uninsuredTitle: "Uninsured Safety Gap",
      assetsDesc: "Aggregated savings & deposit balances held within this branch ledger",
      digitalDesc: "Ratio of UPI, Card, and NetBanking transfers vs paper check & manual cash withdrawals",
      uninsuredDesc: "Percentage of branch accounts lacking any active PMSBY, PMJJBY, or health insurance coverage",
      dtiTitle: "Debt Service Ratio (DTI) Distribution",
      dtiDesc: "Proportion of safe vs highly over-leveraged borrowers",
      leaderboardTitle: "🏆 Financial Health Leaderboard",
      leaderboardDesc: "Average S-FIA health scores aggregated by occupation class",
      dtiLabels: {
        noDebt: "No Debt",
        safe: "Safe (<=30%)",
        moderate: "Moderate (30-50%)",
        leveraged: "Over-leveraged (>50%)"
      }
    },
    login: {
      secureNetbanking: "Secure Retail NetBanking",
      portalTitle: "YONO S-FIA Login Portal",
      portalDesc: "Log in with your demo credentials to enter the AI Diagnostic Lab. S-FIA dynamically inspects balances, DTI ratios, and insurance safety nets to guide users out of debt traps and activate social security.",
      designSpotlightTitle: "The Shekhar Kamat Keyhole Symbol (1971)",
      designSpotlightBody: "Our iconic circle represents the completeness and unity of our nation-wide network. The bottom keyhole represents trust and absolute security—your savings are locked securely with us.",
      dbNoticeTitle: "Secure Multi-Database Routing Architecture",
      farmerRouting: "Farmer Profile: Routes calls directly to Google Firestore (JSON DB).",
      supabaseRouting: "Police/Merchant/Salaried Profiles: Route directly to Supabase PostgreSQL.",
      fallbackRouting: "Automatic Fallback: Seamlessly drops back to a local SQLite database if cloud connections time out.",
      loginTitle: "Corporate Security Login",
      usernameLabel: "NetBanking Username",
      usernamePlaceholder: "Enter username (e.g. farmer, police)",
      passwordLabel: "Password / PIN",
      passwordPlaceholder: "Enter PIN (use 'sbi')",
      forgotPin: "Forgot PIN?",
      submitBtn: "Enter Secure Terminal",
      quickSelectTitle: "Demo Credentials Quick Select"
    },
    investments: {
      title: "📈 Mutual Fund & SIP Advisor",
      desc: "Analyze compounding returns, explore customized SBI mutual fund schemes based on your risk profile, and calculate future wealth growth.",
      profileSection: "Financial Profile Assessment",
      riskProfileLabel: "Risk Propensity",
      recommendedSipLabel: "Recommended Monthly SIP",
      fundsTitle: "Tailored SBI Mutual Funds",
      fundsDesc: "Selected based on your occupational cash flow stability, age, and risk appetite.",
      calculatorTitle: "Interactive SIP Calculator",
      calculatorDesc: "Drag the sliders to see how regular investments compound over time.",
      monthlyInv: "Monthly Investment Size",
      duration: "Investment Horizon",
      returnRate: "Expected Annual Return",
      investedAmount: "Invested Capital",
      estReturns: "Estimated Wealth Gain",
      totalValue: "Future Value (Wealth)",
      years: "years",
      sipFormulaNotice: "Calculations based on regular monthly compound growth formulas.",
      executeActionBtn: "Set Up Mutual Fund SIP"
    }
  },
  Hindi: {
    sidebar: {
      overview: "अवलोकन डैशबोर्ड",
      console: "प्रोफेसर एस-फिया कंसोल",
      insights: "नकदी प्रवाह खोजें",
      health: "मेरी कल्याण रिपोर्ट",
      agents: "एस-फिया एजेंट मानचित्र",
      compliance: "ट्रस्ट लॉकर",
      whatsapp: "व्हाट्सएप सिम्युलेटर",
      analytics: "बैंक विश्लेषिकी",
      investments: "एसआईपी और म्यूचुअल फंड",
      logout: "सुरक्षित लॉगआउट",
      savings: "बचत",
      loans: "ऋण",
      caseStudy: "केस स्टडी चुनें",
      backToPortal: "एसबीआई पोर्टल पर वापस जाएं",
      title: "योनि एस-फिया",
      tutor: "ट्यूटर वी3.0"
    },
    header: {
      activeAudit: "सक्रिय",
      evaluateWellness: "कल्याण का मूल्यांकन",
      evaluateWellnessOverview: "कल्याण का मूल्यांकन करें",
      evaluateWellnessConsole: "चर्चा का विश्लेषण करें",
      evaluateWellnessInsights: "नकदी प्रवाह का ऑडिट करें",
      evaluateWellnessHealth: "बीमा अंतराल का आकलन करें",
      evaluateWellnessAgents: "एजेंट प्रवाह का पता लगाएं",
      evaluateWellnessCompliance: "वीटो की समीक्षा करें",
      evaluateWellnessWhatsapp: "चैट लॉग का ऑडिट करें",
      evaluateWellnessAnalytics: "शाखा डेटा संकलित करें",
      selectCaseStudyMsg: "शुरू करने के लिए कृपया एक केस स्टडी चुनें।",
      reviewingLedgerMsg: "खाता बही की समीक्षा की जा रही है"
    },
    overview: {
      ratingIndex: "कल्याण रेटिंग सूचकांक",
      safetyIndex: "एस-फिया वित्तीय सुरक्षा सूचकांक",
      availableBalance: "उपलब्ध खाता शेष",
      savingsTag: "बचत",
      savingsDesc: "आपकी सक्रिय नकदी आरक्षित निधि। निष्क्रिय बचत पर 3.0% ब्याज मिलता है। ऑटो-स्वीप एमओडीएस सक्रिय करने से यह 6.8% तक बढ़ सकता है।",
      socialSecurityScan: "सामाजिक सुरक्षा जांच",
      auditReportTag: "ऑडिट रिपोर्ट",
      scanningLedger: "प्रोफेसर खाता बही की जांच कर रहे हैं...",
      auditComplete: "ऑडिट पूरा हुआ",
      diagnosticsRequired: "डायग्नोस्टिक्स आवश्यक",
      evaluateInstructions: "एजेंट डायग्नोस्टिक्स जांच चलाने के लिए हेडर में कल्याण मूल्यांकन बटन पर क्लिक करें।",
      blackboardTitle: "प्रोफेसर का ब्लैकबोर्ड",
      blackboardTips: "सम्पत्ति बनाने पर ध्यान दें, उच्च ब्याज वाले कर्ज के चक्रों में न फंसें।",
      cashFlowTitle: "नकदी प्रवाह गतिशीलता",
      cashFlowDesc: "सक्रिय बहीखाते से साप्ताहिक शुद्ध जमा और खर्च शेष",
      noLedgerMsg: "कोई लेनदेन बहीखाता प्रविष्टियां उपलब्ध नहीं हैं।",
      sandboxTitle: "त्वरित कोर बैंकिंग सैंडबॉक्स संचालन",
      sandboxDesc: "परीक्षण करें कि एस-फिया एजेंट लाइव कोर बैंकिंग लेनदेन और नीति परिवर्तनों पर गतिशील रूप से कैसे प्रतिक्रिया करते हैं",
      pmsbyBtn: "पीएम सुरक्षा बीमा (PMSBY) सक्रियता का अनुकरण करें",
      pmjjbyBtn: "पीएम जीवन ज्योति (PMJJBY) सक्रियता का अनुकरण करें",
      mudraBtn: "एमएसएमई मुद्रा ऋण वितरित करें",
      sweepBtn: "एफडी स्वीप एमओडीएस कॉन्फ़िगर करें",
      lessonFarmerTitle: "📖 पाठ: पीएम सुरक्षा बीमा योजना (PMSBY)",
      lessonFarmerBody: '"सालाना सिर्फ ₹20 में (एक कप चाय से भी कम कीमत पर!), सरकार ₹2 लाख की दुर्घटना बीमा सुरक्षा प्रदान करती है। यह भारत में सबसे सस्ती ढाल है। एस-फिया इसे तुरंत प्राप्त करने में आपकी मदद करता है।"',
      lessonPoliceTitle: "👮 पाठ: उच्च जोखिम वाले अंतरालों को कम करना",
      lessonPoliceBody: '"एक पुलिस अधिकारी के रूप में, आपकी सेवा में दैनिक व्यावसायिक खतरे शामिल हैं। यद्यपि आपकी बचत और गृह ऋण संरचनाएं स्वस्थ हैं, लेकिन जीवन बीमा कवर न होने से आपके आश्रित असुरक्षित हो जाते हैं। आइए PMJJBY सक्रिय करें।""',
      lessonMerchantTitle: "🏪 पाठ: एमएसएमई मुद्रा ऋण",
      lessonMerchantBody: '"जब आपकी किराना दुकान पर लगातार यूपीआई क्रेडिट प्राप्त होता है, तो यह दर्शाता है कि आपका व्यवसाय बढ़ रहा है! स्थानीय साहूकारों से 24% ब्याज पर उधार लेने के बजाय, एसबीआई मुद्रा 9.5% पर सुरक्षित, संपार्श्विक-मुक्त ऋण प्रदान करता है।"',
      lessonSalariedTitle: "⚠️ पाठ: ऋण जाल को खारिज करना",
      lessonSalariedBody: '"कल्पना कीजिए कि आपने एक भारी बैग ले रखा है। एक छोटी पानी की बोतल (माइक्रो-लोन) ठीक है। एक विशाल पत्थर (₹5 लाख का ऋण) जब आप पहले से ही थक चुके हों, आपकी पीठ तोड़ देगा! एस-फिया 50% से अधिक कर्ज-से-आय सीमा वाले ऋणों को खारिज कर देता है।""'
    },
    console: {
      title: "प्रोफेसर एस-फिया कंसोल",
      desc: "आपका व्यक्तिगत एआई कल्याण संबंध प्रबंधक। प्रश्न पूछें, इंटरैक्टिव वित्तीय सुझाव प्राप्त करें, और अपनी पसंदीदा भाषा में बोली जाने वाली निर्देश सुनें।",
      voiceEngine: "एस-फिया वॉयस इंजन",
      narratorStatus: "कथावाचक की स्थिति",
      activeListening: "🔈 सक्रिय और सुन रहा है",
      mutedPaused: "🔇 मौन / रुका हुआ",
      muteBtn: "मौन करें",
      unmuteBtn: "आवाज चालू करें",
      readLessonBtn: "पाठ पढ़ें",
      stopVoiceBtn: "आवाज बंद करें",
      speakingIndicator: "🔊 प्रोफेसर एस-फिया बोल रहे हैं...",
      lessonHighlights: "नवीनतम पाठ की मुख्य बातें",
      activeTopic: "सक्रिय विषय",
      description: "विवरण",
      suitabilityStatus: "उपयुक्तता स्थिति",
      requiredAction: "आवश्यक कार्रवाई",
      interactiveDialogue: "इंटरैक्टिव बातचीत",
      studentLabel: "छात्र",
      emptyAuditMsg: "बातचीत सत्र शुरू करने के लिए खाता बही का ऑडिट करें।",
      inputPlaceholder: "अपना उत्तर या प्रश्न टाइप करें...",
      sendBtn: "भेजें"
    },
    insights: {
      discoveriesTitle: "🔍 नकदी प्रवाह की खोजें",
      discoveriesDesc: "आपके लेनदेन बहीखाते से ऑडिट किए गए स्पष्ट संकेतक",
      lifecycleTitle: "🎯 आगामी जीवनचक्र आवश्यकताएं",
      lifecycleDesc: "संभावित नकदी आवश्यकताओं को दर्शाने वाले स्मार्ट पूर्वानुमान",
      confidence: "विश्वास स्तर",
      probability: "संभाव्यता",
      signals: {
        dormant: "🌾 सुप्त खाता (निष्क्रिय)",
        zeroUpi: "📱 डिजिटल भुगतान सेटअप नहीं है",
        highUpi: "⚡ बढ़ती डिजिटल दुकान भुगतान",
        healthyCash: "📈 ठोस खुदरा आय",
        stableSalary: "💼 नियमित वेतन आय",
        heavyDebt: "⚠️ भारी मासिक ऋण बोझ",
        highCard: "💳 उच्च क्रेडिट कार्ड खर्च"
      },
      events: {
        cropCycleTitle: "🚜 मौसमी फसल चक्र",
        cropCycleDesc: "कृषि प्रोफाइल के आधार पर मौसमी खेती पूंजी आवश्यकताएं।",
        scaleUpTitle: "🏪 दुकान विस्तार और पुनः स्टॉकिंग",
        scaleUpDesc: "लगातार बढ़ते डिजिटल स्टोरफ्रंट क्रेडिट खुदरा दुकान के विस्तार की तैयारी का संकेत देते हैं।",
        highExpenditureTitle: "💍 उच्च खर्च का मील का पत्थर (शादी/कार)",
        highExpenditureDesc: "ऋण अनुरोध और कार्ड उपयोग में वृद्धि उच्च लागत वाले जीवन मील के पत्थर की ओर इशारा करती है।"
      }
    },
    health: {
      radarTitle: "कल्याण प्रोफाइल रडार चार्ट",
      radarDesc: "बचत, ऋण सुरक्षा और सुरक्षा ढालों का दृश्य स्कोरकार्ड",
      scorecardTitle: "कल्याण पैरामीटर स्कोरकार्ड",
      scorecardDesc: "व्यक्तिगत मानकों का सरल आम बोलचाल की भाषा में अनुवाद",
      parameters: {
        savingsTitle: "💵 नकद आरक्षित निधि (बचत)",
        savingsDesc: "क्या आपके पास पर्याप्त बैकअप नकद राशि है?",
        insuranceTitle: "🛡️ सुरक्षा कवच (बीमा)",
        insuranceDesc: "क्या आप दुर्घटनाओं और जीवन की घटनाओं के प्रति सुरक्षित हैं?",
        investmentTitle: "📈 धन संवर्धन (निवेश)",
        investmentDesc: "क्या आपका पैसा एफडी/एसआईपी में बढ़ रहा है?",
        digitalTitle: "📱 मोबाइल बैंकिंग ऑनबोर्डिंग",
        digitalDesc: "क्या आप यूपीआई, योनो या ऑनलाइन पोर्टल का उपयोग कर रहे हैं?",
        debtTitle: "⚖️ ऋण सुरक्षा बोझ",
        debtDesc: "क्या आपका कर्ज सुरक्षित है या आपकी आय को निगल रहा है?"
      },
      gapTitle: "⚠️ बीमा कवरेज अंतराल ऑडिट",
      gapDesc: "अनुशंसित दिशानिर्देशों के साथ सक्रिय सुरक्षा कवरेज की तुलना करने वाला गणितीय ऑडिट",
      gaps: {
        lifeGap: "जीवन बीमा अंतराल",
        lifeRequired: "आवश्यक: वार्षिक आय का 10 गुना",
        healthGap: "स्वास्थ्य बीमा अंतराल",
        healthRequired: "अनुशंसित कवरेज: ₹5 लाख",
        accidentalCover: "दुर्घटना बीमा कवर",
        accidentalScheme: "प्रधानमंत्री सुरक्षा बीमा योजना (PMSBY)",
        accidentalDesc: "₹20/वर्ष में ₹2 लाख का सुरक्षा कवर प्रदान करता है।",
        microLife: "लघु जीवन सुरक्षा",
        microLifeScheme: "पीएम जीवन ज्योति बीमा / एपीवाई",
        microLifeDesc: "₹436/वर्ष में ₹2 लाख का जीवन सुरक्षा कवर प्रदान करता है।",
        activeCover: "सक्रिय कवर",
        inactiveCover: "निष्क्रिय / व्यपगत",
        fullyCovered: "पूरी तरह से सुरक्षित",
        gapLabel: "अंतराल"
      },
      tableTitle: "📋 सक्रिय और ऐतिहासिक बीमा पॉलिसियां",
      tableDesc: "ग्राहक बीमा पोर्टफोलियो का डेटाबेस ऑडिट लॉग",
      loadingMsg: "बीमा पोर्टफोलियो लोड किया जा रहा है...",
      emptyTableMsg: "इस ग्राहक के लिए कोई पॉलिसी नहीं मिली।",
      headers: {
        id: "पॉलिसी आईडी",
        name: "योजना का नाम",
        type: "प्रकार",
        sum: "सुनिश्चित राशि",
        premium: "वार्षिक प्रीमियम",
        status: "स्थिति",
        expiry: "समाप्ति तिथि"
      }
    },
    compliance: {
      approvedTitle: "स्वीकृत उत्पाद",
      vetoedTitle: "अस्वीकृत / अवरुद्ध उत्पाद",
      emptyApproved: "कोई स्वीकृत बैंक उत्पाद उपलब्ध नहीं हैं।",
      zeroBlocked: "शून्य अनुशंसाएँ अवरुद्ध। पूर्णतः सुरक्षित खाता पद्धतियां।",
      unloadedAudit: "कोई ऑडिट रिकॉर्ड लोड नहीं किया गया। विवरण प्राप्त करने के लिए मूल्यांकन चलाएं।",
      altLabel: "प्रोफेसर कल्याण विकल्प",
      tableTitle: "अनुपालन और बैंकिंग ऑडिट खाता बही",
      tableDesc: "एस-फिया एजेंटों द्वारा लिए गए अनुपालन निर्णयों को दर्शाने वाली लाइव नियामक जांच",
      emptyTable: "कोई अनुपालन ऑडिट लॉग नहीं मिला। उत्पन्न करने के लिए मूल्यांकन पर क्लिक करें।",
      tableHeaders: {
        timestamp: "समय",
        clientId: "ग्राहक आईडी",
        agent: "एजेंट/प्रणाली",
        decision: "निर्णय",
        reasoning: "ऑडिट का तर्क"
      }
    },
    agents: {
      title: "🎓 एस-फिया एजेंट ट्रांजिट मानचित्र",
      desc: "देखें कि कैसे आर्केस्ट्रेटर, ट्रस्ट और कंप्लायंस एजेंट आपके मामले की चरण-दर-चरण समीक्षा करते हैं",
      step: "ऑडिट चरण",
      decisionsHeader: "एजेंट के निर्णय और तर्क के निशान",
      emptyLogs: "ऑडिटर लॉग यहाँ उत्पन्न होंगे। शीर्ष हेडर बार से मूल्यांकन शुरू करें।"
    },
    whatsapp: {
      botName: "प्रोफेसर एस-फिया बॉट",
      online: "ऑनलाइन",
      statementBtn: "📄 1 वर्ष का विवरण प्राप्त करें",
      loanBtn: "💰 व्यक्तिगत ऋण के लिए आवेदन करें",
      entitlementsBtn: "🛡️ पात्रता जांचें",
      typingPlaceholder: "एक संदेश टाइप करें...",
      consoleTitle: "मेटा एपीआई ऑडिटर कंसोल",
      consoleDesc: "वास्तविक समय का वेबहुक और ग्राफ़ एपीआई पेलोड निरीक्षक",
      targetPhone: "लक्षित फोन नंबर",
      tipMsg: "आने वाले ट्रिगर्स का अनुकरण करता है। मेटा `.env` से लोड की गई क्रेडेंशियल का उपयोग करके वास्तविक व्हाट्सएप भेजता है।",
      emptyLogs: "कोई लॉग ट्रैक नहीं किया गया। मोबाइल मॉकअप के अंदर त्वरित क्रियाओं पर क्लिक करने का प्रयास करें!",
      payloadHeader: "पेलोड",
      apiResponseCode: "एपीआई प्रतिक्रिया कोड"
    },
    analytics: {
      assetsTitle: "शाखा परिसंपत्तियां (AUM)",
      digitalTitle: "डिजिटल गेटवे अपनाना",
      uninsuredTitle: "असुरक्षित सुरक्षा अंतराल",
      assetsDesc: "इस शाखा खाता बही के भीतर रखी गई कुल बचत और जमा शेष राशि",
      digitalDesc: "कागज चेक और नकद निकासी बनाम यूपीआई, कार्ड और नेटबैंकिंग हस्तांतरण का अनुपात",
      uninsuredDesc: "सक्रिय PMSBY, PMJJBY या स्वास्थ्य बीमा कवरेज से वंचित शाखा खातों का प्रतिशत",
      dtiTitle: "कर्ज-से-आय अनुपात (DTI) वितरण",
      dtiDesc: "सुरक्षित बनाम अत्यधिक कर्ज में दबे उधारकर्ताओं का अनुपात",
      leaderboardTitle: "🏆 वित्तीय स्वास्थ्य लीडरबोर्ड",
      leaderboardDesc: "पेशा वर्ग द्वारा समेकित औसत एस-फिया कल्याण स्कोर",
      dtiLabels: {
        noDebt: "कोई कर्ज नहीं",
        safe: "सुरक्षित (<=30%)",
        moderate: "मध्यम (30-50%)",
        leveraged: "अत्यधिक कर्ज (>50%)"
      }
    },
    login: {
      secureNetbanking: "सुरक्षित खुदरा नेटबैंकिंग",
      portalTitle: "योनि एस-फिया लॉगिन पोर्टल",
      portalDesc: "एआई डायग्नोस्टिक लैब में प्रवेश करने के लिए अपने डेमो क्रेडेंशियल के साथ लॉगिन करें। एस-फिया कर्ज के जाल से बचाने और सामाजिक सुरक्षा सक्रिय करने के लिए शेष राशि, डीटीआई अनुपात और बीमा सुरक्षा कवच की जांच करता है।",
      designSpotlightTitle: "शेखर कामत कीहोल सिंबल (1971)",
      designSpotlightBody: "हमारा प्रतिष्ठित वृत्त हमारे देशव्यापी नेटवर्क की पूर्णता और एकता का प्रतिनिधित्व करता है। नीचे का कीहोल विश्वास और पूर्ण सुरक्षा का प्रतिनिधित्व करता है - आपकी बचत हमारे पास सुरक्षित रूप से बंद है।",
      dbNoticeTitle: "सुरक्षित मल्टी-डेटाबेस रूटिंग आर्किटेक्चर",
      farmerRouting: "किसान प्रोफाइल: सीधे गूगल फायरस्टोर (JSON DB) में कॉल रूट करता है।",
      supabaseRouting: "पुलिस/व्यापारी/वेतनभोगी प्रोफाइल: सीधे Supabase PostgreSQL में रूट करते हैं।",
      fallbackRouting: "स्वचालित फ़ालबैक: यदि क्लाउड कनेक्शन समय समाप्त हो जाता है, तो स्थानीय SQLite डेटाबेस में वापस चला जाता है।",
      loginTitle: "कॉर्पोरेट सुरक्षा लॉगिन",
      usernameLabel: "नेटबैंकिंग यूजरनेम",
      usernamePlaceholder: "यूजरनेम दर्ज करें (जैसे farmer, police)",
      passwordLabel: "पासवर्ड / पिन",
      passwordPlaceholder: "पिन दर्ज करें ('sbi' का उपयोग करें)",
      forgotPin: "पिन भूल गए?",
      submitBtn: "सुरक्षित टर्मिनल में प्रवेश करें",
      quickSelectTitle: "डेमो क्रेडेंशियल त्वरित चयन"
    },
    investments: {
      title: "📈 म्यूचुअल फंड और एसआईपी सलाहकार",
      desc: "कंपाउंडिंग रिटर्न का विश्लेषण करें, अपने जोखिम प्रोफाइल के आधार पर अनुकूलित एसबीआई म्यूचुअल फंड योजनाओं का पता लगाएं, और भविष्य की संपत्ति वृद्धि की गणना करें।",
      profileSection: "वित्तीय प्रोफाइल मूल्यांकन",
      riskProfileLabel: "जोखिम की प्रवृत्ति",
      recommendedSipLabel: "अनुशंसित मासिक एसआईपी",
      fundsTitle: "अनुकूलित एसबीआई म्यूचुअल फंड",
      fundsDesc: "आपके व्यावसायिक नकदी प्रवाह स्थिरता, आयु और जोखिम भूख के आधार पर चुने गए।",
      calculatorTitle: "एसआईपी कैलकुलेटर",
      calculatorDesc: "यह देखने के लिए स्लाइडर्स खींचें कि नियमित निवेश समय के साथ कैसे बढ़ता है।",
      monthlyInv: "मासिक निवेश राशि",
      duration: "निवेश की अवधि",
      returnRate: "अपेक्षित वार्षिक रिटर्न",
      investedAmount: "कुल निवेशित पूंजी",
      estReturns: "अनुमानित धन लाभ",
      totalValue: "कुल भविष्य का मूल्य",
      years: "वर्ष",
      sipFormulaNotice: "नियमित मासिक चक्रवृद्धि ब्याज विकास सूत्रों पर आधारित गणना।",
      executeActionBtn: "म्यूचुअल फंड एसआईपी शुरू करें"
    }
  },
  Tamil: {
    sidebar: {
      overview: "கண்ணோட்டக் கட்டுப்பாட்டகம்",
      console: "பேராசிரியர் எஸ்-ஃபியா முனையம்",
      insights: "பணப்புழக்கக் கண்டுபிடிப்புகள்",
      health: "எனது நல்வாழ்வு அறிக்கை",
      agents: "எஸ்-ஃபியா முகவர் வரைபடம்",
      compliance: "நம்பிக்கை காப்பகம்",
      whatsapp: "வாட்ஸ்அப் உருவகப்படுத்தி",
      analytics: "வங்கி பகுப்பாய்வு",
      investments: "SIP மற்றும் பரஸ்பர நிதி",
      logout: "பாதுகாப்பான வெளியேற்றம்",
      savings: "சேமிப்பு",
      loans: "கடன்",
      caseStudy: "கேஸ் ஸ்டடி தேர்வு செய்க",
      backToPortal: "எஸ்பிஐ போர்ட்டலுக்குத் திரும்பு",
      title: "யோனோ எஸ்-ஃபியா",
      tutor: "பயிற்றுவிப்பாளர் வி3.0"
    },
    header: {
      activeAudit: "செயலில்",
      evaluateWellness: "நல்வாழ்வை மதிப்பிடு",
      evaluateWellnessOverview: "நல்வாழ்வை மதிப்பிடுக",
      evaluateWellnessConsole: "உரையாடலை பகுப்பாய்",
      evaluateWellnessInsights: "பணப்புழக்க தணிக்கை செய்க",
      evaluateWellnessHealth: "காப்பீட்டு இடைவெளியை மதிப்பிடு",
      evaluateWellnessAgents: "முகவர் ஓட்டத்தைக் கண்டறி",
      evaluateWellnessCompliance: "தடுப்பாணைகளை மதிப்பாய்வு செய்",
      evaluateWellnessWhatsapp: "உரையாடல் பதிவுகளைத் தணிக்கை செய்",
      evaluateWellnessAnalytics: "கிளைத் தரவைத் தொகு",
      selectCaseStudyMsg: "தொடங்குவதற்கு தயவுசெய்து ஒரு கேஸ் ஸ்டடியைத் தேர்ந்தெடுக்கவும்.",
      reviewingLedgerMsg: "கணக்கு ஏடு ஆய்வு செய்யப்படுகிறது"
    },
    overview: {
      ratingIndex: "நிதி நல்வாழ்வு குறியீடு",
      safetyIndex: "எஸ்-ஃபியா நிதி பாதுகாப்பு குறியீடு",
      availableBalance: "கிடைக்கக்கூடிய கணக்கு இருப்பு",
      savingsTag: "சேமிப்பு",
      savingsDesc: "உங்களது செயலில் உள்ள சேமிப்பு. சும்மா இருக்கும் சேமிப்பிற்கு 3.0% வட்டி கிடைக்கும். MODS ஆட்டோ-ஸ்வீப்பைச் செயல்படுத்துவதன் மூலம் இதை 6.8% ஆக உயர்த்தலாம்.",
      socialSecurityScan: "சமூக பாதுகாப்பு தணிக்கை",
      auditReportTag: "தணிக்கை அறிக்கை",
      scanningLedger: "பேராசிரியர் கணக்கு ஏட்டை ஆய்வு செய்கிறார்...",
      auditComplete: "தணிக்கை நிறைவடைந்தது",
      diagnosticsRequired: "பகுப்பாய்வு தேவைப்படுகிறது",
      evaluateInstructions: "முகவர் பகுப்பாய்வை இயக்க ஹெடரில் உள்ள நிதி நல்வாழ்வு மதிப்பீடு பொத்தானைக் கிளிக் செய்யவும்.",
      blackboardTitle: "பேராசிரியரின் கரும்பலகை",
      blackboardTips: "சொத்துக்களை உருவாக்குவதில் கவனம் செலுத்துங்கள், அதிக வட்டி கடன் சுழற்சியில் சிக்காதீர்கள்.",
      cashFlowTitle: "பணப்புழக்கத்தின் இயக்கவியல்",
      cashFlowDesc: "செயலில் உள்ள கணக்கு ஏட்டிலிருந்து வாராந்திர நிகர வைப்பு மற்றும் செலவு இருப்பு",
      noLedgerMsg: "பரிவர்த்தனை பதிவுகள் ஏதும் இல்லை.",
      sandboxTitle: "விரைவான வங்கி உருவகப்படுத்துதல் செயல்பாடுகள்",
      sandboxDesc: "நேரடி வங்கி பரிவர்த்தனைகள் மற்றும் கொள்கை மாற்றங்களுக்கு எஸ்-ஃபியா முகவர்கள் எவ்வாறு பதிலளிக்கிறார்கள் என்பதைச் சோதிக்கவும்",
      pmsbyBtn: "PMSBY காப்பீட்டுச் செயல்பாட்டை உருவகப்படுத்துக",
      pmjjbyBtn: "PMJJBY காப்பீட்டுச் செயல்பாட்டை உருவகப்படுத்துக",
      mudraBtn: "MSME முத்ரா கடனை வழங்குக",
      sweepBtn: "FD ஸ்வீப் MODS கட்டமைக்கவும்",
      lessonFarmerTitle: "📖 பாடம்: பிரதமரின் விபத்து காப்பீட்டுத் திட்டம் (PMSBY)",
      lessonFarmerBody: '"ஆண்டுக்கு வெறும் ₹20-க்கு (ஒரு கப் டீயின் விலையை விடக் குறைவு!), அரசாங்கம் ₹2 லட்சம் மதிப்பிலான விபத்துக் காப்பீட்டை வழங்குகிறது. இதுவே இந்தியாவின் மலிவான கவசம். எஸ்-ஃபியா இதனை உடனடியாகப் பெற உதவுகிறது."',
      lessonPoliceTitle: "👮 பாடம்: அதிக ஆபத்துள்ள காப்பீட்டு இடைவெளிகள்",
      lessonPoliceBody: '"ஒரு போலீஸ் அதிகாரியாக, உங்கள் பணியில் தினசரி ஆபத்துகள் நிறைந்துள்ளன. சேமிப்பும் வீட்டுக் கடனும் சரியாக இருந்தாலும், ஆயுள் காப்பீடு இல்லாதது உங்களைச் சார்ந்தவர்களைப் பாதிக்கும். உடனடியாக PMJJBY திட்டத்தை இயக்குவோம்."',
      lessonMerchantTitle: "🏪 பாடம்: MSME முத்ரா கடன்கள்",
      lessonMerchantBody: '"உங்கள் கடை கணக்கில் தொடர்ந்து யுபிஐ வரவுகள் வருவது, உங்கள் வணிகம் வளர்வதைக் காட்டுகிறது! கந்துவட்டிக்காரர்களிடம் 24% வட்டிக்குக் கடன் வாங்குவதற்குப் பதிலாக, எஸ்பிஐ முத்ரா 9.5% வட்டியில் பிணையில்லாக் கடனை வழங்குகிறது."',
      lessonSalariedTitle: "⚠️ பாடம்: கடன் வலையைத் தவிர்த்தல்",
      lessonSalariedBody: '"நீங்கள் ஒரு கனமான பையைச் சுமக்கிறீர்கள் என்று கற்பனை செய்து பாருங்கள். ஒரு சிறிய தண்ணீர் பாட்டில் (குறுங்கடன்) பரவாயில்லை. ஆனால் களைப்பாக இருக்கும்போது ஒரு பெரிய பாறாங்கல் (₹5 லட்சம் கடன்) உங்கள் முதுகை உடைத்துவிடும்! எஸ்-ஃபியா 50% கடனுக்கும் மேலுள்ள கடன்களைத் தடுக்கிறது."'
    },
    console: {
      title: "பேராசிரியர் எஸ்-ஃபியா முனையம்",
      desc: "உங்கள் தனிப்பட்ட ஏஐ நல்வாழ்வு உறவு மேலாளர். கேள்விகளைக் கேளுங்கள், ஊடாடும் நிதி ஆலோசனைகளைப் பெறுங்கள், மற்றும் நீங்கள் விரும்பும் மொழியில் குரல் வழிகாட்டலைக் கேளுங்கள்.",
      voiceEngine: "எஸ்-ஃபியா குரல் பொறி",
      narratorStatus: "குரல் விளக்கம் நிலை",
      activeListening: "🔈 செயலில் உள்ளது மற்றும் கேட்கிறது",
      mutedPaused: "🔇 ஒலியடக்கப்பட்டது / நிறுத்தப்பட்டது",
      muteBtn: "ஒலியடக்கு",
      unmuteBtn: "ஒலி இயக்கு",
      readLessonBtn: "பாடத்தை வாசி",
      stopVoiceBtn: "குரலை நிறுத்து",
      speakingIndicator: "🔊 பேராசிரியர் எஸ்-ஃபியா பேசுகிறார்...",
      lessonHighlights: "சமீபத்திய பாடத்தின் சிறப்பம்சங்கள்",
      activeTopic: "செயலில் உள்ள தலைப்பு",
      description: "விளக்கம்",
      suitabilityStatus: "பொருத்த நிலை",
      requiredAction: "தேவையான நடவடிக்கை",
      interactiveDialogue: "ஊடாடும் உரையாடல்",
      studentLabel: "மாணவர்",
      emptyAuditMsg: "உரையாடலைத் தொடங்க கணக்கு ஏட்டைத் தணிக்கை செய்யவும்.",
      inputPlaceholder: "உங்கள் பதில் அல்லது கேள்வியைத் தட்டச்சு செய்க...",
      sendBtn: "அனுப்பு"
    },
    insights: {
      discoveriesTitle: "🔍 பணப்புழக்கக் கண்டுபிடிப்புகள்",
      discoveriesDesc: "உங்கள் பரிவர்த்தனை கணக்கேட்டிலிருந்து தணிக்கை செய்யப்பட்ட குறிகாட்டிகள்",
      lifecycleTitle: "🎯 வரவிருக்கும் வாழ்க்கைச் சுழற்சி தேவைகள்",
      lifecycleDesc: "சாத்தியமான பணத் தேவைகளை வரைபடமாக்கும் நுண்ணறிவு கணிப்புகள்",
      confidence: "நம்பிக்கை நிலை",
      probability: "சாத்தியக்கூறு",
      signals: {
        dormant: "🌾 செயலற்ற கணக்கு (Dormant)",
        zeroUpi: "📱 டிஜிட்டல் பரிவர்த்தனைகள் இல்லை",
        highUpi: "⚡ வளரும் டிஜிட்டல் கடை பரிவர்த்தனைகள்",
        healthyCash: "📈 உறுதியான சில்லறை வணிக வருவாய்",
        stableSalary: "💼 வழக்கமான சம்பள வருமானம்",
        heavyDebt: "⚠️ அதிக மாதாந்திர கடன் சுமை",
        highCard: "💳 அதிக கிரெடிட் கார்டு செலவுகள்"
      },
      events: {
        cropCycleTitle: "🚜 பருவகால அறுவடை காலம்",
        cropCycleDesc: "விவசாய சுயவிவரத்தின் அடிப்படையிலான பருவகால சாகுபடி மூலதனத் தேவைகள்.",
        scaleUpTitle: "🏪 கடை விரிவாக்கம் மற்றும் இருப்புப் பெருக்கம்",
        scaleUpDesc: "தொடர்ந்து உயரும் டிஜிட்டல் கடை வரவுகள் கடை விரிவாக்கத்திற்கான தயார்நிலையைக் காட்டுகின்றன.",
        highExpenditureTitle: "💍 அதிக செலவு தரும் மைல்கல் (திருமணம்/கார்)",
        highExpenditureDesc: "கடன் கோரிக்கைகளும் கார்டு பயன்பாடும் அதிக செலவு தரும் குடும்ப நிகழ்வைச் சுட்டிக்காட்டுகின்றன."
      }
    },
    health: {
      radarTitle: "நிதி நல்வாழ்வு விவரக்குறிப்பு வரைபடம்",
      radarDesc: "சேமிப்பு, கடன் பாதுகாப்பு மற்றும் பாதுகாப்பு கவசங்களை வரைபடமாக்கும் மதிப்பெண் அட்டை",
      scorecardTitle: "நிதி நல்வாழ்வு அளவுருக்கள்",
      scorecardDesc: "தனிப்பட்ட நிதி அளவுருக்களின் எளிய விளக்கங்கள்",
      parameters: {
        savingsTitle: "💵 பண இருப்பு (சேமிப்பு)",
        savingsDesc: "உங்களிடம் போதுமான அவசரக்கால பண இருப்பு உள்ளதா?",
        insuranceTitle: "🛡️ பாதுகாப்பு கவசங்கள் (காப்பீடு)",
        insuranceDesc: "விபத்து மற்றும் வாழ்நாள் ஆபத்துகளுக்கு எதிராக நீங்கள் காப்பீடு செய்துள்ளீர்களா?",
        investmentTitle: "📈 செல்வப் பெருக்கிகள் (முதலீடுகள்)",
        investmentDesc: "உங்கள் பணம் FD அல்லது SIP-களில் வளர்ந்து பெருகுகிறதா?",
        digitalTitle: "📱 மொபைல் பேங்கிங் பயன்பாடு",
        digitalDesc: "நீங்கள் UPI, YONO அல்லது ஆன்லைன் போர்ட்டல்களைப் பயன்படுத்துகிறீர்களா?",
        debtTitle: "⚖️ கடன் பாதுகாப்பு சுமை",
        debtDesc: "உங்கள் கடன் பாதுகாப்பானதா அல்லது உங்கள் வருமானத்தை அழிக்கிறதா?"
      },
      gapTitle: "⚠️ காப்பீட்டு இடைவெளி தணிக்கை",
      gapDesc: "பரிந்துரைக்கப்பட்ட அளவுகளுடன் செயலில் உள்ள காப்பீடுகளை ஒப்பிடும் கணித தணிக்கை",
      gaps: {
        lifeGap: "ஆயுள் காப்பீட்டு இடைவெளி",
        lifeRequired: "தேவை: ஆண்டு வருமானத்தைப் போல 10 மடங்கு",
        healthGap: "மருத்துவக் காப்பீட்டு இடைவெளி",
        healthRequired: "பரிந்துரைக்கப்பட்ட காப்பீடு: ₹5 லட்சம்",
        accidentalCover: "விபத்துக் காப்பீடு",
        accidentalScheme: "பிரதமரின் விபத்து காப்பீட்டுத் திட்டம் (PMSBY)",
        accidentalDesc: "ஆண்டுக்கு ₹20 கட்டணத்தில் ₹2 லட்சம் விபத்துக் காப்பீடு வழங்குகிறது.",
        microLife: "குறு ஆயுள் பாதுகாப்பு",
        microLifeScheme: "PM ஜீவன் ஜோதி பீமா / APY",
        microLifeDesc: "ஆண்டுக்கு ₹436 கட்டணத்தில் ₹2 லட்சம் ஆயுள் காப்பீடு வழங்குகிறது.",
        activeCover: "செயலில் உள்ள காப்பீடு",
        inactiveCover: "செயலற்றது / காலாவதியானது",
        fullyCovered: "முழுமையாகப் பாதுகாக்கப்பட்டது",
        gapLabel: "இடைவெளி"
      },
      tableTitle: "📋 செயலில் உள்ள மற்றும் வரலாற்று காப்பீட்டுப் பத்திரங்கள்",
      tableDesc: "வாடிக்கையாளர் காப்பீட்டுத் தரவுகளின் தணிக்கைப் பதிவு",
      loadingMsg: "காப்பீட்டுத் தரவுகள் ஏற்றப்படுகின்றன...",
      emptyTableMsg: "இந்த வாடிக்கையாளருக்கு காப்பீட்டுப் பத்திரங்கள் எதுவும் இல்லை.",
      headers: {
        id: "பத்திர எண் (ID)",
        name: "திட்டத்தின் பெயர்",
        type: "வகை",
        sum: "காப்பீட்டுத் தொகை",
        premium: "ஆண்டுக் கட்டணம்",
        status: "நிலை",
        expiry: "முடிவடையும் தேதி"
      }
    },
    compliance: {
      approvedTitle: "அனுமதிக்கப்பட்ட தேர்வுகள்",
      vetoedTitle: "தடுக்கப்பட்ட வங்கித் தயாரிப்புகள்",
      emptyApproved: "அனுமதிக்கப்பட்ட தயாரிப்புகள் ஏதுமில்லை.",
      zeroBlocked: "தடுக்கப்பட்ட தயாரிப்புகள் ஏதுமில்லை. கணக்கு ஏடு முற்றிலும் பாதுகாப்பானது.",
      unloadedAudit: "தணிக்கைப் பதிவுகள் இல்லை. விவரங்களைப் பெற நல்வாழ்வு மதிப்பீட்டை இயக்கவும்.",
      altLabel: "பேராசிரியரின் சிறந்த மாற்று ஆலோசனை",
      tableTitle: "வங்கி விதிமுறை தணிக்கை பதிவேடு",
      tableDesc: "விதிமுறை இணக்கங்களைச் சரிபார்க்கும் நேரடி தணிக்கை முடிவுகள்",
      emptyTable: "தணிக்கைப் பதிவுகள் ஏதுமில்லை. மதிப்பீட்டை இயக்கவும்.",
      tableHeaders: {
        timestamp: "நேரம்",
        clientId: "வாடிக்கையாளர் எண்",
        agent: "முகவர்/அமைப்பு",
        decision: "முடிவு",
        reasoning: "தணிக்கை விளக்கம்"
      }
    },
    agents: {
      title: "🎓 எஸ்-ஃபியா முகவர் வரைபடம்",
      desc: "உங்கள் கோப்புகளை முகவர்கள் எவ்வாறு படிநிலையாக ஆய்வு செய்கிறார்கள் என்பதைக் கண்காணியுங்கள்",
      step: "தணிக்கை படி",
      decisionsHeader: "முகவர்களின் தணிக்கை முடிவுகள் மற்றும் காரணங்கள்",
      emptyLogs: "தணிக்கைப் பதிவுகள் இங்கே தோன்றும். நல்வாழ்வு மதிப்பீட்டைத் தொடங்கவும்."
    },
    whatsapp: {
      botName: "பேராசிரியர் எஸ்-ஃபியா பாட்",
      online: "செயலில் உள்ளார்",
      statementBtn: "📄 1 வருட கணக்கு அறிக்கை",
      loanBtn: "💰 தனிநபர் கடன் விண்ணப்பம்",
      entitlementsBtn: "🛡️ சலுகைகளைச் சரிபார்",
      typingPlaceholder: "செய்தியைத் தட்டச்சு செய்க...",
      consoleTitle: "மெட்டா ஏபிஐ தணிக்கை முனையம்",
      consoleDesc: "நேரடி வெப்ஹுக் மற்றும் கிராப் ஏபிஐ தரவுப் பரிமாற்றக் கண்காணிப்பு",
      targetPhone: "இலக்கு தொலைபேசி எண்",
      tipMsg: "செய்தி பரிமாற்றத்தை உருவகப்படுத்துகிறது. மெட்டா `.env` கோப்பில் உள்ள சான்றுகளைப் பயன்படுத்தி வாட்ஸ்அப் செய்தியை அனுப்பும்.",
      emptyLogs: "பதிவுகள் ஏதுமில்லை. மொபைல் திரையில் உள்ள பொத்தான்களை அழுத்தவும்!",
      payloadHeader: "தரவுப் பொதி (PAYLOAD)",
      apiResponseCode: "ஏபிஐ பதில் குறியீடு"
    },
    analytics: {
      assetsTitle: "கிளையின் மொத்த சொத்து மதிப்பு (AUM)",
      digitalTitle: "டிஜிட்டல் வங்கிப் பயன்பாடு",
      uninsuredTitle: "காப்பீடு இல்லாத இடைவெளி",
      assetsDesc: "இந்தக் கிளையில் வாடிக்கையாளர்கள் வைத்துள்ள மொத்த சேமிப்பு மற்றும் வைப்பு இருப்புக்கள்",
      digitalDesc: "காசோலை மற்றும் நேரடிப் பணப் பரிவர்த்தனைகளுக்கு மாற்றாக யுபிஐ, கார்டு மற்றும் இணையப் பயன்பாட்டின் விகிதம்",
      uninsuredDesc: "பிரதமரின் காப்பீட்டுத் திட்டங்களோ அல்லது மருத்துவக் காப்பீட்டோ இல்லாத கணக்குகளின் சதவீதம்",
      dtiTitle: "கடன்-வருமான விகிதப் பரவல் (DTI)",
      dtiDesc: "பாதுகாப்பான மற்றும் அதிகக் கடன் சுமையில் இருக்கும் கடனாளிகளின் விகிதம்",
      leaderboardTitle: "🏆 நிதி நல்வாழ்வு தரவரிசைப் பட்டியல்",
      leaderboardDesc: "தொழில் வாரியாகக் கணக்கிடப்பட்ட சராசரி நிதி நல்வாழ்வு மதிப்பெண்கள்",
      dtiLabels: {
        noDebt: "கடன் இல்லாதவை",
        safe: "பாதுகாப்பானது (<=30%)",
        moderate: "நடுத்தர கடன் (30-50%)",
        leveraged: "அபாயகரமான கடன் (>50%)"
      }
    },
    login: {
      secureNetbanking: "பாதுகாப்பான சில்லறை இணைய வங்கி",
      portalTitle: "யோனோ எஸ்-ஃபியா உள்நுழைவு முனையம்",
      portalDesc: "ஏஐ பகுப்பாய்வகத்திற்குள் நுழைய உங்கள் சான்றுகளுடன் உள்நுழையவும். கடன்பொறிகளிலிருந்து உங்களைப் பாதுகாக்கவும், சமூகப் பாதுகாப்பை செயல்படுத்தவும் உங்களது இருப்புக்கள், கடன்-வருமான விகிதங்கள் மற்றும் காப்பீட்டு கவசங்களை எஸ்-ஃபியா சரிபார்க்கிறது.",
      designSpotlightTitle: "சேகர் காமத்தின் சாவித்துவாரச் சின்னம் (1971)",
      designSpotlightBody: "எங்கள் சின்னத்திலுள்ள வட்டம் நாடு தழுவிய எங்களின் முழுமையையும் ஒற்றுமையையும் குறிக்கிறது. கீழேயுள்ள சாவித்துவாரம் வாடிக்கையாளர்களின் நம்பிக்கையையும் முழுமையான பாதுகாப்பையும் குறிக்கிறது - உங்கள் சேமிப்பு எஸ்பிஐ-யிடம் பாதுகாப்பாக உள்ளது.",
      dbNoticeTitle: "பாதுகாப்பான பன்முக தரவுத்தளக் கட்டமைப்பு",
      farmerRouting: "விவசாயி விவரக்குறிப்பு: கோரிக்கைகளை நேரடியாக கூகுள் ஃபயர்ஸ்டோர் (JSON DB) தரவுத்தளத்திற்கு அனுப்புகிறது.",
      supabaseRouting: "போலீஸ்/வணிகர்/சம்பளதாரர் விவரக்குறிப்புகள்: கோரிக்கைகளை நேரடியாக Supabase PostgreSQL தரவுத்தளத்திற்கு அனுப்புகிறது.",
      fallbackRouting: "தானியங்கி பாதுகாப்பு: இணையத் தொடர்புகள் தடைபட்டால், உடனடியாக கணினிக்குள்ளேயே உள்ள SQLite தரவுத்தளத்திற்கு மாறுகிறது.",
      loginTitle: "கார்ப்பரேட் பாதுகாப்பு உள்நுழைவு",
      usernameLabel: "இணைய வங்கி பயனர் பெயர்",
      usernamePlaceholder: "பயனர் பெயரை உள்ளிடுக (எ.கா: farmer, police)",
      passwordLabel: "கடவுச்சொல் / பின் (PIN)",
      passwordPlaceholder: "பின் எண்ணை உள்ளிடுக ('sbi' என உள்ளிடுக)",
      forgotPin: "பின் எண் மறந்ததா?",
      submitBtn: "பாதுகாப்பான முனையத்திற்குள் நுழைக",
      quickSelectTitle: "டெமோ சான்றுகளின் விரைவுத் தேர்வு"
    },
    investments: {
      title: "📈 மியூச்சுவல் ஃபண்ட் & SIP ஆலோசகர்",
      desc: "கூட்டு வட்டி வருவாயை பகுப்பாய்வு செய்யவும், உங்களது அபாய சுயவிவரத்தின் அடிப்படையில் தனிப்பயனாக்கப்பட்ட எஸ்பிஐ மியூச்சுவல் ஃபண்ட் திட்டங்களை ஆராயவும்.",
      profileSection: "நிதி சுயவிவர மதிப்பீடு",
      riskProfileLabel: "அபாய சகிப்புத்தன்மை",
      recommendedSipLabel: "பரிந்துரைக்கப்பட்ட மாதாந்திர SIP",
      fundsTitle: "பரிந்துரைக்கப்பட்ட எஸ்பிஐ மியூச்சுவல் ஃபண்டுகள்",
      fundsDesc: "உங்களது மாதாந்திர வருமான நிலைத்தன்மை, வயது மற்றும் அபாய அளவை அடிப்படையாகக் கொண்டு தேர்ந்தெடுக்கப்பட்டது.",
      calculatorTitle: "SIP கூட்டு வட்டி கணக்கீடு",
      calculatorDesc: "முறையான மாதாந்திர முதலீடுகள் காலப்போக்கில் எவ்வாறு வளர்கின்றன என்பதை அறிய ஸ்லைடரை இழுக்கவும்.",
      monthlyInv: "மாதாந்திர முதலீட்டு அளவு",
      duration: "முதலீட்டு காலம்",
      returnRate: "எதிர்பார்க்கப்படும் ஆண்டு வட்டி",
      investedAmount: "முதலீடு செய்த தொகை",
      estReturns: "மதிப்பிடப்பட்ட வட்டி லாபம்",
      totalValue: "மொத்த எதிர்கால மதிப்பு",
      years: "ஆண்டுகள்",
      sipFormulaNotice: "முறையான மாதாந்திர கூட்டு வட்டி கணக்கீட்டு சூத்திரங்களின் அடிப்படையில் கணக்கிடப்பட்டது.",
      executeActionBtn: "மியூச்சுவல் ஃபண்ட் SIP ஐத் தொடங்கு"
    }
  }
};
