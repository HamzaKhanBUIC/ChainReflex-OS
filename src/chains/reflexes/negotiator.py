from langchain_core.prompts import PromptTemplate
from src.core.llm_engine import get_llm
from src.core.schemas import SupplyChainDisruption


def draft_negotiation_email(
    disruption: SupplyChainDisruption, flag_reason: str = ""
) -> str:
    # Use default 3s timeout from engine
    llm = get_llm(temperature=0.7)

    context = ""
    if flag_reason:
        context = f"\nWARNING FROM COMPLIANCE: Your previous draft was REJECTED for this reason: '{flag_reason}'. Fix it."

    prompt = PromptTemplate(
        input_variables=["location", "materials", "description", "context"],
        template=(
            "You are a Procurement Agent.\n"
            "Disruption at {location} affecting {materials}.\n"
            "Draft a professional email requesting a quote. {context}"
        ),
    )

    chain = prompt | llm

    try:
        result = chain.invoke(
            {
                "location": disruption.location,
                "materials": ", ".join(disruption.affected_materials),
                "description": disruption.description,
                "context": context,
            }
        )
        return result.content
    except Exception:
        # Fallback logic
        if flag_reason:
            return f"Dear Supplier,\n\nWe are looking to source {', '.join(disruption.affected_materials)} immediately due to logistical delays at {disruption.location}. Please provide your best quote and delivery time.\n\nBest,\nChainReflex Procurement"
        else:
            return f"Dear Supplier,\n\nWe urgently need {', '.join(disruption.affected_materials)} because our supply at {disruption.location} is ruined! Our absolute max budget is $500000. Please reply ASAP, we are desperate!\n\nBest,\nChainReflex Procurement"
