"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSFIA } from "./dashboard/context";
import { 
  Building2, Users, Sparkles, ArrowUpRight, Search, 
  FileText, Lock, Landmark, BookOpen, PhoneCall, UserPlus, Info, Sun, Moon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Shekhar Kamat SBI Logo
function SBILogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="currentColor">
      <path d="M 50 10 A 40 40 0 1 0 50 90 A 40 40 0 1 0 50 10 Z" />
      <rect x="46" y="55" width="8" height="30" fill="#ffffff" />
      <circle cx="50" cy="50" r="14" fill="#ffffff" />
      <circle cx="50" cy="50" r="7" fill="currentColor" />
    </svg>
  );
}

const landingTranslations = {
  English: {
    tollFree: "1800 123 4 (Toll Free)",
    ifsc: "IFSC: SBIN0000301",
    corporateWebsite: "Corporate Website",
    launchSfia: "Launch YONO S-FIA",
    tagline: "The Banker to every Indian",
    personal: "Personal",
    business: "Business",
    nri: "NRI",
    agriculture: "Agriculture",
    banking: "Banking",
    heritage: "Our Heritage",
    searchPlaceholder: "Search schemes...",
    yonoLogin: "YONO LOGIN",
    socialSecurity: "Social Security",
    businessExpansion: "Business Expansion",
    wealthAccumulation: "Wealth Accumulation",
    checkEligibility: "Check Eligibility",
    verifyBusiness: "Verify Business",
    configureSweep: "Configure Sweep",
    askSfia: "Ask S-FIA Advisor",
    yonoSfiaAudit: "YONO S-FIA AI Audit",
    analyzingLedger: "*Analyzing core banking ledgers...*",
    checkingSafetyShield: "*Checking safety shield insurance gaps...*",
    pmsbyStatusPending: "*PM Suraksha Bima Cover status: PENDING*",
    auditYourLedgerNow: "Audit Your Ledger Now",
    retailBankingPortals: "Retail Banking Portals",
    accessSecureTerminals: "Access secure banking, accounts, and investment terminals",
    netbankingTitle: "NetBanking Retail Login",
    netbankingDesc: "Access savings, checking, and online sweeps.",
    mudraTitle: "Apply for Loan / MSME Mudra",
    mudraDesc: "Check credit status and collateral-free options.",
    sweepTitle: "Open New Sweep Account",
    sweepDesc: "Start auto-sweep MODS for higher returns.",
    sfiaAssistantTitle: "YONO S-FIA Virtual Assistant",
    sfiaAssistantDesc: "Talk directly to our AI relationship manager.",
    heritageTitle: "State Bank of India: Our Heritage & Identity",
    heritageDesc: "A journey of trust and completeness since 1806",
    h1806Title: "1806 — Bank of Calcutta",
    h1806Desc: "Tracing roots back to the Presidency Bank of Bengal, Bombay, and Madras, which managed early Indian state transactions.",
    h1921Title: "1921 — Imperial Bank of India",
    h1921Desc: "Amalgamation of the three Presidency banks into a unified entity, laying down modern structural retail and commercial banking protocols.",
    h1955Title: "1955 — State Bank of India Act",
    h1955Desc: "Nationalization of the Imperial Bank of India, creating the State Bank of India to secure financial inclusion across rural and urban landscapes.",
    logoTitle: "The Iconic Logo (1971)",
    logoDesc: "Designed by NID alumnus Shekhar Kamat in October 1971. The Circle represents the completeness of unity and SBI's nationwide network. The Keyhole Cut at the bottom represents safety, security, and trust—guaranteeing that the customer's savings are locked securely with us.",
    exploreSfia: "Explore YONO S-FIA AI Wellness Tutor",
    launchBtn: "LAUNCH",
    securityTips: "Security Tips",
    privacyPolicy: "Privacy Policy",
    helpDesk: "Help Desk",
    floatingWidgetLabel: "YONO S-FIA AI Banker"
  },
  Hindi: {
    tollFree: "1800 123 4 (टोल फ्री)",
    ifsc: "आईएफएससी: SBIN0000301",
    corporateWebsite: "कॉर्पोरेट वेबसाइट",
    launchSfia: "योनो एस-फिया शुरू करें",
    tagline: "हर भारतीय का बैंकर",
    personal: "व्यक्तिगत",
    business: "व्यवसाय",
    nri: "एनआरआई",
    agriculture: "कृषि",
    banking: "बैंकिंग",
    heritage: "हमारी विरासत",
    searchPlaceholder: "योजनाएं खोजें...",
    yonoLogin: "योनो लॉगिन",
    socialSecurity: "सामाजिक सुरक्षा",
    businessExpansion: "व्यवसाय विस्तार",
    wealthAccumulation: "धन संचय",
    checkEligibility: "पात्रता जांचें",
    verifyBusiness: "व्यवसाय सत्यापित करें",
    configureSweep: "स्वीप कॉन्फ़िगर करें",
    askSfia: "एस-फिया सलाहकार से पूछें",
    yonoSfiaAudit: "योनो एस-फिया एआई ऑडिट",
    analyzingLedger: "*कोर बैंकिंग बहीखातों का विश्लेषण...*",
    checkingSafetyShield: "*सुरक्षा कवच बीमा अंतराल की जांच...*",
    pmsbyStatusPending: "*पीएम सुरक्षा बीमा कवर स्थिति: लंबित*",
    auditYourLedgerNow: "अभी अपना बहीखाता ऑडिट करें",
    retailBankingPortals: "खुदरा बैंकिंग पोर्टल",
    accessSecureTerminals: "सुरक्षित बैंकिंग, खाते और निवेश टर्मिनलों तक पहुंचें",
    netbankingTitle: "नेटबैंकिंग रिटेल लॉगिन",
    netbankingDesc: "बचत, चेकिंग और ऑनलाइन स्वीप तक पहुंचें।",
    mudraTitle: "ऋण / एमएसएमई मुद्रा के लिए आवेदन करें",
    mudraDesc: "क्रेडिट स्थिति और संपार्श्विक-मुक्त विकल्पों की जांच करें।",
    sweepTitle: "नया स्वीप खाता खोलें",
    sweepDesc: "उच्च रिटर्न के लिए ऑटो-स्वीप एमओडीएस शुरू करें।",
    sfiaAssistantTitle: "योनो एस-फिया वर्चुअल सहायक",
    sfiaAssistantDesc: "हमारे एआई संबंध प्रबंधक से सीधे बात करें।",
    heritageTitle: "भारतीय स्टेट बैंक: हमारी विरासत और पहचान",
    heritageDesc: "1806 से विश्वास और पूर्णता की यात्रा",
    h1806Title: "1806 — बैंक ऑफ कलकत्ता",
    h1806Desc: "प्रेसीडेंसी बैंक ऑफ Bengal, बॉम्बे और मद्रास से जुड़ी जड़ें, जिन्होंने शुरुआती भारतीय राज्य लेनदेन का प्रबंधन किया।",
    h1921Title: "1921 — इम्पीरियल बैंक ऑफ इंडिया",
    h1921Desc: "तीन प्रेसीडेंसी बैंकों का एक एकीकृत इकाई में विलय, जिसने आधुनिक खुदरा और वाणिज्यिक बैंकिंग प्रोटोकॉल की नींव रखी।",
    h1955Title: "1955 — भारतीय स्टेट बैंक अधिनियम",
    h1955Desc: "इम्पीरियल बैंक ऑफ इंडिया का राष्ट्रीयकरण, ग्रामीण और शहरी क्षेत्रों में वित्तीय समावेशन सुरक्षित करने के लिए भारतीय स्टेट बैंक का गठन।",
    logoTitle: "प्रतिष्ठित लोगो (1971)",
    logoDesc: "अक्टूबर 1971 में एनआईडी के पूर्व छात्र शेखर कामत द्वारा डिजाइन किया गया। चक्र एकता की पूर्णता और एसबीआई के राष्ट्रव्यापी नेटवर्क का प्रतिनिधित्व करता है। नीचे दिया गया मुख्य छिद्र (चाबी का छेद) सुरक्षा और पूर्ण विश्वास का प्रतिनिधित्व करता है - आपकी बचत हमारे पास पूरी तरह सुरक्षित है।",
    exploreSfia: "योनो एस-फिया एआई कल्याण शिक्षक का अन्वेषण करें",
    launchBtn: "प्रारंभ",
    securityTips: "सुरक्षा टिप्स",
    privacyPolicy: "गोपनीयता नीति",
    helpDesk: "सहायता डेस्क",
    floatingWidgetLabel: "योनो एस-फिया एआई बैंकर"
  },
  Tamil: {
    tollFree: "1800 123 4 (கட்டணமில்லா எண்)",
    ifsc: "IFSC குறியீடு: SBIN0000301",
    corporateWebsite: "கார்ப்பரேட் வலைத்தளம்",
    launchSfia: "யோனோ எஸ்-ஃபியாவைத் தொடங்கு",
    tagline: "ஒவ்வொரு இந்தியரின் வங்கி",
    personal: "தனிநபர்",
    business: "வணிகம்",
    nri: "என்ஆர்ஐ",
    agriculture: "விவசாயம்",
    banking: "வங்கிச் சேவை",
    heritage: "எங்கள் பாரம்பரியம்",
    searchPlaceholder: "திட்டங்களைத் தேடுக...",
    yonoLogin: "யோனோ உள்நுழைவு",
    socialSecurity: "சமூகப் பாதுகாப்பு",
    businessExpansion: "வணிக விரிவாக்கம்",
    wealthAccumulation: "சொத்து குவிப்பு",
    checkEligibility: "தகுதியைச் சரிபார்",
    verifyBusiness: "வணிகத்தைச் சரிபார்",
    configureSweep: "ஸ்வீப் கட்டமைக்கவும்",
    askSfia: "எஸ்-ஃபியா ஆலோசனை பெறு",
    yonoSfiaAudit: "யோனோ எஸ்-ஃபியா ஏஐ தணிக்கை",
    analyzingLedger: "*பரிவர்த்தனைகளை பகுப்பாய்வு செய்கிறது...*",
    checkingSafetyShield: "*காப்பீட்டு பாதுகாப்பு இடைவெளிகளைச் சரிபார்க்கிறது...*",
    pmsbyStatusPending: "*PMSBY காப்பீட்டு நிலை: நிலுவையில் உள்ளது*",
    auditYourLedgerNow: "உங்களது கணக்கை இப்போது தணிக்கை செய்க",
    retailBankingPortals: "சில்லறை வங்கி நுழைவாயில்கள்",
    accessSecureTerminals: "பாதுகாப்பான கணக்குகள் மற்றும் முதலீட்டு முனையங்களை அணுகுக",
    netbankingTitle: "நெட்பேங்கிங் சில்லறை உள்நுழைவு",
    netbankingDesc: "சேமிப்பு கணக்குகள் மற்றும் ஆன்லைன் வைப்புத்தொகைகளை அணுகவும்.",
    mudraTitle: "முத்ரா குறுங்கடன் விண்ணப்பம்",
    mudraDesc: "பிணையில்லாத கடன்கள் மற்றும் தகுதிகளைச் சரிபார்க்கவும்.",
    sweepTitle: "புதிய ஸ்வீப் கணக்கைத் தொடங்கு",
    sweepDesc: "அதிக வட்டி பெற ஆட்டோ-ஸ்வீப் வசதியை இயக்கவும்.",
    sfiaAssistantTitle: "யோனோ எஸ்-ஃபியா மெய்நிகர் உதவியாளர்",
    sfiaAssistantDesc: "எங்கள் எஸ்பிஐ ஏஐ உறவு மேலாளருடன் நேரடியாக உரையாடுங்கள்.",
    heritageTitle: "பாரத ஸ்டேட் வங்கி: எங்களது பாரம்பரியம் & அடையாளம்",
    heritageDesc: "1806 முதல் தொடரும் நம்பிக்கை மற்றும் முழுமைக்கான பயணம்",
    h1806Title: "1806 — பேங்க் ஆஃப் கல்கத்தா",
    h1806Desc: "பழைய இந்திய அரசு பரிவர்த்தனைகளை நிர்வகித்த பெங்கால், பம்பாய் மற்றும் மெட்ராஸ் பிரசிடென்சி வங்கிகளின் தொடக்கம்.",
    h1921Title: "1921 — இம்பீரியல் பேங்க் ஆஃப் இந்தியா",
    h1921Desc: "மூன்று பிரசிடென்சி வங்கிகளும் ஒன்றிணைக்கப்பட்டு இம்பீரியல் வங்கியாக உருவெடுத்தது, இதுவே நவீன சில்லறை வங்கி முறைக்கு வித்திட்டது.",
    h1955Title: "1955 — பாரத ஸ்டேட் வங்கிச் சட்டம்",
    h1955Desc: "இம்பீரியல் வங்கி தேசியமயமாக்கப்பட்டு பாரத ஸ்டேட் வங்கியாக மாறியது, இது கிராமப்புற மற்றும் நகர்ப்புறங்களில் நிதி உள்ளடக்கத்தைப் பாதுகாத்தது.",
    logoTitle: "புகழ்பெற்ற சின்னம் (1971)",
    logoDesc: "அக்டோபர் 1971 இல் என்ஐடி முன்னாள் மாணவர் சேகர் காமத் என்பவரால் வடிவமைக்கப்பட்டது. சின்னத்திலுள்ள வட்டம் நாட்டின் முழுமையையும் எங்களின் பரந்த நெட்வொர்க்கையும் குறிக்கிறது. கீழேயுள்ள சாவித்துவாரம் வாடிக்கையாளர்களின் நம்பிக்கையையும் பாதுகாப்பையும் குறிக்கிறது - உங்கள் சேமிப்பு எஸ்பிஐ-யிடம் பாதுகாப்பாக உள்ளது.",
    exploreSfia: "யோனோ எஸ்-ஃபியா நிதி நல்வாழ்வு ஆசிரியரை ஆராயுங்கள்",
    launchBtn: "தொடங்கு",
    securityTips: "பாதுகாப்பு குறிப்புகள்",
    privacyPolicy: "தனியுரிமைக் கொள்கை",
    helpDesk: "உதவி மையம்",
    floatingWidgetLabel: "யோனோ எஸ்-ஃபியா ஏஐ பாங்கர்"
  }
};

