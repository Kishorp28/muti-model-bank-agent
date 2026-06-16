"use client";

import React, { useState, useEffect } from "react";
import { useSFIA } from "../context";
import { translations } from "../translations";
import { 
  TrendingUp, Sparkles, AlertTriangle, RefreshCw, 
  HelpCircle, Info, Landmark, HelpCircle as HelpIcon, ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";

interface FundRecommendation {
  name: string;
  category: string;
  risk: string;
  returns3y: string;
  desc: string;
}

export default function InvestmentsPage() {
  const { selectedCustomerId, customerDetails, language, theme } = useSFIA();
  const t = translations[language];

  // Sliders states
  const [monthlySip, setMonthlySip] = useState<number>(2000);
  const [returnRate, setReturnRate] = useState<number>(12);
  const [years, setYears] = useState<number>(10);
  
  // Action state simulation
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [setupSuccess, setSetupSuccess] = useState(false);

  // Set default sliders based on profile when customer changes
  useEffect(() => {
    if (selectedCustomerId === "C_RURAL_NARENDHIRA") {
      setMonthlySip(1000);
      setReturnRate(8);
      setYears(5);
    } else if (selectedCustomerId === "C_POLICE_VIKRAM") {
      setMonthlySip(4000);
      setReturnRate(12);
      setYears(15);
    } else if (selectedCustomerId === "C_SHOP_SUNITA") {
      setMonthlySip(5000);
      setReturnRate(14);
      setYears(10);
    } else if (selectedCustomerId === "C_SALARIED_RAMESH") {
      setMonthlySip(10000);
      setReturnRate(13);
      setYears(12);
    } else {
      setMonthlySip(2000);
      setReturnRate(12);
      setYears(10);
    }
    setSetupSuccess(false);
  }, [selectedCustomerId]);

  const getProfileMeta = () => {
    if (language === "Hindi") {
      if (selectedCustomerId === "C_RURAL_NARENDHIRA") {
        return { risk: "रूढ़िवादी / कम जोखिम (Conservative)", label: "सुरक्षित ऋण और हाइब्रिड फंड", target: "सुरक्षित संपत्ति सृजन" };
      }
      if (selectedCustomerId === "C_SHOP_SUNITA") {
        return { risk: "मध्यम-आक्रामक / संतुलित (Moderate-Aggressive)", label: "विविध इक्विटी और मिडकैप फंड", target: "व्यवसाय विस्तार और पूंजी लाभ" };
      }
      if (selectedCustomerId === "C_SALARIED_RAMESH") {
        return { risk: "कर बचत और ऋण कटौती (ELSS / Dynamic)", label: "कर-बचत ईएलएसएस (Sec 80C) और इंडेक्स फंड", target: "ऋण जाल से मुक्ति और संपत्ति संचय" };
      }
      return { risk: "संतुलित / मध्यम जोखिम (Balanced)", label: "संतुलित एडवांटेज और लार्जकैप फंड", target: "सेवानिवृत्ति और शिक्षा निधि" };
    }

    if (language === "Tamil") {
      if (selectedCustomerId === "C_RURAL_NARENDHIRA") {
        return { risk: "பாதுகாப்பான / குறைந்த அபாயம் (Conservative)", label: "பாதுகாப்பான கடன் மற்றும் கலப்பின நிதி", target: "பாதுகாப்பான நிதிச் சொத்து குவிப்பு" };
      }
      if (selectedCustomerId === "C_SHOP_SUNITA") {
        return { risk: "நடுத்தர-அதிக அபாயம் / வளர்ச்சி (Moderate-Aggressive)", label: "பல்முகப்படுத்தப்பட்ட மியூச்சுவல் ஃபண்ட்", target: "வணிக விரிவாக்கம் மற்றும் சொத்து வளர்ச்சி" };
      }
      if (selectedCustomerId === "C_SALARIED_RAMESH") {
        return { risk: "வரிச் சேமிப்பு & கடன் மீட்பு (ELSS / Dynamic)", label: "வரி சேமிப்பு ELSS (பிரிவு 80C) மற்றும் குறியீட்டு நிதி", target: "கடன் சுமையிலிருந்து விடுபடுதல்" };
      }
      return { risk: "சமச்சீர் / நடுத்தர அபாயம் (Balanced)", label: "சமச்சீர் அட்வான்டேஜ் மற்றும் லார்ஜ்கேப் நிதி", target: "ஓய்வூதிய நிதி மற்றும் எதிர்காலப் பாதுகாப்பு" };
    }

    // English
    if (selectedCustomerId === "C_RURAL_NARENDHIRA") {
      return { risk: "Conservative / Low Risk", label: "Debt & Conservative Hybrid Pools", target: "Preserve principal capital and cover crop cycle inflation" };
    }
    if (selectedCustomerId === "C_SHOP_SUNITA") {
      return { risk: "Moderate-Aggressive / Growth", label: "Diversified Equity & Growth Midcaps", target: "Build Kirana shop expansion capital to fund future inventory" };
    }
    if (selectedCustomerId === "C_SALARIED_RAMESH") {
      return { risk: "Tax Saving & Debt Pruning", label: "Tax-Deductible ELSS (80C) & Safe Indexes", target: "Liquidate credit card leverage, lock tax credits, build core wealth" };
    }
    return { risk: "Balanced / Moderate", label: "Balanced Advantage & Large Cap Indexing", target: "Retirement reserve accumulation and family safety cover" };
  };

  const getRecommendedFunds = (): FundRecommendation[] => {
    if (language === "Hindi") {
      if (selectedCustomerId === "C_RURAL_NARENDHIRA") {
        return [
          { name: "एसबीआई कंज़र्वेटिव हाइब्रिड फंड", category: "हाइब्रिड (कम जोखिम)", returns3y: "8.9% p.a.", risk: "कम से मध्यम", desc: "यह योजना 75% सरकारी बॉन्ड और 25% सुरक्षित लार्ज-कैप शेयरों में निवेश करती है। ग्रामीण परिवारों के लिए आदर्श है जो पूंजी सुरक्षा चाहते हैं।" },
          { name: "एसबीआई सेविंग्स फंड", category: "ऋण (Debt Fund)", returns3y: "6.8% p.a.", risk: "कम", desc: "अल्पकालिक बचत के लिए सर्वोत्तम। फसल चक्र के दौरान जरूरत पड़ने पर त्वरित निकासी (T+1) प्रदान करता है।" }
        ];
      }
      if (selectedCustomerId === "C_SHOP_SUNITA") {
        return [
          { name: "एसबीआई फ्लेक्सीकैप फंड", category: "इक्विटी (विविध)", returns3y: "16.2% p.a.", risk: "उच्च", desc: "लार्ज, मिड और स्मॉल कैप शेयरों में लचकदार आवंटन। किराना स्टोर के नियमित गल्ले से दीर्घकालिक कोष बनाने के लिए उत्कृष्ट।" },
          { name: "एसबीआई स्मॉल कैप फंड", category: "इक्विटी (स्मॉल कैप)", returns3y: "21.5% p.a.", risk: "बहुत उच्च", desc: "व्यापार में तेजी से वृद्धि के लक्ष्य के लिए। उच्च रिटर्न क्षमता के साथ आक्रामक पूंजी वृद्धि।" }
        ];
      }
      if (selectedCustomerId === "C_SALARIED_RAMESH") {
        return [
          { name: "एसबीआई लॉन्ग टर्म इक्विटी फंड (ELSS)", category: "इक्विटी (टैक्स सेविंग)", returns3y: "15.8% p.a.", risk: "उच्च", desc: "आयकर धारा 80C के तहत ₹1.5 लाख तक कर छूट। 3 साल की लॉक-इन अवधि के साथ अनुशासित बचत को बढ़ावा देता है।" },
          { name: "एसबीआई निफ्टी 50 इंडेक्स फंड", category: "इक्विटी (इंडेक्स)", returns3y: "14.1% p.a.", risk: "उच्च", desc: "भारत की शीर्ष 50 कंपनियों में बिना किसी फंड मैनेजर जोखिम के सीधे निवेश। बचत वृद्धि के लिए सबसे सुरक्षित इक्विटी विकल्प।" }
        ];
      }
      return [
        { name: "एसबीआई बैलेंस्ड एडवांटेज फंड", category: "हाइब्रिड (डायनेमिक)", returns3y: "11.7% p.a.", risk: "मध्यम", desc: "बाजार के उतार-चढ़ाव के अनुसार ऋण और इक्विटी में ऑटो-बैलेंस। मध्यम जोखिम वाले पुलिसकर्मियों और सरकारी कर्मचारियों के लिए अनुकूल।" },
        { name: "एसबीआई ब्लूचिप फंड", category: "इक्विटी (लार्ज कैप)", returns3y: "13.5% p.a.", risk: "उच्च", desc: "भारत के विशालतम कॉर्पोरेट दिग्गजों में निवेश। स्थिर और विश्वसनीय वेल्थ क्रिएशन।" }
      ];
    }

    if (language === "Tamil") {
      if (selectedCustomerId === "C_RURAL_NARENDHIRA") {
        return [
          { name: "SBI கன்சர்வேடிவ் ஹைப்ரிட் நிதி", category: "கலப்பின நிதி (குறைந்த ஆபத்து)", returns3y: "8.9% p.a.", risk: "குறைந்த-மிதமான", desc: "அரசு பத்திரங்கள் மற்றும் பாதுகாப்பான பங்குகளில் முதலீடு செய்கிறது. பணப் பாதுகாப்பை விரும்பும் கிராமப்புற விவசாயிகளுக்கு ஏற்றது." },
          { name: "SBI சேவிங்ஸ் ஃபண்ட் (கடன்)", category: "கடன் திட்டம் (Debt)", returns3y: "6.8% p.a.", risk: "குறைந்த", desc: "உடனடித் தேவைக்கான முதலீடு. பயிர் அறுவடையின் போது தேவைப்பட்டால் 24 மணிநேரத்தில் பணமாக மாற்றலாம்." }
        ];
      }
      if (selectedCustomerId === "C_SHOP_SUNITA") {
        return [
          { name: "SBI பிளெக்ஸிகேப் நிதி", category: "பங்குகள் (பல்முகப்படுத்தப்பட்டது)", returns3y: "16.2% p.a.", risk: "அதிக", desc: "அனைத்து வகையான பங்குகளில் முதலீடு. மளிகைக் கடையிலிருந்து தினசரி உபரிப் பணத்தை நீண்ட காலத்திற்கு முதலீடு செய்ய உகந்தது." },
          { name: "SBI ஸ்மால்கேப் நிதி", category: "பங்குகள் (சிறு நிறுவனங்கள்)", returns3y: "21.5% p.a.", risk: "மிக அதிக", desc: "வணிக விரிவாக்கத்திற்கு மிக வேகமாகப் பணத்தை பெருக்க விரும்பும் வணிகர்களுக்கானது." }
        ];
      }
      if (selectedCustomerId === "C_SALARIED_RAMESH") {
        return [
          { name: "SBI லாங் டெர்ம் ஈக்விட்டி நிதி (ELSS)", category: "பங்குகள் (வரி சேமிப்பு)", returns3y: "15.8% p.a.", risk: "அதிக", desc: "வருமான வரி சட்டம் பிரிவு 80C இன் கீழ் ₹1.5 லட்சம் வரை வரி விலக்கு. 3 ஆண்டுகள் கட்டாய லாக்-இன் காலம் கொண்டது." },
          { name: "SBI நிஃப்டி 50 இண்டெக்ஸ் நிதி", category: "பங்குகள் (குறியீட்டு நிதி)", returns3y: "14.1% p.a.", risk: "அதிக", desc: "இந்தியாவின் முன்னணி 50 நிறுவனங்களில் நேரடி முதலீடு. குறைந்த நிர்வாக கட்டணத்தில் சொத்து சேர்ப்பு." }
        ];
      }
      return [
        { name: "SBI பேலன்ஸ்டு அட்வான்டேஜ் நிதி", category: "கலப்பின நிதி (சமச்சீர்)", returns3y: "11.7% p.a.", risk: "மிதமான", desc: "சந்தையின் நிலவரத்திற்கேற்ப கடன் மற்றும் பங்குகளின் விகிதாச்சாரத்தை மாற்றியமைக்கும். அரசு ஊழியர்கள் மற்றும் போலீசாருக்கு ஏற்றது." },
        { name: "SBI புளூசிப் நிதி", category: "பங்குகள் (லார்ஜ்கேப்)", returns3y: "13.5% p.a.", risk: "அதிக", desc: "இந்தியாவின் மிகப்பெரிய கார்ப்பரேட் நிறுவனங்களில் முதலீடு. நிலையான மற்றும் நம்பகமான சொத்து சேர்ப்பு." }
      ];
    }

    // Default English
    if (selectedCustomerId === "C_RURAL_NARENDHIRA") {
      return [
        { name: "SBI Conservative Hybrid Fund", category: "Hybrid (Debt-Oriented)", returns3y: "8.9% p.a.", risk: "Low to Moderate", desc: "Allocates 75% in bonds and 25% in high-grade equities. Highly suitable for farmers seeking basic wealth hedging without stock volatility." },
        { name: "SBI Savings Fund", category: "Debt (Ultra Short)", returns3y: "6.8% p.a.", risk: "Low", desc: "Ideal short-term reserve. Provides T+1 redemption liquidity, allowing easy withdrawals to purchase farming seeds/fertilizers." }
      ];
    }
    if (selectedCustomerId === "C_SHOP_SUNITA") {
      return [
        { name: "SBI Flexicap Fund", category: "Equity (Multi-Cap)", returns3y: "16.2% p.a.", risk: "Very High", desc: "Flexible asset mix across large, mid, and small caps. Excellent to compound grocery store daily cash flows into solid reserves." },
        { name: "SBI Smallcap Fund", category: "Equity (Small Cap)", returns3y: "21.5% p.a.", risk: "Very High", desc: "High-conviction micro-cap equity allocation, designed to target rapid capital appreciation for capital projects/kirana shop expansion." }
      ];
    }
    if (selectedCustomerId === "C_SALARIED_RAMESH") {
      return [
        { name: "SBI Long Term Equity Fund (ELSS)", category: "Equity (Tax Saving)", returns3y: "15.8% p.a.", risk: "Very High", desc: "Tax deduction under Section 80C up to ₹1.5 Lakhs. Features a disciplined 3-year lock-in to prevent impulsive redemptions." },
        { name: "SBI Nifty 50 Index Fund", category: "Equity (Index)", returns3y: "14.1% p.a.", risk: "High", desc: "Low-cost index tracking of India's top 50 corporate pillars. The safest way to compound monthly white-collar salary reserves." }
      ];
    }
    return [
      { name: "SBI Balanced Advantage Fund", category: "Hybrid (Asset Allocator)", returns3y: "11.7% p.a.", risk: "Moderate", desc: "Dynamically balances stock and bond weights automatically based on valuation signals. Tailored for police officers needing inflation protection with low drawdown risk." },
      { name: "SBI Bluechip Fund", category: "Equity (Large Cap)", returns3y: "13.5% p.a.", risk: "High", desc: "Invests in giant market leaders. High long-term compounding dependability for household children education and retirement goals." }
    ];
  };

  // Compute compounding math
  const getCalculatorData = () => {
    const data = [];
    const monthlyRate = returnRate / 12 / 100;
    
    for (let y = 1; y <= years; y++) {
      const months = y * 12;
      const invested = monthlySip * months;
      
      // Future Value formula for SIP (Compounded Monthly)
      // FV = P * [((1 + i)^n - 1) / i] * (1 + i)
      const fv = monthlyRate > 0 
        ? monthlySip * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate)
        : invested;
        
      const gains = Math.max(0, fv - invested);
      
      data.push({
        year: `${y} ${y === 1 ? (language === "Tamil" ? "ஆண்டு" : language === "Hindi" ? "वर्ष" : "Yr") : (language === "Tamil" ? "ஆண்டுகள்" : language === "Hindi" ? "वर्ष" : "Yrs")}`,
        Invested: Math.round(invested),
        Gains: Math.round(gains),
        Total: Math.round(fv)
      });
    }
    return data;
  };

  const calcData = getCalculatorData();
  const latestData = calcData[calcData.length - 1] || { Invested: 0, Gains: 0, Total: 0 };
  const profile = getProfileMeta();
  const funds = getRecommendedFunds();

  const isDark = theme === "dark";
  const strokeInvested = isDark ? "#3b82f6" : "#1d4ed8";
  const strokeGains = isDark ? "#10b981" : "#047857";
  const fillInvestedOpacity = isDark ? 0.2 : 0.08;
  const fillGainsOpacity = isDark ? 0.3 : 0.12;

  const handleSimulateSipSetup = async () => {
    setIsSettingUp(true);
    setSetupSuccess(false);
    // Simulate API request delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSettingUp(false);
    setSetupSuccess(true);
  };

  const getProfessorPedagogy = () => {
    if (language === "Hindi") {
      if (selectedCustomerId === "C_RURAL_NARENDHIRA") {
        return "नरेन्द्र जी, चक्रवृद्धि ब्याज (Compounding) को संसार का आठवां अजूबा कहा जाता है। हर महीने केवल ₹1,000 की छोटी बचत भी भविष्य में एक मजबूत सुरक्षा कोष बन सकती है। ध्यान रहे कि खेती की बचत में सुरक्षा पहले आनी चाहिए, इसलिए जोखिम भरे सट्टे से दूर रहें और सरकारी बॉन्ड तथा एसबीआई कंज़र्वेटिव फंड जैसे हाइब्रिड विकल्पों को प्राथमिकता दें।";
      }
      if (selectedCustomerId === "C_SHOP_SUNITA") {
        return "सुनीता जी, व्यवसाय के गल्ले से रोज ₹150-200 अलग करके मासिक एसआईपी में डालना एक बहुत ही बुद्धिमान कदम है। इससे आपके किराना स्टोर का दैनिक मुनाफा चुपचाप कम्पाउंड होता रहेगा और 5-10 साल बाद आपको बैंक से बड़ा लोन लिए बिना दुकान का विस्तार करने के लिए आवश्यक पूंजी मिल जाएगी।";
      }
      if (selectedCustomerId === "C_SALARIED_RAMESH") {
        return "रमेश, कर्ज के जाल (Debt Trap) से बाहर निकलने का पहला नियम उच्च ब्याज दरों वाले कर्ज को चुकाना है। लेकिन इसके साथ ही धारा 80C के तहत टैक्स बचाने के लिए एसबीआई ईएलएसएस (ELSS) में एक व्यवस्थित एसआईपी शुरू करें। जैसे ही क्रेडिट कार्ड का बोझ खत्म हो, अतिरिक्त बचत को कम्पाउंडिंग पूल में धकेलें। याद रखें, अमीर कर्ज से नहीं, बल्कि कंपाउंडिंग लिक्विड एसेट्स से बना जाता है!";
      }
      return "विक्रम जी, आपकी पुलिस की ड्यूटी अत्यंत चुनौतीपूर्ण और जोखिम भरी है। अपने परिवार की सेवानिवृत्ति और भविष्य की सुरक्षा के लिए एक गतिशील बैलेंस्ड एडवांटेज फंड में एसआईपी शुरू करें। यह बिना किसी घबराहट के बाजार के उतार-चढ़ाव को संतुलित करता है और लंबी अवधि में महंगाई को मात देने वाला कोष बनाता है।";
    }

    if (language === "Tamil") {
      if (selectedCustomerId === "C_RURAL_NARENDHIRA") {
        return "நரேந்திரா அவர்களே, கூட்டு வட்டி (Compounding) என்பது உலகத்தின் எட்டாவது அதிசயம். ஒவ்வொரு மாதமும் நீங்கள் சேமிக்கும் சிறு தொகை, பிற்காலத்தில் உங்களது குடும்பத்திற்கு ஒரு பெரிய கவசமாக மாறும். விவசாயத்தில் பாதுகாப்பு மிக முக்கியம் என்பதால், ஆபத்தான பங்குச்சந்தை முதலீடுகளை விடுத்து, எஸ்பிஐ ஹைப்ரிட் திட்டங்களை மட்டும் தேர்வு செய்ய வேண்டும்.";
      }
      if (selectedCustomerId === "C_SHOP_SUNITA") {
        return "சுனிதா அவர்களே, மளிகைக் கடையின் லாபத்தில் தினமும் ₹150-200 தனியாக எடுத்து மாதாந்திர எஸ்.ஐ.பி-யில் முதலீடு செய்வது சிறந்த முறை. இது கடையின் வளர்ச்சிப் பணத்தை உங்களது உழைப்புடன் சேர்த்து கூட்டு வட்டியில் வளர்க்கும், இதன் மூலம் 5-10 ஆண்டுகளில் கடையை விரிவாக்கப் போதுமான தொகை தயாராகிவிடும்.";
      }
      if (selectedCustomerId === "C_SALARIED_RAMESH") {
        return "ரமேஷ், கடன் சுமையிலிருந்து விடுபட அதிக வட்டி கொண்ட கிரெடிட் கார்டு கடன்களை முதலில் அடைக்கவும். அதே நேரத்தில், வரிச் சலுகை பெற எஸ்பிஐ ELSS திட்டத்தில் ஒரு சிறிய தொகையை முதலீடு செய்யவும். கடன் குறையக் குறைய சேமிப்புத் தொகையை அதிகரியுங்கள். கூட்டு வட்டி சொத்துக்கள் மட்டுமே உங்களை நிதி சுதந்திரத்திற்கு அழைத்துச் செல்லும்.";
      }
      return "விக்ரம் அவர்களே, உங்களது காவல் பணி மிகவும் சவாலானது. உங்களது ஓய்வூதியத் தேவைக்காகவும், குழந்தைகளின் கல்விக்காகவும் எஸ்பிஐ பேலன்ஸ்டு அட்வான்டேஜ் திட்டத்தில் முதலீடு செய்யவும். இது அபாயம் இல்லாமல் உங்களது முதலீட்டை சீராக வளர்க்கும்.";
    }

    // Default English
    if (selectedCustomerId === "C_RURAL_NARENDHIRA") {
      return "Narendhira Ji, compounding is the eighth wonder of the world. For a farmer, crop prices fluctuate, but a steady ₹1,000 monthly investment in conservative hybrid funds acts as a secondary buffer. Avoid aggressive stock speculation; prioritize safety and consistent compounding to build secondary liquid cash.";
    }
    if (selectedCustomerId === "C_SHOP_SUNITA") {
      return "Sunita Ji, putting aside ₹150-200 every day from your Kirana shop's UPI sales register and routing it to a monthly SIP is a textbook business expansion strategy. By compounding store cash flows, you build the required capital to expand stock in 5-10 years without relying on heavy bank interest loans.";
    }
    if (selectedCustomerId === "C_SALARIED_RAMESH") {
      return "Ramesh, clearing your 58% DTI credit card debt is the primary priority, but configuring a tax-saving ELSS SIP helps lock in tax credits under Sec 80C. As you prune revolving credit, route the saved EMI amounts directly to Nifty Index and ELSS mutual funds. Wealth is built by buying liquid compounding assets, not high-interest consumer liabilities!";
    }
    return "Vikram Ji, serving in a high-risk police role demands balanced wealth security. A Balanced Advantage Fund dynamically hedges equity volatility with debt, providing inflation-beating growth for your children's college education or your own retirement without stock market stress.";
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="max-w-7xl mx-auto flex flex-col gap-8"
    >
      
      {/* 1. Page Title Header */}
      <div>
        <h2 className="text-3xl font-extrabold text-primary-text tracking-tight flex items-center gap-2">
          <TrendingUp className="w-8 h-8 text-cyan-400" />
          {t.investments.title}
        </h2>
        <p className="text-base text-muted-text mt-1.5 max-w-4xl leading-relaxed">
          {t.investments.desc}
        </p>
      </div>

      {/* 2. Top Interactive Profile Assessment Bar */}
      <div className="bg-card-bg border border-primary-border rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors duration-200">
        <div>
          <span className="text-xs text-muted-text uppercase font-black tracking-wider block mb-1">
            {t.investments.profileSection}
          </span>
          <h3 className="text-xl font-bold text-primary-text">
            {customerDetails?.customer_info.first_name} {customerDetails?.customer_info.last_name} ({customerDetails?.customer_info.occupation})
          </h3>
        </div>
        
        <div className="grid grid-cols-2 gap-8 text-sm">
          <div>
            <span className="text-xs text-muted-text uppercase font-black tracking-wider block mb-0.5">{t.investments.riskProfileLabel}</span>
            <span className="text-sm font-extrabold text-cyan-400">{profile.risk}</span>
          </div>
          <div>
            <span className="text-xs text-muted-text uppercase font-black tracking-wider block mb-0.5">{t.investments.recommendedSipLabel}</span>
            <span className="text-sm font-extrabold text-emerald-450">₹{selectedCustomerId === "C_RURAL_NARENDHIRA" ? "1,000" : selectedCustomerId === "C_POLICE_VIKRAM" ? "4,000" : selectedCustomerId === "C_SHOP_SUNITA" ? "5,000" : "10,000"}/mo</span>
          </div>
        </div>
      </div>

      {/* 3. Main Grid layout: Left is Sliders + Chart, Right is Mutual Funds & Pedagogy */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Column: Calculator Panel & Chart (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          
          {/* Sliders panel */}
          <div className="bg-card-bg border border-primary-border rounded-2xl p-6 shadow-xl flex flex-col gap-6 transition-colors duration-200">
            <h4 className="font-extrabold text-lg text-primary-text border-b border-primary-border pb-3 flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-cyan-400" />
              {t.investments.calculatorTitle}
            </h4>
            
            <div className="space-y-6">
              
              {/* Monthly Amount slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-secondary-text">{t.investments.monthlyInv}</span>
                  <span className="text-cyan-405">₹{monthlySip.toLocaleString("en-IN")}</span>
                </div>
                <input 
                  type="range"
                  min={500}
                  max={50000}
                  step={500}
                  value={monthlySip}
                  onChange={(e) => setMonthlySip(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-primary-bg rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
                <div className="flex justify-between text-[10px] text-muted-text">
                  <span>₹500</span>
                  <span>₹50,000</span>
                </div>
              </div>

              {/* Expected Returns slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-secondary-text">{t.investments.returnRate}</span>
                  <span className="text-cyan-405">{returnRate}% p.a.</span>
                </div>
                <input 
                  type="range"
                  min={5}
                  max={25}
                  step={0.5}
                  value={returnRate}
                  onChange={(e) => setReturnRate(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-primary-bg rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
                <div className="flex justify-between text-[10px] text-muted-text">
                  <span>5%</span>
                  <span>25%</span>
                </div>
              </div>

              {/* Years slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-secondary-text">{t.investments.duration}</span>
                  <span className="text-cyan-405">{years} {language === "Tamil" ? "ஆண்டுகள்" : language === "Hindi" ? "वर्ष" : "Years"}</span>
                </div>
                <input 
                  type="range"
                  min={1}
                  max={30}
                  step={1}
                  value={years}
                  onChange={(e) => setYears(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-primary-bg rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
                <div className="flex justify-between text-[10px] text-muted-text">
                  <span>1 Yr</span>
                  <span>30 Yrs</span>
                </div>
              </div>

            </div>

            {/* Calculations summaries */}
            <div className="grid grid-cols-3 gap-4 border-t border-primary-border pt-5 text-center transition-colors duration-200">
              <div className="bg-primary-bg/50 border border-primary-border p-3.5 rounded-xl transition-colors duration-200">
                <span className="text-[10px] text-muted-text uppercase font-black block mb-1">{t.investments.investedAmount}</span>
                <span className="text-sm font-black text-secondary-text">₹{latestData.Invested.toLocaleString("en-IN")}</span>
              </div>
              <div className="bg-primary-bg/50 border border-primary-border p-3.5 rounded-xl transition-colors duration-200">
                <span className="text-[10px] text-muted-text uppercase font-black block mb-1">{t.investments.estReturns}</span>
                <span className="text-sm font-black text-cyan-400">₹{latestData.Gains.toLocaleString("en-IN")}</span>
              </div>
              <div className="bg-cyan-950/20 border border-cyan-900/30 p-3.5 rounded-xl">
                <span className="text-[10px] text-cyan-400 uppercase font-black block mb-1">{t.investments.totalValue}</span>
                <span className="text-sm font-black text-emerald-450">₹{latestData.Total.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

          {/* Interactive Recharts Projection Graph */}
          <div className="bg-card-bg border border-primary-border rounded-2xl p-6 shadow-xl flex flex-col gap-4 transition-colors duration-200">
            <div>
              <h4 className="font-extrabold text-lg text-primary-text">
                {language === "Hindi" ? "📈 संपत्ति संचय प्रक्षेपण (Compound Growth)" : language === "Tamil" ? "📈 கூட்டு வட்டி வளர்ச்சி வரைபடம்" : "📈 Compound Growth Horizon"}
              </h4>
              <p className="text-xs text-muted-text mt-0.5">{t.investments.sipFormulaNotice}</p>
            </div>
            
            <div className="h-68 w-full text-[10px] pr-2 mt-2">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <AreaChart data={calcData} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colInvested" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={strokeInvested} stopOpacity={fillInvestedOpacity}/>
                      <stop offset="95%" stopColor={strokeInvested} stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colGains" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={strokeGains} stopOpacity={fillGainsOpacity}/>
                      <stop offset="95%" stopColor={strokeGains} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" />
                  <XAxis dataKey="year" stroke="var(--text-muted)" style={{ fontSize: "11px" }} />
                  <YAxis stroke="var(--text-muted)" style={{ fontSize: "11px" }} />
                  <Tooltip contentStyle={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-primary)", color: "var(--text-primary)", fontSize: "12px", borderRadius: "8px" }} />
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                  <Area type="monotone" name={t.investments.investedAmount} dataKey="Invested" stroke={strokeInvested} fillOpacity={1} fill="url(#colInvested)" strokeWidth={2} stackId="1" />
                  <Area type="monotone" name={t.investments.estReturns} dataKey="Gains" stroke={strokeGains} fillOpacity={1} fill="url(#colGains)" strokeWidth={2.5} stackId="1" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Right Column: Tailored SBI Mutual Funds & Pedagogy Card (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Blackboard Pedagogy */}
          <div className="bg-card-bg border border-primary-border rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col gap-4 transition-colors duration-200">
            <div className="flex items-center gap-3 border-b border-primary-border pb-3">
              <img src="/professor_sfia_avatar.png" className="w-10 h-10 rounded-full border border-cyan-500 bg-primary-bg object-cover" alt="S-FIA Avatar" />
              <h4 className="font-extrabold text-base text-primary-text uppercase tracking-wider">
                {language === "Hindi" ? "प्रोफेसर की वित्तीय शिक्षा" : language === "Tamil" ? "நிதி ஆசிரியரின் போதனை" : "Professor S-FIA's Lesson"}
              </h4>
            </div>
            <div className="bg-primary-bg border border-primary-border rounded-xl p-5 text-sm leading-relaxed text-secondary-text relative transition-colors duration-200">
              <span className="text-6xl text-cyan-400/15 absolute top-1 left-2 font-serif select-none pointer-events-none">“</span>
              <p className="relative italic font-medium leading-relaxed">
                {getProfessorPedagogy()}
              </p>
              <div className="mt-4 pt-3 border-t border-primary-border/60 flex items-center justify-between text-xs text-muted-text">
                <span className="font-black tracking-widest uppercase">{t.sidebar.tutor}</span>
                <span className="text-cyan-400 font-bold">compounding.edu</span>
              </div>
            </div>
          </div>

          {/* Recommended Funds Card list */}
          <div className="bg-card-bg border border-primary-border rounded-2xl p-6 shadow-xl flex flex-col gap-4 transition-colors duration-200">
            <div>
              <h4 className="font-extrabold text-lg text-primary-text">{t.investments.fundsTitle}</h4>
              <p className="text-xs text-muted-text mt-0.5">{t.investments.fundsDesc}</p>
            </div>

            <div className="space-y-4">
              {funds.map((fund, idx) => (
                <div key={idx} className="bg-primary-bg/50 border border-primary-border p-4.5 rounded-xl space-y-2.5 transition-colors duration-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-black text-cyan-400 uppercase tracking-wider block">{fund.category}</span>
                      <h5 className="text-sm font-black text-primary-text mt-0.5">{fund.name}</h5>
                    </div>
                    <span className="text-xs font-bold text-emerald-450 bg-emerald-950/20 border border-emerald-900/30 px-2 py-0.5 rounded shrink-0">
                      3Y Return: {fund.returns3y}
                    </span>
                  </div>
                  <p className="text-xs text-secondary-text leading-relaxed">
                    {fund.desc}
                  </p>
                  <div className="flex justify-between items-center text-[10px] text-muted-text pt-1.5 border-t border-primary-border/40">
                    <span>{language === "Hindi" ? "जोखिम श्रेणी" : language === "Tamil" ? "அபாய நிலை" : "Risk Profile"}: <strong className="text-primary-text">{fund.risk}</strong></span>
                    <span className="text-cyan-400 font-bold flex items-center gap-0.5">
                      {language === "Hindi" ? "योजना विवरण" : language === "Tamil" ? "திட்ட விவரம்" : "Scheme Info"} <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Quick transaction trigger button */}
            <div className="pt-2 border-t border-primary-border transition-colors duration-200">
              {setupSuccess ? (
                <div className="bg-emerald-950/20 border border-emerald-900/30 text-emerald-400 text-xs font-bold p-3 rounded-xl text-center">
                  ✅ {language === "Hindi" ? "एसआईपी सफलतापूर्वक पंजीकृत! मासिक निवेश ऑटो-डेबिट सक्षम किया गया।" : language === "Tamil" ? "SIP வெற்றிகரமாக செயல்படுத்தப்பட்டது! மாதாந்திர தானியங்கி டெபிட் இயக்கப்பட்டது." : "Mutual Fund SIP configured! Auto-debit successfully scheduled on your account."}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleSimulateSipSetup}
                  disabled={isSettingUp}
                  className="w-full py-3 px-4 bg-cyan-500 hover:bg-cyan-400 active:scale-95 text-slate-950 text-sm font-black rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                >
                  {isSettingUp ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <TrendingUp className="w-4 h-4" />
                  )}
                  <span>{t.investments.executeActionBtn}</span>
                </button>
              )}
            </div>
          </div>

        </div>

      </div>

    </motion.div>
  );
}
