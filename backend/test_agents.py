import os
import sys
from db import DB_PATH
from agents.engine import SFIAgentCore

def test_scenario_3_veto():
    print("Testing Scenario 3 (Ramesh Patel Veto Audit)...")
    core = SFIAgentCore(db_path=DB_PATH)
    
    # Run the workflow for Ramesh Patel with loan request
    state = core.run_workflow(
        customer_id="C_SALARIED_RAMESH",
        requested_action="APPLY_PERSONAL_LOAN",
        language="English"
    )
    
    # Assertions
    print(f"Customer Name: {state['customer_info']['first_name']} {state['customer_info']['last_name']}")
    print(f"Calculated Financial Health Score: {state['financial_scores']['final_health_score']}/100")
    
    # Verify we have all agent logs
    agent_names = [log['agent_name'] for log in state['agent_logs']]
    print(f"Executed Agents: {', '.join(agent_names)}")
    
    assert len(state['agent_logs']) >= 9, "Not all agents executed in the workflow."
    
    # Find personal loan action and check veto status
    loan_action = None
    for action in state['final_actions']:
        if "Personal Loan" in action['product_name']:
            loan_action = action
            break
            
    assert loan_action is not None, "Personal Loan recommendation was not generated."
    print(f"Personal Loan Action Status: {loan_action['status']}")
    print(f"Reason: {loan_action['reason'].replace('₹', 'INR')}")
    
    assert loan_action['status'] == "REJECTED_BY_TRUST", "Trust Agent failed to veto the over-leveraged personal loan!"
    print("Test passed: Trust Agent correctly vetoed the personal loan and provided alternative savings advice.")

def test_scenario_2_mudra_approval():
    print("\nTesting Scenario 2 (Sunita Devi MSME Mudra Approval)...")
    core = SFIAgentCore(db_path=DB_PATH)
    
    state = core.run_workflow(
        customer_id="C_SHOP_SUNITA",
        language="English"
    )
    
    # Verify Shishu Mudra Loan is approved
    mudra_action = None
    for action in state['final_actions']:
        if "Mudra Loan" in action['product_name']:
            mudra_action = action
            break
            
    assert mudra_action is not None, "Mudra Loan recommendation was not generated."
    print(f"Mudra Loan Status: {mudra_action['status']}")
    print(f"Reason: {mudra_action['reason'].replace('₹', 'INR')}")
    
    assert mudra_action['status'] == "APPROVED", "Mudra Loan should be approved for the shopkeeper."
    print("Test passed: Shishu Mudra Loan correctly recommended and approved.")

def test_scenario_1_pmsby_entitlement():
    print("\nTesting Scenario 1 (Narendhira modi Unclaimed PMSBY)...")
    core = SFIAgentCore(db_path=DB_PATH)
    
    state = core.run_workflow(
        customer_id="C_RURAL_NARENDHIRA",
        language="Hindi"
    )
    
    # Verify PMSBY is flagged as an unclaimed entitlement
    pmsby_ent = None
    for ent in state['entitlements']:
        if "PMSBY" in ent['scheme_name']:
            pmsby_ent = ent
            break
            
    assert pmsby_ent is not None, "PMSBY entitlement was not found."
    print(f"PMSBY Status: {pmsby_ent['status']}, Unclaimed: {pmsby_ent['unclaimed']}")
    
    assert pmsby_ent['unclaimed'] is True, "PMSBY should be flagged as unclaimed for rural dormant user."
    print("Test passed: Unclaimed PMSBY successfully identified.")

if __name__ == "__main__":
    try:
        test_scenario_3_veto()
        test_scenario_2_mudra_approval()
        test_scenario_1_pmsby_entitlement()
        print("\nAll unit tests passed successfully!")
    except AssertionError as e:
        print(f"\nTest failed: {e}")
        sys.exit(1)
