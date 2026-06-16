"use client";

import React from "react";
import { useSFIA } from "../context";
import { translations } from "../translations";
import { Sparkles, CheckCircle2, ShieldAlert, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function AgentFlowchartPage() {
  const { selectedCustomerId, auditResult, activeNode, language } = useSFIA();
  const t = translations[language];

  const agentsList = [
    { nodeName: "Orchestrator Agent", layman: "👩‍✈️ Core Manager" },
    { nodeName: "Transaction Signal Agent", layman: "🔍 Ledger Scanner" },
    { nodeName: "Life Event Agent", layman: "🎯 Milestone Predictor" },
    { nodeName: "Entitlement Agent", layman: "🛡️ Benefit Finder" },
    { nodeName: "Financial Health Agent", layman: "📈 Wellness Scorer" },
    { nodeName: "Product Discovery Agent", layman: "📦 Scheme Matcher" },
    { nodeName: "Trust Agent", layman: "⚖️ Safe Trust Advisor" },
    { nodeName: "Compliance Agent", layman: "📜 Compliance Auditor" },
    { nodeName: "Conversation Agent", layman: "💬 Professor Translator" }
  ];

  const getLaymanName = (name: string) => {
    if (language === "Hindi") {
      switch (name) {
        case "👩‍✈️ Core Manager": return "👩‍✈️ मुख्य प्रबंधक (Core Manager)";
        case "🔍 Ledger Scanner": return "🔍 बहीखाता स्कैनर (Ledger Scanner)";
        case "🎯 Milestone Predictor": return "🎯 जीवन मील का पत्थर भविष्यवक्ता";
        case "🛡️ Benefit Finder": return "🛡️ सरकारी लाभ खोजक";
        case "📈 Wellness Scorer": return "📈 कल्याण स्कोरर (Wellness Scorer)";
        case "📦 Scheme Matcher": return "📦 योजना मिलानकर्ता (Scheme Matcher)";
        case "⚖️ Safe Trust Advisor": return "⚖️ सुरक्षित ट्रस्ट सलाहकार (Trust)";
        case "📜 Compliance Auditor": return "📜 अनुपालन लेखा परीक्षक (Compliance)";
        case "💬 Professor Translator": return "💬 प्रोफेसर अनुवादक (Chat)";
        default: return name;
      }
    }
    if (language === "Tamil") {
      switch (name) {
        case "👩‍✈️ Core Manager": return "👩‍✈️ முக்கிய மேலாளர்";
        case "🔍 Ledger Scanner": return "🔍 கணக்கு ஏடு ஆய்வாளர்";
        case "🎯 Milestone Predictor": return "🎯 வாழ்க்கை இலக்கு கணிப்பாளர்";
        case "🛡️ Benefit Finder": return "🛡️ அரசுச் சலுகை கண்டறிபவர்";
        case "📈 Wellness Scorer": return "📈 நல்வாழ்வு மதிப்பீட்டாளர்";
        case "📦 Scheme Matcher": return "📦 திட்டங்களைப் பொருத்துபவர்";
        case "⚖️ Safe Trust Advisor": return "⚖️ நம்பகமான நிதி ஆலோசகர் (டிரஸ்ட்)";
        case "📜 Compliance Auditor": return "📜 தணிக்கையாளர் (கம்ப்ளையன்ஸ்)";
        case "💬 Professor Translator": return "💬 பேராசிரியர் பாட் (உரையாடல்)";
        default: return name;
      }
    }
    return name;
  };

  const isCompleted = auditResult ? true : false;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-8">
      
      {/* Visual flowchart container */}
      <div className="bg-card-bg border border-primary-border rounded-2xl p-8 shadow-xl flex flex-col gap-6 transition-colors duration-200">
        <div>
          <h4 className="font-extrabold text-lg text-primary-text">{t.agents.title}</h4>
          <p className="text-sm text-muted-text mt-1">{t.agents.desc}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 py-4 text-center">
          {agentsList.map((item, idx) => {
            const isActive = activeNode === item.nodeName;
            const isVetoedNode = item.nodeName === "Trust Agent" && selectedCustomerId === "C_SALARIED_RAMESH" && isCompleted;
            
            return (
              <div 
                key={idx} 
                className={`p-4 rounded-xl border text-sm font-bold flex flex-col items-center justify-center gap-1.5 transition-all relative ${
                  isActive 
                    ? "bg-[#0054a6]/20 border-[#00a4e4] text-[#00a4e4]" 
                    : isVetoedNode
                    ? "bg-rose-950/20 border-rose-500/40 text-rose-450 animate-pulse"
                    : isCompleted 
                    ? "bg-emerald-950/5 border-emerald-500/20 text-emerald-450" 
                    : "bg-primary-bg/40 border-primary-border text-secondary-text"
                }`}
              >
                <span className="text-xs text-muted-text block mb-0.5">{t.agents.step} {idx+1}</span>
                <span className="leading-tight block font-black text-primary-text">{getLaymanName(item.layman)}</span>
                <span className="text-[10px] text-muted-text mt-0.5 font-mono">({item.nodeName.replace(" Agent", "")})</span>
                {isActive && (
                  <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00a4e4] opacity-75"></span>
                    <span className="relative inline-flex bg-[#00a4e4] rounded-full h-2.5 w-2.5"></span>
                  </span>
                )}
                {isVetoedNode && <ShieldAlert className="w-4 h-4 text-rose-500 mt-1" />}
                {isCompleted && !isVetoedNode && <CheckCircle2 className="w-4 h-4 text-emerald-450 mt-1" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Audit Reasoning Logs */}
      <div className="flex flex-col gap-6">
        <h4 className="font-extrabold text-xl text-primary-text">{t.agents.decisionsHeader}</h4>
        {auditResult ? (
          <div className="flex flex-col gap-5">
            {auditResult.agent_logs.map((log, idx) => (
              <div key={idx} className="bg-card-bg border border-primary-border rounded-2xl p-6 shadow-xl transition-colors duration-200">
                <div className="flex justify-between items-center border-b border-primary-border pb-3 mb-3">
                  <span className="font-extrabold text-sm text-primary-text flex items-center gap-2">
                    <Sparkles className="w-4.5 h-4.5 text-cyan-400" /> {log.agent_name}
                  </span>
                  <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                    log.status === "COMPLETED" ? "bg-emerald-950/20 text-emerald-450 border border-emerald-900/20" : "bg-card-hover-bg text-muted-text border border-primary-border"
                  }`}>{log.decision || log.status}</span>
                </div>
                <p className="text-sm text-secondary-text leading-relaxed font-mono whitespace-pre-wrap">{log.reasoning}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-base text-muted-text italic text-center p-10 border border-dashed border-primary-border rounded-2xl bg-card-bg/40">
            {t.agents.emptyLogs}
          </div>
        )}
      </div>

    </motion.div>
  );
}
