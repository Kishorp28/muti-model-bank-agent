"use client";

import React, { useState, useEffect } from "react";
import { useSFIA } from "../context";
import { translations } from "../translations";
import { 
  HeartPulse, Shield, AlertCircle, CheckCircle2, 
  HelpCircle, RefreshCw, BadgeInfo, Landmark, ShieldCheck
} from "lucide-react";
import { motion } from "framer-motion";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";

interface Policy {
  policy_id: string;
  customer_id: string;
  policy_name: string;
  policy_type: string;
  sum_assured: number;
  annual_premium: number;
  status: string;
  expiry_date: string;
}

export default function HealthReportPage() {
  const { selectedCustomerId, auditResult, language } = useSFIA();
  const t = translations[language];
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPolicies = async () => {
      setLoading(true);
      try {
        const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
        const res = await fetch(`${API_BASE}/insurance/${selectedCustomerId}`);
        if (res.ok) {
          const data = await res.json();
          setPolicies(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (selectedCustomerId) {
      fetchPolicies();
    }
  }, [selectedCustomerId]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-450";
    if (score >= 50) return "text-amber-400";
    return "text-rose-500";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-emerald-500/10 border-emerald-500/20 text-emerald-405";
    if (score >= 50) return "bg-amber-500/10 border-amber-500/20 text-amber-300";
    return "bg-rose-500/10 border-rose-550/20 text-rose-400";
  };

  const getRadarData = () => {
    if (!auditResult) {
      if (selectedCustomerId === "C_RURAL_NARENDHIRA") {
        return [
          { subject: "Reserve Cash", A: 15, fullMark: 100 },
          { subject: "Safety Shields", A: 0, fullMark: 100 },
          { subject: "Asset Growth", A: 0, fullMark: 100 },
          { subject: "Digital Channels", A: 5, fullMark: 100 },
          { subject: "Debt Safety", A: 100, fullMark: 100 }
        ];
      }
      if (selectedCustomerId === "C_SHOP_SUNITA") {
        return [
          { subject: "Reserve Cash", A: 65, fullMark: 100 },
          { subject: "Safety Shields", A: 18, fullMark: 100 },
          { subject: "Asset Growth", A: 20, fullMark: 100 },
          { subject: "Digital Channels", A: 95, fullMark: 100 },
          { subject: "Debt Safety", A: 100, fullMark: 100 }
        ];
      }
      return [
        { subject: "Reserve Cash", A: 40, fullMark: 100 },
        { subject: "Safety Shields", A: 56, fullMark: 100 },
        { subject: "Asset Growth", A: 10, fullMark: 100 },
        { subject: "Digital Channels", A: 95, fullMark: 100 },
        { subject: "Debt Safety", A: 25, fullMark: 100 }
      ];
    }
    const s = auditResult.financial_scores;
    return [
      { subject: "Reserve Cash", A: s.savings, fullMark: 100 },
      { subject: "Safety Shields", A: s.insurance, fullMark: 100 },
      { subject: "Asset Growth", A: s.investment, fullMark: 100 },
      { subject: "Digital Channels", A: s.digital_adoption, fullMark: 100 },
      { subject: "Debt Safety", A: s.debt, fullMark: 100 }
    ];
  };

  const getRadarSubject = (subject: string) => {
    if (language === "Hindi") {
      if (subject === "Reserve Cash") return "नकद भंडार";
      if (subject === "Safety Shields") return "सुरक्षा कवच";
      if (subject === "Asset Growth") return "धन वृद्धि";
      if (subject === "Digital Channels") return "डिजिटल चैनल";
      return "ऋण सुरक्षा";
    }
    if (language === "Tamil") {
      if (subject === "Reserve Cash") return "சேமிப்பு இருப்பு";
      if (subject === "Safety Shields") return "பாதுகாப்பு கவசம்";
      if (subject === "Asset Growth") return "சொத்து வளர்ச்சி";
      if (subject === "Digital Channels") return "டிஜிட்டல் சேனல்";
      return "கடன் பாதுகாப்பு";
    }
    return subject;
  };

  // Gap audit variables
  const getGapAuditDetails = () => {
    let income = 60000;
    if (selectedCustomerId === "C_SHOP_SUNITA") income = 480000;
    if (selectedCustomerId === "C_SALARIED_RAMESH") income = 2160000;

    const activeLifeSum = policies.filter(p => p.policy_type === "Life" && p.status === "Active").reduce((acc, p) => acc + p.sum_assured, 0);
    const lifeRecommended = income * 10;
    const lifeGap = Math.max(0, lifeRecommended - activeLifeSum);

    const activeHealthSum = policies.filter(p => p.policy_type === "Health" && p.status === "Active").reduce((acc, p) => acc + p.sum_assured, 0);
    const healthRecommended = 500000;
    const healthGap = Math.max(0, healthRecommended - activeHealthSum);

    const pmsbyActive = policies.some(p => p.policy_type === "Accidental" && p.status === "Active");
    const pmjjbyActive = policies.some(p => p.policy_type === "Life" && p.status === "Active" && (p.policy_name.includes("PMJJBY") || p.policy_name.includes("Jeevan")));

    return {
      income,
      activeLifeSum,
      lifeRecommended,
      lifeGap,
      activeHealthSum,
      healthRecommended,
      healthGap,
      pmsbyActive,
      pmjjbyActive
    };
  };

  const gap = getGapAuditDetails();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-8">
      
      {/* Scorecards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Radar view */}
        <div className="bg-card-bg border border-primary-border rounded-2xl p-8 shadow-xl flex flex-col gap-6 transition-colors duration-200">
          <div>
            <h4 className="font-extrabold text-lg text-primary-text">{t.health.radarTitle}</h4>
            <p className="text-sm text-muted-text mt-1">{t.health.radarDesc}</p>
          </div>
          <div className="h-68 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={getRadarData()}>
                <PolarGrid stroke="var(--border-primary)" />
                <PolarAngleAxis dataKey="subject" tickFormatter={getRadarSubject} stroke="var(--text-muted)" style={{ fontSize: "12px" }} />
                <PolarRadiusAxis stroke="var(--text-muted)" angle={30} domain={[0, 100]} style={{ fontSize: "11px" }} />
                <Radar name="Wellness" dataKey="A" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Scores */}
        <div className="bg-card-bg border border-primary-border rounded-2xl p-8 shadow-xl flex flex-col gap-6 transition-colors duration-200">
          <div>
            <h4 className="font-extrabold text-lg text-primary-text">{t.health.scorecardTitle}</h4>
            <p className="text-sm text-muted-text mt-1">{t.health.scorecardDesc}</p>
          </div>
          <div className="flex flex-col gap-3 text-sm">
            {Object.entries(auditResult?.financial_scores || (
              selectedCustomerId === "C_RURAL_NARENDHIRA" 
                ? { savings: 15, insurance: 0, investment: 0, digital_adoption: 5, debt: 100 }
                : selectedCustomerId === "C_SHOP_SUNITA"
                ? { savings: 65, insurance: 18, investment: 20, digital_adoption: 95, debt: 100 }
                : { savings: 40, insurance: 56, investment: 10, digital_adoption: 95, debt: 25 }
            )).map(([key, val]) => {
              if (key === "final_health_score") return null;
              return (
                <div key={key} className="bg-primary-bg/40 border border-primary-border p-4.5 rounded-xl flex justify-between items-center transition-colors duration-200">
                  <div>
                    <span className="capitalize font-extrabold text-primary-text block mb-1 text-sm">
                      {key === "savings" && t.health.parameters.savingsTitle}
                      {key === "insurance" && t.health.parameters.insuranceTitle}
                      {key === "investment" && t.health.parameters.investmentTitle}
                      {key === "digital_adoption" && t.health.parameters.digitalTitle}
                      {key === "debt" && t.health.parameters.debtTitle}
                    </span>
                    <span className="text-xs text-muted-text block">
                      {key === "savings" && t.health.parameters.savingsDesc}
                      {key === "insurance" && t.health.parameters.insuranceDesc}
                      {key === "investment" && t.health.parameters.investmentDesc}
                      {key === "digital_adoption" && t.health.parameters.digitalDesc}
                      {key === "debt" && t.health.parameters.debtDesc}
                    </span>
                  </div>
                  <span className={`font-black text-sm px-3.5 py-1.5 rounded-lg shrink-0 ${getScoreBg(val as number)}`}>{val as number}/100</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Insurance Gap Audit Calculator Deck */}
      <div className="bg-card-bg border border-primary-border rounded-2xl p-8 shadow-xl flex flex-col gap-6 transition-colors duration-200">
        <div>
          <h4 className="font-extrabold text-lg text-primary-text flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-cyan-400" />
            {t.health.gapTitle}
          </h4>
          <p className="text-sm text-muted-text mt-1">{t.health.gapDesc}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          {/* Life Cover Gap */}
          <div className="bg-primary-bg/40 border border-primary-border p-5 rounded-2xl flex flex-col justify-between gap-4 text-sm transition-colors duration-200">
            <div>
              <span className="font-extrabold text-primary-text block mb-1">{t.health.gaps.lifeGap}</span>
              <p className="text-xs text-muted-text leading-normal">{t.health.gaps.lifeRequired}</p>
            </div>
            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span>Active: ₹{gap.activeLifeSum.toLocaleString("en-IN")}</span>
                <span>Rec: ₹{gap.lifeRecommended.toLocaleString("en-IN")}</span>
              </div>
              <div className="w-full bg-card-bg h-2 rounded-full overflow-hidden border border-primary-border">
                <div 
                  className={`h-full rounded-full ${gap.lifeGap === 0 ? "bg-emerald-500" : "bg-rose-500"}`} 
                  style={{ width: `${Math.min(100, (gap.activeLifeSum / gap.lifeRecommended) * 100)}%` }}
                />
              </div>
            </div>
            {gap.lifeGap > 0 ? (
              <span className="text-xs font-extrabold text-rose-400 bg-rose-950/20 border border-rose-900/20 px-3 py-1 rounded w-fit">
                {t.health.gaps.gapLabel}: ₹{gap.lifeGap.toLocaleString("en-IN")}
              </span>
            ) : (
              <span className="text-xs font-extrabold text-emerald-450 bg-emerald-950/20 border border-emerald-900/20 px-3 py-1 rounded w-fit">
                {t.health.gaps.fullyCovered}
              </span>
            )}
          </div>

          {/* Health Cover Gap */}
          <div className="bg-primary-bg/40 border border-primary-border p-5 rounded-2xl flex flex-col justify-between gap-4 text-sm transition-colors duration-200">
            <div>
              <span className="font-extrabold text-primary-text block mb-1">{t.health.gaps.healthGap}</span>
              <p className="text-xs text-muted-text leading-normal">{t.health.gaps.healthRequired}</p>
            </div>
            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span>Active: ₹{gap.activeHealthSum.toLocaleString("en-IN")}</span>
                <span>Rec: ₹{gap.healthRecommended.toLocaleString("en-IN")}</span>
              </div>
              <div className="w-full bg-card-bg h-2 rounded-full overflow-hidden border border-primary-border">
                <div 
                  className={`h-full rounded-full ${gap.healthGap === 0 ? "bg-emerald-500" : "bg-amber-500"}`} 
                  style={{ width: `${Math.min(100, (gap.activeHealthSum / gap.healthRecommended) * 100)}%` }}
                />
              </div>
            </div>
            {gap.healthGap > 0 ? (
              <span className="text-xs font-extrabold text-amber-350 bg-amber-955/20 border border-amber-900/20 px-3 py-1 rounded w-fit">
                {t.health.gaps.gapLabel}: ₹{gap.healthGap.toLocaleString("en-IN")}
              </span>
            ) : (
              <span className="text-xs font-extrabold text-emerald-455 bg-emerald-955/20 border border-emerald-900/20 px-3 py-1 rounded w-fit">
                {t.health.gaps.fullyCovered}
              </span>
            )}
          </div>

          {/* PMSBY status */}
          <div className="bg-primary-bg/40 border border-primary-border p-5 rounded-2xl flex flex-col justify-between gap-4 text-sm transition-colors duration-200">
            <div>
              <span className="font-extrabold text-primary-text block mb-1">{t.health.gaps.accidentalCover}</span>
              <p className="text-xs text-muted-text leading-normal">{t.health.gaps.accidentalScheme}</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold">
              {gap.pmsbyActive ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 animate-none" />
                  <span className="text-emerald-400 font-bold">{t.health.gaps.activeCover}</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 text-rose-500" />
                  <span className="text-rose-400 font-bold">{t.health.gaps.inactiveCover}</span>
                </>
              )}
            </div>
            <span className="text-xs text-muted-text leading-relaxed">{t.health.gaps.accidentalDesc}</span>
          </div>

          {/* PMJJBY status */}
          <div className="bg-primary-bg/40 border border-primary-border p-5 rounded-2xl flex flex-col justify-between gap-4 text-sm transition-colors duration-200">
            <div>
              <span className="font-extrabold text-primary-text block mb-1">{t.health.gaps.microLife}</span>
              <p className="text-xs text-muted-text leading-normal">{t.health.gaps.microLifeScheme}</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold">
              {gap.pmjjbyActive ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">{t.health.gaps.activeCover}</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 text-rose-500" />
                  <span className="text-rose-400 font-bold">{t.health.gaps.inactiveCover}</span>
                </>
              )}
            </div>
            <span className="text-xs text-muted-text leading-relaxed">{t.health.gaps.microLifeDesc}</span>
          </div>

        </div>
      </div>

      {/* Policies List Table */}
      <div className="bg-card-bg border border-primary-border rounded-2xl p-8 shadow flex flex-col gap-6 transition-colors duration-200">
        <div>
          <h4 className="font-extrabold text-lg text-primary-text flex items-center gap-2">
            <Landmark className="w-5 h-5 text-cyan-400" />
            {t.health.tableTitle}
          </h4>
          <p className="text-sm text-muted-text mt-1">{t.health.tableDesc}</p>
        </div>

        {loading ? (
          <div className="py-10 text-center text-sm text-muted-text flex items-center justify-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin text-cyan-400" />
            {t.health.loadingMsg}
          </div>
        ) : policies.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted-text italic bg-primary-bg/20 border border-dashed border-primary-border rounded-2xl">
            {t.health.emptyTableMsg}
          </div>
        ) : (
          <div className="overflow-x-auto border border-primary-border rounded-2xl text-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-primary-bg border-b border-primary-border text-secondary-text font-bold">
                  <th className="p-4">{t.health.headers.id}</th>
                  <th className="p-4">{t.health.headers.name}</th>
                  <th className="p-4">{t.health.headers.type}</th>
                  <th className="p-4">{t.health.headers.sum}</th>
                  <th className="p-4">{t.health.headers.premium}</th>
                  <th className="p-4">{t.health.headers.status}</th>
                  <th className="p-4">{t.health.headers.expiry}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary-border text-secondary-text">
                {policies.map((p) => (
                  <tr key={p.policy_id} className="hover:bg-primary-bg/30">
                    <td className="p-4 font-mono text-xs text-muted-text">{p.policy_id}</td>
                    <td className="p-4 font-extrabold text-primary-text text-sm">{p.policy_name}</td>
                    <td className="p-4">{p.policy_type}</td>
                    <td className="p-4">₹{p.sum_assured.toLocaleString("en-IN")}</td>
                    <td className="p-4">₹{p.annual_premium.toLocaleString("en-IN")}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-black uppercase ${
                        p.status === "Active" 
                          ? "bg-emerald-950/30 text-emerald-450 border border-emerald-900/20" 
                          : p.status === "Lapsed"
                          ? "bg-rose-950/30 text-rose-450 border border-rose-900/20"
                          : "bg-card-hover-bg text-secondary-text border border-primary-border"
                      }`}>{p.status}</span>
                    </td>
                    <td className="p-4 text-xs text-muted-text">{p.expiry_date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </motion.div>
  );
}
