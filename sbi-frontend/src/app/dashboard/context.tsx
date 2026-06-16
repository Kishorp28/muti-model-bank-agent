"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";

// Interfaces
export interface Customer {
  customer_id: string;
  first_name: string;
  last_name: string;
  occupation: string;
  city: string;
  age: number;
  gender: string;
}

export interface CustomerDetails {
  customer_info: {
    customer_id: string;
    first_name: string;
    last_name: string;
    city: string;
    phone_number: string;
    occupation: string;
    dob: string;
    age: number;
    gender: string;
    email: string;
  };
  accounts: Array<{
    account_id: string;
    account_type: string;
    balance: number;
    account_status: string;
    account_open_date: string;
  }>;
  transactions: Array<{
    transaction_id: string;
    transaction_date: string;
    transaction_media: string;
    transaction_type: string;
    transaction_amount: number;
  }>;
  loans: Array<{
    loan_id: string;
    loan_amount: number;
    loan_type: string;
    interest_rate: number;
    loan_term: number;
    status: string;
    monthly_emi: number;
  }>;
  summary: {
    total_balance: number;
    account_count: number;
    loan_count: number;
    transaction_count: number;
  };
}

export interface AgentLog {
  agent_name: string;
  status: string;
  decision?: string;
  reasoning: string;
  output_data?: any;
}

export interface RunResult {
  financial_scores: {
    savings: number;
    insurance: number;
    investment: number;
    digital_adoption: number;
    debt: number;
    final_health_score: number;
  };
  detected_life_events: Array<{
    event_name: string;
    description: string;
    probability: number;
  }>;
  signals: Array<{
    signal_type: string;
    description: string;
    confidence: number;
  }>;
  entitlements: Array<{
    scheme_name: string;
    status: string;
    description: string;
    unclaimed: boolean;
  }>;
  recommended_products: Array<{
    product_name: string;
    category: string;
    description: string;
    priority: string;
    reason: string;
  }>;
  final_actions: Array<{
    product_name: string;
    category: string;
    status: string;
    reason: string;
    alternative?: string;
  }>;
  agent_logs: Array<AgentLog>;
  response_text: string;
  translated_response_text: string;
}

export interface WhatsAppLog {
  timestamp: string;
  direction: "INCOMING" | "OUTGOING";
  phone?: string;
  message?: string;
  payload?: any;
  status: string;
  response?: any;
}

export interface UserSession {
  username: string;
  role: "farmer" | "police" | "merchant" | "salaried" | "developer";
  customerId?: string;
}

interface SFIAContextType {
  customers: Customer[];
  selectedCustomerId: string;
  setSelectedCustomerId: (id: string) => void;
  customerDetails: CustomerDetails | null;
  isAuditing: boolean;
  activeNode: string | null;
  auditResult: RunResult | null;
  language: "English" | "Hindi" | "Tamil";
  setLanguage: (lang: "English" | "Hindi" | "Tamil") => void;
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  fontScale: number;
  setFontScale: (scale: number) => void;
  chatMessages: Array<{ sender: "user" | "bot"; text: string; recommendedAction?: string }>;
  setChatMessages: React.Dispatch<React.SetStateAction<Array<{ sender: "user" | "bot"; text: string; recommendedAction?: string }>>>;
  inputValue: string;
  setInputValue: (val: string) => void;
  isVoiceActive: boolean;
  setIsVoiceActive: (val: boolean) => void;
  isAudioReading: boolean;
  executingAction: string | null;
  actionNotice: string | null;
  complianceLogs: any[];
  waMessages: Array<{ sender: "user" | "bot"; text: string; time: string }>;
  setWaMessages: React.Dispatch<React.SetStateAction<Array<{ sender: "user" | "bot"; text: string; time: string }>>>;
  waInput: string;
  setWaInput: (val: string) => void;
  waPhone: string;
  setWaPhone: (val: string) => void;
  isWaSending: boolean;
  waLogs: WhatsAppLog[];
  runAgentAudit: () => Promise<void>;
  handleSendMessage: (e?: React.FormEvent, customText?: string) => Promise<void>;
  handleSendWhatsAppSimulate: (customMessage?: string) => Promise<void>;
  executeSimulatedAction: (actionType: string) => Promise<void>;
  speakText: (text: string) => void;
  stopAudio: () => void;
  toggleVoice: () => void;
  fetchCustomerDetails: (id: string) => Promise<void>;
  fetchComplianceLogs: () => Promise<void>;
  fetchWhatsAppLogs: () => Promise<void>;
  userSession: UserSession | null;
  login: (username: string, pass: string) => Promise<boolean>;
  logout: () => void;
}

