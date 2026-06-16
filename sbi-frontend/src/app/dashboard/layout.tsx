"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSFIA } from "./context";
import { translations } from "./translations";
import { 
  Building2, Users, ShieldCheck, HeartPulse, Sparkles, 
  ChevronLeft, Play, RefreshCw, Landmark, BookOpen, 
  ChevronRight, MessageSquare, Volume2, VolumeX, Send, 
  CheckCircle2, AlertTriangle, PhoneCall, LayoutDashboard,
  Activity, ShieldAlert, BarChart3, Sun, Moon, Shield, TrendingUp
} from "lucide-react";

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

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  
  const {
    customers,
    selectedCustomerId,
    setSelectedCustomerId,
    customerDetails,
    isAuditing,
    activeNode,
    language,
    setLanguage,
    theme,
    setTheme,
    fontScale,
    setFontScale,
    runAgentAudit,
    userSession,
    logout
  } = useSFIA();

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("sfi_user_session");
      if (!stored) {
        router.push("/login");
      }
    }
  }, [userSession, router]);

  const t = translations[language];

  const navItems = [
    { href: "/dashboard", label: t.sidebar.overview, icon: LayoutDashboard },
    { href: "/dashboard/console", label: t.sidebar.console, icon: MessageSquare },
    { href: "/dashboard/insights", label: t.sidebar.insights, icon: Activity },
    { href: "/dashboard/health", label: t.sidebar.health, icon: HeartPulse },
    { href: "/dashboard/investments", label: t.sidebar.investments, icon: TrendingUp },
    { href: "/dashboard/agents", label: t.sidebar.agents, icon: Sparkles },
    { href: "/dashboard/compliance", label: t.sidebar.compliance, icon: ShieldCheck },
    { href: "/dashboard/whatsapp", label: t.sidebar.whatsapp, icon: PhoneCall },
    { href: "/dashboard/analytics", label: t.sidebar.analytics, icon: BarChart3 },
    { href: "/dashboard/security", label: language === "Hindi" ? "सुरक्षा ऑडिट" : language === "Tamil" ? "பாதுகாப்பு தணிக்கை" : "Security Audit", icon: Shield }
  ];

  const getContextualButtonLabel = () => {
    switch (pathname) {
      case "/dashboard":
        return t.header.evaluateWellnessOverview;
      case "/dashboard/console":
        return t.header.evaluateWellnessConsole;
      case "/dashboard/insights":
        return t.header.evaluateWellnessInsights;
      case "/dashboard/health":
        return t.header.evaluateWellnessHealth;
      case "/dashboard/agents":
        return t.header.evaluateWellnessAgents;
      case "/dashboard/compliance":
        return t.header.evaluateWellnessCompliance;
      case "/dashboard/whatsapp":
        return t.header.evaluateWellnessWhatsapp;
      case "/dashboard/analytics":
        return t.header.evaluateWellnessAnalytics;
      case "/dashboard/security":
        return language === "Hindi" ? "नेटवर्क री-ऑडिट" : language === "Tamil" ? "பாதுகாப்பை மறுஆய்வு செய்" : "Re-Audit Network";
      case "/dashboard/investments":
        return language === "Hindi" ? "बचत अनुमान" : language === "Tamil" ? "கூட்டு வட்டி பகுப்பாய்வு" : "Project Savings Growth";
      default:
        return t.header.evaluateWellness;
    }
  };

  return (
    <div className="flex min-h-screen bg-primary-bg text-primary-text font-sans overflow-x-hidden transition-colors duration-200">
      
      {/* 1. SIDEBAR */}
      <aside className="w-72 bg-sidebar-bg border-r border-primary-border flex flex-col z-30 shrink-0 transition-colors duration-200">
        {/* Brand / Logo */}
        <div className="p-5 border-b border-primary-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-[#0054a6]/10 rounded-xl border border-[#00a4e4]/30 shadow-inner">
              <SBILogo className="w-10 h-10 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-base font-black text-primary-text flex items-center gap-1">
                {t.sidebar.title}
              </h2>
              <p className="text-xs text-muted-text tracking-wide font-black uppercase">{t.sidebar.tutor}</p>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="p-4 border-b border-primary-border">
          <Link 
            href="/"
            className="w-full px-4 py-2.5 bg-card-bg/40 hover:bg-card-hover-bg text-secondary-text hover:text-primary-text rounded-xl transition-all flex items-center gap-2 text-sm font-black border border-primary-border"
          >
            <ChevronLeft className="w-4.5 h-4.5 text-cyan-400" />
            <span>{t.sidebar.backToPortal}</span>
          </Link>
        </div>

        {/* Case Study Selector (Only for Developer role) */}
        {userSession?.role === "developer" && (
          <div className="p-5 border-b border-primary-border flex flex-col gap-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-muted-text flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              {t.sidebar.caseStudy}
            </h3>
            <div className="flex flex-col gap-2">
              {[
                { id: "C_RURAL_NARENDHIRA", label: "🌾 Narendhira (Servant)", alert: "Unclaimed Benefits" },
                { id: "C_POLICE_VIKRAM", label: "👮 Vikram (Police)", alert: "Life Cover Gap" },
                { id: "C_SHOP_SUNITA", label: "🏪 Sunita (Kirana)", alert: "Mudra Approved" },
                { id: "C_SALARIED_RAMESH", label: "💼 Ramesh (Salaried)", alert: "Veto Warning" }
              ].map((scen) => (
                <button
                  key={scen.id}
                  onClick={() => setSelectedCustomerId(scen.id)}
                  disabled={isAuditing}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex flex-col gap-1 ${
                    selectedCustomerId === scen.id 
                      ? "bg-card-hover-bg border-primary-border shadow-md" 
                      : "bg-card-bg/20 border-primary-border hover:bg-card-hover-bg/30"
                  }`}
                >
                  <span className={`text-xs font-black ${selectedCustomerId === scen.id ? "text-cyan-400" : "text-primary-text"}`}>{scen.label}</span>
                  <span className={`text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded w-fit ${
                    scen.id === "C_SALARIED_RAMESH" ? "bg-rose-950/30 text-rose-450" : 
                    scen.id === "C_POLICE_VIKRAM" ? "bg-orange-950/30 text-orange-450" : "bg-emerald-950/30 text-emerald-450"
                  }`}>{scen.alert}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="flex-1 p-5 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-black transition-all border ${
                  isActive 
                    ? "bg-[#0054a6]/20 border-[#0054a6]/40 text-primary-text shadow-md" 
                    : "text-muted-text border-transparent hover:text-primary-text hover:bg-card-hover-bg/30"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-cyan-400" : "text-slate-500"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Customer Stats Summary */}
        {customerDetails && (
          <div className="p-5 bg-sidebar-bg border-t border-primary-border text-xs space-y-1.5 text-secondary-text flex items-center gap-3">
            <img src="/professor_sfia_avatar.png" className="w-10 h-10 rounded-full border border-cyan-500 bg-primary-bg object-cover shrink-0" alt="S-FIA Avatar" />
            <div className="flex-1">
              <span className="font-extrabold text-primary-text text-sm block mb-1">{customerDetails.customer_info.first_name} {customerDetails.customer_info.last_name}</span>
              <div className="flex justify-between text-[11px]">
                <span>{t.sidebar.savings}:</span>
                <span className="font-bold text-cyan-405">₹{customerDetails.summary.total_balance.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-[11px] mt-0.5">
                <span>{t.sidebar.loans}:</span>
                <span className="font-bold text-rose-400">₹{customerDetails.loans.reduce((acc, l) => acc + l.loan_amount, 0).toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>
        )}

        {/* Secure Logout Button */}
        <div className="p-4 border-t border-primary-border bg-sidebar-bg">
          <button
            onClick={() => {
              logout();
              router.push("/login");
            }}
            className="w-full px-4 py-2.5 bg-rose-950/15 hover:bg-rose-900/30 text-rose-400 hover:text-rose-300 rounded-xl transition-all flex items-center justify-center gap-2 text-sm font-black border border-rose-900/30 shadow-inner"
          >
            <ShieldAlert className="w-4.5 h-4.5 text-rose-500" />
            <span>{t.sidebar.logout}</span>
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        
        {/* Header */}
        <header className="border-b border-primary-border bg-sidebar-bg/75 backdrop-blur-md sticky top-0 z-20 px-8 py-5 flex items-center justify-between transition-colors duration-200">
          <div>
            <h1 className="text-2xl font-black text-primary-text flex items-center gap-2.5">
              {navItems.find(n => n.href === pathname)?.label || "S-FIA Diagnostic Lab"}
              {isAuditing && (
                <span className="text-xs bg-[#0a2540] border border-[#0054a6]/40 px-2.5 py-0.5 rounded text-cyan-400 animate-pulse font-mono">
                  {t.header.activeAudit}: {activeNode || "Orchestrating"}
                </span>
              )}
            </h1>
            <p className="text-sm text-muted-text mt-1">
              {customerDetails ? (
                language === "English" 
                  ? `${t.header.reviewingLedgerMsg} ${customerDetails.customer_info.first_name} (${customerDetails.customer_info.occupation})`
                  : `${customerDetails.customer_info.first_name} (${customerDetails.customer_info.occupation}) ${t.header.reviewingLedgerMsg}`
              ) : t.header.selectCaseStudyMsg}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Global Language Selector */}
            <div className="bg-card-bg/60 backdrop-blur rounded-xl p-1 border border-primary-border flex items-center transition-colors duration-200">
              {(["English", "Hindi", "Tamil"] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-4 py-1.5 text-sm font-black rounded-lg transition-all ${
                    language === lang 
                      ? "bg-[#0054a6] text-white shadow-md" 
                      : "text-muted-text hover:text-primary-text"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>

            {/* Font Scaler (+ / -) */}
            <div className="bg-card-bg/60 backdrop-blur rounded-xl p-1 border border-primary-border flex items-center gap-1 transition-colors duration-200">
              <button
                onClick={() => setFontScale(Math.max(0.85, Math.round((fontScale - 0.05) * 100) / 100))}
                disabled={fontScale <= 0.85}
                className="w-8 h-8 flex items-center justify-center font-bold text-sm text-primary-text hover:bg-card-hover-bg rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                title="Decrease Text Size"
              >
                A-
              </button>
              <span className="text-xs font-bold px-1.5 min-w-[3.5rem] text-center text-primary-text select-none">
                {Math.round(fontScale * 100)}%
              </span>
              <button
                onClick={() => setFontScale(Math.min(1.35, Math.round((fontScale + 0.05) * 100) / 100))}
                disabled={fontScale >= 1.35}
                className="w-8 h-8 flex items-center justify-center font-bold text-sm text-primary-text hover:bg-card-hover-bg rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                title="Increase Text Size"
              >
                A+
              </button>
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="p-2.5 bg-card-bg/60 backdrop-blur border border-primary-border rounded-xl text-primary-text hover:bg-card-hover-bg transition-all flex items-center justify-center"
              title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
            >
              {theme === "light" ? <Moon className="w-5 h-5 text-indigo-600" /> : <Sun className="w-5 h-5 text-amber-400" />}
            </button>

            {/* Evaluate Button */}
            <button
              onClick={runAgentAudit}
              disabled={isAuditing}
              className={`px-5 py-2.5 font-black text-sm rounded-xl flex items-center gap-2 shadow-md transition-all ${
                isAuditing 
                  ? "bg-card-bg text-muted-text border border-primary-border cursor-not-allowed" 
                  : "bg-gradient-to-r from-[#0054a6] to-[#00a4e4] hover:shadow-lg text-white"
              }`}
            >
              {isAuditing ? (
                <RefreshCw className="w-4 h-4 animate-spin text-sky-400" />
              ) : (
                <Play className="w-4 h-4 fill-white" />
              )}
              <span>{getContextualButtonLabel()}</span>
            </button>
          </div>
        </header>

        {/* Child Pages */}
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayoutContent>{children}</DashboardLayoutContent>;
}
