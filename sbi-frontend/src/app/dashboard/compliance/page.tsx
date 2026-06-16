"use client";

import React, { useEffect, useState } from "react";
import { useSFIA } from "../context";
import { translations } from "../translations";
import { ShieldCheck, ShieldAlert, CheckCircle2, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

export default function CompliancePage() {
  const { selectedCustomerId, auditResult, complianceLogs, fetchComplianceLogs, language } = useSFIA();
  const t = translations[language];

  useEffect(() => {
    fetchComplianceLogs();
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-8">
      
      {/* Vetoes and approvals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Approved products */}
        <div className="bg-card-bg border border-primary-border rounded-2xl p-8 shadow-xl flex flex-col gap-6 transition-colors duration-200">
          <h4 className="font-extrabold text-lg text-primary-text flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-450" /> {t.compliance.approvedTitle}
          </h4>
          {auditResult ? (
            <div className="flex flex-col gap-4">
              {auditResult.final_actions.filter(a => a.status === "APPROVED").length === 0 ? (
                <p className="text-sm text-muted-text italic">{t.compliance.emptyApproved}</p>
              ) : (
                auditResult.final_actions.filter(a => a.status === "APPROVED").map((act, idx) => (
                  <div key={idx} className="bg-emerald-950/10 border border-emerald-900/20 p-4 rounded-xl flex flex-col gap-1.5 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="font-extrabold text-emerald-405">{act.product_name}</span>
                      <span className="text-xs bg-emerald-900/20 text-emerald-400 px-2 py-0.5 rounded font-black uppercase tracking-wider">{act.category}</span>
                    </div>
                    <p className="text-secondary-text leading-relaxed">{act.reason}</p>
                  </div>
                ))
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-text italic">{t.compliance.unloadedAudit}</p>
          )}
        </div>

        {/* Vetoed products */}
        <div className="bg-card-bg border border-primary-border rounded-2xl p-8 shadow-xl flex flex-col gap-6 transition-colors duration-200">
          <h4 className="font-extrabold text-lg text-primary-text flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-500" /> {t.compliance.vetoedTitle}
          </h4>
          {auditResult ? (
            <div className="flex flex-col gap-4">
              {auditResult.final_actions.filter(a => a.status === "REJECTED_BY_TRUST").length === 0 ? (
                <div className="text-sm text-secondary-text bg-primary-bg/25 border border-primary-border p-4.5 rounded-xl flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-405" /> {t.compliance.zeroBlocked}
                </div>
              ) : (
                auditResult.final_actions.filter(a => a.status === "REJECTED_BY_TRUST").map((act, idx) => (
                  <div key={idx} className="bg-red-950/10 border border-red-900/20 p-4.5 rounded-xl flex flex-col gap-3 text-sm">
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="font-extrabold text-rose-455 text-base">{act.product_name}</span>
                        <span className="text-[10px] bg-red-950/30 text-rose-400 border border-red-900/20 px-2 py-0.5 rounded font-black uppercase">Blocked by Trust</span>
                      </div>
                      <p className="text-secondary-text leading-relaxed font-semibold mt-1.5">{act.reason}</p>
                    </div>
                    {act.alternative && (
                      <div className="border-t border-primary-border pt-3 bg-primary-bg/25 p-3 rounded-xl">
                        <span className="text-[10px] uppercase font-black text-cyan-400 block mb-1">{t.compliance.altLabel}</span>
                        <p className="text-sm text-secondary-text italic">"{act.alternative}"</p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-text italic">{t.compliance.unloadedAudit}</p>
          )}
        </div>

      </div>

      {/* Compliance Logs Table */}
      <div className="bg-card-bg border border-primary-border rounded-2xl p-8 shadow-xl flex flex-col gap-6 transition-colors duration-200">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="font-extrabold text-lg text-primary-text">{t.compliance.tableTitle}</h4>
            <p className="text-sm text-muted-text mt-1">{t.compliance.tableDesc}</p>
          </div>
          <button 
            onClick={fetchComplianceLogs}
            className="p-2 hover:bg-card-hover-bg border border-primary-border rounded-lg text-secondary-text transition-all cursor-pointer"
            title="Refresh Logs"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto border border-primary-border rounded-2xl text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-primary-bg border-b border-primary-border text-secondary-text font-bold">
                <th className="p-4">{t.compliance.tableHeaders.timestamp}</th>
                <th className="p-4">{t.compliance.tableHeaders.clientId}</th>
                <th className="p-4">{t.compliance.tableHeaders.agent}</th>
                <th className="p-4">{t.compliance.tableHeaders.decision}</th>
                <th className="p-4">{t.compliance.tableHeaders.reasoning}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary-border text-secondary-text">
              {complianceLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-5 text-center text-muted-text italic">
                    {t.compliance.emptyTable}
                  </td>
                </tr>
              ) : (
                complianceLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-primary-bg/30">
                    <td className="p-4 text-muted-text whitespace-nowrap">{log.timestamp}</td>
                    <td className="p-4 font-mono text-xs">{log.customer_id}</td>
                    <td className="p-4 font-black text-[#00a4e4]">{log.agent_name.replace(" Agent", "")}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-black ${
                        log.decision === "VETO_CONFIRMED" || log.decision === "VETO_FOUND"
                          ? "bg-red-950/20 text-rose-455 border border-red-900/20"
                          : log.decision === "EXECUTE"
                          ? "bg-indigo-950/20 text-indigo-400 border border-indigo-900/20"
                          : "bg-emerald-955/20 text-emerald-450 border border-emerald-900/20"
                      }`}>{log.decision}</span>
                    </td>
                    <td className="p-4 max-w-sm truncate" title={log.reasoning}>{log.reasoning}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </motion.div>
  );
}
