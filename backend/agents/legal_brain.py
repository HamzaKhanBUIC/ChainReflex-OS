import time

def draft_legal_notice(disruption_data: dict, contract_text: str = 'Standard MSA') -> str:
    """
    Simulates a heavy 70B model processing a 500-page contract.
    """
    print("⚖️ [LEGAL BRAIN] Analyzing Force Majeure clauses against disruption...")
    
    # Simulate heavy processing
    time.sleep(2.5)
    
    location = disruption_data.get('location', 'Unknown Location')
    affected_materials = disruption_data.get('materials') or disruption_data.get('affected_materials', 'Unknown Materials')
    
    email = f"""SUBJECT: URGENT: Breach of SLA and Force Majeure Invocation - {location}

Dear Supplier Management,

This email serves as formal notification regarding the critical supply chain disruption at {location} affecting the delivery of {affected_materials}. 

Upon immediate review of our Master Services Agreement ({contract_text}), specifically Section 8.1: Force Majeure, we have determined that this disruption constitutes a material breach of our Service Level Agreement (SLA). 

We demand an immediate shipping refund for the affected batches. Furthermore, you are contractually obligated to provide alternative routing or sourcing for the {affected_materials} within 24 hours to mitigate further damages to our production schedule. 

Failure to comply will result in further legal action and potential termination of the vendor contract. We expect a formal response acknowledging this notice and detailing your immediate corrective action plan by End of Business today.

Sincerely,
ChainReflex Automated Legal Operations
"""
    
    return email
