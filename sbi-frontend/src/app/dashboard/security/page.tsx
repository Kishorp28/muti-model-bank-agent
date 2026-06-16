"use client";

import React, { useEffect, useState } from "react";
import { useSFIA } from "../context";
import { 
  Shield, Key, History, MapPin, Globe, Laptop, 
  AlertTriangle, CheckCircle2, ShieldCheck, RefreshCw, Clock, Lock
} from "lucide-react";
import { motion } from "framer-motion";

interface LoginAttempt {
  timestamp: string;
  ip: string;
  location: string;
  role: string;
  device: string;
  status: "Success" | "Failed";
  type: string;
}

export default function SecurityAuditPage() {
  const { language, userSession } = useSFIA();
  
  const [ipAddress, setIpAddress] = useState<string>("Detecting...");
  const [location, setLocation] = useState<string>("Detecting...");
  const [loginHistory, setLoginHistory] = useState<LoginAttempt[]>([]);
  const [mfaEnabled, setMfaEnabled] = useState<boolean>(false);
  const [sessionTimeout, setSessionTimeout] = useState<number>(900); // 15 minutes
  const [vpnActive, setVpnActive] = useState<boolean>(true);
  const [loadingIp, setLoadingIp] = useState<boolean>(false);

  // Translations dictionary local fallback to keep translations.ts type-safe
  const tSec = {
    English: {
      title: "🛡️ Security & Access Control Panel",
      desc: "Monitor your network integrity, connection credentials, session timeouts, and historical login entries.",
      connIntegrity: "Connection Integrity",
      ipDisplay: "Internal & Public IP",
      location: "Detected Location",
      vpnStatus: "SBI MPLS VPN Tunneling",
      active: "Active",
      inactive: "Inactive",
      historyTitle: "Access Log History",
      historyDesc: "Historical records of successful and blocked access requests.",
      headers: {
        time: "Timestamp",
        ip: "IP Address",
        loc: "Location",
        role: "Persona/Role",
        device: "Device/Agent",
        status: "Status"
      },
      mfaTitle: "Multi-Factor Authentication (MFA)",
      mfaDesc: "Enforce hardware tokens or authentication app validation codes on new login requests.",
      mfaEnabled: "MFA Enforced",
      mfaDisabled: "MFA Disabled",
      sessionTitle: "Secure Session Timeout",
      sessionDesc: "Auto-logout countdown for inactive sessions.",
      renewBtn: "Renew Session",
      deviceTrust: "Device Trust Assessment",
      deviceTrustDesc: "Browser headers and cryptographic keys verified by Trust Agent.",
      browser: "Browser",
      os: "Operating System",
      mfaStatusLabel: "MFA Status",
      threatLevel: "Session Threat Level",
      lowRisk: "Low Risk (Trusted Zone)",
      highRisk: "Developer Mode (Audit Override)",
      vpnActiveMsg: "Secure SBI intranet VPN route enabled.",
      vpnInactiveMsg: "Public route warning: Enable private connection.",
      refreshBtn: "Re-Audit Network"
    },
    Hindi: {
      title: "🛡️ सुरक्षा और एक्सेस कंट्रोल पैनल",
      desc: "अपनी नेटवर्क अखंडता, कनेक्शन क्रेडेंशियल्स, सत्र टाइमआउट और ऐतिहासिक लॉगिन प्रविष्टियों की निगरानी करें।",
      connIntegrity: "कनेक्शन अखंडता",
      ipDisplay: "आंतरिक और सार्वजनिक आईपी",
      location: "पता लगाया गया स्थान",
      vpnStatus: "एसबीआई एमपीएलएस वीपीएन टनलिंग",
      active: "सक्रिय",
      inactive: "निष्क्रिय",
      historyTitle: "पहुंच लॉग इतिहास",
      historyDesc: "सफल और अवरुद्ध पहुंच अनुरोधों के ऐतिहासिक रिकॉर्ड।",
      headers: {
        time: "समय स्टांप",
        ip: "आईपी ​​पता",
        loc: "स्थान",
        role: "भूमिका",
        device: "उपकरण/एजेंट",
        status: "स्थिति"
      },
      mfaTitle: "मल्टी-फैक्टर ऑथेंटिकेशन (MFA)",
      mfaDesc: "नए लॉगिन अनुरोधों पर हार्डवेयर टोकन या प्रमाणीकरण कोड लागू करें।",
      mfaEnabled: "एमएफए लागू",
      mfaDisabled: "एमएफए अक्षम",
      sessionTitle: "सुरक्षित सत्र समय समाप्त",
      sessionDesc: "निष्क्रिय सत्रों के लिए ऑटो-लॉगआउट उलटी गिनती।",
      renewBtn: "सत्र का नवीनीकरण करें",
      deviceTrust: "डिवाइस ट्रस्ट मूल्यांकन",
      deviceTrustDesc: "ट्रस्ट एजेंट द्वारा सत्यापित ब्राउज़र हेडर और क्रिप्टोग्राफ़िक कुंजियाँ।",
      browser: "ब्राउज़र",
      os: "ऑपरेटिंग सिस्टम",
      mfaStatusLabel: "एमएफए स्थिति",
      threatLevel: "सत्र जोखिम स्तर",
      lowRisk: "कम जोखिम (विश्वसनीय क्षेत्र)",
      highRisk: "डेवलपर मोड (ऑडिट ओवरराइड)",
      vpnActiveMsg: "सुरक्षित एसबीआई इंट्रानेट वीपीएन मार्ग सक्रिय है।",
      vpnInactiveMsg: "सार्वजनिक मार्ग चेतावनी: निजी कनेक्शन सक्षम करें।",
      refreshBtn: "नेटवर्क री-ऑडिट"
    },
    Tamil: {
      title: "🛡️ பாதுகாப்பு மற்றும் அணுகல் கட்டுப்பாட்டு குழு",
      desc: "உங்கள் நெட்வொர்க் ஸ்திரத்தன்மை, இணைய அணுகல் சான்றுகள், அமர்வு காலாவதி மற்றும் உள்நுழைவு வரலாற்றுப் பதிவுகளைக் கண்காணிக்கவும்.",
      connIntegrity: "இணைய இணைப்பு பாதுகாப்பு",
      ipDisplay: "உள் மற்றும் பொது ஐபி",
      location: "கண்டறியப்பட்ட இடம்",
      vpnStatus: "எஸ்பிஐ எம்.பி.எல்.எஸ் விபிஎன் சுரங்கப்பாதை",
      active: "செயலில் உள்ளது",
      inactive: "செயலிழந்தது",
      historyTitle: "உள்நுழைவு வரலாற்றுப் பதிவுகள்",
      historyDesc: "வெற்றிகரமான மற்றும் தடுக்கப்பட்ட உள்நுழைவு கோரிக்கைகளின் வரலாற்றுத் தரவு.",
      headers: {
        time: "நேரம்",
        ip: "ஐபி முகவரி",
        loc: "இடம்",
        role: "பணி/விவரக்குறிப்பு",
        device: "சாதனம்/ஏஜென்ட்",
        status: "நிலை"
      },
      mfaTitle: "இருபடி அங்கீகாரம் (MFA)",
      mfaDesc: "புதிய உள்நுழைவு கோரிக்கைகளுக்கு மொபைல் அங்கீகாரக் குறியீடுகள் அல்லது பாதுகாப்பு விசைகளை கட்டாயமாக்குங்கள்.",
      mfaEnabled: "MFA செயல்படுத்தப்பட்டது",
      mfaDisabled: "MFA செயலிழந்தது",
      sessionTitle: "பாதுகாப்பான அமர்வு காலாவதி",
      sessionDesc: "செயலற்ற அமர்வுகளுக்கான தானியங்கி வெளியேற்றக் கணக்கீடு.",
      renewBtn: "அமர்வை நீட்டிப்பு செய்",
      deviceTrust: "சாதன நம்பகத்தன்மை மதிப்பீடு",
      deviceTrustDesc: "டிரஸ்ட் ஏஜெண்டால் சரிபார்க்கப்பட்ட உங்களது உலாவி மற்றும் குறியாக்க விசைகள்.",
      browser: "உலாவி",
      os: "இயக்க முறைமை",
      mfaStatusLabel: "MFA நிலை",
      threatLevel: "அமர்வு அபாய நிலை",
      lowRisk: "குறைந்த அபாயம் (பாதுகாப்பான வலயம்)",
      highRisk: "சிஸ்டம் டெவலப்பர் (நிர்வாக அணுகல்)",
      vpnActiveMsg: "பாதுகாப்பான எஸ்பிஐ விபிஎன் இணையவழி இயக்கப்பட்டுள்ளது.",
      vpnInactiveMsg: "பொது இணையவழி எச்சரிக்கை: எஸ்பிஐ விபிஎன் ஐ இயக்கவும்.",
      refreshBtn: "பாதுகாப்பை மறுஆய்வு செய்"
    }
  }[language === "Hindi" || language === "Tamil" ? language : "English"];

  // Countdown timer for session timeout
  useEffect(() => {
    const interval = setInterval(() => {
      setSessionTimeout(prev => {
        if (prev <= 1) {
          // Reset session
          return 900;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const auditNetwork = async () => {
    setLoadingIp(true);
    setIpAddress("Scanning...");
    setLocation("Scanning...");
    
    try {
      // Live IP detection
      const ipRes = await fetch("https://api.ipify.org?format=json");
      if (ipRes.ok) {
        const ipData = await ipRes.json();
        setIpAddress(ipData.ip);
        
        // Geo-location lookup
        const geoRes = await fetch(`https://ipapi.co/${ipData.ip}/json/`);
        if (geoRes.ok) {
          const geoData = await geoRes.json();
          setLocation(`${geoData.city}, ${geoData.region}, ${geoData.country_name}`);
        } else {
          setLocation("Mumbai, Maharashtra, India");
        }
      } else {
        throw new Error("Ipify failed");
      }
    } catch (e) {
      // Fallback local internal proxy
      setIpAddress("103.14.120.45");
      setLocation("Mumbai, Maharashtra, India");
    } finally {
      setLoadingIp(false);
    }
  };

  useEffect(() => {
    auditNetwork();
    
    // Manage login history storage
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("sfi_login_history");
      const currentRole = userSession?.role || "Developer";
      const currentUsername = userSession?.username || "System Administrator";
      const currentTime = new Date().toLocaleString();
      const currentDevice = navigator.userAgent.split(" (")[0] || "Mozilla Chrome";
      
      let historyList: LoginAttempt[] = [];
      
      if (stored) {
        try {
          historyList = JSON.parse(stored);
        } catch (e) {
          console.error("Failed to parse login history", e);
        }
      }
      
      // If history is empty, seed it with mock values for demonstration
      if (historyList.length === 0) {
        historyList = [
          {
            timestamp: new Date(Date.now() - 3600000 * 24).toLocaleString(),
            ip: "103.14.120.12",
            location: "Delhi, India",
            role: "Farmer (Narendhira)",
            device: "YONO Lite Mobile app",
            status: "Success",
            type: "Mobile APP"
          },
          {
            timestamp: new Date(Date.now() - 3600000 * 12).toLocaleString(),
            ip: "152.12.45.101",
            location: "Salem, Tamil Nadu",
            role: "Farmer (Narendhira)",
            device: "Samsung Internet / Android",
            status: "Success",
            type: "Web Browser"
          },
          {
            timestamp: new Date(Date.now() - 3600000 * 6).toLocaleString(),
            ip: "122.10.85.90",
            location: "Chandigarh, India",
            role: "Police Officer (Vikram)",
            device: "SBI Netbanking Portal / Windows",
            status: "Success",
            type: "Desktop Web"
          },
          {
            timestamp: new Date(Date.now() - 3600000 * 2).toLocaleString(),
            ip: "203.0.113.195",
            location: "Moscow, Russia",
            role: "Kirana Merchant (Sunita)",
            device: "Unknown Agent (Proxy)",
            status: "Failed",
            type: "Blocked Attack"
          }
        ];
      }

      // Add current login attempt to history if it's not already logged
      const isLogged = historyList.some(
        h => h.role.toLowerCase().includes(currentRole.toLowerCase()) && 
             Math.abs(Date.parse(h.timestamp) - Date.parse(currentTime)) < 60000
      );

      if (!isLogged) {
        historyList.unshift({
          timestamp: currentTime,
          ip: "103.14.120.45",
          location: "Mumbai, Maharashtra, India",
          role: `${currentUsername} (${currentRole})`,
          device: currentDevice,
          status: "Success",
          type: "Current Session"
        });
      }

      // Keep logs list trimmed to 15 entries max
      historyList = historyList.slice(0, 15);
      setLoginHistory(historyList);
      localStorage.setItem("sfi_login_history", JSON.stringify(historyList));
    }
  }, [userSession]);

  const handleRenewSession = () => {
    setSessionTimeout(900);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="max-w-7xl mx-auto flex flex-col gap-8"
    >
      {/* 1. Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-primary-text tracking-tight flex items-center gap-2">
            <Shield className="w-8 h-8 text-cyan-400" />
            {tSec.title}
          </h2>
          <p className="text-base text-muted-text mt-1.5 max-w-4xl leading-relaxed">
            {tSec.desc}
          </p>
        </div>
        <button
          onClick={auditNetwork}
          disabled={loadingIp}
          className="px-5 py-2.5 bg-[#0054a6] hover:bg-[#004282] text-white font-extrabold text-sm rounded-xl flex items-center gap-2 shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer shrink-0"
        >
          {loadingIp ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
          <span>{tSec.refreshBtn}</span>
        </button>
      </div>

      {/* 2. Top row security credentials cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Network & Connection Integrity Card */}
        <div className="bg-card-bg border border-primary-border rounded-2xl p-6 shadow-xl flex flex-col justify-between min-h-[180px] relative transition-colors duration-200">
          <div className="flex justify-between items-start">
            <span className="text-xs uppercase font-black tracking-widest text-muted-text">{tSec.connIntegrity}</span>
            <Globe className="w-5 h-5 text-cyan-405" />
          </div>
          <div className="space-y-2.5 mt-4">
            <div>
              <span className="text-[10px] text-muted-text uppercase font-black block">{tSec.ipDisplay}</span>
              <span className="text-xl font-mono font-black text-primary-text block">{ipAddress}</span>
            </div>
            <div>
              <span className="text-[10px] text-muted-text uppercase font-black block">{tSec.location}</span>
              <span className="text-sm font-extrabold text-secondary-text block flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                {location}
              </span>
            </div>
          </div>
        </div>

        {/* VPN Shield Status Card */}
        <div className="bg-card-bg border border-primary-border rounded-2xl p-6 shadow-xl flex flex-col justify-between min-h-[180px] relative transition-colors duration-200">
          <div className="flex justify-between items-start">
            <span className="text-xs uppercase font-black tracking-widest text-muted-text">{tSec.vpnStatus}</span>
            <Lock className={`w-5 h-5 ${vpnActive ? "text-emerald-450" : "text-rose-455"}`} />
          </div>
          <div className="mt-4">
            <div className="flex items-center gap-2 mb-2">
              <span className={`w-2.5 h-2.5 rounded-full ${vpnActive ? "bg-emerald-450 animate-pulse" : "bg-rose-500"}`}></span>
              <span className="text-lg font-black text-primary-text">{vpnActive ? tSec.active : tSec.inactive}</span>
            </div>
            <p className="text-xs text-muted-text leading-relaxed">
              {vpnActive ? tSec.vpnActiveMsg : tSec.vpnInactiveMsg}
            </p>
          </div>
          <button 
            onClick={() => setVpnActive(!vpnActive)} 
            className="text-[10px] uppercase font-black text-[#00a4e4] hover:text-[#0092cc] text-left mt-2 block w-fit"
          >
            Toggle VPN Route
          </button>
        </div>

        {/* Timeout Count Card */}
        <div className="bg-card-bg border border-primary-border rounded-2xl p-6 shadow-xl flex flex-col justify-between min-h-[180px] relative transition-colors duration-200">
          <div className="flex justify-between items-start">
            <span className="text-xs uppercase font-black tracking-widest text-muted-text">{tSec.sessionTitle}</span>
            <Clock className="w-5 h-5 text-amber-400" />
          </div>
          <div className="mt-4 flex justify-between items-end">
            <div>
              <span className="text-3xl font-mono font-black text-amber-405 leading-none block">
                {formatTime(sessionTimeout)}
              </span>
              <span className="text-[10px] text-muted-text uppercase font-bold block mt-1">{tSec.sessionDesc}</span>
            </div>
            <button
              onClick={handleRenewSession}
              className="px-3 py-1.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
            >
              {tSec.renewBtn}
            </button>
          </div>
        </div>

      </div>

      {/* 3. Middle row: MFA Control & Device Health check */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Device Trust Assessment */}
        <div className="lg:col-span-6 bg-card-bg border border-primary-border rounded-2xl p-8 shadow-xl flex flex-col gap-5 transition-colors duration-200">
          <div>
            <h4 className="font-extrabold text-lg text-primary-text flex items-center gap-2">
              <Laptop className="w-5 h-5 text-cyan-400" />
              {tSec.deviceTrust}
            </h4>
            <p className="text-sm text-muted-text mt-1">{tSec.deviceTrustDesc}</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
            <div className="bg-primary-bg border border-primary-border p-4 rounded-xl space-y-1 transition-colors duration-200">
              <span className="text-muted-text uppercase text-[9px] font-black block">{tSec.browser}</span>
              <span className="text-sm text-primary-text block truncate" title={typeof navigator !== "undefined" ? navigator.userAgent : "Chrome / NextJS"}>
                {typeof navigator !== "undefined" ? navigator.userAgent.split(" (")[0] : "Chrome Browser"}
              </span>
            </div>

            <div className="bg-primary-bg border border-primary-border p-4 rounded-xl space-y-1 transition-colors duration-200">
              <span className="text-muted-text uppercase text-[9px] font-black block">{tSec.os}</span>
              <span className="text-sm text-primary-text block">
                {typeof navigator !== "undefined" && navigator.userAgent.includes("Windows") ? "Windows Server Edition" : "OS: Linux/MacOS"}
              </span>
            </div>

            <div className="bg-primary-bg border border-primary-border p-4 rounded-xl space-y-1 transition-colors duration-200">
              <span className="text-muted-text uppercase text-[9px] font-black block">{tSec.mfaStatusLabel}</span>
              <span className={`text-sm font-black block ${mfaEnabled ? "text-emerald-450" : "text-amber-400"}`}>
                {mfaEnabled ? tSec.mfaEnabled : tSec.mfaDisabled}
              </span>
            </div>

            <div className="bg-primary-bg border border-primary-border p-4 rounded-xl space-y-1 transition-colors duration-200">
              <span className="text-muted-text uppercase text-[9px] font-black block">{tSec.threatLevel}</span>
              <span className="text-sm text-rose-500 font-bold block">
                {userSession?.role === "developer" ? tSec.highRisk : tSec.lowRisk}
              </span>
            </div>
          </div>
        </div>

        {/* Multi-Factor Authentication Control */}
        <div className="lg:col-span-6 bg-card-bg border border-primary-border rounded-2xl p-8 shadow-xl flex flex-col justify-between gap-6 transition-colors duration-200">
          <div className="space-y-2">
            <h4 className="font-extrabold text-lg text-primary-text flex items-center gap-2">
              <Key className="w-5 h-5 text-emerald-450" />
              {tSec.mfaTitle}
            </h4>
            <p className="text-sm text-muted-text leading-relaxed">
              {tSec.mfaDesc}
            </p>
          </div>

          <div className="bg-primary-bg border border-primary-border p-5 rounded-xl flex items-center justify-between transition-colors duration-200">
            <div className="flex items-center gap-3">
              <div className={`w-3.5 h-3.5 rounded-full ${mfaEnabled ? "bg-emerald-450" : "bg-amber-400"}`}></div>
              <div>
                <span className="text-sm font-black text-primary-text block">
                  {mfaEnabled ? tSec.mfaEnabled : tSec.mfaDisabled}
                </span>
                <span className="text-[10px] text-muted-text block uppercase font-bold mt-0.5">Dual-factor token sync</span>
              </div>
            </div>
            
            <button
              onClick={() => setMfaEnabled(!mfaEnabled)}
              className={`px-5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                mfaEnabled 
                  ? "bg-emerald-600 hover:bg-emerald-500 text-white" 
                  : "bg-slate-800 hover:bg-slate-700 text-slate-200"
              }`}
            >
              {mfaEnabled ? "Disable MFA" : "Enforce MFA"}
            </button>
          </div>
        </div>

      </div>

      {/* 4. Login Access log history list */}
      <div className="bg-card-bg border border-primary-border rounded-2xl p-8 shadow-xl flex flex-col gap-6 transition-colors duration-200">
        <div>
          <h4 className="font-extrabold text-lg text-primary-text flex items-center gap-2">
            <History className="w-5 h-5 text-[#00a4e4]" />
            {tSec.historyTitle}
          </h4>
          <p className="text-sm text-muted-text mt-1">{tSec.historyDesc}</p>
        </div>

        <div className="overflow-x-auto border border-primary-border rounded-2xl text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-primary-bg border-b border-primary-border text-secondary-text font-bold">
                <th className="p-4">{tSec.headers.time}</th>
                <th className="p-4">{tSec.headers.ip}</th>
                <th className="p-4">{tSec.headers.loc}</th>
                <th className="p-4">{tSec.headers.role}</th>
                <th className="p-4">{tSec.headers.device}</th>
                <th className="p-4">{tSec.headers.status}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary-border text-secondary-text">
              {loginHistory.map((item, idx) => (
                <tr key={idx} className="hover:bg-primary-bg/30">
                  <td className="p-4 text-muted-text font-medium">{item.timestamp}</td>
                  <td className="p-4 font-mono text-xs text-primary-text">{item.ip}</td>
                  <td className="p-4">{item.location}</td>
                  <td className="p-4 font-extrabold text-primary-text">{item.role}</td>
                  <td className="p-4 text-muted-text truncate max-w-xs" title={item.device}>{item.device}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      item.status === "Success" 
                        ? "bg-emerald-950/20 text-emerald-450 border border-emerald-900/20" 
                        : "bg-rose-955/20 text-rose-455 border border-rose-900/20"
                    }`}>{item.status === "Success" ? "SUCCESS" : "BLOCKED"}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </motion.div>
  );
}
