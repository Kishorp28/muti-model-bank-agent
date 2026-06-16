import sqlite3
import csv
import os
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), "sfi_database.db")
DATASETS_DIR = os.environ.get("DATASETS_DIR", os.path.join(os.path.dirname(__file__), "datasets"))

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Create tables
    cursor.execute("""
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
    """)
    
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS accounts (
        account_id TEXT PRIMARY KEY,
        customer_id TEXT,
        branch_id TEXT,
        balance REAL,
        account_open_date TEXT,
        account_type TEXT,
        account_status TEXT,
        FOREIGN KEY(customer_id) REFERENCES customers(customer_id)
    )
    """)
    
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS transactions (
        transaction_id TEXT PRIMARY KEY,
        account_id TEXT,
        transaction_date TEXT,
        transaction_media TEXT,
        transaction_type TEXT,
        transaction_amount REAL,
        FOREIGN KEY(account_id) REFERENCES accounts(account_id)
    )
    """)
    
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS loans (
        loan_id TEXT PRIMARY KEY,
        customer_id TEXT,
        branch_id TEXT,
        loan_amount REAL,
        loan_type TEXT,
        interest_rate REAL,
        loan_term INTEGER,
        status TEXT,
        monthly_emi REAL,
        FOREIGN KEY(customer_id) REFERENCES customers(customer_id)
    )
    """)
    
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS insurance_policies (
        policy_id TEXT PRIMARY KEY,
        customer_id TEXT,
        policy_name TEXT,
        policy_type TEXT, -- Life, Health, Accidental, Pension
        sum_assured REAL,
        annual_premium REAL,
        status TEXT, -- Active, Inactive, Lapsed
        expiry_date TEXT,
        FOREIGN KEY(customer_id) REFERENCES customers(customer_id)
    )
    """)
    
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS agent_audit_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_id TEXT,
        timestamp TEXT,
        scenario TEXT,
        agent_name TEXT,
        status TEXT,
        decision TEXT,
        reasoning TEXT,
        output_data TEXT
    )
    """)
    
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        username TEXT PRIMARY KEY,
        password TEXT,
        role TEXT,
        customer_id TEXT
    )
    """)
    
    conn.commit()
    conn.close()

