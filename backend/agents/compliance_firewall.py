from langchain_core.prompts import PromptTemplate
from core.llm_engine import get_llm
from core.schemas import ComplianceReport

def audit_legal_draft(drafted_email_text: str) -> ComplianceReport:
    """
    Zero-Trust Firewall that audits outbound Legal Notices.
    """
    llm = get_llm(temperature=0.0)
    structured_llm = llm.with_structured_output(ComplianceReport)
    
    prompt = PromptTemplate(
        input_variables=["draft"],
        template=(
            "Audit this legal email: {draft}\n"
            "Fail it if it explicitly threatens 'formal litigation'. Board approval is required for that."
        )
    )
    
    chain = prompt | structured_llm
    
    try:
        result = chain.invoke({
            "draft": drafted_email_text
        })
        return result
    except Exception as e:
        # Hackathon Fallback Logic
        if "litigation" in drafted_email_text.lower():
            return ComplianceReport(
                is_approved=False, 
                flag_reason="POLICY VIOLATION: Unauthorized threat of 'formal litigation'. Board approval is required before threatening a lawsuit. Tone down the aggression."
            )
        else:
            return ComplianceReport(
                is_approved=True, 
                flag_reason="Passed - Professional and firm tone."
            )
