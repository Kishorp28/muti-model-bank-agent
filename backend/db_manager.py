import os
import json
import sqlite3
import urllib.request
import urllib.parse
import time
import base64
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), "sfi_database.db")
SUPABASE_HOST = "db.xqkckyjvagmfnpnnbvbw.supabase.co"
SUPABASE_PORT = 5432
SUPABASE_USER = "postgres"
SUPABASE_DB = "postgres"

def get_firestore_project_id():
    gs_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "google-services.json")
    if os.path.exists(gs_path):
        try:
            with open(gs_path, "r") as f:
                data = json.load(f)
                return data.get("project_info", {}).get("project_id", "sample-b12fa")
        except Exception:
            pass
    return "sample-b12fa"

FIRESTORE_PROJECT_ID = get_firestore_project_id()

def get_firebase_token():
    # Try to load firebase-service-account.json from root directory
    sa_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "firebase-service-account.json")
    if os.path.exists(sa_path):
        try:
            from cryptography.hazmat.primitives import serialization
            from cryptography.hazmat.primitives.asymmetric import padding
            from cryptography.hazmat.primitives import hashes
            
            with open(sa_path, "r") as f:
                sa_data = json.load(f)
                
            private_key_pem = sa_data["private_key"]
            client_email = sa_data["client_email"]
            token_uri = sa_data.get("token_uri", "https://oauth2.googleapis.com/token")
            
            header = {"alg": "RS256", "typ": "JWT"}
            header_b64 = base64.urlsafe_b64encode(json.dumps(header).encode('utf-8')).decode('utf-8').rstrip('=')
            
            now = int(time.time())
            payload = {
                "iss": client_email,
                "scope": "https://www.googleapis.com/auth/datastore",
                "aud": token_uri,
                "exp": now + 3600,
                "iat": now
            }
            payload_b64 = base64.urlsafe_b64encode(json.dumps(payload).encode('utf-8')).decode('utf-8').rstrip('=')
            
            signing_input = f"{header_b64}.{payload_b64}".encode('utf-8')
            private_key = serialization.load_pem_private_key(
                private_key_pem.encode('utf-8'),
                password=None
            )
            signature = private_key.sign(
                signing_input,
                padding.PKCS1v15(),
                hashes.SHA256()
            )
            sig_b64 = base64.urlsafe_b64encode(signature).decode('utf-8').rstrip('=')
            jwt = f"{header_b64}.{payload_b64}.{sig_b64}"
            
            data = urllib.parse.urlencode({
                "grant_type": "urn:ietf:params:oauth:grant-type:jwt-bearer",
                "assertion": jwt
            }).encode("utf-8")
            
            req = urllib.request.Request(
                token_uri,
                data=data,
                headers={"Content-Type": "application/x-www-form-urlencoded"},
                method="POST"
            )
            with urllib.request.urlopen(req, timeout=4) as res:
                res_data = json.loads(res.read().decode('utf-8'))
                return res_data.get("access_token")
        except Exception as e:
            print(f"[DBManager] Failed to generate OAuth2 token from service account: {e}")
    return None

def get_firebase_api_key():
    api_key = os.environ.get("FIREBASE_API_KEY")
    if api_key:
        return api_key
    gs_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "google-services.json")
    if os.path.exists(gs_path):
        try:
            with open(gs_path, "r") as f:
                data = json.load(f)
                clients = data.get("client", [])
                if clients:
                    api_keys = clients[0].get("api_key", [])
                    if api_keys:
                        return api_keys[0].get("current_key")
        except Exception:
            pass
    return None

def get_sqlite_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

# Conversion utilities for Firestore REST API
def dict_to_firestore(d):
    fields = {}
    for k, v in d.items():
        if v is None:
            fields[k] = {"nullValue": None}
        elif isinstance(v, bool):
            fields[k] = {"booleanValue": v}
        elif isinstance(v, (int, float)):
            fields[k] = {"doubleValue": float(v)}
        else:
            fields[k] = {"stringValue": str(v)}
    return {"fields": fields}

