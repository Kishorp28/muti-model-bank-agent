"use client";

import React from "react";
import { useSFIA } from "./context";
import { translations } from "./translations";
import { 
  Building2, Users, ShieldCheck, HeartPulse, Sparkles, 
  Landmark, BookOpen, RefreshCw, AlertTriangle, Check, 
  Activity, AreaChart as AreaChartIcon, Wallet
} from "lucide-react";
import { motion } from "framer-motion";
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";

export default function OverviewDashboard() {
  const {
    selectedCustomerId,
    customerDetails,
    isAuditing,
    auditResult,
    executingAction,
    actionNotice,
    executeSimulatedAction,
    language
  } = useSFIA();

  const t = translations[language];

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-450";
    if (score >= 50) return "text-amber-400";
    return "text-rose-500";
  };

  const getRecentTransactionsData = () => {
    if (!customerDetails || !customerDetails.transactions) return [];
    return [...customerDetails.transactions]
      .reverse()
      .slice(-10)
      .map(t => ({
        date: t.transaction_date.slice(5),
        Amount: t.transaction_type === "Deposit" ? t.transaction_amount : -t.transaction_amount,
        type: t.transaction_type
      }));
  };

  // Speedometer Gauge Parameters
  const getGaugeProps = () => {
    const score = auditResult?.financial_scores.final_health_score || (selectedCustomerId === "C_RURAL_NARENDHIRA" ? 24 : selectedCustomerId === "C_SHOP_SUNITA" ? 57 : 40);
    // Map score 0-100 to angle -90 to 90 degrees
    const angle = -90 + (score / 100) * 180;
    return { score, angle };
  };

  const getAuditMessage = () => {
    if (language === "Hindi") {
      if (selectedCustomerId === "C_RURAL_NARENDHIRA") return "लावारिस सरकारी बीमा लाभ मिले। दावा करने के लिए तैयार।";
      if (selectedCustomerId === "C_POLICE_VIKRAM") return "उच्च प्राथमिकता वाले जीवन बीमा कवरेज का अंतर पाया गया।";
      if (selectedCustomerId === "C_SHOP_SUNITA") return "स्टोरफ्रंट विस्तार के लिए मुद्रा एमएसएमई ऋण पूर्व-स्वीकृत है।";
      return "चेतावनी: उच्च ईएमआई बोझ। सलाहकार द्वारा एक्सप्रेस क्रेडिट ऋण को खारिज कर दिया गया।";
    }
    if (language === "Tamil") {
      if (selectedCustomerId === "C_RURAL_NARENDHIRA") return "கோரப்படாத அரசு காப்பீட்டு சலுகைகள் கண்டறியப்பட்டுள்ளன. பெறத் தயார்.";
      if (selectedCustomerId === "C_POLICE_VIKRAM") return "அதிக முன்னுரிமை கொண்ட ஆயுள் காப்பீட்டு இடைவெளி கண்டறியப்பட்டுள்ளது.";
      if (selectedCustomerId === "C_SHOP_SUNITA") return "வணிக விரிவாக்கத்திற்கு முத்ரா கடன் முன்கூட்டியே அங்கீகரிக்கப்பட்டுள்ளது.";
      return "எச்சரிக்கை: அதிக ஈஎம்ஐ சுமை. எஸ்பிஐ எக்ஸ்பிரஸ் கடன் முகவரால் தடுக்கப்பட்டது.";
    }
    // Default English
    if (selectedCustomerId === "C_RURAL_NARENDHIRA") return "Found unclaimed government insurance benefits. Ready to claim.";
    if (selectedCustomerId === "C_POLICE_VIKRAM") return "High priority life insurance coverage gap detected.";
    if (selectedCustomerId === "C_SHOP_SUNITA") return "Mudra MSME loan pre-approved for storefront expansion.";
    return "Warning: High EMI burden. Express credit loan vetoed by advisor.";
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="flex flex-col gap-8 max-w-7xl mx-auto"
    >
      
      {/* Sandbox Operations banner (Notice) */}
      {actionNotice && (
        <motion.div 
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl text-sm text-emerald-300 text-center font-bold"
        >
          {actionNotice}
        </motion.div>
      )}

      {/* Top row cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Visual Dial Speedometer Gauge */}
        <div className="bg-card-bg border border-primary-border rounded-2xl p-8 shadow-xl flex flex-col items-center justify-between min-h-[220px] relative overflow-hidden transition-colors duration-200">
          <span className="text-sm font-black uppercase text-muted-text tracking-widest self-start mb-3">
            {t.overview.ratingIndex}
          </span>
          
          <div className="relative w-48 h-28 flex justify-center mt-3">
            <svg className="w-full h-full" viewBox="0 0 100 55">
              {/* Background Arc */}
              <path 
                d="M 10 50 A 40 40 0 0 1 90 50" 
                fill="none" 
                stroke="var(--border-primary)" 
                strokeWidth="8" 
                strokeLinecap="round" 
              />
              {/* Active Colored Arc */}
              <path 
                d="M 10 50 A 40 40 0 0 1 90 50" 
                fill="none" 
                stroke="url(#gaugeGrad)" 
                strokeWidth="8" 
                strokeLinecap="round" 
                strokeDasharray="125"
                strokeDashoffset={125 - (125 * getGaugeProps().score) / 100}
              />
              {/* Needle Pin */}
              <circle cx="50" cy="50" r="4" fill="#22d3ee" />
              {/* Needle */}
              <line 
                x1="50" y1="50" 
                x2="50" y2="15" 
                stroke="#22d3ee" 
                strokeWidth="2.5" 
                strokeLinecap="round"
                transform={`transform-origin-50-50 rotate(${getGaugeProps().angle} 50 50)`}
                style={{ transform: `rotate(${getGaugeProps().angle}deg)`, transformOrigin: "50px 50px" }}
                className="transition-transform duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="50%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
            </svg>
            
            <div className="absolute bottom-1 text-center">
              <span className={`text-3xl font-black tracking-tight ${getScoreColor(getGaugeProps().score)}`}>
                {getGaugeProps().score}/100
              </span>
            </div>
          </div>
          <span className="text-xs font-black text-muted-text block text-center mt-4 uppercase tracking-widest">
            {t.overview.safetyIndex}
          </span>
        </div>

        {/* Layman Liquidity Card */}
        <div className="bg-card-bg border border-primary-border rounded-2xl p-8 shadow-xl flex flex-col justify-between min-h-[220px] relative transition-colors duration-200">
          <div className="flex justify-between items-start">
            <span className="text-sm font-black uppercase tracking-widest text-muted-text">{t.overview.availableBalance}</span>
            <span className="px-3.5 py-1 text-xs bg-[#0054a6]/20 text-[#00a4e4] border border-[#00a4e4]/30 rounded-lg font-black uppercase">{t.overview.savingsTag}</span>
          </div>
          <div className="mt-5">
            <h3 className="text-5xl font-black text-primary-text tracking-tight leading-none mb-4">
              ₹{customerDetails?.summary.total_balance.toLocaleString("en-IN") || "0"}
            </h3>
            <p className="text-sm text-secondary-text leading-relaxed">
              {t.overview.savingsDesc}
            </p>
          </div>
        </div>

        {/* Layman Benefit Scanner */}
        <div className="bg-card-bg border border-primary-border rounded-2xl p-8 shadow-xl flex flex-col justify-between min-h-[220px] relative transition-colors duration-200">
          <div className="flex justify-between items-start">
            <span className="text-sm font-black uppercase tracking-widest text-muted-text">{t.overview.socialSecurityScan}</span>
            <span className="px-3.5 py-1 text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-lg font-black uppercase">{t.overview.auditReportTag}</span>
          </div>
          <div className="mt-5 flex-1 flex flex-col justify-center">
            {isAuditing ? (
              <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-base">
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>{t.overview.scanningLedger}</span>
              </div>
            ) : auditResult ? (
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center gap-2 text-emerald-400 font-black text-base">
                  <Check className="w-5 h-5" />
                  <span>{t.overview.auditComplete}</span>
                </div>
                <p className="text-secondary-text leading-relaxed text-sm">
                  {getAuditMessage()}
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center gap-2 text-amber-400 font-black text-base">
                  <AlertTriangle className="w-5 h-5" />
                  <span>{t.overview.diagnosticsRequired}</span>
                </div>
                <p className="text-secondary-text leading-relaxed text-sm">
                  {t.overview.evaluateInstructions}
                </p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Central Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Blackboard Explainer */}
        <div className="bg-card-bg border border-primary-border rounded-2xl p-8 shadow-2xl relative overflow-hidden flex flex-col gap-6 transition-colors duration-200">
          <div className="border-b border-primary-border pb-4 flex items-center gap-3">
            <img src="/professor_sfia_avatar.png" className="w-10 h-10 rounded-full border border-cyan-500 bg-primary-bg object-cover" alt="S-FIA Avatar" />
            <div>
              <span className="font-extrabold text-sm text-primary-text uppercase tracking-wider block">{t.overview.blackboardTitle}</span>
              <span className="text-[10px] text-muted-text uppercase font-black tracking-widest">{t.sidebar.tutor}</span>
            </div>
          </div>

          <div className="bg-primary-bg border border-primary-border rounded-2xl p-6 text-sm leading-relaxed text-secondary-text font-sans flex-1 flex flex-col justify-between min-h-[240px] transition-colors duration-200">
            {selectedCustomerId === "C_RURAL_NARENDHIRA" ? (
              <div className="text-base text-secondary-text leading-relaxed">
                <span className="text-cyan-400 font-bold text-lg block mb-3">{t.overview.lessonFarmerTitle}</span>
                {t.overview.lessonFarmerBody}
              </div>
            ) : selectedCustomerId === "C_POLICE_VIKRAM" ? (
              <div className="text-base text-secondary-text leading-relaxed">
                <span className="text-orange-400 font-bold text-lg block mb-3">{t.overview.lessonPoliceTitle}</span>
                {t.overview.lessonPoliceBody}
              </div>
            ) : selectedCustomerId === "C_SHOP_SUNITA" ? (
              <div className="text-base text-secondary-text leading-relaxed">
                <span className="text-emerald-400 font-bold text-lg block mb-3">{t.overview.lessonMerchantTitle}</span>
                {t.overview.lessonMerchantBody}
              </div>
            ) : (
              <div className="text-base text-secondary-text leading-relaxed">
                <span className="text-rose-500 font-bold text-lg block mb-3">{t.overview.lessonSalariedTitle}</span>
                {t.overview.lessonSalariedBody}
              </div>
            )}
            
            <div className="mt-5 p-3.5 bg-card-bg/50 border border-primary-border rounded-xl text-sm text-muted-text text-center font-bold">
              💡 {t.overview.blackboardTips}
            </div>
          </div>
        </div>

        {/* Chart Area */}
        <div className="lg:col-span-2 bg-card-bg border border-primary-border rounded-2xl p-8 shadow-xl flex flex-col gap-6 transition-colors duration-200">
          <div>
            <h4 className="font-extrabold text-xl text-primary-text">{t.overview.cashFlowTitle}</h4>
            <p className="text-sm text-muted-text mt-1">{t.overview.cashFlowDesc}</p>
          </div>
          <div className="h-72 w-full text-xs min-w-0">
            {customerDetails && customerDetails.transactions.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <AreaChart data={getRecentTransactionsData()} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAmt2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" />
                  <XAxis dataKey="date" stroke="var(--text-muted)" style={{ fontSize: "12px" }} />
                  <YAxis stroke="var(--text-muted)" style={{ fontSize: "12px" }} />
                  <Tooltip contentStyle={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-primary)", borderRadius: "8px", color: "var(--text-primary)", fontSize: "13px" }} />
                  <Area type="monotone" dataKey="Amount" stroke="#22d3ee" fillOpacity={1} fill="url(#colorAmt2)" strokeWidth={2.5} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center border border-dashed border-primary-border rounded-2xl text-muted-text text-base">
                {t.overview.noLedgerMsg}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Sandbox Operations quick buttons */}
      <div className="bg-card-bg border border-primary-border rounded-2xl p-8 shadow-xl flex flex-col gap-5 transition-colors duration-200">
        <div>
          <h4 className="font-extrabold text-xl text-primary-text flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#00a4e4]" /> 
            {t.overview.sandboxTitle}
          </h4>
          <p className="text-sm text-muted-text mt-1">{t.overview.sandboxDesc}</p>
        </div>
        <div className="flex flex-wrap gap-4 mt-2">
          {selectedCustomerId === "C_RURAL_NARENDHIRA" && (
            <button
              onClick={() => executeSimulatedAction("ACTIVATE_PMSBY")}
              disabled={executingAction !== null}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm py-3.5 px-6 rounded-xl flex items-center gap-2.5 shadow transition-all active:scale-95 disabled:opacity-50"
            >
              {executingAction === "ACTIVATE_PMSBY" ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Landmark className="w-4 h-4" />
              )}
              <span>{t.overview.pmsbyBtn}</span>
            </button>
          )}
          {selectedCustomerId === "C_POLICE_VIKRAM" && (
            <button
              onClick={() => executeSimulatedAction("ACTIVATE_PMSBY")}
              disabled={executingAction !== null}
              className="bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-sm py-3.5 px-6 rounded-xl flex items-center gap-2.5 shadow transition-all active:scale-95 disabled:opacity-50"
            >
              {executingAction === "ACTIVATE_PMSBY" ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Landmark className="w-4 h-4" />
              )}
              <span>{t.overview.pmjjbyBtn}</span>
            </button>
          )}
          {selectedCustomerId === "C_SHOP_SUNITA" && (
            <button
              onClick={() => executeSimulatedAction("APPLY_MUDRA")}
              disabled={executingAction !== null}
              className="bg-[#00a4e4] hover:bg-[#0093cc] text-white font-extrabold text-sm py-3.5 px-6 rounded-xl flex items-center gap-2.5 shadow transition-all active:scale-95 disabled:opacity-50"
            >
              {executingAction === "APPLY_MUDRA" ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              <span>{t.overview.mudraBtn}</span>
            </button>
          )}
          {selectedCustomerId === "C_SALARIED_RAMESH" && (
            <button
              onClick={() => executeSimulatedAction("SETUP_FD_SWEEP")}
              disabled={executingAction !== null}
              className="bg-[#0054a6] hover:bg-[#004b93] text-white font-extrabold text-sm py-3.5 px-6 rounded-xl flex items-center gap-2.5 shadow transition-all active:scale-95 disabled:opacity-50"
            >
              {executingAction === "SETUP_FD_SWEEP" ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Wallet className="w-4 h-4" />
              )}
              <span>{t.overview.sweepBtn}</span>
            </button>
          )}
        </div>
      </div>

    </motion.div>
  );
}
