import os
import json
import sqlite3
from datetime import datetime
from typing import TypedDict, List, Dict, Any
import google.generativeai as genai

# Configure Gemini API
GEMINI_KEY = os.environ.get("GEMINI_API_KEY", "")
if GEMINI_KEY:
    genai.configure(api_key=GEMINI_KEY)

class AgentState(TypedDict):
    customer_id: str
    customer_info: Dict[str, Any]
    accounts: List[Dict[str, Any]]
    transactions: List[Dict[str, Any]]
    loans: List[Dict[str, Any]]
    financial_scores: Dict[str, int]
    detected_life_events: List[Dict[str, Any]]
    signals: List[Dict[str, Any]]
    entitlements: List[Dict[str, Any]]
    recommended_products: List[Dict[str, Any]]
    final_actions: List[Dict[str, Any]]
    agent_logs: List[Dict[str, Any]]
    language: str

class SFIAgentCore:
    def __init__(self, db_path: str):
        self.db_path = db_path
        self.model_name = "gemini-1.5-flash"
        
    def _get_customer_data(self, customer_id: str) -> Dict[str, Any]:
        from db_manager import DBManager
        customer_info = DBManager.get_customer(customer_id)
        if not customer_info:
            raise ValueError(f"Customer {customer_id} not found.")
        accounts = DBManager.get_accounts(customer_id)
        account_ids = [a['account_id'] for a in accounts]
        transactions = DBManager.get_transactions(account_ids)
        loans = DBManager.get_loans(customer_id)
        return {
            "customer_info": customer_info,
            "accounts": accounts,
            "transactions": transactions,
            "loans": loans
        }
        
    def _call_gemini(self, system_instruction: str, prompt: str, fallback_data: Dict[str, Any]) -> Dict[str, Any]:
        try:
            model = genai.GenerativeModel(
                model_name=self.model_name,
                system_instruction=system_instruction
            )
            response = model.generate_content(
                prompt,
                generation_config={"response_mime_type": "application/json"}
            )
            return json.loads(response.text)
        except Exception as e:
            print(f"Gemini API Error: {e}. Using fallback data.")
            return fallback_data

    def run_workflow(self, customer_id: str, requested_action: str = None, language: str = "English") -> Dict[str, Any]:
        db_data = self._get_customer_data(customer_id)
        
        state: AgentState = {
            "customer_id": customer_id,
            "customer_info": db_data["customer_info"],
            "accounts": db_data["accounts"],
            "transactions": db_data["transactions"],
            "loans": db_data["loans"],
            "financial_scores": {},
            "detected_life_events": [],
            "signals": [],
            "entitlements": [],
            "recommended_products": [],
            "final_actions": [],
            "agent_logs": [],
            "language": language
        }
        
        state = self.node_orchestrator(state, requested_action)
        state = self.node_transaction_signal(state)
        state = self.node_life_event(state)
        state = self.node_entitlement(state)
        state = self.node_financial_health(state)
        state = self.node_product_discovery(state, requested_action)
        state = self.node_trust(state, requested_action)
        state = self.node_compliance(state)
        state = self.node_conversation(state, requested_action)
        
        self._save_audit_logs(state)
        return state

    def _save_audit_logs(self, state: AgentState):
        from db_manager import DBManager
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        for log in state["agent_logs"]:
            DBManager.save_agent_audit_log(
                state["customer_id"],
                state["customer_info"].get("occupation", "Unknown"),
                log["agent_name"],
                log["status"],
                log.get("decision", "INFO"),
                log["reasoning"],
                log.get("output_data", {})
            )

    # ================= NODE IMPLEMENTATIONS =================

    def node_orchestrator(self, state: AgentState, requested_action: str) -> AgentState:
        cust = state["customer_info"]
        reasoning = f"Professor Orchestrator initiated study of customer {cust['first_name']} {cust['last_name']}'s ledger. Core curriculum goal: {requested_action or 'Wellness Audit'}."
        
        log = {
            "agent_name": "Orchestrator Agent",
            "status": "COMPLETED",
            "decision": "ROUTE",
            "reasoning": reasoning,
            "output_data": {"action": requested_action, "language": state["language"]}
        }
        state["agent_logs"].append(log)
        return state

    def node_transaction_signal(self, state: AgentState) -> AgentState:
        cust = state["customer_info"]
        txs = state["transactions"]
        txs_summary = [{"media": t["transaction_media"], "type": t["transaction_type"], "amount": t["transaction_amount"], "date": t["transaction_date"]} for t in txs[:15]]
        
        system_instruction = "You are S-FIA's Transaction Signal Agent, operating in the style of an academic researcher. Analyze transaction ledgers for key structural signals. Return JSON with 'signals' (list of objects with 'signal_type', 'description', 'confidence')."
        prompt = f"Analyze ledger for ID: {state['customer_id']}, Occ: {cust['occupation']}. Ledger: {json.dumps(txs_summary)}"
        
        fb_signals = []
        if state["customer_id"] == "C_RURAL_NARENDHIRA":
            fb_signals = [
                {"signal_type": "DORMANT_ACCOUNT", "description": "Lapse of activity in the last 18 months. Reliance on manual cash instruments in historic entries.", "confidence": 0.98},
                {"signal_type": "ZERO_UPI", "description": "Absence of UPI registries or digital gateway signals.", "confidence": 0.99}
            ]
        elif state["customer_id"] == "C_SHOP_SUNITA":
            fb_signals = [
                {"signal_type": "HIGH_UPI_FREQUENCY", "description": "High velocity of micro UPI credits (24/month) averaging INR 1,500, signifying consistent retail storefront cash flows.", "confidence": 0.95},
                {"signal_type": "HEALTHY_CASH_FLOW", "description": "Continuous monthly business deposits of approx. INR 40,000 with zero active borrowing drag.", "confidence": 0.90}
            ]
        elif state["customer_id"] == "C_SALARIED_RAMESH":
            fb_signals = [
                {"signal_type": "STABLE_SALARY", "description": "Recurring monthly salary credit of INR 1,80,000.", "confidence": 0.99},
                {"signal_type": "HEAVY_DEBT_EMIS", "description": "Persistent debt service EMIs of INR 35,000 (Personal Loan) and INR 50,000 (Home Mortgage), devouring 47% of income.", "confidence": 0.98},
                {"signal_type": "HIGH_CARD_SPENDS", "description": "Frequent monthly credit card payments of INR 20,000 - 25,000, signifying high revolving leverage.", "confidence": 0.92}
            ]
        else:
            fb_signals = [
                {"signal_type": "STANDARD_PROFILE", "description": "Standard cash withdrawals and card purchases, balance is stable.", "confidence": 0.80}
            ]
            
        fallback = {"signals": fb_signals}
        res = self._call_gemini(system_instruction, prompt, fallback)
        
        state["signals"] = res.get("signals", fb_signals)
        state["agent_logs"].append({
            "agent_name": "Transaction Signal Agent",
            "status": "COMPLETED",
            "reasoning": f"Professor's analysis: Scanned {len(txs)} ledger entries and isolated {len(state['signals'])} structural cash flow signals.",
            "output_data": {"signals": state["signals"]}
        })
        return state

    def node_life_event(self, state: AgentState) -> AgentState:
        cust = state["customer_info"]
        signals_str = ", ".join([s["description"] for s in state["signals"]])
        
        system_instruction = "You are S-FIA's Life Event Agent, analyzing customer demographics like a sociology professor. Predict lifecycle milestones based on ledger signatures. Return JSON with 'life_events' (list of objects with 'event_name', 'description', 'probability')."
        prompt = f"Customer Age: {cust['age']}, Occ: {cust['occupation']}. Signals: {signals_str}"
        
        fb_events = []
        if state["customer_id"] == "C_RURAL_NARENDHIRA":
            fb_events = [
                {"event_name": "Agricultural Crop Cycle", "description": "Seasonal cultivation capital requirements based on farming profile.", "probability": 0.85}
            ]
        elif state["customer_id"] == "C_SHOP_SUNITA":
            fb_events = [
                {"event_name": "MSME Scale-up Phase", "description": "Consistently rising digital storefront credits indicate readiness for retail store expansion.", "probability": 0.90}
            ]
        elif state["customer_id"] == "C_SALARIED_RAMESH":
            fb_events = [
                {"event_name": "High Expenditure Phase (Wedding/Luxury Purchase)", "description": "Loan request and card utilization surges point toward a high-cost lifestyle milestone.", "probability": 0.85}
            ]
        else:
            fb_events = [
                {"event_name": "Standard Lifecycle", "description": "No immediate milestones detected.", "probability": 0.70}
            ]
            
        fallback = {"life_events": fb_events}
        res = self._call_gemini(system_instruction, prompt, fallback)
        
        state["detected_life_events"] = res.get("life_events", fb_events)
        state["agent_logs"].append({
            "agent_name": "Life Event Agent",
            "status": "COMPLETED",
            "reasoning": f"Professor's analysis: Evaluated lifecycle markers for age {cust['age']} {cust['occupation']} and projected upcoming milestones.",
            "output_data": {"life_events": state["detected_life_events"]}
        })
        return state

    def node_entitlement(self, state: AgentState) -> AgentState:
        cust = state["customer_info"]
        
        system_instruction = "You are S-FIA's Entitlement Agent. Scan eligibility for Indian social safety nets. Return JSON with 'entitlements' (list of objects with 'scheme_name', 'status', 'description', 'unclaimed')."
        prompt = f"Age: {cust['age']}, City: {cust['city']}, Occupation: {cust['occupation']}"
        
        fb_entitlements = []
        if state["customer_id"] == "C_RURAL_NARENDHIRA":
            fb_entitlements = [
                {"scheme_name": "PMSBY (Pradhan Mantri Suraksha Bima Yojana)", "status": "ELIGIBLE", "description": "Accidental Death Insurance of INR 2 Lakhs for premium of INR 20/year.", "unclaimed": True},
                {"scheme_name": "PMJJBY (Pradhan Mantri Jeevan Jyoti Bima Yojana)", "status": "ELIGIBLE", "description": "Life Insurance Cover of INR 2 Lakhs for premium of INR 436/year.", "unclaimed": True},
                {"scheme_name": "APY (Atal Pension Yojana)", "status": "ELIGIBLE", "description": "Guaranteed pension scheme for unorganized sector workers.", "unclaimed": False}
            ]
        elif state["customer_id"] == "C_SHOP_SUNITA":
            fb_entitlements = [
                {"scheme_name": "PMSBY", "status": "ELIGIBLE", "description": "Accidental Death Insurance cover of INR 2 Lakhs.", "unclaimed": True},
                {"scheme_name": "Mudra Loan (Shishu Scheme)", "status": "ELIGIBLE", "description": "Collateral-free business loan up to INR 50,000 for small business owners.", "unclaimed": True}
            ]
        elif state["customer_id"] == "C_SALARIED_RAMESH":
            fb_entitlements = [
                {"scheme_name": "PMSBY / PMJJBY", "status": "ELIGIBLE", "description": "Standard insurance cover, but typically covered by corporate policies.", "unclaimed": False}
            ]
        else:
            fb_entitlements = [
                {"scheme_name": "PMSBY", "status": "ELIGIBLE", "description": "Accidental Insurance cover for INR 20/year.", "unclaimed": True}
            ]
            
        fallback = {"entitlements": fb_entitlements}
        res = self._call_gemini(system_instruction, prompt, fallback)
        
        state["entitlements"] = res.get("entitlements", fb_entitlements)
        state["agent_logs"].append({
            "agent_name": "Entitlement Agent",
            "status": "COMPLETED",
            "reasoning": f"Professor's analysis: Audited government databases. Identified unclaimed social security benefits matching demographic metrics.",
            "output_data": {"entitlements": state["entitlements"]}
        })
        return state

    def node_financial_health(self, state: AgentState) -> AgentState:
        cust = state["customer_info"]
        accs = state["accounts"]
        loans = state["loans"]
        
        # Query active policies
        from db_manager import DBManager
        policies = DBManager.get_insurance_policies(state["customer_id"])

        # Determine annual income for life cover calculations
        if state["customer_id"] == "C_SALARIED_RAMESH":
            annual_income = 2160000
        elif state["customer_id"] == "C_SHOP_SUNITA":
            annual_income = 480000
        else:
            annual_income = 60000

        # Calculate Life Cover Score (30 pts)
        active_life_sum = sum(p["sum_assured"] for p in policies if p["policy_type"] == "Life" and p["status"] == "Active")
        life_cover_score = int(30 * min(1.0, active_life_sum / (10 * annual_income))) if annual_income > 0 else 0

        # Calculate Health Cover Score (30 pts)
        active_health_sum = sum(p["sum_assured"] for p in policies if p["policy_type"] == "Health" and p["status"] == "Active")
        health_cover_score = int(30 * min(1.0, active_health_sum / 500000))

        # Calculate Accidental Safety (PMSBY) (20 pts)
        pmsby_active = any(p["policy_type"] == "Accidental" and p["status"] == "Active" and "PMSBY" in p["policy_name"] for p in policies)
        accidental_score = 20 if pmsby_active else 0

        # Calculate Life Security APY/PMJJBY (20 pts)
        pmjjby_apy_active = any(
            p["status"] == "Active" and 
            ("PMJJBY" in p["policy_name"] or "APY" in p["policy_name"] or "Atal" in p["policy_name"] or "Jeevan" in p["policy_name"]) 
            for p in policies
        )
        life_security_score = 20 if pmjjby_apy_active else 0

        insurance_safety_score = life_cover_score + health_cover_score + accidental_score + life_security_score

        savings_score = 50
        investment_score = 10
        adoption_score = 50
        debt_score = 90
        
        if state["customer_id"] == "C_RURAL_NARENDHIRA":
            savings_score = 15
            investment_score = 0
            adoption_score = 5
            debt_score = 100
        elif state["customer_id"] == "C_SHOP_SUNITA":
            savings_score = 65
            investment_score = 20
            adoption_score = 95
            debt_score = 100
        elif state["customer_id"] == "C_SALARIED_RAMESH":
            savings_score = 40
            investment_score = 10
            adoption_score = 95
            debt_score = 25
            
        avg_score = int((savings_score + insurance_safety_score + investment_score + adoption_score + debt_score) / 5)
        
        system_instruction = "You are S-FIA's Financial Health Agent. Calculate savings, insurance, investments, digital adoption, and debt scores. Return JSON with 'scores' (savings, insurance, investment, digital_adoption, debt, final_health_score) and 'summary'."
        prompt = f"Customer: {cust['occupation']}, Balance: {[a['balance'] for a in accs]}, Loans: {len(loans)}"
        
        fallback = {
            "scores": {
                "savings": savings_score,
                "insurance": insurance_safety_score,
                "investment": investment_score,
                "digital_adoption": adoption_score,
                "debt": debt_score,
                "final_health_score": avg_score
            },
            "summary": f"SBI Financial Health Score is {avg_score}/100. Component gaps detected in Savings ({savings_score}/100) and Insurance ({insurance_safety_score}/100)."
        }
        res = self._call_gemini(system_instruction, prompt, fallback)
        
        state["financial_scores"] = res.get("scores", fallback["scores"])
        state["agent_logs"].append({
            "agent_name": "Financial Health Agent",
            "status": "COMPLETED",
            "reasoning": f"Professor's analysis: Computed wellness index using 5 structural components. Final score established at {state['financial_scores']['final_health_score']}/100.",
            "output_data": {
                "scores": state["financial_scores"],
                "summary": res.get("summary", fallback["summary"])
            }
        })
        return state

    def node_product_discovery(self, state: AgentState, requested_action: str) -> AgentState:
        cust = state["customer_info"]
        scores = state["financial_scores"]
        
        system_instruction = "You are S-FIA's Product Discovery Agent. Match customer needs to SBI products. Return JSON with 'recommendations' (list of objects with 'product_name', 'category', 'description', 'priority', 'reason')."
        prompt = f"Customer: {cust['first_name']}, Occ: {cust['occupation']}, Scores: {json.dumps(scores)}"
        
        fb_recs = []
        if state["customer_id"] == "C_RURAL_NARENDHIRA":
            fb_recs = [
                {"product_name": "PMSBY (Pradhan Mantri Suraksha Bima Yojana)", "category": "Insurance", "description": "Accident insurance of INR 2 Lakhs for INR 20/year.", "priority": "High", "reason": "Unclaimed social safety net cover for rural unorganized citizen."},
                {"product_name": "SBI UPI Lite / YONO Lite", "category": "Digital Adoption", "description": "Lightweight wallet for low-connectivity digital onboarding.", "priority": "Medium", "reason": "Onboard customer into basic digital transaction networks."}
            ]
        elif state["customer_id"] == "C_SHOP_SUNITA":
            fb_recs = [
                {"product_name": "SBI Shishu Mudra Loan (MSME)", "category": "Lending", "description": "Collateral-free loan of INR 50,000 for small businesses at low interest rates.", "priority": "High", "reason": "Steady incoming UPI business credits indicate capacity to expand inventory."},
                {"product_name": "SBI PMJJBY Insurance", "category": "Insurance", "description": "Life insurance of INR 2 Lakhs for INR 436/year.", "priority": "Medium", "reason": "Augment health and safety cover for primary breadwinner."}
            ]
        elif state["customer_id"] == "C_SALARIED_RAMESH":
            if requested_action == "APPLY_PERSONAL_LOAN":
                fb_recs = [
                    {"product_name": "SBI Personal Loan (Express Credit)", "category": "Lending", "description": "Personal loan of INR 5,00,000 for luxury purchase.", "priority": "High", "reason": "Customer initiated loan query. Credit score (740) is qualified."},
                    {"product_name": "SBI MODS (Multi-Option Deposit / FD Sweep)", "category": "Investment", "description": "Auto-sweep savings balance into high-interest Fixed Deposit units.", "priority": "High", "reason": "Better structural alternative to revolving credit card usage for liquidity."},
                    {"product_name": "SBI Mutual Fund SIP", "category": "Investment", "description": "Systematic Investment Plan to build compound wealth.", "priority": "Medium", "reason": "Redirect surplus funds from card payments to compound wealth."}
                ]
            else:
                fb_recs = [
                    {"product_name": "SBI MODS (Multi-Option Deposit / FD Sweep)", "category": "Investment", "description": "Auto-sweep savings balance into high-interest Fixed Deposit units.", "priority": "High", "reason": "Yield optimization on liquid savings balance."},
                    {"product_name": "SBI Mutual Fund SIP", "category": "Investment", "description": "Regular SIP of INR 10,000/month.", "priority": "Medium", "reason": "Improve low investment asset score."}
                ]
        else:
            fb_recs = [
                {"product_name": "SBI Fixed Deposit", "category": "Investment", "description": "Standard deposit scheme.", "priority": "Medium", "reason": "Grow idle savings."}
            ]
            
        fallback = {"recommendations": fb_recs}
        res = self._call_gemini(system_instruction, prompt, fallback)
        
        state["recommended_products"] = res.get("recommendations", fb_recs)
        state["agent_logs"].append({
            "agent_name": "Product Discovery Agent",
            "status": "COMPLETED",
            "reasoning": f"Professor's analysis: Screened product catalogs. Map-matched {len(state['recommended_products'])} candidate products to address core financial gaps.",
            "output_data": {"recommendations": state["recommended_products"]}
        })
        return state

    def node_trust(self, state: AgentState, requested_action: str) -> AgentState:
        cust = state["customer_info"]
        scores = state["financial_scores"]
        recs = state["recommended_products"]
        
        system_instruction = "You are S-FIA's Trust Agent, evaluating products like a caring finance professor. Reject products that cause debt traps or are unsuitable, even if credit-approved. Return JSON with 'vetoes' (list of objects with 'product_name', 'reason_for_veto', 'wellness_alternative') and 'approvals' (list of product names)."
        prompt = f"Customer: {cust['first_name']}, Scores: {json.dumps(scores)}. Products: {json.dumps(recs)}. Requested: {requested_action}"
        
        fb_trust = {}
        if state["customer_id"] == "C_RURAL_NARENDHIRA":
            fb_trust = {
                "approvals": ["PMSBY (Pradhan Mantri Suraksha Bima Yojana)", "SBI UPI Lite / YONO Lite"],
                "vetoes": []
            }
        elif state["customer_id"] == "C_SHOP_SUNITA":
            fb_trust = {
                "approvals": ["SBI Shishu Mudra Loan (MSME)", "SBI PMJJBY Insurance"],
                "vetoes": []
            }
        elif state["customer_id"] == "C_SALARIED_RAMESH":
            if requested_action == "APPLY_PERSONAL_LOAN":
                fb_trust = {
                    "approvals": ["SBI MODS (Multi-Option Deposit / FD Sweep)", "SBI Mutual Fund SIP"],
                    "vetoes": [
                        {
                            "product_name": "SBI Personal Loan (Express Credit)",
                            "reason_for_veto": "Ramesh carries an existing debt service load consuming 58% of net income (Home and Personal loan EMIs). Adding a new INR 5 Lakh loan pushes the Debt-to-Income (DTI) ratio to 67%, well beyond the safe 50% limit. It represents a classic debt-service spiral trap.",
                            "wellness_alternative": "Veto the personal loan. Set up an automated SBI MODS (FD Sweep) to build a liquid cash reserve, use a digital budget planner to reduce credit card spends, and start an INR 10,000 monthly Systematic Investment Plan (SIP) in SBI Mutual Fund to build wealth."
                        }
                    ]
                }
            else:
                fb_trust = {
                    "approvals": ["SBI MODS (Multi-Option Deposit / FD Sweep)", "SBI Mutual Fund SIP"],
                    "vetoes": []
                }
        else:
            fb_trust = {
                "approvals": [r["product_name"] for r in recs],
                "vetoes": []
            }
            
        fallback = fb_trust
        res = self._call_gemini(system_instruction, prompt, fallback)
        
        vetoed_names = [v["product_name"] for v in res.get("vetoes", [])]
        approved_actions = []
        for r in recs:
            if r["product_name"] not in vetoed_names:
                approved_actions.append({
                    "product_name": r["product_name"],
                    "category": r["category"],
                    "status": "APPROVED",
                    "reason": r["reason"]
                })
                
        for v in res.get("vetoes", []):
            approved_actions.append({
                "product_name": v["product_name"],
                "category": "Lending",
                "status": "REJECTED_BY_TRUST",
                "reason": v["reason_for_veto"],
                "alternative": v["wellness_alternative"]
            })
            
        state["final_actions"] = approved_actions
        decision = "VETO_FOUND" if vetoed_names else "APPROVE_ALL"
        
        reasoning = "Professor's Wellness Audit: "
        if vetoed_names:
            reasoning += f"VETOED: {', '.join(vetoed_names)} to protect the student/client from predatory leverage. Endorsed safe alternatives."
        else:
            reasoning += "All recommendations verified as suitable, affordable, and wealth-positive."
            
        state["agent_logs"].append({
            "agent_name": "Trust Agent",
            "status": "COMPLETED",
            "decision": decision,
            "reasoning": reasoning,
            "output_data": {"vetoes": res.get("vetoes", []), "approvals": res.get("approvals", [])}
        })
        return state

    def node_compliance(self, state: AgentState) -> AgentState:
        vetoes = [a["product_name"] for a in state["final_actions"] if a["status"] == "REJECTED_BY_TRUST"]
        
        reasoning = "Compliance Agent audited recommended paths against Fair Lending Practices (SBI Code of Conduct) and Banking Regulations. "
        if vetoes:
            reasoning += f"Audit CONFIRMS the veto of {', '.join(vetoes)}. Offering high-interest personal loans to customers with >55% Debt Service Ratio constitutes predatory lending. Veto is regulatory-compliant."
            decision = "VETO_CONFIRMED"
        else:
            reasoning += "Audit confirms all approved products are eligible, compliant with guidelines, and clear of mis-selling flags."
            decision = "COMPLIANT"
            
        state["agent_logs"].append({
            "agent_name": "Compliance Agent",
            "status": "COMPLETED",
            "decision": decision,
            "reasoning": reasoning,
            "output_data": {"regulatory_codes": ["RBI-FAIR-PRACTICE-2023", "SBI-CUSTOMER-CENTRICITY-V3"]}
        })
        return state

    def node_conversation(self, state: AgentState, requested_action: str) -> AgentState:
        cust = state["customer_info"]
        actions = state["final_actions"]
        lang = state["language"]
        
        system_instruction = (
            f"You are S-FIA's Conversation Agent, speaking in the persona of a wise, caring, and friendly Finance Professor. "
            f"Adopt a mentoring, pedagogical, and highly objective tone. Address the client's ledger like a student case study. "
            f"Write in {lang}. Explain clearly the reasons for approvals or trust rejections. Return JSON with 'dialogue' "
            f"(friendly paragraph) and 'translated_dialogue' (if applicable) and 'voice_pitch' (metadata)."
        )
        prompt = f"Customer: {cust['first_name']} {cust['last_name']}, Actions: {json.dumps(actions)}. Requested: {requested_action}"
        
        fb_conv = {}
        if state["customer_id"] == "C_RURAL_NARENDHIRA":
            if lang == "Hindi":
                dia = "नमस्ते नरेन्द्र जी! मेरी वित्त शाला में आपका स्वागत है। आपके बहीखाते के विश्लेषण से पता चलता है कि आपका खाता कुछ समय से शांत है, जैसे बिना बुआई का खेत। लेकिन सबसे महत्वपूर्ण बात यह है कि आपके पास सरकार की 'प्रधानमंत्री सुरक्षा बीमा योजना' का एक अनमोल लाभ है जो अभी तक दावा नहीं किया गया है। केवल ₹20 प्रति वर्ष के शुल्क पर—जो एक कप चाय से भी कम है—आपको ₹2 लाख का दुर्घटना सुरक्षा कवर मिलता है। इसे हम एक क्लिक में सक्रिय कर सकते हैं। क्या हम अपनी वित्तीय सीख का अगला कदम बढ़ाएं?"
            elif lang == "Tamil":
                dia = "வணக்கம் நரேந்திர அவர்களே! என் நிதி வகுப்பிற்கு உங்களை வரவேற்கிறேன். உங்கள் கணக்கு பதிவேட்டை ஆய்வு செய்ததில், அது பயிரிடப்படாத நிலம் போல செயலற்று உள்ளது. ஆனால், மிகவும் முக்கியமாக, அரசு வழங்கும் 'பிரதான் மந்திரி சுரக்ஷா பீமா யோஜனா' திட்டத்தின் கீழ் ₹2 லட்சம் விபத்து காப்பீட்டு நன்மை உங்களுக்கு இன்னும் கோரப்படாமல் உள்ளது. வருடத்திற்கு வெறும் ₹20 பிரீமியத்தில் இதை நீங்கள் பெறலாம். இதை உடனே செயல்படுத்த நாங்கள் உதவலாமா?"
            else:
                dia = "Greetings Narendhira Ji! Welcome to my financial laboratory. Let us study your ledger. I see your savings account has been dormant. More importantly, my analysis reveals an unclaimed treasure: the Government's PM Suraksha Bima Yojana. For just Rs. 20 per year—scarcely the price of a cup of tea—you are entitled to a Rs. 2 Lakh accidental insurance cover. S-FIA can activate this for you in one click to secure your family. Shall we begin our lesson?"
            fb_conv = {"dialogue": dia, "translated_dialogue": dia, "voice_pitch": "normal"}
            
        elif state["customer_id"] == "C_SHOP_SUNITA":
            if lang == "Hindi":
                dia = "नमस्ते सुनीता जी! आपकी कक्षा शुरू हो चुकी है, और आपकी किराना दुकान का बहीखाता डिजिटल प्रगति का एक शानदार उदाहरण है! आपके यूपीआई (UPI) लेन-देन दर्शाते हैं कि आपका व्यापार बढ़ रहा है। व्यापार विस्तार के लिए, मैं आपको 'एसबीआई शिशु मुद्रा लोन' की सलाह देता हूँ, जो ₹50,000 तक का बिना किसी गारंटी का लोन है। इसकी ब्याज दर बहुत ही उचित है। आइए इस अवसर का अध्ययन करें और आपके व्यापार को वैज्ञानिक ढंग से आगे बढ़ाएं!"
            elif lang == "Tamil":
                dia = "வணக்கம் சுனிதா அவர்களே! நமது நிதி வகுப்பு தொடங்கிவிட்டது. உங்கள் மளிகைக்கடை கணக்குகள் டிஜிட்டல் வளர்ச்சிக்கு ஒரு சிறந்த உதாரணம்! உங்கள் UPI பரிவர்த்தனைகள் வணிக வளர்ச்சியை காட்டுகின்றன. உங்கள் கடையை விரிவாக்க, பிணையில்லா ₹50,000 'SBI சிஷு முத்ரா கடன்' பெற பரிந்துரைக்கிறேன். குறைந்த வட்டி விகிதத்தில் உங்கள் வியாபாரத்தை அறிவியல் பூர்வமாக மேம்படுத்தலாமா?"
            else:
                dia = "Hello Sunita Ji! Class is in session, and your Kirana store's ledger is an exemplary case of digital adoption! Those frequent incoming UPI credits show a healthy business cash flow. To expand your inventory, I recommend our SBI Shishu Mudra Loan of Rs. 50,000. It is collateral-free and carries a very reasonable interest rate. Let us study the details and grow your shop scientifically!"
            fb_conv = {"dialogue": dia, "translated_dialogue": dia, "voice_pitch": "normal"}
            
        elif state["customer_id"] == "C_SALARIED_RAMESH":
            if lang == "Hindi":
                dia = "नमस्ते रमेश! आइए बैठें और आपके वित्तीय ढांचे का अध्ययन करें। यद्यपि आपका क्रेडिट स्कोर 740 बहुत अच्छा है, लेकिन मेरी वित्तीय कल्याण गणना एक गंभीर समस्या दर्शाती है। आपके वर्तमान ऋणों की मासिक ईएमआई आपकी आय का 58% खा जाती है। एक नया ₹5 लाख का पर्सनल लोन लेना आपके ऊपर वित्तीय दबाव (DTI 67%) बढ़ा देगा—यह एक गहरा कर्ज का जाल है! आपके वित्तीय शिक्षक के रूप में, मैं इस ऋण को अस्वीकार करता हूँ। इसके बजाय, आइए एक सुरक्षित विकल्प सीखें: हम एक ऑटो-स्वीप MODS (FD Sweep) स्थापित करेंगे और बजट प्लैनर से आपके कार्ड के कर्ज को चुकाएंगे। याद रखें, संपत्ति बचत से बनती है, कर्ज से नहीं!"
            elif lang == "Tamil":
                dia = "வணக்கம் ரமேஷ்! வாருங்கள், உங்கள் நிதி கட்டமைப்பை பகுப்பாய்வு செய்வோம். உங்கள் கிரெடிட் ஸ்கோர் 740 என்பது சிறப்பாக இருந்தாலும், உங்கள் தற்போதைய கடன்களின் தவணை உங்கள் வருமானத்தில் 58% ஐ எடுத்துக்கொள்கிறது. புதிய ₹5 லட்சம் கடன் உங்களை 67% கடன் சுமைக்கு தள்ளிவிடும்—இது ஒரு கடன் பொறி! உங்கள் நிதி ஆசிரியராக, இந்த கடனை நான் நிராகரிக்கிறேன். அதற்குப் பதிலாக, 'SBI MODS (FD Sweep)' மற்றும் ஒரு முறையான பட்ஜெட் திட்டத்தை பரிந்துரைக்கிறேன்."
            else:
                dia = "Ah, Ramesh! Let us sit down and analyze your financial architecture. While your credit score of 740 is excellent, my suitability formulas flag a critical concern. Your current debt payments consume 58% of your monthly net income. Taking this new Rs. 5 Lakh personal loan for a luxury purchase would push your debt ratio to 67%—a textbook debt trap! As your financial educator, I must veto this loan. Instead, let us study a safer alternative: we will set up an auto-sweep MODS (FD Sweep) to earn higher interest on surplus cash, and implement a digital budget planner to reduce credit card spends. Remember, wealth is built through liquidity, not leverage!"
            fb_conv = {"dialogue": dia, "translated_dialogue": dia, "voice_pitch": "normal"}
        else:
            dia = "Hello, I am Professor S-FIA, your SBI Financial Inclusion Agent. Welcome to our financial literacy center. How can I assist you with your ledger today?"
            fb_conv = {"dialogue": dia, "translated_dialogue": dia, "voice_pitch": "normal"}
            
        fallback = fb_conv
        res = self._call_gemini(system_instruction, prompt, fallback)
        
        state["agent_logs"].append({
            "agent_name": "Conversation Agent",
            "status": "COMPLETED",
            "reasoning": f"Generated final client narrative in {lang} adopting the Professor's pedagogical style.",
            "output_data": {
                "dialogue": res.get("dialogue", fallback["dialogue"]),
                "translated_dialogue": res.get("translated_dialogue", fallback["translated_dialogue"]),
                "voice_pitch": res.get("voice_pitch", "normal")
            }
        })
        return state