def firestore_to_dict(f):
    d = {}
    fields = f.get("fields", {})
    for k, val_dict in fields.items():
        if "stringValue" in val_dict:
            d[k] = val_dict["stringValue"]
        elif "doubleValue" in val_dict:
            d[k] = float(val_dict["doubleValue"])
        elif "integerValue" in val_dict:
            d[k] = int(val_dict["integerValue"])
        elif "booleanValue" in val_dict:
            d[k] = val_dict["booleanValue"]
        elif "nullValue" in val_dict:
            d[k] = None
        else:
            d[k] = list(val_dict.values())[0] if val_dict else None
    return d

class DBManager:
    @staticmethod
    def get_db_routing(customer_id: str) -> str:
        """Determines which database to route the customer's data to."""
        if customer_id == "C_RURAL_NARENDHIRA":
            return "firestore"
        elif customer_id == "C_POLICE_VIKRAM":
            return "supabase"
        # All default profiles are stored in Supabase in production, SQLite locally
        return "supabase" if os.environ.get("SUPABASE_PASSWORD") else "sqlite"

    @staticmethod
    def _firestore_request(collection: str, doc_id: str = None, method: str = "GET", payload: dict = None):
        """Communicates with Google Firestore REST API."""
        url = f"https://firestore.googleapis.com/v1/projects/{FIRESTORE_PROJECT_ID}/databases/(default)/documents/{collection}"
        if doc_id:
            url += f"/{doc_id}"
        
        headers = {"Content-Type": "application/json"}
        
        # 1. Try Service Account Authentication
        token = get_firebase_token()
        if token:
            headers["Authorization"] = f"Bearer {token}"
        else:
            # 2. Fall back to API Key
            api_key = get_firebase_api_key()
            if api_key:
                url += f"?key={api_key}"
            
        try:
            data_bytes = json.dumps(payload).encode("utf-8") if payload else None
            req = urllib.request.Request(url, data=data_bytes, headers=headers, method=method)
            with urllib.request.urlopen(req, timeout=4) as res:
                return json.loads(res.read().decode("utf-8"))
        except Exception as e:
            # Fail silently to trigger local SQLite fallback
            raise ConnectionError(f"Firestore REST connection failed: {e}")

    @staticmethod
    def _supabase_execute(query_str: str, params: tuple = (), fetch: str = "all"):
        """Executes a SQL query on Supabase PostgreSQL database."""
        password = os.environ.get("SUPABASE_PASSWORD")
        if not password:
            raise ConnectionError("SUPABASE_PASSWORD not set.")
        
        try:
            import pg8000
        except ImportError:
            raise ConnectionError("pg8000 dependency not installed.")

        conn = None
        try:
            conn = pg8000.connect(
                host=SUPABASE_HOST,
                port=SUPABASE_PORT,
                database=SUPABASE_DB,
                user=SUPABASE_USER,
                password=password,
                timeout=3
            )
            cursor = conn.cursor()
            
            # Translate SQLite parameterized queries (?) to PostgreSQL (%s)
            formatted_query = query_str.replace("?", "%s")
            
            cursor.execute(formatted_query, params)
            
            if fetch == "all":
                # Convert tuples to dictionary using cursor description
                desc = cursor.description
                columns = [col[0] for col in desc]
                results = []
                for row in cursor.fetchall():
                    results.append(dict(zip(columns, row)))
                return results
            elif fetch == "one":
                row = cursor.fetchone()
                if row:
                    desc = cursor.description
                    columns = [col[0] for col in desc]
                    return dict(zip(columns, row))
                return None
            else:
                conn.commit()
                return cursor.rowcount
        except Exception as e:
            raise ConnectionError(f"Supabase connection/execution failed: {e}")
        finally:
            if conn:
                conn.close()

    @classmethod
    def get_customer(cls, customer_id: str):
        db_type = cls.get_db_routing(customer_id)
        
        if db_type == "firestore":
            try:
                doc = cls._firestore_request("customers", customer_id)
                return firestore_to_dict(doc)
            except Exception as e:
                print(f"[DBManager] Firestore error: {e}. Falling back to SQLite.")
                db_type = "sqlite"

        if db_type == "supabase":
            try:
                return cls._supabase_execute("SELECT * FROM customers WHERE customer_id = ?", (customer_id,), fetch="one")
            except Exception as e:
                print(f"[DBManager] Supabase error: {e}. Falling back to SQLite.")
                db_type = "sqlite"

        if db_type == "sqlite":
            conn = get_sqlite_connection()
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM customers WHERE customer_id = ?", (customer_id,))
            row = cursor.fetchone()
            conn.close()
            return dict(row) if row else None

    @classmethod
    def get_accounts(cls, customer_id: str):
        db_type = cls.get_db_routing(customer_id)
        
        if db_type == "firestore":
            try:
                # Firestore query for subcollection or simulated doc structure
                doc = cls._firestore_request("accounts", f"ACC_{customer_id}")
                return [firestore_to_dict(doc)]
            except Exception:
                db_type = "sqlite"

        if db_type == "supabase":
            try:
                return cls._supabase_execute("SELECT * FROM accounts WHERE customer_id = ?", (customer_id,))
            except Exception:
                db_type = "sqlite"

        if db_type == "sqlite":
            conn = get_sqlite_connection()
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM accounts WHERE customer_id = ?", (customer_id,))
            rows = [dict(r) for r in cursor.fetchall()]
            conn.close()
            return rows

    @classmethod
    def get_transactions(cls, account_ids: list):
        if not account_ids:
            return []
        
        # Determine routing from the first account_id
        db_type = "sqlite"
        if "NARENDHIRA" in account_ids[0]:
            db_type = cls.get_db_routing("C_RURAL_NARENDHIRA")
        elif "VIKRAM" in account_ids[0]:
            db_type = cls.get_db_routing("C_POLICE_VIKRAM")
            
        if db_type == "firestore":
            try:
                # Return standard transactions
                doc = cls._firestore_request("transactions", f"TX_{account_ids[0]}")
                return [firestore_to_dict(doc)]
            except Exception:
                db_type = "sqlite"

        if db_type == "supabase":
            try:
                placeholders = ",".join("?" for _ in account_ids)
                return cls._supabase_execute(f"SELECT * FROM transactions WHERE account_id IN ({placeholders}) ORDER BY transaction_date DESC", tuple(account_ids))
            except Exception:
                db_type = "sqlite"

        if db_type == "sqlite":
            conn = get_sqlite_connection()
            cursor = conn.cursor()
            placeholders = ",".join("?" for _ in account_ids)
            cursor.execute(f"SELECT * FROM transactions WHERE account_id IN ({placeholders}) ORDER BY transaction_date DESC", account_ids)
            rows = [dict(r) for r in cursor.fetchall()]
            conn.close()
            return rows

    @classmethod
    def get_loans(cls, customer_id: str):
        db_type = cls.get_db_routing(customer_id)
        
        if db_type == "firestore":
            try:
                doc = cls._firestore_request("loans", f"LOAN_{customer_id}")
                return [firestore_to_dict(doc)]
            except Exception:
                db_type = "sqlite"

        if db_type == "supabase":
            try:
                return cls._supabase_execute("SELECT * FROM loans WHERE customer_id = ?", (customer_id,))
            except Exception:
                db_type = "sqlite"

        if db_type == "sqlite":
            conn = get_sqlite_connection()
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM loans WHERE customer_id = ?", (customer_id,))
            rows = [dict(r) for r in cursor.fetchall()]
            conn.close()
            return rows

    @classmethod
    def get_insurance_policies(cls, customer_id: str):
        db_type = cls.get_db_routing(customer_id)
        
        if db_type == "firestore":
            try:
                # In Firestore, let's query all docs in policies collection filtered by customer_id
                # Or just read a document holding the customer's policy list
                doc = cls._firestore_request("insurance_policies", f"INS_{customer_id}")
                data = firestore_to_dict(doc)
                if "policies" in data:
                    return json.loads(data["policies"])
                return [data]
            except Exception:
                db_type = "sqlite"

        if db_type == "supabase":
            try:
                return cls._supabase_execute("SELECT * FROM insurance_policies WHERE customer_id = ?", (customer_id,))
            except Exception:
                db_type = "sqlite"

        if db_type == "sqlite":
            conn = get_sqlite_connection()
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM insurance_policies WHERE customer_id = ?", (customer_id,))
            rows = [dict(r) for r in cursor.fetchall()]
            conn.close()
            return rows

    @classmethod
    def save_agent_audit_log(cls, customer_id: str, scenario: str, agent_name: str, status: str, decision: str, reasoning: str, output_data: dict):
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        db_type = cls.get_db_routing(customer_id)

        if db_type == "firestore":
            try:
                payload = dict_to_firestore({
                    "customer_id": customer_id,
                    "timestamp": timestamp,
                    "scenario": scenario,
                    "agent_name": agent_name,
                    "status": status,
                    "decision": decision,
                    "reasoning": reasoning,
                    "output_data": json.dumps(output_data)
                })
                # Add log with timestamped document ID
                log_id = f"LOG_{customer_id}_{int(datetime.now().timestamp())}"
                cls._firestore_request("agent_audit_logs", log_id, method="PATCH", payload=payload)
                return
            except Exception:
                db_type = "sqlite"

        if db_type == "supabase":
            try:
                cls._supabase_execute(
                    "INSERT INTO agent_audit_logs (customer_id, timestamp, scenario, agent_name, status, decision, reasoning, output_data) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                    (customer_id, timestamp, scenario, agent_name, status, decision, reasoning, json.dumps(output_data)),
                    fetch="none"
                )
                return
            except Exception:
                db_type = "sqlite"

        if db_type == "sqlite":
            conn = get_sqlite_connection()
            cursor = conn.cursor()
            cursor.execute("""
            INSERT INTO agent_audit_logs (customer_id, timestamp, scenario, agent_name, status, decision, reasoning, output_data)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (customer_id, timestamp, scenario, agent_name, status, decision, reasoning, json.dumps(output_data)))
            conn.commit()
            conn.close()

    @classmethod
    def get_compliance_logs(cls):
        # We merge SQLite and Supabase compliance logs for comprehensive analysis
        logs = []
        
        # 1. Supabase logs
        if os.environ.get("SUPABASE_PASSWORD"):
            try:
                logs += cls._supabase_execute("SELECT * FROM agent_audit_logs ORDER BY id DESC LIMIT 50")
            except Exception:
                pass
                
        # 2. SQLite logs
        conn = get_sqlite_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM agent_audit_logs ORDER BY id DESC LIMIT 50")
        logs += [dict(r) for r in cursor.fetchall()]
        conn.close()
        
        # Sort combined logs by timestamp descending
        logs.sort(key=lambda x: x.get("timestamp", ""), reverse=True)
        return logs[:100]

    @classmethod
    def execute_banking_action(cls, customer_id: str, action_type: str) -> str:
        conn = get_sqlite_connection()
        cursor = conn.cursor()
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        status = "SUCCESS"
        details = ""
        
        if action_type == "ACTIVATE_PMSBY":
            details = "Pradhan Mantri Suraksha Bima Yojana (PMSBY) activated. Premium of INR 20 auto-debited. Cover of INR 2,00,000 active."
            cursor.execute("UPDATE accounts SET balance = balance - 20.00 WHERE customer_id = ?", (customer_id,))
            cursor.execute("UPDATE accounts SET account_status = 'Active' WHERE customer_id = ?", (customer_id,))
            cursor.execute("""
            INSERT INTO transactions (transaction_id, account_id, transaction_date, transaction_media, transaction_type, transaction_amount)
            VALUES (?, (SELECT account_id FROM accounts WHERE customer_id = ? LIMIT 1), ?, 'System', 'Transfer', 20.0)
            """, (f"T_PMSBY_{customer_id[:4]}_{int(datetime.now().timestamp())[-4:]}", customer_id, timestamp[:10]))
            
            # Sync to Firestore if farmer
            db_type = cls.get_db_routing(customer_id)
            if db_type == "firestore":
                try:
                    # Update policy status in Firestore
                    payload = dict_to_firestore({
                        "policy_id": "POL_MODI_PMSBY",
                        "customer_id": customer_id,
                        "policy_name": "PMSBY Accidental cover",
                        "policy_type": "Accidental",
                        "sum_assured": 200000.0,
                        "annual_premium": 20.0,
                        "status": "Active",
                        "expiry_date": "2027-06-01"
                    })
                    cls._firestore_request("insurance_policies", "POL_MODI_PMSBY", method="PATCH", payload=payload)
                except Exception:
                    pass
            
            # Sync to Supabase if Vikram/other
            if db_type == "supabase":
                try:
                    cls._supabase_execute("UPDATE accounts SET balance = balance - 20.00 WHERE customer_id = ?", (customer_id,), fetch="none")
                    cls._supabase_execute("UPDATE accounts SET account_status = 'Active' WHERE customer_id = ?", (customer_id,), fetch="none")
                    cls._supabase_execute(
                        "INSERT INTO transactions (transaction_id, account_id, transaction_date, transaction_media, transaction_type, transaction_amount) VALUES (?, (SELECT account_id FROM accounts WHERE customer_id = ? LIMIT 1), ?, 'System', 'Transfer', 20.0)",
                        (f"T_PMSBY_{customer_id[:4]}", customer_id, timestamp[:10]),
                        fetch="none"
                    )
                except Exception:
                    pass

        elif action_type == "APPLY_MUDRA":
            details = "SBI Shishu Mudra Loan approved and INR 50,000 disbursed instantly to savings account."
            cursor.execute("""
            INSERT INTO loans (loan_id, customer_id, branch_id, loan_amount, loan_type, interest_rate, loan_term, status, monthly_emi)
            VALUES (?, ?, 'B00038', 50000.0, 'MSME Mudra', 9.5, 36, 'Approved', 1500.0)
            """, (f"L_MUDRA_{customer_id[:4]}", customer_id))
            cursor.execute("UPDATE accounts SET balance = balance + 50000.0 WHERE customer_id = ?", (customer_id,))
            cursor.execute("""
            INSERT INTO transactions (transaction_id, account_id, transaction_date, transaction_media, transaction_type, transaction_amount)
            VALUES (?, (SELECT account_id FROM accounts WHERE customer_id = ? LIMIT 1), ?, 'System', 'Deposit', 50000.0)
            """, (f"T_MUDRA_{customer_id[:4]}", customer_id, timestamp[:10]))
            
            db_type = cls.get_db_routing(customer_id)
            if db_type == "supabase":
                try:
                    cls._supabase_execute(
                        "INSERT INTO loans (loan_id, customer_id, branch_id, loan_amount, loan_type, interest_rate, loan_term, status, monthly_emi) VALUES (?, ?, 'B00038', 50000.0, 'MSME Mudra', 9.5, 36, 'Approved', 1500.0)",
                        (f"L_MUDRA_{customer_id[:4]}", customer_id),
                        fetch="none"
                    )
                    cls._supabase_execute("UPDATE accounts SET balance = balance + 50000.0 WHERE customer_id = ?", (customer_id,), fetch="none")
                    cls._supabase_execute(
                        "INSERT INTO transactions (transaction_id, account_id, transaction_date, transaction_media, transaction_type, transaction_amount) VALUES (?, (SELECT account_id FROM accounts WHERE customer_id = ? LIMIT 1), ?, 'System', 'Deposit', 50000.0)",
                        (f"T_MUDRA_{customer_id[:4]}", customer_id, timestamp[:10]),
                        fetch="none"
                    )
                except Exception:
                    pass

        elif action_type == "SETUP_FD_SWEEP":
            details = "SBI MODS (Fixed Deposit Auto-Sweep) configured. Threshold set at INR 20,000. Surplus sweeps in units of INR 5,000 yielding 6.8% interest."
            
        else:
            status = "FAILED"
            details = f"Unknown banking action: {action_type}"
            
        cursor.execute("""
        INSERT INTO agent_audit_logs (customer_id, timestamp, scenario, agent_name, status, decision, reasoning, output_data)
        VALUES (?, ?, ?, 'Core Banking System', ?, 'EXECUTE', ?, ?)
        """, (
            customer_id,
            timestamp,
            "Transaction Action",
            status,
            details,
            json.dumps({"action": action_type})
        ))
        
        conn.commit()
        conn.close()
        return details

    @classmethod
    def init_supabase_db(cls):
        """Creates and seeds the tables in Supabase PostgreSQL if they do not exist."""
        password = os.environ.get("SUPABASE_PASSWORD")
        if not password:
            return
            
        print("[DBManager] Initializing Supabase PostgreSQL Schema...")
        
        # Create Tables DDL
        ddls = [
            """
            CREATE TABLE IF NOT EXISTS customers (
                customer_id TEXT PRIMARY KEY,
                first_name TEXT,
                last_name TEXT,
                city TEXT,
                phone_number TEXT,
                occupation TEXT,
                dob TEXT,
                age INTEGER,
                gender TEXT,
                email TEXT
            )
            """,
            """
            CREATE TABLE IF NOT EXISTS accounts (
                account_id TEXT PRIMARY KEY,
                customer_id TEXT,
                branch_id TEXT,
                balance REAL,
                account_open_date TEXT,
                account_type TEXT,
                account_status TEXT
            )
            """,
            """
            CREATE TABLE IF NOT EXISTS transactions (
                transaction_id TEXT PRIMARY KEY,
                account_id TEXT,
                transaction_date TEXT,
                transaction_media TEXT,
                transaction_type TEXT,
                transaction_amount REAL
            )
            """,
            """
            CREATE TABLE IF NOT EXISTS loans (
                loan_id TEXT PRIMARY KEY,
                customer_id TEXT,
                branch_id TEXT,
                loan_amount REAL,
                loan_type TEXT,
                interest_rate REAL,
                loan_term INTEGER,
                status TEXT,
                monthly_emi REAL
            )
            """,
            """
            CREATE TABLE IF NOT EXISTS insurance_policies (
                policy_id TEXT PRIMARY KEY,
                customer_id TEXT,
                policy_name TEXT,
                policy_type TEXT,
                sum_assured REAL,
                annual_premium REAL,
                status TEXT,
                expiry_date TEXT
            )
            """,
            """
            CREATE TABLE IF NOT EXISTS agent_audit_logs (
                id SERIAL PRIMARY KEY,
                customer_id TEXT,
                timestamp TEXT,
                scenario TEXT,
                agent_name TEXT,
                status TEXT,
                decision TEXT,
                reasoning TEXT,
                output_data TEXT
            )
            """
        ]
        
        for ddl in ddls:
            try:
                cls._supabase_execute(ddl, fetch="none")
            except Exception as e:
                print(f"[DBManager] Supabase DDL execution warning: {e}")
                
        # Seed Supabase with Vikram Singh and other scenarios
        try:
            # Check if Vikram already exists in Supabase
            check = cls._supabase_execute("SELECT count(*) as count FROM customers WHERE customer_id = 'C_POLICE_VIKRAM'", fetch="one")
            if check and check.get("count", 0) > 0:
                print("[DBManager] Supabase already seeded.")
                return
                
            print("[DBManager] Seeding Supabase PostgreSQL table records...")
            
            # Seed Vikram Singh
            cls._supabase_execute(
                "INSERT INTO customers (customer_id, first_name, last_name, city, phone_number, occupation, dob, age, gender, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                ('C_POLICE_VIKRAM', 'Vikram', 'Singh', 'Jaipur', '9876543211', 'Police officer', '1984-06-15', 42, 'Male', 'vikram.singh@police-mock.in'),
                fetch="none"
            )
            cls._supabase_execute(
                "INSERT INTO accounts (account_id, customer_id, branch_id, balance, account_open_date, account_type, account_status) VALUES (?, ?, ?, ?, ?, ?, ?)",
                ('A_POLICE_VIKRAM', 'C_POLICE_VIKRAM', 'B00021', 125000.00, '2019-10-10', 'Savings', 'Active'),
                fetch="none"
            )
            vikram_txs = [
                ('T_V1', 'A_POLICE_VIKRAM', '2026-06-01', 'Transfer', 'Deposit', 65000.00),
                ('T_V2', 'A_POLICE_VIKRAM', '2026-06-03', 'Debit_Card', 'Withdrawal', 12000.00),
                ('T_V3', 'A_POLICE_VIKRAM', '2026-06-05', 'UPI', 'Deposit', 3000.00)
            ]
            for tx in vikram_txs:
                cls._supabase_execute(
                    "INSERT INTO transactions (transaction_id, account_id, transaction_date, transaction_media, transaction_type, transaction_amount) VALUES (?, ?, ?, ?, ?, ?)",
                    tx,
                    fetch="none"
                )
            cls._supabase_execute(
                "INSERT INTO loans (loan_id, customer_id, branch_id, loan_amount, loan_type, interest_rate, loan_term, status, monthly_emi) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                ('L_VIKRAM_HOME', 'C_POLICE_VIKRAM', 'B00021', 2000000.00, 'Mortgage', 8.5, 120, 'Approved', 24000.00),
                fetch="none"
            )
            
            # Seed policies
            policies = [
                ('POL_VIKRAM_PMSBY', 'C_POLICE_VIKRAM', 'PMSBY Accidental cover', 'Accidental', 200000.00, 20.00, 'Active', '2027-06-01'),
                ('POL_VIKRAM_HEALTH', 'C_POLICE_VIKRAM', 'SBI Arogya Health', 'Health', 300000.00, 6500.00, 'Active', '2027-04-10'),
                ('POL_VIKRAM_LIFE', 'C_POLICE_VIKRAM', 'PMJJBY Life cover', 'Life', 0.00, 0.00, 'Inactive', 'N/A')
            ]
            for pol in policies:
                cls._supabase_execute(
                    "INSERT INTO insurance_policies (policy_id, customer_id, policy_name, policy_type, sum_assured, annual_premium, status, expiry_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                    pol,
                    fetch="none"
                )
            print("[DBManager] Supabase seeding complete.")
        except Exception as e:
            print(f"[DBManager] Supabase seeding warning: {e}")

    @classmethod
    def init_firestore_db(cls):
        """Initializes and seeds Google Firestore with farmer scenario details if writeable."""
        print("[DBManager] Initializing and seeding Google Firestore...")
        
        farmer_data = {
            "customer_id": "C_RURAL_NARENDHIRA",
            "first_name": "Narendhira",
            "last_name": "modi",
            "city": "Vadnagar",
            "phone_number": "9876543210",
            "occupation": "Public Servant",
            "dob": "1950-09-17",
            "age": 75,
            "gender": "Male",
            "email": "narendhira.modi@pmo.in"
        }
        
        try:
            # Seed Customer
            cls._firestore_request("customers", "C_RURAL_NARENDHIRA", method="PATCH", payload=dict_to_firestore(farmer_data))
            
            # Seed Account
            acc_data = {
                "account_id": "A_RURAL_NARENDHIRA",
                "customer_id": "C_RURAL_NARENDHIRA",
                "branch_id": "B00019",
                "balance": 4500.00,
                "account_open_date": "2018-05-12",
                "account_type": "Savings",
                "account_status": "Dormant"
            }
            cls._firestore_request("accounts", "ACC_C_RURAL_NARENDHIRA", method="PATCH", payload=dict_to_firestore(acc_data))
            
            # Seed Transactions
            tx_data = {
                "transaction_id": "T_R1",
                "account_id": "A_RURAL_NARENDHIRA",
                "transaction_date": "2024-11-10",
                "transaction_media": "Cash",
                "transaction_type": "Withdrawal",
                "transaction_amount": 1000.0
            }
            cls._firestore_request("transactions", "TX_A_RURAL_NARENDHIRA", method="PATCH", payload=dict_to_firestore(tx_data))
            
            # Seed Loans
            loan_data = {
                "loan_id": "L_NONE",
                "customer_id": "C_RURAL_NARENDHIRA",
                "branch_id": "N/A",
                "loan_amount": 0.0,
                "loan_type": "None",
                "interest_rate": 0.0,
                "loan_term": 0,
                "status": "Inactive",
                "monthly_emi": 0.0
            }
            cls._firestore_request("loans", "LOAN_C_RURAL_NARENDHIRA", method="PATCH", payload=dict_to_firestore(loan_data))
            
            # Seed Policies
            policies_list = [
                {"policy_id": "POL_MODI_PMSBY", "customer_id": "C_RURAL_NARENDHIRA", "policy_name": "PMSBY Accidental cover", "policy_type": "Accidental", "sum_assured": 200000.0, "annual_premium": 20.0, "status": "Lapsed", "expiry_date": "2025-06-01"},
                {"policy_id": "POL_MODI_PMJJBY", "customer_id": "C_RURAL_NARENDHIRA", "policy_name": "PMJJBY Life cover", "policy_type": "Life", "sum_assured": 200000.0, "annual_premium": 436.0, "status": "Lapsed", "expiry_date": "2025-06-01"}
            ]
            cls._firestore_request("insurance_policies", "INS_C_RURAL_NARENDHIRA", method="PATCH", payload=dict_to_firestore({
                "policies": json.dumps(policies_list)
            }))
            
            print("[DBManager] Google Firestore seeding completed successfully!")
        except Exception as e:
            print(f"[DBManager] Google Firestore seeding failed/skipped: {e}. (Verify your security rules allow writes or supply a 'firebase-service-account.json' file in the workspace root)")
