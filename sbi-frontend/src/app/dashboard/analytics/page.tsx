"use client";

import React, { useEffect, useState } from "react";
import { useSFIA } from "../context";
import { translations } from "../translations";
import { Landmark, Sparkles, TrendingUp, AlertTriangle, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from "recharts";

interface AnalyticsData {
  total_aum: number;
  digital_ratio: number;
  insurance_gap: number;
  dti_distribution: Array<{ name: string; value: number }>;
  occupation_health: Array<{ occupation: string; avg_score: number }>;
}

export default function AnalyticsPage() {
  const { language } = useSFIA();
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  const t = translations[language];

  const fallbackData: AnalyticsData = {
    total_aum: 25302854.59,
    digital_ratio: 49.43,
    insurance_gap: 58.5,
    dti_distribution: [
      { name: "No Debt", value: 1400 },
      { name: "Safe (<=30%)", value: 850 },
      { name: "Moderate (30-50%)", value: 520 },
      { name: "Over-leveraged (>50%)", value: 230 }
    ],
    occupation_health: [
      { occupation: "Pilot", avg_score: 71.8 },
      { occupation: "Businessman", avg_score: 70.7 },
      { occupation: "Doctor", avg_score: 69.9 },
      { occupation: "Professor", avg_score: 67.0 },
      { occupation: "Engineer", avg_score: 66.8 }
    ]
  };

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
      const res = await fetch(`${API_BASE}/analytics`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      } else {
        setData(fallbackData);
      }
    } catch (e) {
      console.error("Failed to fetch analytics, using fallback:", e);
      setData(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const getDtiLabel = (name: string) => {
    if (name === "No Debt") return t.analytics.dtiLabels.noDebt;
    if (name.includes("Safe")) return t.analytics.dtiLabels.safe;
    if (name.includes("Moderate")) return t.analytics.dtiLabels.moderate;
    if (name.includes("leveraged") || name.includes(">50%")) return t.analytics.dtiLabels.leveraged;
    return name;
  };

  const translateOccupation = (occ: string) => {
    if (language === "Hindi") {
      if (occ.toLowerCase() === "pilot") return "पायलट (Pilot)";
      if (occ.toLowerCase() === "businessman") return "व्यवसायी";
      if (occ.toLowerCase() === "doctor") return "डॉक्टर";
      if (occ.toLowerCase() === "professor") return "प्रोफेसर";
      if (occ.toLowerCase() === "engineer") return "इंजीनियर";
      return occ;
    }
    if (language === "Tamil") {
      if (occ.toLowerCase() === "pilot") return "விமான ஓட்டி";
      if (occ.toLowerCase() === "businessman") return "தொழிலதிபர்";
      if (occ.toLowerCase() === "doctor") return "மருத்துவர்";
      if (occ.toLowerCase() === "professor") return "பேராசிரியர்";
      if (occ.toLowerCase() === "engineer") return "பொறியாளர்";
      return occ;
    }
    return occ;
  };

  const getLoadingMsg = () => {
    if (language === "Hindi") return "शाखा-व्यापी विश्लेषिकी इंजन को प्रसंस्कृत किया जा रहा है...";
    if (language === "Tamil") return "கிளை அளவிலான தரவுப் பகுப்பாய்வு கணக்கிடப்படுகிறது...";
    return "Processing branch-wide analytics engine...";
  };

  if (loading || !data) {
    return (
      <div className="py-20 text-center text-xs text-muted-text flex items-center justify-center gap-2">
        <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
        {getLoadingMsg()}
      </div>
    );
  }

  const dtiData = data.dti_distribution.map(d => ({
    ...d,
    name: getDtiLabel(d.name)
  }));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
      
      {/* Top statistics summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Total Assets Under Management (AUM) */}
        <div className="bg-card-bg border border-primary-border rounded-2xl p-6 shadow-xl flex flex-col justify-between h-44 relative transition-colors duration-200">
          <div className="flex justify-between items-start">
            <span className="text-xs uppercase font-black tracking-widest text-muted-text">{t.analytics.assetsTitle}</span>
            <Landmark className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-3xl font-black text-primary-text leading-none mb-2">
              ₹{data.total_aum.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
            </h3>
            <p className="text-xs text-muted-text leading-relaxed">
              {t.analytics.assetsDesc}
            </p>
          </div>
        </div>

        {/* Digital Onboarding Adoption */}
        <div className="bg-card-bg border border-primary-border rounded-2xl p-6 shadow-xl flex flex-col justify-between h-44 relative transition-colors duration-200">
          <div className="flex justify-between items-start">
            <span className="text-xs uppercase font-black tracking-widest text-muted-text">{t.analytics.digitalTitle}</span>
            <Sparkles className="w-5 h-5 text-emerald-450" />
          </div>
          <div>
            <h3 className="text-3xl font-black text-emerald-450 leading-none mb-2">
              {data.digital_ratio.toFixed(2)}%
            </h3>
            <div className="w-full bg-card-bg h-2 rounded-full overflow-hidden mt-2 mb-2 border border-primary-border">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${data.digital_ratio}%` }} />
            </div>
            <p className="text-xs text-muted-text leading-relaxed">
              {t.analytics.digitalDesc}
            </p>
          </div>
        </div>

        {/* Insurance safety gap ratio */}
        <div className="bg-card-bg border border-primary-border rounded-2xl p-6 shadow-xl flex flex-col justify-between h-44 relative transition-colors duration-200">
          <div className="flex justify-between items-start">
            <span className="text-xs uppercase font-black tracking-widest text-muted-text">{t.analytics.uninsuredTitle}</span>
            <AlertTriangle className="w-5 h-5 text-rose-500 animate-pulse" />
          </div>
          <div>
            <h3 className="text-3xl font-black text-rose-500 leading-none mb-2">
              {data.insurance_gap.toFixed(1)}%
            </h3>
            <div className="w-full bg-card-bg h-2 rounded-full overflow-hidden mt-2 mb-2 border border-primary-border">
              <div className="bg-rose-500 h-full rounded-full" style={{ width: `${data.insurance_gap}%` }} />
            </div>
            <p className="text-xs text-muted-text leading-relaxed">
              {t.analytics.uninsuredDesc}
            </p>
          </div>
        </div>

      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Debt-to-Income (DTI) Distribution Pie Chart */}
        <div className="bg-card-bg border border-primary-border rounded-2xl p-8 shadow flex flex-col gap-6 transition-colors duration-200">
          <div>
            <h4 className="font-extrabold text-lg text-primary-text">{t.analytics.dtiTitle}</h4>
            <p className="text-sm text-muted-text mt-1">{t.analytics.dtiDesc}</p>
          </div>
          <div className="h-72 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dtiData}
                  cx="50%"
                  cy="45%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {dtiData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-primary)", color: "var(--text-primary)" }} />
                <Legend layout="horizontal" align="center" verticalAlign="bottom" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Average Financial Health by Occupation leaderboard */}
        <div className="bg-card-bg border border-primary-border rounded-2xl p-8 shadow flex flex-col gap-6 transition-colors duration-200">
          <div>
            <h4 className="font-extrabold text-lg text-primary-text flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              {t.analytics.leaderboardTitle}
            </h4>
            <p className="text-sm text-muted-text mt-1">{t.analytics.leaderboardDesc}</p>
          </div>
          
          <div className="flex-1 overflow-y-auto max-h-72 space-y-3 pr-1 text-sm">
            {data.occupation_health.slice(0, 15).map((occ, idx) => (
              <div key={idx} className="bg-primary-bg/40 border border-primary-border p-3.5 rounded-xl flex items-center justify-between gap-4 transition-colors duration-200">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-muted-text w-6">#{idx + 1}</span>
                  <span className="font-black text-primary-text">{translateOccupation(occ.occupation)}</span>
                </div>
                <div className="flex items-center gap-4 w-44 shrink-0">
                  <div className="flex-1 bg-card-bg h-2.5 rounded-full overflow-hidden border border-primary-border">
                    <div className="bg-cyan-550 h-full rounded-full" style={{ width: `${occ.avg_score}%` }} />
                  </div>
                  <span className="font-black text-cyan-405 w-12 text-right">{occ.avg_score.toFixed(1)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </motion.div>
  );
}
