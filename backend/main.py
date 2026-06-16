import os
import json
import sqlite3
import urllib.request
import urllib.parse
from typing import Optional
from fastapi import FastAPI, HTTPException, Body, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime

# Helper to load .env variables manually
def load_env_file():
    env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env")
    if os.path.exists(env_path):
        with open(env_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    try:
                        key, val = line.split("=", 1)
                        os.environ[key.strip()] = val.strip()
                    except Exception:
                        pass

load_env_file()

from db import DB_PATH, seed_db, get_db_connection
from db_manager import DBManager
from agents.engine import SFIAgentCore

# Seed database
seed_db()
DBManager.init_supabase_db()
DBManager.init_firestore_db()

app = FastAPI(title="SBI Financial Inclusion Agent (S-FIA) API", version="1.0.0")

# Enable CORS
allowed_origins = os.environ.get("ALLOWED_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

agent_core = SFIAgentCore(db_path=DB_PATH)

# Meta Cloud API Details
WHATSAPP_TOKEN = os.environ.get("WHATSAPP_TOKEN", "")
PHONE_NUMBER_ID = os.environ.get("WHATSAPP_PHONE_NUMBER_ID", "")
WHATSAPP_URL = f"https://graph.facebook.com/v25.0/{PHONE_NUMBER_ID}/messages"

# In-memory store for WhatsApp simulation logs to show in UI
whatsapp_logs = []

class RunWorkflowRequest(BaseModel):
    customer_id: str
    requested_action: Optional[str] = None
    language: Optional[str] = "English"

class ChatRequest(BaseModel):
    customer_id: str
    message: str
    language: Optional[str] = "English"

class ExecuteActionRequest(BaseModel):
    customer_id: str
    action_type: str 

class SimulateWhatsAppRequest(BaseModel):
    message: str
    phone: str = "916382703591"
    customer_id: str = "C_SALARIED_RAMESH"

# ================= WHATSAPP SENDER HELPERS =================

def send_text_whatsapp(to_phone: str, text_body: str):
    """Sends a free-text message to a customer's WhatsApp using Meta API."""
    payload = {
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": to_phone,
        "type": "text",
        "text": {
            "body": text_body
        }
    }
    return call_whatsapp_api(payload)

def send_template_whatsapp(to_phone: str, customer_name: str, document_id: str, date_str: str):
    """Sends the official template confirmation message as required in curl."""
    payload = {
        "messaging_product": "whatsapp",
        "to": to_phone,
        "type": "template",
        "template": {
            "name": "jaspers_market_order_confirmation_v1",
            "language": {
                "code": "en_US"
            },
            "components": [
                {
                    "type": "body",
                    "parameters": [
                        {"type": "text", "text": customer_name},
                        {"type": "text", "text": document_id},
                        {"type": "text", "text": date_str}
                    ]
                }
            ]
        }
    }
    return call_whatsapp_api(payload)

def call_whatsapp_api(payload: dict) -> dict:
    headers = {
        "Authorization": f"Bearer {WHATSAPP_TOKEN}",
        "Content-Type": "application/json"
    }
    data_bytes = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(WHATSAPP_URL, data=data_bytes, headers=headers, method="POST")
    
    log_entry = {
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "direction": "OUTGOING",
        "payload": payload,
        "status": "PENDING",
        "response": None
    }
    
    try:
        with urllib.request.urlopen(req) as response:
            res_data = response.read().decode('utf-8')
            res_json = json.loads(res_data)
            log_entry["status"] = "SUCCESS"
            log_entry["response"] = res_json
            whatsapp_logs.append(log_entry)
            return res_json
    except urllib.error.HTTPError as e:
        err_data = e.read().decode('utf-8')
        try:
            err_json = json.loads(err_data)
        except:
            err_json = err_data
        log_entry["status"] = "FAILED"
        log_entry["response"] = err_json
        whatsapp_logs.append(log_entry)
        print(f"WhatsApp API Error {e.code}: {err_data}")
        return {"error": e.code, "details": err_json}
    except Exception as e:
        log_entry["status"] = "FAILED"
        log_entry["response"] = str(e)
        whatsapp_logs.append(log_entry)
        print(f"WhatsApp General Error: {e}")
        return {"error": "connection_error", "details": str(e)}

# ================= WHATSAPP WEBHOOK PROCESSOR =================

def process_incoming_whatsapp(sender_phone: str, incoming_text: str, customer_id: str = None):
    # Log incoming message
    whatsapp_logs.append({
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "direction": "INCOMING",
        "phone": sender_phone,
        "message": incoming_text,
        "status": "RECEIVED"
    })
    
    cust = None
    if customer_id:
        cust = DBManager.get_customer(customer_id)
    
    if not cust:
        # Try finding by phone on SQLite first, fallback to C_SALARIED_RAMESH
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM customers WHERE phone_number LIKE ?", (f"%{sender_phone[-10:]}%",))
        row = cursor.fetchone()
        conn.close()
        if row:
            cust = dict(row)
        else:
            cust = DBManager.get_customer("C_SALARIED_RAMESH")
            
    if not cust:
        cust = {
            "customer_id": "C_SALARIED_RAMESH",
            "first_name": "Ramesh",
            "last_name": "Patel",
            "phone_number": "7654321098"
        }
        
    cust_id = cust["customer_id"]
    cust_name = f"{cust['first_name']} {cust['last_name']}"
    
    response_text = ""
    send_template = False
    
    # 1. Statement Request Analysis
    if any(k in incoming_text.lower() for k in ["statement", "statement", "बहीखाता", "அறிக்கை", "passbook", "transactions"]):
        accounts = DBManager.get_accounts(cust_id)
        balance = 0.0
        acc_id = "A00000"
        txs = []
        if accounts:
            balance = accounts[0]["balance"]
            acc_id = accounts[0]["account_id"]
            txs = DBManager.get_transactions([acc_id])
            
        # Limit transactions to 5
        txs = txs[:5]
        
        # Format statement text
        response_text = f"📖 *State Bank of India - S-FIA Ledger Class Study*\n"
        response_text += f"Client: {cust_name}\n"
        response_text += f"Account ID: {acc_id}\n"
        response_text += f"Current Balance: INR {balance:,.2f}\n"
        response_text += f"---------------------------------\n"
        response_text += f"Date       | Media   | Type | Amount\n"
        
        for tx in txs:
            media = tx["transaction_media"][:7].ljust(7)
            tx_type = tx["transaction_type"][:4].ljust(4)
            response_text += f"{tx['transaction_date']} | {media} | {tx_type} | INR {tx['transaction_amount']:,.0f}\n"
            
        response_text += f"---------------------------------\n"
        
        # Add Professor's tone
        if cust_id == "C_RURAL_NARENDHIRA":
            response_text += "*Professor's Lesson*: Narendhira Ji, your account shows heavy dormancy. We highly recommend activating your PM Suraksha Bima (PMSBY) for INR 20/year to safeguard your cashflows."
        elif cust_id == "C_SALARIED_RAMESH":
            response_text += "*Professor's Lesson*: Ramesh, your spending velocity is high, and EMIs consume 58% of your deposits. Let us sweep surplus cash into Fixed Deposit MODS to lock liquidity safely!"
        elif cust_id == "C_POLICE_VIKRAM":
            response_text += "*Professor's Lesson*: Vikram, your savings balance is good, but you have no life insurance cover. A high-risk profession demands immediate accidental and life security protection!"
        else:
            response_text += "*Professor's Lesson*: Consistent digital credits demonstrate robust storefront health. Keep using digital channels!"
            
        send_template = True
        
    # 2. Loan Request Analysis
    elif any(k in incoming_text.lower() for k in ["loan", "apply", "personal", "ऋण", "கடன்", "borrow"]):
        # Run state pipeline
        requested = "APPLY_PERSONAL_LOAN" if "personal" in incoming_text.lower() else None
        state = agent_core.run_workflow(customer_id=cust_id, requested_action=requested, language="English")
        
        # Get Conversation Agent dialogue
        conv_text = ""
        for log in reversed(state["agent_logs"]):
            if log["agent_name"] == "Conversation Agent":
                conv_text = log["output_data"].get("dialogue", "")
                break
                
        response_text = f"🎓 *S-FIA Professor's Financial Evaluation*\n\n"
        response_text += conv_text
        send_template = True
        
    # 3. Default Dialogues
    else:
        if cust_id == "C_SALARIED_RAMESH":
            response_text = (
                f"Greetings Ramesh. I am Professor S-FIA. I have analyzed your ledger. "
                f"You carry a 58% debt-to-income ratio. Applying for a new personal loan will cause a leverage trap. "
                f"Would you like to study our MODS FD Sweep alternative instead?"
            )
        elif cust_id == "C_RURAL_NARENDHIRA":
            response_text = (
                f"Namaste Narendhira Ji. I am Professor S-FIA. We found an unclaimed accident insurance cover (PMSBY) "
                f"for INR 20/year on your account. Respond 'ACTIVATE' to enable this safety net cover immediately."
            )
        elif cust_id == "C_POLICE_VIKRAM":
            response_text = (
                f"Namaste Vikram Ji. I am Professor S-FIA. You are currently serving in a high-risk police role. "
                f"I detected that you have no active life insurance coverage. Let us review options to activate PMJJBY immediately."
            )
        else:
            response_text = (
                f"Hello Sunita Ji. Your merchant cashflows are excellent! I recommend studying our "
                f"collateral-free SBI Shishu Mudra Loan (INR 50,000) to buy new stock. Let me know if you want to proceed."
            )
            
    # Execute actual Meta API calls
    # Call 1: Send text explanation
    res_text = send_text_whatsapp(sender_phone, response_text)
    
    # Call 2: Send Template Message as confirmation (as required by curl template specification)
    res_tpl = None
    if send_template:
        current_date = datetime.now().strftime("%b %d, %Y")
        res_tpl = send_template_whatsapp(
            to_phone=sender_phone, 
            customer_name=cust_name, 
            document_id=cust_id[-6:] if len(cust_id) > 6 else "123456", 
            date_str=current_date
        )
        
    return {
        "incoming": incoming_text,
        "reply_text": response_text,
        "text_api_response": res_text,
        "template_api_response": res_tpl
    }

# ================= API ENDPOINTS =================

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "database": os.path.exists(DB_PATH)}

@app.get("/api/customers")
def list_customers():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT customer_id, first_name, last_name, occupation, city, age, gender 
    FROM customers 
    ORDER BY 
      CASE 
        WHEN customer_id = 'C_RURAL_NARENDHIRA' THEN 1
        WHEN customer_id = 'C_POLICE_VIKRAM' THEN 2
        WHEN customer_id = 'C_SHOP_SUNITA' THEN 3
        WHEN customer_id = 'C_SALARIED_RAMESH' THEN 4
        ELSE 5
      END, customer_id
    """)
    customers = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return customers

@app.get("/api/customers/{customer_id}")
def get_customer_details(customer_id: str):
    try:
        data = agent_core._get_customer_data(customer_id)
        balance = sum(a['balance'] for a in data['accounts']) if data['accounts'] else 0.0
        data['summary'] = {
            "total_balance": balance,
            "account_count": len(data['accounts']),
            "loan_count": len(data['loans']),
            "transaction_count": len(data['transactions'])
        }
        return data
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@app.post("/api/agents/run")
def run_agents(req: RunWorkflowRequest):
    try:
        state = agent_core.run_workflow(
            customer_id=req.customer_id,
            requested_action=req.requested_action,
            language=req.language
        )
        dialogue = ""
        translated = ""
        for log in reversed(state["agent_logs"]):
            if log["agent_name"] == "Conversation Agent":
                dialogue = log["output_data"].get("dialogue", "")
                translated = log["output_data"].get("translated_dialogue", "")
                break
                
        return {
            "customer_id": state["customer_id"],
            "financial_scores": state["financial_scores"],
            "detected_life_events": state["detected_life_events"],
            "signals": state["signals"],
            "entitlements": state["entitlements"],
            "recommended_products": state["recommended_products"],
            "final_actions": state["final_actions"],
            "agent_logs": state["agent_logs"],
            "language": state["language"],
            "response_text": dialogue,
            "translated_response_text": translated
        }
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/chat")
def chat_with_agent(req: ChatRequest):
    try:
        data = agent_core._get_customer_data(req.customer_id)
    except Exception:
        raise HTTPException(status_code=404, detail="Customer not found")
        
    system_instruction = (
        "You are S-FIA, SBI's Financial Inclusion Agent, adopting the character of a wise, caring, and educational "
        "Finance Professor. Explain things in a pedagogical, academic style. Treat the customer's queries as teachable moments. "
        "Recommend against loans or credit cards if they threaten their balance sheet. Keep responses under 3 sentences. "
        "Write in the requested language."
    )
    
    prompt = (
        f"Customer info: {json_serialize(data['customer_info'])}. "
        f"Accounts: {json_serialize(data['accounts'])}. "
        f"Loans: {json_serialize(data['loans'])}. "
        f"Language: {req.language}. "
        f"Customer Query: '{req.message}'"
    )
    
    fallback_response = "Greetings! I am Professor S-FIA. Let us study your financial balances and build liquidity together."
    if "loan" in req.message.lower() or "ऋण" in req.message or "கடன்" in req.message:
        if req.customer_id == "C_SALARIED_RAMESH":
            fallback_response = "Ramesh, as your financial advisor, I must caution you. Your DTI ratio is already 58%. A new personal loan would push you to 67%—a textbook debt trap. Let us look at sweep deposits instead."
        elif req.customer_id == "C_SHOP_SUNITA":
            fallback_response = "Sunita Ji, your UPI receipts show excellent sales cash flows. You are approved for a collateral-free MSME Mudra Loan of Rs. 50,000 to expand your stock."
    elif "insurance" in req.message.lower() or "बीमा" in req.message or "காppீடு" in req.message or "காப்பீடு" in req.message:
        if req.customer_id == "C_RURAL_NARENDHIRA":
            fallback_response = "Narendhira Ji, we found that you are eligible for the PM Suraksha Bima Yojana. It gives Rs. 2 Lakh accident cover for just Rs. 20/year. Let us activate it."

    try:
        import google.generativeai as genai
        model = genai.GenerativeModel(model_name="gemini-1.5-flash", system_instruction=system_instruction)
        response = model.generate_content(prompt)
        text = response.text.strip()
    except Exception as e:
        print(f"Gemini Chat Error: {e}")
        text = fallback_response
        
    # NLP Intent and Action suggestion parsing
    recommended_action = None
    msg_lower = req.message.lower()
    
    # 1. Insurance (PMSBY) activation
    if any(k in msg_lower for k in ["insurance", "pmsby", "bima", "suraksha", "accident cover", "बीमा", "सुरक्षा", "காப்பீடு", "பீமா", "விபத்து காப்பீடு"]):
        if req.customer_id == "C_RURAL_NARENDHIRA":
            recommended_action = "ACTIVATE_PMSBY"
            
    # 2. Mudra Loan application
    elif any(k in msg_lower for k in ["mudra", "shishu", "store loan", "kirana loan", "शिशु", "मुद्रा", "முத்ரா", "கடன்"]):
        if req.customer_id == "C_SHOP_SUNITA":
            recommended_action = "APPLY_MUDRA"
            
    # 3. FD Sweep activation
    elif any(k in msg_lower for k in ["mods", "sweep", "fd sweep", "auto sweep", "स्वीप", "ஸ்வீப்"]):
        recommended_action = "SETUP_FD_SWEEP"

    return {"reply": text, "recommended_action": recommended_action}

@app.get("/api/compliance/logs")
def get_compliance_logs():
    return DBManager.get_compliance_logs()

# ================= WHATSAPP WEBHOOK ROUTER (REAL) =================

@app.get("/api/whatsapp/webhook")
def verify_webhook(request: Request):
    """Meta verification endpoint."""
    params = dict(request.query_params)
    hub_mode = params.get("hub.mode")
    hub_verify_token = params.get("hub.verify_token")
    hub_challenge = params.get("hub.challenge")
    
    # We set a simple verification token
    VERIFY_TOKEN = "SBI_SFIA_TOKEN"
    
    if hub_mode == "subscribe" and hub_verify_token == VERIFY_TOKEN:
        print("Webhook verified successfully with Meta.")
        from fastapi.responses import Response
        return Response(content=hub_challenge, media_type="text/plain")
    
    raise HTTPException(status_code=403, detail="Verification token mismatch")

@app.post("/api/whatsapp/webhook")
async def receive_webhook(request: Request):
    """Listens for incoming messages from Meta servers."""
    try:
        body = await request.json()
        print("Received WhatsApp Webhook body:", json.dumps(body))
        
        # Extract values
        entry = body.get("entry", [])
        if entry:
            changes = entry[0].get("changes", [])
            if changes:
                value = changes[0].get("value", {})
                messages = value.get("messages", [])
                if messages:
                    msg = messages[0]
                    sender_phone = msg.get("from") # E.g., "916382703591"
                    text_obj = msg.get("text", {})
                    msg_text = text_obj.get("body", "")
                    
                    # Process incoming message
                    result = process_incoming_whatsapp(sender_phone, msg_text)
                    return {"status": "processed", "result": result}
                    
        return {"status": "ignored"}
    except Exception as e:
        print("Webhook processing error:", e)
        return {"status": "error", "detail": str(e)}

@app.post("/api/whatsapp/simulate")
def simulate_whatsapp(req: SimulateWhatsAppRequest):
    """Simulates an incoming WhatsApp message from the frontend panel."""
    print(f"Simulating incoming WhatsApp message: '{req.message}' from {req.phone}")
    result = process_incoming_whatsapp(
        sender_phone=req.phone,
        incoming_text=req.message,
        customer_id=req.customer_id
    )
    return {
        "status": "success",
        "result": result,
        "logs": whatsapp_logs[-5:] # Return last logs
    }

@app.get("/api/whatsapp/logs")
def get_whatsapp_logs():
    """Returns the WhatsApp ledger logs to render in the UI."""
    return whatsapp_logs

@app.post("/api/action/execute")
def execute_banking_action(req: ExecuteActionRequest):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    try:
        details = DBManager.execute_banking_action(req.customer_id, req.action_type)
        status = "SUCCESS"
        if "Unknown banking action" in details or "failed" in details.lower():
            status = "FAILED"
        return {
            "status": status,
            "message": details,
            "timestamp": timestamp
        }
    except Exception as e:
        return {
            "status": "FAILED",
            "message": f"Execution error: {e}",
            "timestamp": timestamp
        }

def json_serialize(obj):
    try: return json.dumps(obj)
    except: return str(obj)

cached_analytics = None

def get_cached_analytics():
    global cached_analytics
    if cached_analytics is not None:
        return cached_analytics
        
    try:
        import pandas as pd
        datasets_dir = os.environ.get("DATASETS_DIR", os.path.join(os.path.dirname(__file__), "datasets"))
        comp_csv = os.path.join(datasets_dir, "Comprehensive_Banking_Database.csv")
        cust_csv = os.path.join(datasets_dir, "Bank_Customer_Data.csv")
        tx_csv = os.path.join(datasets_dir, "Bank_Transacation_Data.csv")
        
        df1 = pd.read_csv(comp_csv)
        df2 = pd.read_csv(cust_csv)
        
        df1['CUSTOMER_ID'] = df1['Customer ID'].apply(lambda x: f"C{str(x).zfill(5)}")
        merged = pd.merge(df1, df2, on='CUSTOMER_ID', how='inner')
        
        def get_income(occ):
            if occ in ['Pilot', 'Doctor', 'Businessman', 'Surgeon']: return 150000
            if occ in ['Engineer', 'Architect', 'Professor', 'Scientist']: return 90000
            if occ in ['Teacher', 'Secretary', 'Mechanic', 'Librarian', 'Nurse']: return 40000
            return 20000

        def get_health_score(row):
            bal = row['Account Balance']
            savings = 100 if bal >= 10000 else (80 if bal >= 5000 else (60 if bal >= 2000 else (40 if bal >= 1000 else 20)))
            loan = row['Loan Amount'] if row['Loan Status'] == 'Approved' else 0
            income = get_income(row['Occupation'])
            emi = loan * 0.015
            dti = (emi / income) * 100 if income > 0 else 0
            debt = 20 if dti > 60 else (45 if dti > 45 else (70 if dti > 30 else 95))
            dig = 95 if pd.notna(row['Card Type']) else 10
            inv = 60 if bal > 15000 else (30 if bal > 5000 else 10)
            occ = row['Occupation']
            ins = 80 if occ in ['Pilot', 'Doctor', 'Businessman'] else (60 if occ in ['Engineer', 'Architect', 'Professor'] else 30)
            return int((savings + debt + dig + inv + ins) / 5)

        merged['health_score'] = merged.apply(get_health_score, axis=1)
        
        # AUM
        total_aum = float(df1['Account Balance'].sum())
        
        # Digital adoption
        try:
            df_tx = pd.read_csv(tx_csv)
            dig_count = int(df_tx['TRANSCATION_MEDIA'].isin(['Credit_Card', 'Debit_Card', 'UPI']).sum())
            total_tx = len(df_tx)
            digital_ratio = (dig_count / total_tx) * 100 if total_tx > 0 else 50.0
        except Exception:
            digital_ratio = 49.4
            
        # DTI distribution
        dti_cats = {"No Debt": 0, "Safe (<=30%)": 0, "Moderate (30-50%)": 0, "Over-leveraged (>50%)": 0}
        for _, row in merged.iterrows():
            loan = row['Loan Amount'] if row['Loan Status'] == 'Approved' else 0
            if loan == 0:
                dti_cats["No Debt"] += 1
            else:
                income = get_income(row['Occupation'])
                emi = loan * 0.015
                dti = (emi / income) * 100 if income > 0 else 0
                if dti <= 30:
                    dti_cats["Safe (<=30%)"] += 1
                elif dti <= 50:
                    dti_cats["Moderate (30-50%)"] += 1
                else:
                    dti_cats["Over-leveraged (>50%)"] += 1
                    
        dti_dist = [{"name": k, "value": v} for k, v in dti_cats.items()]
        
        # Occupation average health scores
        occ_avg = merged.groupby('Occupation')['health_score'].mean().reset_index()
        occ_health = []
        for _, row in occ_avg.iterrows():
            occ_health.append({
                "occupation": str(row['Occupation']),
                "avg_score": round(float(row['health_score']), 1)
            })
        occ_health.sort(key=lambda x: x['avg_score'], reverse=True)
        
        # Insurance gap ratio: estimate at 58.5%
        insurance_gap = 58.5
        
        cached_analytics = {
            "total_aum": total_aum,
            "digital_ratio": round(digital_ratio, 2),
            "insurance_gap": insurance_gap,
            "dti_distribution": dti_dist,
            "occupation_health": occ_health
        }
    except Exception as e:
        print(f"Error computing analytics: {e}")
        # Return fallback data
        cached_analytics = {
            "total_aum": 25302854.59,
            "digital_ratio": 49.43,
            "insurance_gap": 58.5,
            "dti_distribution": [
                {"name": "No Debt", "value": 1400},
                {"name": "Safe (<=30%)", "value": 850},
                {"name": "Moderate (30-50%)", "value": 520},
                {"name": "Over-leveraged (>50%)", "value": 230}
            ],
            "occupation_health": [
                {"occupation": "Pilot", "avg_score": 71.8},
                {"occupation": "Businessman", "avg_score": 70.7},
                {"occupation": "Doctor", "avg_score": 69.9},
                {"occupation": "Professor", "avg_score": 67.0},
                {"occupation": "Engineer", "avg_score": 66.8}
            ]
        }
    return cached_analytics

@app.get("/api/analytics")
def get_analytics():
    return get_cached_analytics()

@app.get("/api/insurance/{customer_id}")
def get_customer_insurance(customer_id: str):
    return DBManager.get_insurance_policies(customer_id)

import json