const SFIAContext = createContext<SFIAContextType | undefined>(undefined);

export function SFIAProvider({ children }: { children: React.ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("C_RURAL_NARENDHIRA");
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [auditResult, setAuditResult] = useState<RunResult | null>(null);
  const [language, setLanguage] = useState<"English" | "Hindi" | "Tamil">("English");
  const [theme, setThemeState] = useState<"light" | "dark">("dark");
  const [fontScale, setFontScaleState] = useState<number>(1.0);
  
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "user" | "bot"; text: string; recommendedAction?: string }>>([]);
  const [inputValue, setInputValue] = useState("");
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isAudioReading, setIsAudioReading] = useState(false);
  
  const [executingAction, setExecutingAction] = useState<string | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [complianceLogs, setComplianceLogs] = useState<any[]>([]);

  const [waMessages, setWaMessages] = useState<Array<{ sender: "user" | "bot"; text: string; time: string }>>([]);
  const [waInput, setWaInput] = useState("");
  const [waPhone, setWaPhone] = useState("916382703591");
  const [isWaSending, setIsWaSending] = useState(false);
  const [waLogs, setWaLogs] = useState<WhatsAppLog[]>([]);

  const [userSession, setUserSession] = useState<UserSession | null>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      synthRef.current = window.speechSynthesis;
    }
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("sfi_user_session");
      if (stored) {
        try {
          const sess = JSON.parse(stored);
          setUserSession(sess);
          if (sess.customerId) {
            setSelectedCustomerId(sess.customerId);
          }
        } catch (e) {
          console.error("Failed to parse stored session", e);
        }
      }
      const storedTheme = localStorage.getItem("sfi_theme") as "light" | "dark";
      if (storedTheme) {
        setThemeState(storedTheme);
      }
      const storedScale = localStorage.getItem("sfi_font_scale");
      if (storedScale) {
        setFontScaleState(parseFloat(storedScale));
      }
    }
    fetchCustomers();
    fetchComplianceLogs();
    fetchWhatsAppLogs();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const root = document.documentElement;
      if (theme === "light") {
        root.classList.add("light-theme");
      } else {
        root.classList.remove("light-theme");
      }
      localStorage.setItem("sfi_theme", theme);
    }
  }, [theme]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const root = document.documentElement;
      root.style.setProperty("--font-scale-factor", fontScale.toString());
      localStorage.setItem("sfi_font_scale", fontScale.toString());
    }
  }, [fontScale]);

  const setTheme = (t: "light" | "dark") => setThemeState(t);
  const setFontScale = (s: number) => setFontScaleState(s);

  const changeSelectedCustomerId = (id: string) => {
    if (userSession && userSession.role !== "developer") {
      // Locked to user profile
      return;
    }
    setSelectedCustomerId(id);
  };

  const login = async (username: string, pass: string): Promise<boolean> => {
    const u = username.toLowerCase().trim();
    const p = pass.trim();
    if (p !== "sbi") return false;

    let sess: UserSession | null = null;
    if (u === "farmer") {
      sess = { username: "Narendhira modi", role: "farmer", customerId: "C_RURAL_NARENDHIRA" };
    } else if (u === "police") {
      sess = { username: "Vikram Singh", role: "police", customerId: "C_POLICE_VIKRAM" };
    } else if (u === "merchant") {
      sess = { username: "Sunita Devi", role: "merchant", customerId: "C_SHOP_SUNITA" };
    } else if (u === "salaried") {
      sess = { username: "Ramesh Patel", role: "salaried", customerId: "C_SALARIED_RAMESH" };
    } else if (u === "developer") {
      sess = { username: "System Developer", role: "developer" };
    }

    if (sess) {
      setUserSession(sess);
      if (typeof window !== "undefined") {
        localStorage.setItem("sfi_user_session", JSON.stringify(sess));
      }
      if (sess.customerId) {
        setSelectedCustomerId(sess.customerId);
      } else {
        setSelectedCustomerId("C_RURAL_NARENDHIRA"); // Default for developer
      }
      return true;
    }
    return false;
  };

  const logout = () => {
    setUserSession(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("sfi_user_session");
    }
    setSelectedCustomerId("C_RURAL_NARENDHIRA");
  };

  useEffect(() => {
    if (selectedCustomerId) {
      fetchCustomerDetails(selectedCustomerId);
      setAuditResult(null);
      resetChat(selectedCustomerId);
      resetWhatsAppMockChat(selectedCustomerId);
      stopAudio();
    }
  }, [selectedCustomerId]);

  const fetchCustomers = async () => {
    try {
      const res = await fetch(`${API_BASE}/customers`);
      if (res.ok) {
        const data = await res.json();
        setCustomers(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCustomerDetails = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/customers/${id}`);
      if (res.ok) {
        const data = await res.json();
        setCustomerDetails(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchComplianceLogs = async () => {
    try {
      const res = await fetch(`${API_BASE}/compliance/logs`);
      if (res.ok) {
        const data = await res.json();
        setComplianceLogs(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchWhatsAppLogs = async () => {
    try {
      const res = await fetch(`${API_BASE}/whatsapp/logs`);
      if (res.ok) {
        const data = await res.json();
        setWaLogs(data.reverse());
      }
    } catch (err) {
      console.error(err);
    }
  };

  const resetChat = (id: string) => {
    let welcome = "";
    if (id === "C_RURAL_NARENDHIRA") {
      welcome = "Greetings Narendhira Ji! Welcome to my financial laboratory. I see your savings account has been dormant. More importantly, my analysis reveals an unclaimed treasure: the Government's PM Suraksha Bima Yojana (PMSBY). S-FIA can help you activate this accident cover of Rs. 2 Lakhs for just Rs. 20/year. Shall we begin our lesson?";
    } else if (id === "C_SHOP_SUNITA") {
      welcome = "Hello Sunita Ji! Class is in session, and your Kirana store's ledger is a fantastic example of digital adoption! Since your UPI storefront deposits are consistent, I recommend checking our collateral-free SBI Shishu Mudra Loan (Rs. 50,000) to expand your stock. Would you like to study the details?";
    } else if (id === "C_SALARIED_RAMESH") {
      welcome = "Ah, Ramesh! Let us sit down and study your financial architecture. While your credit score of 740 is excellent, my suitability formulas flag that your monthly EMIs consume 58% of your income. Taking a new Rs. 5 Lakh personal loan would push you to 67%—a textbook debt trap! As your financial educator, I highly recommend looking at safer MODS FD sweep alternatives instead. Let us study why.";
    } else {
      welcome = "Welcome, seeker of knowledge! I am Professor S-FIA, your SBI Financial Inclusion Agent. Let us review your balances and study your financial well-being today.";
    }
    setChatMessages([{ sender: "bot", text: welcome }]);
  };

  const resetWhatsAppMockChat = (id: string) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let botMsg = "";
    if (id === "C_RURAL_NARENDHIRA") {
      botMsg = "Namaste Narendhira Ji. I am Professor S-FIA. I found an unclaimed accident insurance cover (PMSBY) for Rs. 20/year on your account. Respond 'ACTIVATE' to enable this safety cover.";
    } else if (id === "C_SHOP_SUNITA") {
      botMsg = "Hello Sunita Ji. Your storefront UPI cashflows are excellent! I recommend our collateral-free SBI Shishu Mudra Loan (Rs. 50,000) to buy new stock. Let me know if you want to proceed.";
    } else {
      botMsg = "Greetings Ramesh. I am Professor S-FIA. Your current EMIs consume 58% of your income. A new personal loan creates a debt trap. Ask me for 'statement' or 'loan' to review safe alternatives.";
    }
    setWaMessages([
      { sender: "bot", text: botMsg, time: time }
    ]);
  };

  const runAgentAudit = async () => {
    if (isAuditing || !selectedCustomerId) return;
    setIsAuditing(true);
    setAuditResult(null);
    stopAudio();

    const nodes = [
      "Orchestrator Agent",
      "Transaction Signal Agent",
      "Life Event Agent",
      "Entitlement Agent",
      "Financial Health Agent",
      "Product Discovery Agent",
      "Trust Agent",
      "Compliance Agent",
      "Conversation Agent"
    ];

    for (let i = 0; i < nodes.length; i++) {
      setActiveNode(nodes[i]);
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    try {
      const requestedAction = selectedCustomerId === "C_SALARIED_RAMESH" ? "APPLY_PERSONAL_LOAN" : null;
      
      const res = await fetch(`${API_BASE}/agents/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_id: selectedCustomerId,
          requested_action: requestedAction,
          language: language
        })
      });

      if (res.ok) {
        const data = await res.json();
        setAuditResult(data);
        const botResponse = language === "English" ? data.response_text : data.translated_response_text;
        setChatMessages(prev => [...prev, { sender: "bot", text: botResponse }]);
        if (isVoiceActive) speakText(botResponse);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAuditing(false);
      setActiveNode(null);
      fetchCustomerDetails(selectedCustomerId);
      fetchComplianceLogs();
    }
  };

  const handleSendMessage = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    
    const userMsg = customText !== undefined ? customText : inputValue;
    if (!userMsg.trim() || isAuditing) return;

    setChatMessages(prev => [...prev, { sender: "user", text: userMsg }]);
    if (customText === undefined) {
      setInputValue("");
    }
    stopAudio();

    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_id: selectedCustomerId,
          message: userMsg,
          language: language
        })
      });

      if (res.ok) {
        const data = await res.json();
        setChatMessages(prev => [...prev, { 
          sender: "bot", 
          text: data.reply, 
          recommendedAction: data.recommended_action 
        }]);
        if (isVoiceActive || customText !== undefined) {
          speakText(data.reply);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendWhatsAppSimulate = async (customMessage?: string) => {
    const textToSend = customMessage || waInput;
    if (!textToSend.trim() || isWaSending) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setWaMessages(prev => [...prev, { sender: "user", text: textToSend, time }]);
    if (!customMessage) setWaInput("");
    setIsWaSending(true);

    try {
      const res = await fetch(`${API_BASE}/whatsapp/simulate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          phone: waPhone,
          customer_id: selectedCustomerId
        })
      });

      if (res.ok) {
        const data = await res.json();
        const waResult = data.result;
        
        setTimeout(() => {
          setWaMessages(prev => [...prev, { 
            sender: "bot", 
            text: waResult.reply_text, 
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
          }]);
        }, 1200);

        fetchWhatsAppLogs();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsWaSending(false);
    }
  };

  const executeSimulatedAction = async (actionType: string) => {
    if (executingAction || !selectedCustomerId) return;
    setExecutingAction(actionType);
    setActionNotice(null);
    stopAudio();

    try {
      const res = await fetch(`${API_BASE}/action/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_id: selectedCustomerId,
          action_type: actionType
        })
      });

      if (res.ok) {
        const data = await res.json();
        setActionNotice(data.message);
        await fetchCustomerDetails(selectedCustomerId);
        await fetchComplianceLogs();
        
        setChatMessages(prev => [...prev, { 
          sender: "bot", 
          text: `[Sandbox Core Banking Transaction: SUCCESS] ${data.message}` 
        }]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setExecutingAction(null);
      setTimeout(() => setActionNotice(null), 8000);
    }
  };

  const speakText = (text: string) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();

    const cleanText = text.replace(/\[.*?\]/g, "").replace(/\*+/g, "").replace(/Rs\./g, "rupees").replace(/INR/g, "rupees");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    if (language === "Hindi") utterance.lang = "hi-IN";
    else if (language === "Tamil") utterance.lang = "ta-IN";
    else utterance.lang = "en-IN";

    utterance.rate = 0.95;
    utterance.pitch = 0.95;

    utterance.onstart = () => setIsAudioReading(true);
    utterance.onend = () => setIsAudioReading(false);
    utterance.onerror = () => setIsAudioReading(false);

    utteranceRef.current = utterance;
    synthRef.current.speak(utterance);
  };

  const stopAudio = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsAudioReading(false);
    }
  };

  const toggleVoice = () => {
    const nextVal = !isVoiceActive;
    setIsVoiceActive(nextVal);
    if (!nextVal) {
      stopAudio();
    } else if (chatMessages.length > 0) {
      const lastMsg = chatMessages[chatMessages.length - 1];
      if (lastMsg.sender === "bot") speakText(lastMsg.text);
    }
  };

  return (
    <SFIAContext.Provider value={{
      customers,
      selectedCustomerId,
      setSelectedCustomerId: changeSelectedCustomerId,
      customerDetails,
      isAuditing,
      activeNode,
      auditResult,
      language,
      setLanguage,
      theme,
      setTheme,
      fontScale,
      setFontScale,
      chatMessages,
      setChatMessages,
      inputValue,
      setInputValue,
      isVoiceActive,
      setIsVoiceActive,
      isAudioReading,
      executingAction,
      actionNotice,
      complianceLogs,
      waMessages,
      setWaMessages,
      waInput,
      setWaInput,
      waPhone,
      setWaPhone,
      isWaSending,
      waLogs,
      runAgentAudit,
      handleSendMessage,
      handleSendWhatsAppSimulate,
      executeSimulatedAction,
      speakText,
      stopAudio,
      toggleVoice,
      fetchCustomerDetails,
      fetchComplianceLogs,
      fetchWhatsAppLogs,
      userSession,
      login,
      logout
    }}>
      {children}
    </SFIAContext.Provider>
  );
}

export function useSFIA() {
  const context = useContext(SFIAContext);
  if (!context) {
    throw new Error("useSFIA must be used within an SFIAProvider");
  }
  return context;
}