export default function SBIPortalClone() {
  const { 
    language, 
    setLanguage, 
    theme, 
    setTheme, 
    fontScale, 
    setFontScale 
  } = useSFIA();
  
  const tl = landingTranslations[language];

  const [selectedSubTab, setSelectedSubTab] = useState<"personal" | "business" | "agriculture" | "history">("personal");
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    {
      title: "PM Suraksha Bima Yojana (PMSBY)",
      desc: language === "Hindi" 
        ? "केवल ₹20/वर्ष में ₹2 लाख का दुर्घटना मृत्यु बीमा। अपने प्रियजनों की सुरक्षा सुनिश्चित करें। योनो एस-फिया द्वारा जांची गई।" 
        : language === "Tamil"
        ? "ஆண்டுக்கு வெறும் ₹20-க்கு ₹2 லட்சம் விபத்து மரணக் காப்பீடு. உங்கள் அன்புக்குரியவர்களின் பாதுகாப்பை உறுதி செய்யுங்கள். யோனோ எஸ்-ஃபியாவால் தணிக்கை செய்யப்பட்டது."
        : "Accidental Death Insurance of ₹2 Lakhs at just ₹20/year. Ensure protection for your loved ones. Audited by YONO S-FIA.",
      btnText: tl.checkEligibility,
      tag: tl.socialSecurity,
      href: "/login?role=farmer"
    },
    {
      title: "SBI Shishu Mudra MSME Loans",
      desc: language === "Hindi"
        ? "किराना दुकानों और सूक्ष्म व्यवसायों के लिए ₹50,000 तक का संपार्श्विक-मुक्त खुदरा ऋण। योनो एस-फिया के साथ ऑटो-अप्लाई करें।"
        : language === "Tamil"
        ? "மளிகைக் கடைகள் மற்றும் குறுந்தொழில்களுக்காக ₹50,000 வரையிலான பிணையில்லா குறுங்கடன். யோனோ எஸ்-ஃபியா மூலம் முன்கூட்டியே தகுதிபெறுக."
        : "Collateral-free retail credit up to ₹50,000 for kirana shops and micro-businesses. Auto-apply with YONO S-FIA.",
      btnText: tl.verifyBusiness,
      tag: tl.businessExpansion,
      href: "/login?role=merchant"
    },
    {
      title: "SBI MODS (Fixed Deposit Sweep)",
      desc: language === "Hindi"
        ? "निष्क्रिय बचत शेष पर 6.8% की उच्च ब्याज दर अर्जित करें। ₹5,000 के गुणांकों में स्वीप होता है। योनो एस-फिया के साथ सेटअप करें।"
        : language === "Tamil"
        ? "சேமிப்பு கணக்கில் சும்மா இருக்கும் இருப்புத் தொகையிலிருந்து 6.8% வரை எஃப்டி வட்டி பெறவும். ₹5,000 அலகுகளில் ஸ்வீப் ஆகும். யோனோ எஸ்-ஃபியா மூலம் கட்டமைக்கலாம்."
        : "Earn high-yield FD interest rate of 6.8% on idle savings balances. Sweeps in units of ₹5,000. Setup with YONO S-FIA.",
      btnText: tl.configureSweep,
      tag: tl.wealthAccumulation,
      href: "/login?role=salaried"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="min-h-screen bg-primary-bg text-primary-text flex flex-col font-sans relative overflow-x-hidden transition-colors duration-200">
      
      {/* Top Utility Bar */}
      <div className="bg-[#0f2540] text-slate-300 text-xs py-2 px-4 border-b border-[#132d4e]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><PhoneCall className="w-3.5 h-3.5 text-cyan-400" /> {tl.tollFree}</span>
            <span className="hidden sm:inline">|</span>
            <span className="hidden sm:inline">{tl.ifsc}</span>
          </div>
          
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <span className="cursor-pointer hover:text-white">{tl.corporateWebsite}</span>
            <span>|</span>
            
            {/* Global Language Selector */}
            <div className="bg-slate-900/60 rounded-lg p-0.5 border border-slate-700 flex items-center">
              {(["English", "Hindi", "Tamil"] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-2.5 py-0.5 text-[10px] font-black rounded transition-all cursor-pointer ${
                    language === lang 
                      ? "bg-[#0054a6] text-white" 
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>

            {/* Font Scaler */}
            <div className="bg-slate-900/60 rounded-lg p-0.5 border border-slate-700 flex items-center gap-1">
              <button
                onClick={() => setFontScale(Math.max(0.85, Math.round((fontScale - 0.05) * 100) / 100))}
                disabled={fontScale <= 0.85}
                className="w-5 h-5 flex items-center justify-center font-bold text-[10px] text-white hover:bg-slate-800 rounded disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                -
              </button>
              <span className="text-[9px] font-bold px-1 min-w-[2rem] text-center text-white select-none">
                {Math.round(fontScale * 100)}%
              </span>
              <button
                onClick={() => setFontScale(Math.min(1.35, Math.round((fontScale + 0.05) * 100) / 100))}
                disabled={fontScale >= 1.35}
                className="w-5 h-5 flex items-center justify-center font-bold text-[10px] text-white hover:bg-slate-800 rounded disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                +
              </button>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="p-1 bg-slate-900/60 border border-slate-700 rounded text-white hover:bg-slate-800 transition-all flex items-center justify-center cursor-pointer"
            >
              {theme === "light" ? <Moon className="w-3.5 h-3.5 text-indigo-405" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
            </button>

            <span>|</span>
            <Link href="/login" className="cursor-pointer hover:text-white font-bold text-cyan-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-400 animate-pulse" /> {tl.launchSfia}
            </Link>
          </div>
        </div>
      </div>

      {/* Corporate Header */}
      <header className="bg-sidebar-bg border-b border-primary-border py-3.5 px-4 sticky top-0 z-40 shadow-sm transition-colors duration-200">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="text-[#0054a6] hover:opacity-90 cursor-pointer">
              <SBILogo className="w-12 h-12 text-[#0054a6]" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-primary-text leading-none mb-1">State Bank of India</h1>
              <span className="text-[10px] text-muted-text tracking-wider uppercase font-bold">{tl.tagline}</span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-6 text-sm font-bold text-primary-text">
            {[
              { id: "personal", label: tl.personal },
              { id: "business", label: tl.business },
              { id: "agriculture", label: tl.agriculture }
            ].map((item) => (
              <button 
                key={item.id}
                onClick={() => setSelectedSubTab(item.id as any)}
                className={`hover:text-[#00a4e4] pb-1 border-b-2 transition-all cursor-pointer ${
                  selectedSubTab === item.id 
                    ? "border-[#0054a6] text-[#0054a6]" 
                    : "border-transparent text-secondary-text"
                }`}
              >
                {item.label} {tl.banking}
              </button>
            ))}
            <button 
              onClick={() => setSelectedSubTab("history")}
              className={`hover:text-[#00a4e4] pb-1 border-b-2 transition-all cursor-pointer ${
                selectedSubTab === "history" ? "border-[#0054a6] text-[#0054a6]" : "border-transparent text-secondary-text"
              }`}
            >
              {tl.heritage}
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <div className="relative hidden md:block">
              <input 
                type="text" 
                placeholder={tl.searchPlaceholder} 
                className="pl-8 pr-3 py-1.5 rounded-full border border-primary-border text-xs bg-card-bg focus:bg-card-hover-bg outline-none w-48 text-primary-text transition-colors duration-200" 
              />
              <Search className="w-4 h-4 text-muted-text absolute left-2.5 top-2" />
            </div>
            <Link 
              href="/login"
              className="bg-gradient-to-r from-[#0054a6] to-[#00a4e4] text-white font-extrabold px-5 py-2 rounded-lg text-xs flex items-center gap-1.5 hover:opacity-90 shadow-md animate-pulse"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{tl.yonoLogin}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Slider Banner Section */}
      <section className="bg-gradient-to-r from-[#0b1b36] via-[#051124] to-[#0b1b36] text-white py-12 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative z-10">
          
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeSlide}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col gap-4"
            >
              <span className="px-2.5 py-1 text-[10px] uppercase font-black tracking-wider bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-md inline-block w-fit">
                {slides[activeSlide].tag}
              </span>
              <h2 className="text-3xl lg:text-4xl font-black leading-tight">
                {slides[activeSlide].title}
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed max-w-lg">
                {slides[activeSlide].desc}
              </p>
              <div className="flex items-center gap-3 mt-2">
                <Link 
                  href={slides[activeSlide].href}
                  className="bg-[#00a4e4] hover:bg-cyan-400 text-black font-extrabold px-6 py-2.5 rounded-lg text-xs flex items-center gap-1.5 transition-all shadow cursor-pointer"
                >
                  <span>{slides[activeSlide].btnText}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
                <Link 
                  href="/login"
                  className="border border-slate-700 hover:border-slate-500 px-5 py-2.5 rounded-lg text-xs font-bold transition-all text-slate-200 cursor-pointer"
                >
                  {tl.askSfia}
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center relative">
            <div className="w-72 h-72 rounded-full bg-cyan-500/5 absolute blur-3xl"></div>
            <div className="border border-slate-800 bg-slate-900/60 p-6 rounded-2xl shadow-2xl relative w-full max-w-[340px]">
              <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <SBILogo className="w-6 h-6 text-cyan-400" />
                  <span className="text-xs font-bold">{tl.yonoSfiaAudit}</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              </div>
              <div className="flex flex-col gap-3">
                <div className="bg-slate-950 p-2.5 rounded text-[10px] text-slate-400 leading-relaxed font-mono">
                  {tl.analyzingLedger}
                  <br/>{tl.checkingSafetyShield}
                  <br/>{tl.pmsbyStatusPending}
                </div>
                <Link 
                  href="/login"
                  className="w-full bg-[#00a4e4]/10 hover:bg-[#00a4e4]/20 border border-[#00a4e4]/30 text-cyan-400 py-2 rounded text-xs font-bold text-center block cursor-pointer"
                >
                  {tl.auditYourLedgerNow}
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Quick Banking Portals */}
      <section className="max-w-7xl w-full mx-auto px-4 py-12 flex flex-col gap-8">
        <div>
          <h3 className="text-lg font-black text-primary-text flex items-center gap-2">
            <Landmark className="w-5 h-5 text-[#0054a6]" />
            {tl.retailBankingPortals}
          </h3>
          <p className="text-xs text-muted-text mt-1">{tl.accessSecureTerminals}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { title: tl.netbankingTitle, desc: tl.netbankingDesc, icon: Lock, href: "/login" },
            { title: tl.mudraTitle, desc: tl.mudraDesc, icon: FileText, href: "/login?role=merchant" },
            { title: tl.sweepTitle, desc: tl.sweepDesc, icon: UserPlus, href: "/login?role=salaried" },
            { title: tl.sfiaAssistantTitle, desc: tl.sfiaAssistantDesc, icon: Sparkles, href: "/login" }
          ].map((card, idx) => {
            const Icon = card.icon;
            return (
              <Link 
                key={idx} 
                href={card.href}
                className="bg-card-bg border border-primary-border rounded-xl p-5 hover:shadow-xl hover:border-cyan-500/30 transition-all cursor-pointer flex flex-col justify-between h-40 group duration-200"
              >
                <div className="w-10 h-10 bg-[#0054a6]/5 rounded-lg flex items-center justify-center text-[#0054a6] group-hover:bg-[#0054a6] group-hover:text-white transition-all">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-primary-text mb-1 group-hover:text-[#0054a6] transition-all">{card.title}</h4>
                  <p className="text-[11px] text-muted-text leading-normal">{card.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Heritage Section */}
      <section className="bg-card-bg py-12 px-6 border-t border-primary-border transition-colors duration-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div>
              <h3 className="text-lg font-black text-primary-text flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#0054a6]" />
                {tl.heritageTitle}
              </h3>
              <p className="text-xs text-muted-text">{tl.heritageDesc}</p>
            </div>
            
            <div className="relative border-l-2 border-[#0054a6]/30 pl-6 ml-2 flex flex-col gap-6 text-xs">
              <div className="relative">
                <div className="absolute -left-[31px] top-1.5 w-4 h-4 bg-[#0054a6] rounded-full border-2 border-white"></div>
                <span className="font-extrabold text-primary-text text-sm block">{tl.h1806Title}</span>
                <p className="text-secondary-text mt-1 leading-relaxed">
                  {tl.h1806Desc}
                </p>
              </div>
              <div className="relative">
                <div className="absolute -left-[31px] top-1.5 w-4 h-4 bg-[#0054a6] rounded-full border-2 border-white"></div>
                <span className="font-extrabold text-primary-text text-sm block">{tl.h1921Title}</span>
                <p className="text-secondary-text mt-1 leading-relaxed">
                  {tl.h1921Desc}
                </p>
              </div>
              <div className="relative">
                <div className="absolute -left-[31px] top-1.5 w-4 h-4 bg-[#0054a6] rounded-full border-2 border-white"></div>
                <span className="font-extrabold text-primary-text text-sm block">{tl.h1955Title}</span>
                <p className="text-secondary-text mt-1 leading-relaxed">
                  {tl.h1955Desc}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-primary-bg border border-primary-border text-primary-text rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between transition-colors duration-200">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-xl"></div>
            <div>
              <div className="flex items-center gap-2 border-b border-primary-border pb-3 mb-4">
                <SBILogo className="w-7 h-7 text-[#00a4e4]" />
                <span className="font-bold text-xs uppercase tracking-wider text-[#00a4e4]">{tl.logoTitle}</span>
              </div>
              <p className="text-xs leading-relaxed text-secondary-text">
                {tl.logoDesc}
              </p>
            </div>
            
            <div className="mt-6 p-3 bg-card-bg rounded-lg text-[10px] text-cyan-400 flex items-center justify-between border border-primary-border transition-colors duration-200">
              <span>{tl.exploreSfia}</span>
              <Link href="/login" className="bg-[#00a4e4] hover:bg-cyan-400 text-black font-extrabold px-3 py-1 rounded">LAUNCH</Link>
            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-primary-border bg-sidebar-bg text-muted-text text-xs py-8 px-4 mt-auto transition-colors duration-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <SBILogo className="w-8 h-8 text-muted-text" />
            <div>
              <span className="font-extrabold text-primary-text block">State Bank of India</span>
              <span className="text-[9px] text-muted-text">© 2026 State Bank of India. Built for SBI Hackathon.</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="cursor-pointer hover:text-primary-text">{tl.securityTips}</span>
            <span>•</span>
            <span className="cursor-pointer hover:text-primary-text">{tl.privacyPolicy}</span>
            <span>•</span>
            <Link href="/login" className="cursor-pointer hover:text-primary-text font-bold text-cyan-400">{tl.launchSfia}</Link>
          </div>
        </div>
      </footer>

      {/* FLOATING ASSISTANT WIDGET */}
      <motion.div 
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2.5"
      >
        <Link
          href="/login"
          className="w-16 h-16 bg-gradient-to-tr from-[#0054a6] to-[#00a4e4] rounded-full shadow-[0_4px_20px_rgba(0,84,166,0.4)] flex items-center justify-center text-white relative group overflow-hidden border border-cyan-400/30 transition-all hover:scale-105 active:scale-95"
        >
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <SBILogo className="w-10 h-10 animate-pulse text-white" />
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-cyan-500"></span>
          </span>
        </Link>
        <div className="bg-primary-bg border border-cyan-500/30 text-primary-text rounded-lg py-1.5 px-3 text-[10px] font-black shadow-lg shadow-black/30 flex items-center gap-1.5 animate-bounce">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>{tl.floatingWidgetLabel}</span>
        </div>
      </motion.div>

    </div>
  );
}