def seed_db():
    init_db()
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Check if already seeded (by scanning for Vikram Singh)
    cursor.execute("SELECT COUNT(*) FROM customers WHERE customer_id = 'C_POLICE_VIKRAM'")
    if cursor.fetchone()[0] > 0:
        print("Database already seeded with Vikram Singh.")
        # Ensure users are seeded even if other data exists
        cursor.execute("CREATE TABLE IF NOT EXISTS users (username TEXT PRIMARY KEY, password TEXT, role TEXT, customer_id TEXT)")
        cursor.execute("SELECT COUNT(*) FROM users")
        if cursor.fetchone()[0] == 0:
            users_list = [
                ("farmer", "sbi", "farmer", "C_RURAL_NARENDHIRA"),
                ("police", "sbi", "police", "C_POLICE_VIKRAM"),
                ("merchant", "sbi", "merchant", "C_SHOP_SUNITA"),
                ("salaried", "sbi", "salaried", "C_SALARIED_RAMESH"),
                ("developer", "sbi", "developer", "C_DEVELOPER")
            ]
            for user in users_list:
                cursor.execute("INSERT OR REPLACE INTO users (username, password, role, customer_id) VALUES (?, ?, ?, ?)", user)
            conn.commit()
        conn.close()
        return

    print("Seeding database from CSVs...")
    
    # Read Branches
    branches = {}
    branch_csv = os.path.join(DATASETS_DIR, "Bank_Branch_Data.csv")
    if os.path.exists(branch_csv):
        with open(branch_csv, mode='r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                branches[row['BRANCH_ID']] = row
                
    # Read Customers (limit to 300 to keep it fast)
    customer_csv = os.path.join(DATASETS_DIR, "Bank_Customer_Data.csv")
    customers_inserted = 0
    if os.path.exists(customer_csv):
        with open(customer_csv, mode='r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                if customers_inserted >= 300:
                    break
                dob_str = row.get('DOB', '1980-01-01')
                try:
                    dob_dt = datetime.strptime(dob_str, "%Y-%m-%d")
                    age = datetime.now().year - dob_dt.year
                except:
                    age = 40
                
                email = f"{row['First_Name'].lower()}.{row['Last_Name'].lower()}@sbi-mock.in"
                
                cursor.execute("""
                INSERT OR IGNORE INTO customers (customer_id, first_name, last_name, city, phone_number, occupation, dob, age, gender, email)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (row['CUSTOMER_ID'], row['First_Name'], row['Last_Name'], row['City'], row['Phone_Number'], row['Occupation'], dob_str, age, 'Male', email))
                customers_inserted += 1

    # Read Accounts
    account_csv = os.path.join(DATASETS_DIR, "Bank_Account_Data.csv")
    if os.path.exists(account_csv):
        with open(account_csv, mode='r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                cursor.execute("SELECT 1 FROM customers WHERE customer_id = ?", (row['CUSTOMER_ID'],))
                if cursor.fetchone():
                    cursor.execute("""
                    INSERT OR IGNORE INTO accounts (account_id, customer_id, branch_id, balance, account_open_date, account_type, account_status)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                    """, (row['ACCOUNT_ID'], row['CUSTOMER_ID'], row['BRANCH_ID'], float(row['OPENING_BALANCE']), row['ACCOUNT_OPEN_DATE'], row['ACCOUNT_TYPE'], row['ACCOUNT_STATUS']))

    # Read Transactions
    transaction_csv = os.path.join(DATASETS_DIR, "Bank_Transacation_Data.csv")
    if os.path.exists(transaction_csv):
        with open(transaction_csv, mode='r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                cursor.execute("SELECT 1 FROM accounts WHERE account_id = ?", (row['ACCOUNT_ID'],))
                if cursor.fetchone():
                    cursor.execute("""
                    INSERT OR IGNORE INTO transactions (transaction_id, account_id, transaction_date, transaction_media, transaction_type, transaction_amount)
                    VALUES (?, ?, ?, ?, ?, ?)
                    """, (row['TRANSCATION_ID'], row['ACCOUNT_ID'], row['TRANSCATION_DATE'], row['TRANSCATION_MEDIA'], row['TRANSCATION_TYPE'], float(row['TRANSCATION_AMOUNT'])))

    # Read Loans
    loan_csv = os.path.join(DATASETS_DIR, "Bank_Loan_Data.csv")
    if os.path.exists(loan_csv):
        with open(loan_csv, mode='r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                cursor.execute("SELECT 1 FROM customers WHERE customer_id = ?", (row['CUSTOMER_ID'],))
                if cursor.fetchone():
                    amt = float(row['LOAN_AMOUNT'])
                    emi = round(amt * 0.015, 2)
                    cursor.execute("""
                    INSERT OR IGNORE INTO loans (loan_id, customer_id, branch_id, loan_amount, loan_type, interest_rate, loan_term, status, monthly_emi)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """, (row['LOAN_ID'], row['CUSTOMER_ID'], row['BRANCH_ID'], amt, 'Personal', 11.5, 36, 'Approved', emi))

    # ==================== INJECT FLAGSHIP CUSTOMERS ====================
    print("Injecting flagship demo scenario customers...")

    # Clear old Rajesh Kumar scenario records
    cursor.execute("DELETE FROM customers WHERE customer_id = 'C_RURAL_RAJESH'")
    cursor.execute("DELETE FROM accounts WHERE customer_id = 'C_RURAL_RAJESH'")
    cursor.execute("DELETE FROM transactions WHERE account_id = 'A_RURAL_RAJESH'")
    cursor.execute("DELETE FROM loans WHERE customer_id = 'C_RURAL_RAJESH'")
    cursor.execute("DELETE FROM insurance_policies WHERE customer_id = 'C_RURAL_RAJESH'")

    # Scenario 1: Narendhira modi (Dormant Rural Activist)
    cursor.execute("""
    INSERT OR REPLACE INTO customers (customer_id, first_name, last_name, city, phone_number, occupation, dob, age, gender, email)
    VALUES ('C_RURAL_NARENDHIRA', 'Narendhira', 'modi', 'Vadnagar', '9876543210', 'Public Servant', '1950-09-17', 75, 'Male', 'narendhira.modi@pmo.in')
    """)
    cursor.execute("""
    INSERT OR REPLACE INTO accounts (account_id, customer_id, branch_id, balance, account_open_date, account_type, account_status)
    VALUES ('A_RURAL_NARENDHIRA', 'C_RURAL_NARENDHIRA', 'B00019', 4500.00, '2018-05-12', 'Savings', 'Dormant')
    """)
    cursor.execute("DELETE FROM transactions WHERE account_id = 'A_RURAL_NARENDHIRA'")
    cursor.execute("""
    INSERT INTO transactions (transaction_id, account_id, transaction_date, transaction_media, transaction_type, transaction_amount)
    VALUES 
    ('T_R1', 'A_RURAL_NARENDHIRA', '2024-11-10', 'Cash', 'Withdrawal', 1000.0),
    ('T_R2', 'A_RURAL_NARENDHIRA', '2024-12-05', 'Cash', 'Deposit', 200.0)
    """)

    # Scenario 2: Sunita Devi (Small Shopkeeper)
    cursor.execute("""
    INSERT OR REPLACE INTO customers (customer_id, first_name, last_name, city, phone_number, occupation, dob, age, gender, email)
    VALUES ('C_SHOP_SUNITA', 'Sunita', 'Devi', 'Patna', '8765432109', 'Kirana Shopkeeper', '1988-11-22', 38, 'Female', 'sunita.kirana@patnamail.com')
    """)
    cursor.execute("""
    INSERT OR REPLACE INTO accounts (account_id, customer_id, branch_id, balance, account_open_date, account_type, account_status)
    VALUES ('A_SHOP_SUNITA', 'C_SHOP_SUNITA', 'B00038', 54200.00, '2020-03-15', 'Savings', 'Active')
    """)
    cursor.execute("DELETE FROM transactions WHERE account_id = 'A_SHOP_SUNITA'")
    upi_txs = [
        ('T_S1', '2026-05-01', 'UPI', 'Deposit', 350.00),
        ('T_S2', '2026-05-02', 'UPI', 'Deposit', 1200.00),
        ('T_S3', '2026-05-03', 'UPI', 'Deposit', 750.00),
        ('T_S4', '2026-05-04', 'UPI', 'Deposit', 1500.00),
        ('T_S5', '2026-05-06', 'UPI', 'Deposit', 400.00),
        ('T_S6', '2026-05-08', 'UPI', 'Deposit', 2100.00),
        ('T_S7', '2026-05-10', 'UPI', 'Deposit', 650.00),
        ('T_S8', '2026-05-11', 'UPI', 'Deposit', 800.00),
        ('T_S9', '2026-05-12', 'UPI', 'Deposit', 1450.00),
        ('T_S10', '2026-05-15', 'UPI', 'Deposit', 3500.00),
        ('T_S11', '2026-05-16', 'UPI', 'Deposit', 950.00),
        ('T_S12', '2026-05-18', 'UPI', 'Deposit', 200.00),
        ('T_S13', '2026-05-20', 'UPI', 'Deposit', 1800.00),
        ('T_S14', '2026-05-22', 'UPI', 'Deposit', 1100.00),
        ('T_S15', '2026-05-25', 'UPI', 'Deposit', 2500.00),
        ('T_S16', '2026-05-27', 'UPI', 'Deposit', 600.00),
        ('T_S17', '2026-05-30', 'UPI', 'Deposit', 1400.00),
        ('T_S18', '2026-06-01', 'UPI', 'Deposit', 3100.00),
        ('T_S19', '2026-06-03', 'UPI', 'Deposit', 500.00),
        ('T_S20', '2026-06-05', 'UPI', 'Deposit', 2200.00),
        ('T_S21', '2026-06-08', 'UPI', 'Deposit', 950.00),
        ('T_S22', '2026-06-10', 'UPI', 'Deposit', 1700.00),
        ('T_S23', '2026-06-12', 'UPI', 'Deposit', 4300.00),
        ('T_S24', '2026-06-14', 'UPI', 'Deposit', 1250.00)
    ]
    for tx_id, date, media, tx_type, amt in upi_txs:
        cursor.execute("""
        INSERT INTO transactions (transaction_id, account_id, transaction_date, transaction_media, transaction_type, transaction_amount)
        VALUES (?, ?, ?, ?, ?, ?)
        """, (tx_id, 'A_SHOP_SUNITA', date, media, tx_type, amt))

    # Scenario 3: Ramesh Patel (High Debt Salaried)
    cursor.execute("""
    INSERT OR REPLACE INTO customers (customer_id, first_name, last_name, city, phone_number, occupation, dob, age, gender, email)
    VALUES ('C_SALARIED_RAMESH', 'Ramesh', 'Patel', 'Ahmedabad', '7654321098', 'Senior Software Engineer', '1991-04-10', 35, 'Male', 'ramesh.patel@techcorp.com')
    """)
    cursor.execute("""
    INSERT OR REPLACE INTO accounts (account_id, customer_id, branch_id, balance, account_open_date, account_type, account_status)
    VALUES ('A_SALARIED_RAMESH', 'C_SALARIED_RAMESH', 'B00002', 120000.00, '2015-07-20', 'Savings', 'Active')
    """)
    cursor.execute("DELETE FROM transactions WHERE account_id = 'A_SALARIED_RAMESH'")
    ramesh_txs = [
        ('T_RA1', '2026-03-01', 'Transfer', 'Deposit', 180000.00), 
        ('T_RA2', '2026-03-05', 'Credit_Card', 'Purchase', 45000.00), 
        ('T_RA3', '2026-03-10', 'Debit_Card', 'Transfer', 35000.00), 
        ('T_RA4', '2026-03-10', 'Debit_Card', 'Transfer', 50000.00), 
        ('T_RA5', '2026-03-20', 'Credit_Card', 'Transfer', 20000.00), 
        ('T_RA6', '2026-04-01', 'Transfer', 'Deposit', 180000.00), 
        ('T_RA7', '2026-04-04', 'Credit_Card', 'Purchase', 65000.00), 
        ('T_RA8', '2026-04-10', 'Debit_Card', 'Transfer', 35000.00), 
        ('T_RA9', '2026-04-10', 'Debit_Card', 'Transfer', 50000.00), 
        ('T_RA10', '2026-04-20', 'Credit_Card', 'Transfer', 25000.00), 
        ('T_RA11', '2026-05-01', 'Transfer', 'Deposit', 180000.00), 
        ('T_RA12', '2026-05-05', 'Credit_Card', 'Purchase', 30000.00), 
        ('T_RA13', '2026-05-10', 'Debit_Card', 'Transfer', 35000.00), 
        ('T_RA14', '2026-05-10', 'Debit_Card', 'Transfer', 50000.00), 
        ('T_RA15', '2026-05-20', 'Credit_Card', 'Transfer', 20000.00), 
        ('T_RA16', '2026-06-01', 'Transfer', 'Deposit', 180000.00), 
        ('T_RA17', '2026-06-06', 'Credit_Card', 'Purchase', 55000.00), 
        ('T_RA18', '2026-06-10', 'Debit_Card', 'Transfer', 35000.00), 
        ('T_RA19', '2026-06-10', 'Debit_Card', 'Transfer', 50000.00), 
        ('T_RA20', '2026-06-15', 'Credit_Card', 'Transfer', 20000.00)  
    ]
    for tx_id, date, media, tx_type, amt in ramesh_txs:
        cursor.execute("""
        INSERT INTO transactions (transaction_id, account_id, transaction_date, transaction_media, transaction_type, transaction_amount)
        VALUES (?, ?, ?, ?, ?, ?)
        """, (tx_id, 'A_SALARIED_RAMESH', date, media, tx_type, amt))

    cursor.execute("DELETE FROM loans WHERE customer_id = 'C_SALARIED_RAMESH'")
    cursor.execute("""
    INSERT INTO loans (loan_id, customer_id, branch_id, loan_amount, loan_type, interest_rate, loan_term, status, monthly_emi)
    VALUES 
    ('L_RAMESH_PERS', 'C_SALARIED_RAMESH', 'B00002', 800000.00, 'Personal', 12.5, 36, 'Approved', 35000.00),
    ('L_RAMESH_HOME', 'C_SALARIED_RAMESH', 'B00002', 4500000.00, 'Mortgage', 8.75, 240, 'Approved', 50000.00)
    """)

    # Scenario 4: Vikram Singh (Police officer)
    cursor.execute("DELETE FROM customers WHERE customer_id = 'C_POLICE_VIKRAM'")
    cursor.execute("DELETE FROM accounts WHERE customer_id = 'C_POLICE_VIKRAM'")
    cursor.execute("""
    INSERT OR REPLACE INTO customers (customer_id, first_name, last_name, city, phone_number, occupation, dob, age, gender, email)
    VALUES ('C_POLICE_VIKRAM', 'Vikram', 'Singh', 'Jaipur', '9876543211', 'Police officer', '1984-06-15', 42, 'Male', 'vikram.singh@police-mock.in')
    """)
    cursor.execute("""
    INSERT OR REPLACE INTO accounts (account_id, customer_id, branch_id, balance, account_open_date, account_type, account_status)
    VALUES ('A_POLICE_VIKRAM', 'C_POLICE_VIKRAM', 'B00021', 125000.00, '2019-10-10', 'Savings', 'Active')
    """)
    cursor.execute("DELETE FROM transactions WHERE account_id = 'A_POLICE_VIKRAM'")
    vikram_txs = [
        ('T_V1', '2026-06-01', 'Transfer', 'Deposit', 65000.00),
        ('T_V2', '2026-06-03', 'Debit_Card', 'Withdrawal', 12000.00),
        ('T_V3', '2026-06-05', 'UPI', 'Deposit', 3000.00)
    ]
    for tx_id, date, media, tx_type, amt in vikram_txs:
        cursor.execute("""
        INSERT INTO transactions (transaction_id, account_id, transaction_date, transaction_media, transaction_type, transaction_amount)
        VALUES (?, ?, ?, ?, ?, ?)
        """, (tx_id, 'A_POLICE_VIKRAM', date, media, tx_type, amt))

    cursor.execute("DELETE FROM loans WHERE customer_id = 'C_POLICE_VIKRAM'")
    cursor.execute("""
    INSERT INTO loans (loan_id, customer_id, branch_id, loan_amount, loan_type, interest_rate, loan_term, status, monthly_emi)
    VALUES ('L_VIKRAM_HOME', 'C_POLICE_VIKRAM', 'B00021', 2000000.00, 'Mortgage', 8.5, 120, 'Approved', 24000.00)
    """)

    # ==================== SEED INSURANCE POLICIES ====================
    print("Seeding detailed insurance policies...")
    cursor.execute("DELETE FROM insurance_policies")
    
    policies = [
        # Narendhira modi policies (all unclaimed/lapsed)
        ('POL_MODI_PMSBY', 'C_RURAL_NARENDHIRA', 'PMSBY Accidental cover', 'Accidental', 200000.00, 20.00, 'Lapsed', '2025-06-01'),
        ('POL_MODI_PMJJBY', 'C_RURAL_NARENDHIRA', 'PMJJBY Life cover', 'Life', 200000.00, 436.00, 'Lapsed', '2025-06-01'),
        ('POL_MODI_HEALTH', 'C_RURAL_NARENDHIRA', 'SBI Arogya Health', 'Health', 0.00, 0.00, 'Inactive', 'N/A'),
        
        # Sunita Devi policies
        ('POL_SUNITA_PMSBY', 'C_SHOP_SUNITA', 'PMSBY Accidental cover', 'Accidental', 200000.00, 20.00, 'Lapsed', '2025-06-01'),
        ('POL_SUNITA_HEALTH', 'C_SHOP_SUNITA', 'SBI Arogya Premier', 'Health', 300000.00, 6500.00, 'Active', '2027-03-15'),
        ('POL_SUNITA_LIFE', 'C_SHOP_SUNITA', 'PMJJBY Life cover', 'Life', 0.00, 0.00, 'Inactive', 'N/A'),

        # Ramesh Patel policies (gap exists, sum assured is too low)
        ('POL_RAMESH_PMSBY', 'C_SALARIED_RAMESH', 'PMSBY Accidental cover', 'Accidental', 200000.00, 20.00, 'Active', '2027-06-01'),
        ('POL_RAMESH_HEALTH', 'C_SALARIED_RAMESH', 'SBI Arogya Premier', 'Health', 500000.00, 9500.00, 'Active', '2027-08-20'),
        ('POL_RAMESH_LIFE', 'C_SALARIED_RAMESH', 'SBI Life eShield', 'Life', 5000000.00, 18000.00, 'Active', '2027-12-15'),

        # Vikram Singh policies (no life insurance, has health and PMSBY)
        ('POL_VIKRAM_PMSBY', 'C_POLICE_VIKRAM', 'PMSBY Accidental cover', 'Accidental', 200000.00, 20.00, 'Active', '2027-06-01'),
        ('POL_VIKRAM_HEALTH', 'C_POLICE_VIKRAM', 'SBI Arogya Health', 'Health', 300000.00, 6500.00, 'Active', '2027-04-10'),
        ('POL_VIKRAM_LIFE', 'C_POLICE_VIKRAM', 'PMJJBY Life cover', 'Life', 0.00, 0.00, 'Inactive', 'N/A')
    ]
    
    for pol in policies:
        cursor.execute("""
        INSERT INTO insurance_policies (policy_id, customer_id, policy_name, policy_type, sum_assured, annual_premium, status, expiry_date)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, pol)

    conn.commit()
    conn.close()
    print("Database seeding completed successfully.")

if __name__ == "__main__":
    seed_db()
