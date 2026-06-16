"use client";

import React, { useEffect, useRef } from "react";
import { useSFIA } from "../context";
import { translations } from "../translations";
import { Send, RefreshCw, Share2 } from "lucide-react";
import { motion } from "framer-motion";

export default function WhatsAppSimulatorPage() {
  const {
    selectedCustomerId,
    waMessages,
    waInput,
    setWaInput,
    waPhone,
    setWaPhone,
    isWaSending,
    waLogs,
    handleSendWhatsAppSimulate,
    fetchWhatsAppLogs,
    language
  } = useSFIA();

  const t = translations[language];
  const waChatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetchWhatsAppLogs();
  }, []);

  useEffect(() => {
    if (waChatEndRef.current) {
      waChatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [waMessages]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      
      {/* Mobile Mockup */}
      <div className="lg:col-span-2 flex justify-center">
        <div className="w-full max-w-[340px] h-[580px] bg-[#0c141a] rounded-[36px] border-[8px] border-slate-700 shadow-2xl flex flex-col overflow-hidden relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-5 bg-slate-800 rounded-b-xl z-20 flex items-center justify-center">
            <div className="w-12 h-1 bg-slate-900 rounded-full"></div>
          </div>
          
          <div className="bg-[#075e54] text-white pt-7 pb-3 px-4 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3 mt-1">
              <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center font-bold text-sm text-emerald-300">P</div>
              <div>
                <h4 className="font-extrabold text-sm">{t.whatsapp.botName}</h4>
                <span className="text-xs text-emerald-250 block">{t.whatsapp.online}</span>
              </div>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping mt-1"></span>
          </div>

          <div className="flex-1 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat p-4 overflow-y-auto flex flex-col gap-3">
            {waMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`p-3 rounded-xl max-w-[85%] text-xs leading-relaxed relative ${
                  msg.sender === "user" ? "bg-[#d9fdd3] text-slate-800 rounded-tr-none" : "bg-[#1f2c34] text-slate-200 rounded-tl-none border border-slate-800"
                }`}>
                  <p className="whitespace-pre-wrap font-semibold">{msg.text}</p>
                  <span className="text-[9px] text-slate-400 block text-right mt-1.5">{msg.time}</span>
                </div>
              </div>
            ))}
            <div ref={waChatEndRef}></div>
          </div>

          <div className="bg-slate-900/80 p-3 border-t border-slate-800 flex flex-wrap gap-2 justify-center">
            <button onClick={() => handleSendWhatsAppSimulate("Can you give me one year bank statement")} className="text-xs bg-[#1f2c34] hover:bg-[#075e54] hover:text-white px-3 py-1.5 rounded-full border border-slate-700 text-slate-200 transition-all font-bold cursor-pointer">{t.whatsapp.statementBtn}</button>
            <button onClick={() => handleSendWhatsAppSimulate("Apply for a personal loan")} className="text-xs bg-[#1f2c34] hover:bg-[#075e54] hover:text-white px-3 py-1.5 rounded-full border border-slate-700 text-slate-200 transition-all font-bold cursor-pointer">{t.whatsapp.loanBtn}</button>
            <button onClick={() => handleSendWhatsAppSimulate("Check entitlements")} className="text-xs bg-[#1f2c34] hover:bg-[#075e54] hover:text-white px-3 py-1.5 rounded-full border border-slate-700 text-slate-200 transition-all font-bold cursor-pointer">{t.whatsapp.entitlementsBtn}</button>
          </div>

          <div className="bg-[#1f2c34] p-3 flex items-center gap-2 border-t border-slate-800">
            <input 
              type="text" 
              placeholder={t.whatsapp.typingPlaceholder} 
              disabled={isWaSending} 
              value={waInput} 
              onChange={(e) => setWaInput(e.target.value)} 
              className="flex-1 bg-[#2a3942] rounded-xl px-3.5 py-2 text-xs text-white outline-none" 
            />
            <button 
              onClick={() => handleSendWhatsAppSimulate()} 
              disabled={isWaSending} 
              className="w-9 h-9 rounded-full bg-[#00a884] hover:bg-[#008f72] flex items-center justify-center text-white shrink-0 cursor-pointer"
            >
              {isWaSending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 fill-white pl-0.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Meta API Console */}
      <div className="lg:col-span-3 bg-card-bg border border-primary-border rounded-2xl p-8 shadow-xl flex flex-col gap-6 transition-colors duration-200">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="font-extrabold text-lg text-primary-text flex items-center gap-2"><Share2 className="w-5 h-5 text-cyan-400" /> {t.whatsapp.consoleTitle}</h4>
            <p className="text-sm text-muted-text mt-1">{t.whatsapp.consoleDesc}</p>
          </div>
          <button 
            onClick={fetchWhatsAppLogs}
            className="p-2 hover:bg-card-hover-bg border border-primary-border rounded-lg text-secondary-text transition-all cursor-pointer"
            title="Refresh Logs"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-primary-bg/50 border border-primary-border p-4 rounded-xl flex flex-col md:flex-row items-center gap-4 transition-colors duration-200">
          <div className="flex-1 w-full">
            <label className="text-xs uppercase font-black text-muted-text block mb-1.5">{t.whatsapp.targetPhone}</label>
            <input 
              type="text" 
              value={waPhone} 
              onChange={(e) => setWaPhone(e.target.value)} 
              className="w-full bg-card-bg border border-primary-border focus:border-cyan-500 rounded-lg px-3 py-2 text-sm text-primary-text outline-none transition-colors duration-200" 
            />
          </div>
          <div className="flex-1 w-full text-sm text-muted-text leading-relaxed">
            💡 {t.whatsapp.tipMsg.replace("target phone number", waPhone)}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto max-h-[340px] border border-primary-border rounded-xl p-4 flex flex-col gap-4 font-mono text-xs transition-colors duration-200">
          {waLogs.length === 0 ? (
            <div className="text-muted-text italic text-center p-10">{t.whatsapp.emptyLogs}</div>
          ) : (
            waLogs.map((log, idx) => (
              <div key={idx} className={`border rounded-xl p-4 ${
                log.direction === "INCOMING" 
                  ? "bg-primary-bg/40 border-primary-border" 
                  : log.status === "SUCCESS" 
                  ? "bg-emerald-950/20 border-emerald-900/20 text-emerald-450" 
                  : "bg-rose-955/20 border-rose-900/20 text-rose-455"
              }`}>
                <div className="flex justify-between items-center border-b border-primary-border pb-2 mb-3">
                  <span className={`font-black ${log.direction === "INCOMING" ? "text-cyan-400" : "text-emerald-400"}`}>{log.direction === "INCOMING" ? t.whatsapp.payloadHeader : "OUTGOING"}</span>
                  <span className="text-muted-text text-xs">{log.timestamp}</span>
                </div>
                <pre className="text-xs text-primary-text overflow-x-auto whitespace-pre-wrap max-h-40">{JSON.stringify(log.payload || { message: log.message, phone: log.phone }, null, 2)}</pre>
                {log.response && (
                  <div className="border-t border-primary-border pt-2 mt-3">
                    <span className="text-xs text-muted-text block mb-1 uppercase font-bold">{t.whatsapp.apiResponseCode}</span>
                    <pre className="text-xs text-secondary-text overflow-x-auto max-h-28">{JSON.stringify(log.response, null, 2)}</pre>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
}
