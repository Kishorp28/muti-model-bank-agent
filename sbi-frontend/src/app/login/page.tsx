"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSFIA } from "../dashboard/context";
import { translations } from "../dashboard/translations";
import Link from "next/link";
import { 
  Lock, User, ShieldCheck, Sparkles, Building2, 
  ArrowRight, Info, AlertCircle, RefreshCw, Eye, EyeOff, Sun, Moon
} from "lucide-react";

// Shekhar Kamat SBI Logo
function SBILogo({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="currentColor">
      <path d="M 50 10 A 40 40 0 1 0 50 90 A 40 40 0 1 0 50 10 Z" />
      <rect x="46" y="55" width="8" height="30" fill="#ffffff" />
      <circle cx="50" cy="50" r="14" fill="#ffffff" />
      <circle cx="50" cy="50" r="7" fill="currentColor" />
    </svg>
  );
}

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams ? searchParams.get("role") : null;
  
  const { 
    login, 
    userSession, 
    language, 
    setLanguage, 
    theme, 
    setTheme, 
    fontScale, 
    setFontScale 
  } = useSFIA();
  const t = translations[language];
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Set default credentials based on URL role parameters
  useEffect(() => {
    if (roleParam) {
      const roleLower = roleParam.toLowerCase();
      if (["farmer", "police", "merchant", "salaried", "developer"].includes(roleLower)) {
        setUsername(roleLower);
        setPassword("sbi");
      }
    }
  }, [roleParam]);

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (userSession) {
      router.push("/dashboard");
    }
  }, [userSession, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setErrorMsg(language === "Hindi" ? "कृपया उपयोगकर्ता नाम और पासवर्ड दोनों दर्ज करें।" : language === "Tamil" ? "பயனர் பெயர் மற்றும் கடவுச்சொல் இரண்டையும் உள்ளிடவும்." : "Please enter both username and password.");
      return;
    }
    
    setIsLoading(true);
    setErrorMsg(null);
    
    // Simulate minor network delay for premium feel
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    try {
      const success = await login(username, password);
      if (success) {
        router.push("/dashboard");
      } else {
        setErrorMsg(language === "Hindi" 
          ? "अमान्य क्रेडेंशियल। पासवर्ड 'sbi' के साथ 'farmer', 'police', 'merchant', 'salaried' या 'developer' का उपयोग करने का प्रयास करें।" 
          : language === "Tamil" 
          ? "தவறான பயனர் விவரங்கள். பயனர் பெயராக 'farmer', 'police', 'merchant', 'salaried' அல்லது 'developer' ஐயும், கடவுச்சொல்லாக 'sbi' ஐயும் பயன்படுத்தவும்." 
          : "Invalid credentials. Try using 'farmer', 'police', 'merchant', 'salaried', or 'developer' with password 'sbi'.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(language === "Hindi" ? "एक अप्रत्याशित त्रुटि हुई। कृपया पुन: प्रयास करें।" : language === "Tamil" ? "உள்நுழைவதில் பிழை ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்." : "An unexpected login error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickSelect = (roleName: string) => {
    setUsername(roleName);
    setPassword("sbi");
    setErrorMsg(null);
  };

  const personas = [
    { id: "farmer", label: "🌾 Farmer (Narendhira)", db: "Google Firestore REST API", desc: "Dormant account, safety net audit required" },
    { id: "police", label: "👮 Police Officer (Vikram)", db: "Supabase PostgreSQL", desc: "High-risk profession, critical life cover gap" },
    { id: "merchant", label: "🏪 Kirana Merchant (Sunita)", db: "Supabase PostgreSQL", desc: "Active business, pre-approved Mudra Loan" },
    { id: "salaried", label: "💼 Software Engineer (Ramesh)", db: "Supabase PostgreSQL", desc: "Overleveraged, high DTI debt trap check" },
    { id: "developer", label: "🛠️ System Developer", db: "SQLite / Dual DB Sync", desc: "Full administrative sandbox access" }
  ];

  const getPersonaDesc = (id: string, defaultDesc: string) => {
    if (language === "Hindi") {
      if (id === "farmer") return "बचत खाता निष्क्रिय, सामाजिक सुरक्षा ऑडिट की आवश्यकता";
      if (id === "police") return "जोखिम भरा पेशा, गंभीर जीवन बीमा का अंतर";
      if (id === "merchant") return "सक्रिय व्यवसाय, एमएसएमई मुद्रा ऋण पूर्व-स्वीकृत";
      if (id === "salaried") return "अत्यधिक कर्ज, उच्च ईएमआई ऋण-से-आय अनुपात की जांच";
      return "पूर्ण प्रशासनिक सैंडबॉक्स पहुंच";
    }
    if (language === "Tamil") {
      if (id === "farmer") return "சேமிப்பு கணக்கு முடக்கம், சமூக பாதுகாப்பு தணிக்கை தேவை";
      if (id === "police") return "ஆபத்தான தொழில், அவசர ஆயுள் காப்பீட்டு இடைவெளி";
      if (id === "merchant") return "வழக்கமான வர்த்தகம், முத்ரா கடன் முன்கூட்டியே அங்கீகரிக்கப்பட்டது";
      if (id === "salaried") return "அதிக கடன் சுமை, கடன்-வருமான விகித சரிபார்ப்பு";
      return "முழுமையான சிமுலேஷன் அணுகல்";
    }
    return defaultDesc;
  };

  const getPersonaLabel = (id: string, defaultLabel: string) => {
    if (language === "Hindi") {
      if (id === "farmer") return "🌾 किसान (नरेन्द्र)";
      if (id === "police") return "👮 पुलिस अधिकारी (विक्रम)";
      if (id === "merchant") return "🏪 किराना व्यापारी (सुनीता)";
      if (id === "salaried") return "💼 सॉफ्टवेयर इंजीनियर (रमेश)";
      return "🛠️ प्रणाली डेवलपर";
    }
    if (language === "Tamil") {
      if (id === "farmer") return "🌾 விவசாயி (நரேந்திரா)";
      if (id === "police") return "👮 போலீஸ் அதிகாரி (விக்ரம்)";
      if (id === "merchant") return "🏪 மளிகைக் கடைக்காரர் (சுனிதா)";
      if (id === "salaried") return "💼 மென்பொருள் பொறியாளர் (ரமேஷ்)";
      return "🛠️ சிஸ்டம் டெவலப்பர்";
    }
    return defaultLabel;
  };

  return (
    <div className="min-h-screen bg-primary-bg text-primary-text flex flex-col justify-between relative overflow-hidden font-sans transition-colors duration-200">
      
      {/* Top Corporate Mini-Bar */}
      <header className="border-b border-primary-border bg-sidebar-bg/60 backdrop-blur-md px-8 py-4 flex items-center justify-between z-10 transition-colors duration-200">
        <Link href="/" className="flex items-center gap-3">
          <div className="p-1.5 bg-[#0054a6]/10 rounded border border-[#00a4e4]/30">
            <SBILogo className="w-10 h-10 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-base font-black text-primary-text leading-none">State Bank of India</h1>
            <span className="text-xs text-muted-text font-extrabold tracking-widest uppercase mt-0.5 block">{t.sidebar.title} {t.sidebar.tutor}</span>
          </div>
        </Link>
        
        <div className="flex items-center gap-4">
          {/* Global Language Selector */}
          <div className="bg-card-bg/65 backdrop-blur rounded-xl p-1 border border-primary-border flex items-center transition-colors duration-200">
            {(["English", "Hindi", "Tamil"] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-3 py-1 text-xs font-black rounded-lg transition-all cursor-pointer ${
                  language === lang 
                    ? "bg-[#0054a6] text-white shadow-md" 
                    : "text-muted-text hover:text-primary-text"
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          {/* Font Scaler */}
          <div className="bg-card-bg/65 backdrop-blur rounded-xl p-1 border border-primary-border flex items-center gap-1 transition-colors duration-200">
            <button
              onClick={() => setFontScale(Math.max(0.85, Math.round((fontScale - 0.05) * 100) / 100))}
              disabled={fontScale <= 0.85}
              className="w-7 h-7 flex items-center justify-center font-bold text-xs text-primary-text hover:bg-card-hover-bg rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              A-
            </button>
            <span className="text-[10px] font-bold px-1 min-w-[2.5rem] text-center text-primary-text select-none">
              {Math.round(fontScale * 100)}%
            </span>
            <button
              onClick={() => setFontScale(Math.min(1.35, Math.round((fontScale + 0.05) * 100) / 100))}
              disabled={fontScale >= 1.35}
              className="w-7 h-7 flex items-center justify-center font-bold text-xs text-primary-text hover:bg-card-hover-bg rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              A+
            </button>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="p-2 bg-card-bg/65 backdrop-blur border border-primary-border rounded-xl text-primary-text hover:bg-card-hover-bg transition-all flex items-center justify-center cursor-pointer"
          >
            {theme === "light" ? <Moon className="w-4 h-4 text-indigo-650" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>

          <Link 
            href="/" 
            className="text-sm text-muted-text hover:text-cyan-405 font-bold transition-colors"
          >
            {t.sidebar.backToPortal.replace("Back to ", "")}
          </Link>
        </div>
      </header>

      {/* Main Grid Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center z-10">
        
        {/* Left Side: Brand Heritage, Security Tips, and Database Architecture */}
        <section className="lg:col-span-6 flex flex-col gap-8">
          <div>
            <span className="px-3 py-1.5 text-xs uppercase font-black tracking-widest bg-[#0054a6]/20 border border-[#00a4e4]/30 text-[#00a4e4] rounded-lg inline-block w-fit mb-4">
              {t.login.secureNetbanking}
            </span>
            <h2 className="text-4xl lg:text-5xl font-black text-primary-text leading-tight">
              {t.login.portalTitle}
            </h2>
            <p className="text-base text-secondary-text mt-4 leading-relaxed">
              {t.login.portalDesc}
            </p>
          </div>

          {/* Shekhar Kamat Design Spotlight */}
          <div className="bg-card-bg border border-primary-border p-6 rounded-2xl flex gap-5 items-start shadow-xl transition-colors duration-200">
            <div className="p-3 bg-[#00a4e4]/10 rounded-xl border border-cyan-500/20 text-[#00a4e4] shrink-0">
              <SBILogo className="w-10 h-10 text-[#00a4e4]" />
            </div>
            <div className="space-y-2 text-sm">
              <h4 className="font-extrabold text-primary-text text-base">{t.login.designSpotlightTitle}</h4>
              <p className="text-secondary-text leading-relaxed">
                {t.login.designSpotlightBody}
              </p>
            </div>
          </div>

          {/* Secure Audit Notice */}
          <div className="bg-card-bg/30 border border-primary-border p-6 rounded-2xl text-sm space-y-4 transition-colors duration-200">
            <h4 className="font-extrabold text-primary-text flex items-center gap-2 text-base">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              {t.login.dbNoticeTitle}
            </h4>
            <ul className="space-y-2.5 text-secondary-text list-disc list-inside">
              <li>
                <strong className="text-primary-text">{getPersonaLabel("farmer", "Farmer")}</strong>: {t.login.farmerRouting}
              </li>
              <li>
                <strong className="text-primary-text">{getPersonaLabel("police", "Police")}/{getPersonaLabel("merchant", "Merchant")}/{getPersonaLabel("salaried", "Salaried")}</strong>: {t.login.supabaseRouting}
              </li>
              <li>
                <strong className="text-primary-text">{t.login.dbNoticeTitle.includes("कठ") || t.login.dbNoticeTitle.includes("கட்ட") ? "பணிநீக்கம்" : "Local Backup"}</strong>: {t.login.fallbackRouting}
              </li>
            </ul>
          </div>
        </section>

        {/* Right Side: Corporate Login Form & Demo Selectors */}
        <section className="lg:col-span-6 flex flex-col gap-6">
          <div className="bg-card-bg border border-primary-border rounded-3xl p-8 shadow-2xl relative transition-colors duration-200">
            
            <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-primary-border">
              <Lock className="w-6 h-6 text-[#00a4e4]" />
              <h3 className="font-extrabold text-base text-primary-text uppercase tracking-wider">{t.login.loginTitle}</h3>
            </div>

            {errorMsg && (
              <div className="bg-rose-950/20 border border-rose-900/30 text-rose-455 p-4 rounded-xl text-sm flex items-start gap-2.5 mb-5 animate-headShake">
                <AlertCircle className="w-5 h-5 shrink-0 text-rose-500 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username Input */}
              <div className="space-y-2">
                <label className="text-xs uppercase font-black tracking-widest text-muted-text block">
                  {t.login.usernameLabel}
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-4 text-muted-text">
                    <User className="w-5 h-5" />
                  </span>
                  <input 
                    type="text" 
                    placeholder={t.login.usernamePlaceholder} 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={isLoading}
                    className="w-full pl-12 pr-4 py-3.5 bg-primary-bg border border-primary-border focus:border-[#00a4e4] rounded-xl text-sm text-primary-text outline-none transition-colors duration-200"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs uppercase font-black tracking-widest text-muted-text block">
                    {t.login.passwordLabel}
                  </label>
                  <span className="text-xs text-muted-text font-bold uppercase cursor-help">{t.login.forgotPin}</span>
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-4 text-muted-text">
                    <Lock className="w-5 h-5" />
                  </span>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder={t.login.passwordPlaceholder} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="w-full pl-12 pr-12 py-3.5 bg-primary-bg border border-primary-border focus:border-[#00a4e4] rounded-xl text-sm text-primary-text outline-none transition-colors duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-4 text-muted-text hover:text-secondary-text"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-r from-[#0054a6] to-[#00a4e4] hover:opacity-90 text-white font-extrabold text-sm rounded-xl flex items-center justify-center gap-2 transition-all mt-8 shadow-md cursor-pointer"
              >
                {isLoading ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>{t.login.submitBtn}</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Selectors section */}
            <div className="mt-8 border-t border-primary-border pt-6">
              <span className="text-xs uppercase font-black tracking-widest text-muted-text block mb-4 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                {t.login.quickSelectTitle}
              </span>
              <div className="flex flex-col gap-2.5">
                {personas.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleQuickSelect(p.id)}
                    className="w-full p-3.5 bg-primary-bg/40 hover:bg-card-hover-bg/30 border border-primary-border rounded-xl text-left transition-all flex justify-between items-center group cursor-pointer"
                  >
                    <div>
                      <span className="text-sm font-bold text-secondary-text group-hover:text-[#00a4e4] block transition-colors">
                        {getPersonaLabel(p.id, p.label)}
                      </span>
                      <span className="text-xs text-muted-text block mt-0.5">
                        {getPersonaDesc(p.id, p.desc)}
                      </span>
                    </div>
                    <span className="px-2.5 py-1 text-[10px] font-bold font-mono uppercase bg-card-bg border border-primary-border rounded group-hover:border-cyan-500/20 text-muted-text group-hover:text-[#00a4e4] transition-colors duration-200">
                      {p.id === "farmer" ? "Firestore" : p.id === "developer" ? "SQLite" : "Supabase"}
                    </span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </section>

      </main>

      {/* Corporate Footer */}
      <footer className="border-t border-primary-border bg-sidebar-bg py-6 px-6 text-center text-[10px] text-muted-text flex flex-col sm:flex-row justify-between items-center gap-3 transition-colors duration-200">
        <div className="flex items-center gap-1.5 justify-center sm:justify-start">
          <SBILogo className="w-5 h-5 text-muted-text" />
          <span>© 2026 State Bank of India. Built for internal simulation & educational purpose.</span>
        </div>
        <div className="flex gap-4">
          <span className="cursor-pointer hover:text-primary-text">Security Tips</span>
          <span>•</span>
          <span className="cursor-pointer hover:text-primary-text">Privacy Policy</span>
          <span>•</span>
          <span className="cursor-pointer hover:text-primary-text">Help Desk</span>
        </div>
      </footer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#03060c] text-white flex flex-col items-center justify-center font-sans gap-3">
        <RefreshCw className="w-8 h-8 animate-spin text-cyan-400" />
        <span className="text-xs text-slate-400 font-extrabold uppercase tracking-widest">Loading Secure Netbanking...</span>
      </div>
    }>
      <LoginFormContent />
    </Suspense>
  );
}
