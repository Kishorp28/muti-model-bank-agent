"use client";

import React from "react";
import { useSFIA } from "../context";
import { translations } from "../translations";
import { Activity, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export default function DiscoveriesPage() {
  const { selectedCustomerId, auditResult, language } = useSFIA();
  const t = translations[language];

  const fallbackSignals = () => {
    if (selectedCustomerId === "C_RURAL_NARENDHIRA") {
      return [
        { signal_type: "DORMANT_ACCOUNT", description: "Lapse of activity in the last 18 months. Reliance on manual cash instruments in historic entries.", confidence: 0.98 },
        { signal_type: "ZERO_UPI", description: "Absence of UPI registries or digital gateway signals.", confidence: 0.99 }
      ];
    }
    if (selectedCustomerId === "C_SHOP_SUNITA") {
      return [
        { signal_type: "HIGH_UPI_FREQUENCY", description: "High velocity of micro UPI credits (24/month) averaging INR 1,500, signifying consistent retail storefront cash flows.", confidence: 0.95 },
        { signal_type: "HEALTHY_CASH_FLOW", description: "Continuous monthly business deposits of approx. INR 40,005 with zero active borrowing drag.", confidence: 0.90 }
      ];
    }
    return [
      { signal_type: "STABLE_SALARY", description: "Recurring monthly salary credit of INR 1,80,000.", confidence: 0.99 },
      { signal_type: "HEAVY_DEBT_EMIS", description: "Persistent debt service EMIs of INR 35,000 (Personal Loan) and INR 50,000 (Home Mortgage), devouring 47% of income.", confidence: 0.98 },
      { signal_type: "HIGH_CARD_SPENDS", description: "Frequent credit card payments of INR 20,000 - 25,000, signifying high revolving leverage.", confidence: 0.92 }
    ];
  };

  const fallbackEvents = () => {
    if (selectedCustomerId === "C_RURAL_NARENDHIRA") {
      return [
        { event_name: "Agricultural Crop Cycle", description: "Seasonal cultivation capital requirements based on farming profile.", probability: 0.85 }
      ];
    }
    if (selectedCustomerId === "C_SHOP_SUNITA") {
      return [
        { event_name: "MSME Scale-up Phase", description: "Consistently rising digital storefront credits indicate readiness for retail store expansion.", probability: 0.90 }
      ];
    }
    return [
      { event_name: "High Expenditure Phase (Wedding/Luxury Purchase)", description: "Loan request and card utilization surges point toward a high-cost lifestyle milestone.", probability: 0.85 }
    ];
  };

  const signals = auditResult?.signals || fallbackSignals();
  const lifeEvents = auditResult?.detected_life_events || fallbackEvents();

  const getSignalDescription = (signalType: string, defaultDesc: string) => {
    if (language === "Hindi") {
      switch (signalType) {
        case "DORMANT_ACCOUNT":
          return "पिछले 18 महीनों में गतिविधि में कमी। पुराने रिकॉर्ड्स में नकद लेनदेन पर निर्भरता।";
        case "ZERO_UPI":
          return "यूपीआई पंजीकरण या डिजिटल भुगतान गेटवे का अभाव।";
        case "HIGH_UPI_FREQUENCY":
          return "औसत ₹1,500 के सूक्ष्म यूपीआई जमा की उच्च आवृत्ति (24/माह), जो स्थिर खुदरा स्टोर आय दर्शाती है।";
        case "HEALTHY_CASH_FLOW":
          return "लगभग ₹40,005 का निरंतर मासिक व्यावसायिक जमा, जिसमें कोई सक्रिय ऋण नहीं है।";
        case "STABLE_SALARY":
          return "₹1,80,000 का नियमित मासिक वेतन क्रेडिट।";
        case "HEAVY_DEBT_EMIS":
          return "₹35,000 (व्यक्तिगत ऋण) और ₹50,000 (गृह ऋण) की मासिक ईएमआई भुगतान, जो आय का 47% हिस्सा खा जाती है।";
        case "HIGH_CARD_SPENDS":
          return "₹20,000 - ₹25,000 का बार-बार क्रेडिट कार्ड भुगतान, जो उच्च क्रेडिट उपयोग दर्शाता है।";
        default:
          return defaultDesc;
      }
    }
    if (language === "Tamil") {
      switch (signalType) {
        case "DORMANT_ACCOUNT":
          return "கடந்த 18 மாதங்களில் எந்த பரிவர்த்தனையும் இல்லை. வரலாற்றில் பணப் பரிவர்த்தனைகளை அதிகம் பயன்படுத்தியுள்ளார்.";
        case "ZERO_UPI":
          return "யுபிஐ அல்லது டிஜிட்டல் பரிவர்த்தனைகள் எதுவும் கணக்கில் இணைக்கப்படவில்லை.";
        case "HIGH_UPI_FREQUENCY":
          return "சராசரியாக ₹1,500 மதிப்புள்ள நுண் யுபிஐ பரிவர்த்தனைகள் (மாதத்திற்கு 24 முறை), இது கடை வருவாயின் ஸ்திரத்தன்மையைக் குறிக்கிறது.";
        case "HEALTHY_CASH_FLOW":
          return "செயலில் உள்ள கடன் சுமை இல்லாமல் மாதத்திற்கு சுமார் ₹40,050 வணிக வைப்புத் தொகை.";
        case "STABLE_SALARY":
          return "ஒவ்வொரு மாதமும் வழக்கமாக வரும் ₹1,80,000 சம்பள வைப்புத்தொகை.";
        case "HEAVY_DEBT_EMIS":
          return "மாதந்தோறும் ₹35,000 (தனிநபர் கடன்) மற்றும் ₹50,000 (வீட்டுக் கடன்) தவணை செலுத்துகிறார், இது வருமானத்தில் 47% ஐ விழுங்குகிறது.";
        case "HIGH_CARD_SPENDS":
          return "அடிக்கடி ₹20,000 - ₹25,000 கிரெடிட் கார்டு செலுத்துகிறார், இது அதிக கடன் சுமையைக் குறிக்கிறது.";
        default:
          return defaultDesc;
      }
    }
    return defaultDesc;
  };

  const getEventDescription = (eventName: string, defaultDesc: string) => {
    if (eventName === "Agricultural Crop Cycle") return t.insights.events.cropCycleDesc;
    if (eventName === "MSME Scale-up Phase") return t.insights.events.scaleUpDesc;
    if (eventName.startsWith("High Expenditure Phase")) return t.insights.events.highExpenditureDesc;
    return defaultDesc;
  };

  const getEventName = (eventName: string) => {
    if (eventName === "Agricultural Crop Cycle") return t.insights.events.cropCycleTitle;
    if (eventName === "MSME Scale-up Phase") return t.insights.events.scaleUpTitle;
    if (eventName.startsWith("High Expenditure Phase")) return t.insights.events.highExpenditureTitle;
    return eventName;
  };

  const getSignalTitle = (signalType: string) => {
    switch (signalType) {
      case "DORMANT_ACCOUNT":
        return t.insights.signals.dormant;
      case "ZERO_UPI":
        return t.insights.signals.zeroUpi;
      case "HIGH_UPI_FREQUENCY":
        return t.insights.signals.highUpi;
      case "HEALTHY_CASH_FLOW":
        return t.insights.signals.healthyCash;
      case "STABLE_SALARY":
        return t.insights.signals.stableSalary;
      case "HEAVY_DEBT_EMIS":
        return t.insights.signals.heavyDebt;
      case "HIGH_CARD_SPENDS":
        return t.insights.signals.highCard;
      default:
        return signalType.replace(/_/g, " ");
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-8">
      
      {/* Transaction Signals */}
      <div className="bg-card-bg border border-primary-border rounded-2xl p-8 shadow-xl flex flex-col gap-6 transition-colors duration-200">
        <div>
          <h4 className="font-extrabold text-lg text-primary-text flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            {t.insights.discoveriesTitle}
          </h4>
          <p className="text-sm text-muted-text mt-1 font-medium">{t.insights.discoveriesDesc}</p>
        </div>
        
        <div className="flex flex-col gap-4">
          {signals.map((sig, idx) => (
            <div key={idx} className="bg-primary-bg/40 border border-primary-border p-4.5 rounded-xl flex justify-between items-start gap-4 transition-colors duration-200">
              <div>
                <span className="text-xs font-black text-[#00a4e4] uppercase tracking-wider block mb-1">
                  {getSignalTitle(sig.signal_type)}
                </span>
                <p className="text-sm text-secondary-text leading-relaxed">
                  {getSignalDescription(sig.signal_type, sig.description)}
                </p>
              </div>
              <span className="px-3 py-1 text-xs bg-cyan-950/25 border border-cyan-800/30 text-cyan-400 rounded-lg font-bold shrink-0">
                {t.insights.confidence}: {Math.round(sig.confidence * 100)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Predicted Life Events */}
      <div className="bg-card-bg border border-primary-border rounded-2xl p-8 shadow-xl flex flex-col gap-6 transition-colors duration-200">
        <div>
          <h4 className="font-extrabold text-lg text-primary-text flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            {t.insights.lifecycleTitle}
          </h4>
          <p className="text-sm text-muted-text mt-1 font-medium">{t.insights.lifecycleDesc}</p>
        </div>

        <div className="flex flex-col gap-4">
          {lifeEvents.map((evt, idx) => (
            <div key={idx} className="bg-primary-bg/40 border border-primary-border p-4.5 rounded-xl flex justify-between items-start gap-4 transition-colors duration-200">
              <div>
                <span className="text-sm font-black text-emerald-450 block mb-1">
                  {getEventName(evt.event_name)}
                </span>
                <p className="text-sm text-secondary-text leading-relaxed">
                  {getEventDescription(evt.event_name, evt.description)}
                </p>
              </div>
              <span className="px-3 py-1 text-xs bg-emerald-950/25 border border-emerald-900/30 text-emerald-400 rounded-lg font-bold shrink-0">
                {t.insights.probability}: {Math.round(evt.probability * 100)}%
              </span>
            </div>
          ))}
        </div>
      </div>

    </motion.div>
  );
}
