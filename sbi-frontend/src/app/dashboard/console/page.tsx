"use client";

import React, { useRef, useEffect, useState } from "react";
import { useSFIA } from "../context";
import { translations } from "../translations";
import { 
  MessageSquare, Volume2, VolumeX, Send, RefreshCw, 
  Play, Square, Sparkles, Check, ChevronRight, Mic, MicOff, AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProfessorConsolePage() {
  const {
    customerDetails,
    selectedCustomerId,
    language,
    chatMessages,
    inputValue,
    setInputValue,
    isVoiceActive,
    isAudioReading,
    toggleVoice,
    handleSendMessage,
    speakText,
    stopAudio,
    isAuditing,
    executeSimulatedAction
  } = useSFIA();

  const t = translations[language];
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Speech recognition states
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-scroll chat window when new messages arrive
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  // Speech Recognition on-demand start function
  const startListening = () => {
    if (typeof window === "undefined") return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.");
      return;
    }

    stopAudio();
    setSpeechError(null);
    setIsListening(true);

    try {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;

      // Set language codes based on interface language choice
      let langCode = "en-IN";
      if (language === "Hindi") langCode = "hi-IN";
      else if (language === "Tamil") langCode = "ta-IN";
      rec.lang = langCode;

      rec.onstart = () => {
        setIsListening(true);
      };

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        console.log("Speech recognized:", transcript);
        if (transcript && transcript.trim()) {
          handleSendMessage(undefined, transcript);
        }
      };

      rec.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
        if (event.error === "not-allowed") {
          setSpeechError("Microphone permission denied. Please click the camera/microphone icon in your URL bar and allow access.");
        } else if (event.error === "no-speech") {
          setSpeechError("No speech detected. Please speak clearly into your microphone.");
        } else {
          setSpeechError(`Speech recognition failed: ${event.error}`);
        }
        setTimeout(() => setSpeechError(null), 5000);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
      rec.start();
    } catch (err: any) {
      console.error("Failed to start speech recognition:", err);
      setSpeechError(`Failed to initialize recorder: ${err.message || err}`);
      setIsListening(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
    } else {
      startListening();
    }
  };

  const handleReadAloudLast = () => {
    if (chatMessages.length > 0) {
      const lastMsg = chatMessages[chatMessages.length - 1];
      if (lastMsg.sender === "bot") {
        speakText(lastMsg.text);
      }
    }
  };

  const handleExecuteNLPAction = async (actionType: string) => {
    if (!selectedCustomerId) return;
    await executeSimulatedAction(actionType);
  };

  // Extract lesson highlights for Narendhira or others
  const getLessonHighlights = () => {
    if (language === "Hindi") {
      if (selectedCustomerId === "C_RURAL_NARENDHIRA") {
        return {
          title: "🌾 पीएम सुरक्षा बीमा योजना (PMSBY)",
          description: "केवल ₹20/वर्ष में ₹2 लाख का दुर्घटना बीमा कवर।",
          status: "सक्रियता लंबित",
          statusColor: "text-amber-400 bg-amber-950/20 border border-amber-900/30",
          actionRequired: "कल्याण मूल्यांकन चलाएं या त्वरित कार्रवाई बटन का उपयोग करें।"
        };
      }
      if (selectedCustomerId === "C_SHOP_SUNITA") {
        return {
          title: "🏪 एसबीआई शिशु मुद्रा ऋण योजना",
          description: "₹50,000 तक का संपार्श्विक-मुक्त खुदरा ऋण।",
          status: "पूर्व-स्वीकृत",
          statusColor: "text-emerald-400 bg-emerald-950/20 border border-emerald-900/30",
          actionRequired: "किराना स्टॉक का विस्तार करने के लिए मुद्रा ऋण वितरित करें।"
        };
      }
      if (selectedCustomerId === "C_SALARIED_RAMESH") {
        return {
          title: "⚠️ उच्च ऋण-से-आय सीमा चेतावनी",
          description: "वर्तमान ईएमआई आय का 58% हिस्सा खा जाती है। व्यक्तिगत ऋण अस्वीकार किया गया।",
          status: "सलाहकार द्वारा खारिज",
          statusColor: "text-rose-400 bg-rose-950/20 border border-rose-900/30",
          actionRequired: "बचत को सुरक्षित रूप से बढ़ाने के लिए एक ऑटो-स्वीप (MODS) सेट करें।"
        };
      }
      return {
        title: "📘 मानक वित्तीय कल्याण जांच",
        description: "निष्क्रिय शेष राशि, ऋण-से-आय अनुपात और बीमा कवर की जांच की जा रही है।",
        status: "खाता बही का विश्लेषण",
        statusColor: "text-cyan-400 bg-cyan-950/20 border border-cyan-900/30",
        actionRequired: "कल्याण मूल्यांकन शुरू करने के लिए 'कल्याण का मूल्यांकन' बटन दबाएं।"
      };
    }

    if (language === "Tamil") {
      if (selectedCustomerId === "C_RURAL_NARENDHIRA") {
        return {
          title: "🌾 பிரதமரின் விபத்து காப்பீட்டுத் திட்டம் (PMSBY)",
          description: "ஆண்டுக்கு வெறும் ₹20 கட்டணத்தில் ₹2 லட்சம் விபத்துக் காப்பீடு.",
          status: "செயல்படுத்தப்பட வேண்டியது",
          statusColor: "text-amber-450 bg-amber-950/20 border border-amber-900/30",
          actionRequired: "'ACTIVATE' எனப் பதிலளிக்கவும் அல்லது முகப்புப் பக்கத்தின் விரைவுப் பொத்தானைப் பயன்படுத்தவும்."
        };
      }
      if (selectedCustomerId === "C_SHOP_SUNITA") {
        return {
          title: "🏪 எஸ்பிஐ சிஷு முத்ரா கடன் திட்டம்",
          description: "₹50,000 வரையிலான பிணையில்லா குறுங்கடன்.",
          status: "முன்கூட்டியே அங்கீகரிக்கப்பட்டது",
          statusColor: "text-emerald-400 bg-emerald-950/20 border border-emerald-900/30",
          actionRequired: "முத்ரா கடன் வழங்கி உங்களது கடைப் பொருட்களை விரிவுபடுத்துங்கள்."
        };
      }
      if (selectedCustomerId === "C_SALARIED_RAMESH") {
        return {
          title: "⚠️ அதிக கடன்-வருமான விகித எச்சரிக்கை",
          description: "மாதாந்திர தவணை வருமானத்தில் 58% ஐ விழுங்குகிறது. புதிய கடன் கோரிக்கை நிராகரிக்கப்பட்டது.",
          status: "ஆலோசகரால் தடுக்கப்பட்டது",
          statusColor: "text-rose-400 bg-rose-950/20 border border-rose-900/30",
          actionRequired: "நிலையான வைப்புத் தொகையிலிருந்து வட்டி பெற ஆட்டோ-ஸ்வீப் வசதியைப் பரிசீலியுங்கள்."
        };
      }
      return {
        title: "📘 நிலையான நிதி நலவாழ்வு பரிசோதனை",
        description: "இருப்புத் தொகை, கடன் விகிதம் மற்றும் காப்பீட்டு நிலை ஆகியவற்றை ஆய்வு செய்கிறது.",
        status: "தரவு ஆய்வு செய்யப்படுகிறது",
        statusColor: "text-cyan-400 bg-cyan-950/20 border border-cyan-900/30",
        actionRequired: "நிதி நல்வாழ்வு மதிப்பீடு செய்ய ஹெடரில் உள்ள பொத்தானை அழுத்தவும்."
      };
    }

    // Default English
    if (selectedCustomerId === "C_RURAL_NARENDHIRA") {
      return {
        title: "🌾 PM Suraksha Bima Yojana (PMSBY)",
        description: "Accident insurance cover of ₹2 Lakhs for only ₹20/year.",
        status: "Pending Activation",
        statusColor: "text-amber-400 bg-amber-950/20 border border-amber-900/30",
        actionRequired: "Respond with 'ACTIVATE' or use the quick action button on the Overview tab."
      };
    }
    if (selectedCustomerId === "C_SHOP_SUNITA") {
      return {
        title: "🏪 SBI Shishu Mudra Loan Scheme",
        description: "Collateral-free retail startup credit of up to ₹50,000.",
        status: "Pre-Approved",
        statusColor: "text-emerald-400 bg-emerald-950/20 border border-emerald-900/30",
        actionRequired: "Click 'Disburse MSME Mudra Loan' to expand Kirana stock."
      };
    }
    if (selectedCustomerId === "C_SALARIED_RAMESH") {
      return {
        title: "⚠️ High Debt-to-Income Veto Warning",
        description: "Current EMIs devour 58% of income. Personal loan request vetoed.",
        status: "Vetoed by Advisor",
        statusColor: "text-rose-400 bg-rose-950/20 border border-rose-950/20 border-rose-900/30",
        actionRequired: "Consider configuring an automatic FD Sweep (MODS) to grow reserves safely."
      };
    }
    return {
      title: "📘 Standard Financial Inclusion Checkup",
      description: "Auditing idle balances, DTI ratios, and insurance cover status.",
      status: "Analyzing Ledger",
      statusColor: "text-cyan-400 bg-cyan-950/20 border border-cyan-900/30",
      actionRequired: "Select customer roles and trigger 'Evaluate Wellness' for automated review."
    };
  };

  const highlight = getLessonHighlights();

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="max-w-6xl mx-auto flex flex-col gap-8"
    >
      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-primary-text tracking-tight flex items-center gap-2">
            <MessageSquare className="w-8 h-8 text-cyan-400" />
            {t.console.title}
          </h2>
          <p className="text-base text-muted-text mt-1.5 max-w-3xl leading-relaxed">
            {t.console.desc}
          </p>
        </div>
      </div>

      {/* 2. Main Two-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Column: Voice Assistant Controls & Active Lesson Card */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Speaking Status Panel */}
          <div className="bg-card-bg border border-primary-border rounded-2xl p-6 shadow-xl flex flex-col gap-4 transition-colors duration-200">
            <div className="flex items-center gap-3 border-b border-primary-border pb-3">
              <img src="/professor_sfia_avatar.png" className="w-10 h-10 rounded-full border border-cyan-500 bg-primary-bg object-cover" alt="S-FIA Avatar" />
              <div>
                <h3 className="text-sm font-black text-primary-text uppercase tracking-wider">
                  {t.console.voiceEngine}
                </h3>
                <span className="text-[10px] text-cyan-400 font-bold block">{language === "Hindi" ? "सक्रिय एआई ट्यूटर" : language === "Tamil" ? "செயலில் உள்ள AI பயிற்றுவிப்பாளர்" : "Active AI Tutor"}</span>
              </div>
            </div>
            
            <div className="bg-primary-bg border border-primary-border p-5 rounded-xl flex items-center justify-between transition-colors duration-200">
              <div>
                <span className="text-xs text-muted-text uppercase font-black block">{t.console.narratorStatus}</span>
                <span className={`text-base font-extrabold block mt-0.5 ${isVoiceActive ? "text-cyan-400" : "text-muted-text"}`}>
                  {isVoiceActive ? t.console.activeListening : t.console.mutedPaused}
                </span>
              </div>
              <button
                type="button"
                onClick={toggleVoice}
                className={`px-4 py-2 text-sm font-black rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  isVoiceActive 
                    ? "bg-cyan-550 text-slate-950 font-bold hover:bg-cyan-400" 
                    : "bg-card-hover-bg text-secondary-text hover:text-primary-text border border-primary-border"
                }`}
              >
                {isVoiceActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                <span>{isVoiceActive ? t.console.muteBtn : t.console.unmuteBtn}</span>
              </button>
            </div>

            {/* Audio Synthesis Playback Controls */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleReadAloudLast}
                disabled={chatMessages.length === 0}
                className="flex-1 py-3 px-4 bg-[#0a2540] border border-[#0054a6]/40 hover:bg-[#0f3054] text-cyan-400 disabled:opacity-40 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 fill-cyan-400 text-cyan-400" />
                <span>{t.console.readLessonBtn}</span>
              </button>
              <button
                type="button"
                onClick={stopAudio}
                disabled={!isAudioReading}
                className="flex-1 py-3 px-4 bg-primary-bg border border-primary-border hover:bg-card-hover-bg text-secondary-text disabled:opacity-40 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Square className="w-4 h-4 fill-secondary-text text-secondary-text" />
                <span>{t.console.stopVoiceBtn}</span>
              </button>
            </div>
            
            {isAudioReading && (
              <div className="text-xs text-cyan-400 bg-cyan-950/20 border border-cyan-900/30 p-3 rounded-lg text-center font-bold animate-pulse">
                {t.console.speakingIndicator}
              </div>
            )}
          </div>

          {/* Active Lesson Details Card */}
          <div className="bg-card-bg border border-primary-border rounded-2xl p-6 shadow-xl flex flex-col gap-4 transition-colors duration-200">
            <h3 className="text-lg font-bold text-primary-text uppercase tracking-wider">
              {t.console.lessonHighlights}
            </h3>
            
            <div className="space-y-4">
              <div>
                <span className="text-xs text-muted-text uppercase font-black block">{t.console.activeTopic}</span>
                <span className="text-base font-extrabold text-primary-text block mt-0.5">{highlight.title}</span>
              </div>

              <div>
                <span className="text-xs text-muted-text uppercase font-black block">{t.console.description}</span>
                <p className="text-sm text-secondary-text leading-relaxed mt-1">{highlight.description}</p>
              </div>

              <div className="flex justify-between items-center py-2 border-t border-primary-border">
                <span className="text-xs text-muted-text uppercase font-black">{t.console.suitabilityStatus}</span>
                <span className={`text-xs font-black px-2.5 py-1 rounded ${highlight.statusColor}`}>
                  {highlight.status}
                </span>
              </div>

              <div className="bg-primary-bg border border-primary-border p-4 rounded-xl text-xs text-secondary-text space-y-1.5 leading-relaxed transition-colors duration-200">
                <span className="font-extrabold text-primary-text block">{t.console.requiredAction}</span>
                <p>{highlight.actionRequired}</p>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Grand Spacious Chat Terminal */}
        <div className="lg:col-span-7 flex flex-col bg-card-bg border border-primary-border rounded-2xl shadow-xl overflow-hidden min-h-[500px] transition-colors duration-200">
          
          {/* Chat Terminal Header */}
          <div className="px-6 py-4 border-b border-primary-border bg-primary-bg flex items-center justify-between transition-colors duration-200">
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 animate-ping"></div>
              <span className="text-sm font-extrabold text-secondary-text uppercase tracking-wider">
                {t.console.interactiveDialogue} ({language})
              </span>
            </div>
            {customerDetails && (
              <span className="text-xs bg-card-bg border border-primary-border px-3 py-1 rounded-full text-secondary-text font-bold">
                {t.console.studentLabel}: {customerDetails.customer_info.first_name} ({customerDetails.customer_info.occupation})
              </span>
            )}
          </div>

          {/* Messages Flow Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-primary-bg/30 max-h-[380px] min-h-[300px]">
            {chatMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-muted-text gap-2">
                <MessageSquare className="w-12 h-12 text-slate-655 animate-pulse" />
                <span className="text-sm italic">{t.console.emptyAuditMsg}</span>
              </div>
            ) : (
              chatMessages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} items-start gap-2.5`}
                >
                  {msg.sender === "bot" && (
                    <img src="/professor_sfia_avatar.png" className="w-8 h-8 rounded-full border border-cyan-500 bg-primary-bg object-cover shrink-0 mt-1" alt="S-FIA Avatar" />
                  )}
                  <div 
                    className={`p-4 rounded-2xl max-w-[85%] text-sm leading-relaxed shadow ${
                      msg.sender === "user" 
                        ? "bg-[#0054a6] text-white font-medium rounded-br-none" 
                        : "bg-primary-bg text-primary-text rounded-bl-none border border-primary-border"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    
                    {msg.sender === "bot" && msg.recommendedAction && (
                      <div className="mt-4 pt-3 border-t border-primary-border flex flex-col gap-2">
                        <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest block text-left">
                          {language === "Hindi" ? "⚡ अनुशंसित त्वरित कार्रवाई" : language === "Tamil" ? "⚡ பரிந்துரைக்கப்பட்ட நடவடிக்கை" : "⚡ RECOMMENDED ACTION"}
                        </span>
                        <div className="bg-card-bg border border-primary-border rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-1">
                          <div className="flex items-start gap-2 text-left">
                            <Sparkles className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                            <div>
                              <p className="text-xs font-bold text-primary-text">
                                {msg.recommendedAction === "ACTIVATE_PMSBY" 
                                  ? (language === "Hindi" ? "पीएम सुरक्षा बीमा सक्रिय करें" : language === "Tamil" ? "விபத்து காப்பீட்டைச் செயல்படுத்துக" : "Activate PM Suraksha Bima Yojana")
                                  : msg.recommendedAction === "APPLY_MUDRA" 
                                  ? (language === "Hindi" ? "एसबीआई शिशु मुद्रा लोन प्राप्त करें" : language === "Tamil" ? "முத்ரா கடன் பெறுக" : "Apply for MSME Mudra Loan")
                                  : (language === "Hindi" ? "ऑटो-स्वीप एफडी (MODS) सेट करें" : language === "Tamil" ? "ஆட்டோ-ஸ்வீப் எஃப்டி அமைக்கவும்" : "Configure Auto-Sweep FD (MODS)")
                                }
                              </p>
                              <span className="text-[10px] text-muted-text block mt-0.5">
                                {msg.recommendedAction === "ACTIVATE_PMSBY" 
                                  ? (language === "Hindi" ? "वार्षिक प्रीमियम: ₹20, बीमा कवर: ₹2 लाख" : language === "Tamil" ? "ஆண்டு பிரீமியம்: ₹20, விபத்து காப்பீடு: ₹2 லட்சம்" : "Annual Premium: ₹20, Accident Cover: ₹2 Lakhs")
                                  : msg.recommendedAction === "APPLY_MUDRA" 
                                  ? (language === "Hindi" ? "₹50,000 संपार्श्विक-मुक्त खुदरा ऋण" : language === "Tamil" ? "₹50,000 பிணையில்லா கடன்" : "₹50,000 collateral-free business credit")
                                  : (language === "Hindi" ? "₹20,000 सीमा से अधिक ऑटो-बचत" : language === "Tamil" ? "₹20,000க்கு மேலான தொகைக்கு வட்டி" : "Sweep surplus funds automatically to FD")
                                }
                              </span>
                            </div>
                          </div>
                          
                          <button
                            type="button"
                            onClick={() => handleExecuteNLPAction(msg.recommendedAction!)}
                            className="w-full sm:w-auto px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 active:scale-95 text-slate-950 text-xs font-black rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>{language === "Hindi" ? "सक्रिय करें" : language === "Tamil" ? "செயல்படுத்து" : "Execute Now"}</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
            <div ref={chatEndRef}></div>
          </div>

          {/* Feedback details (e.g. Permission / Error messages) */}
          <AnimatePresence>
            {speechError && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="bg-rose-950/20 border-t border-rose-900/30 px-6 py-2 flex items-center gap-2 text-xs text-rose-400 font-bold"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{speechError}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chat Message Input Form */}
          <form 
            onSubmit={handleSendMessage} 
            className="p-4 border-t border-primary-border bg-primary-bg flex gap-3 items-center transition-colors duration-200"
          >
            <div className="flex-1 relative flex items-center">
              <input 
                type="text" 
                placeholder={isListening ? (language === "Hindi" ? "सुन रहा हूँ... बोलें" : language === "Tamil" ? "கேட்கிறது... பேசவும்" : "Listening... Speak now") : (language === "Hindi" ? "अपना प्रश्न या संदेश यहां टाइप करें..." : language === "Tamil" ? "உங்கள் கேள்வி அல்லது செய்தியை இங்கே தட்டச்சு செய்க..." : "Type your question or message here...")} 
                disabled={isAuditing || isListening} 
                value={isListening ? "" : inputValue} 
                onChange={(e) => setInputValue(e.target.value)} 
                className={`flex-1 bg-card-bg border ${isListening ? "border-red-500 ring-2 ring-red-500/20" : "border-primary-border focus:border-cyan-500"} rounded-xl pl-4 pr-12 py-3 text-sm text-primary-text outline-none transition-all`} 
              />
              <button
                type="button"
                onClick={toggleListening}
                disabled={isAuditing}
                className={`absolute right-3 p-1.5 rounded-lg transition-all cursor-pointer ${
                  isListening 
                    ? "text-red-500 bg-red-950/20 hover:bg-red-900/30" 
                    : "text-secondary-text hover:text-cyan-400 hover:bg-card-hover-bg"
                }`}
                title={language === "Hindi" ? "आवाज से इनपुट" : language === "Tamil" ? "குரல் உள்ளீடு" : "Voice Input (Speech-to-Text)"}
              >
                {isListening ? (
                  <div className="relative">
                    <Mic className="w-5 h-5 text-red-500 animate-bounce" />
                    <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                    </span>
                  </div>
                ) : (
                  <Mic className="w-5 h-5 text-secondary-text" />
                )}
              </button>
            </div>
            <button 
              type="submit" 
              disabled={isAuditing || isListening} 
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold px-6 py-3 rounded-xl text-sm flex items-center gap-1.5 transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{t.console.sendBtn}</span>
            </button>
          </form>

        </div>

      </div>
    </motion.div>
  );
}
