from langchain_core.prompts import PromptTemplate
from core.llm_engine import get_llm
from core.schemas import SupplyChainDisruption, InventoryImpact

def run_analyzer(disruption: SupplyChainDisruption) -> InventoryImpact:
    """
    The Analyzer Agent takes a validated disruption and evaluates the 
    inventory impact and financial risk.
    
    Args:
        disruption (SupplyChainDisruption): The detected disruption from the Scout agent.
        
    Returns:
        InventoryImpact: A strict Pydantic model with inventory and financial risk analysis.
    """
    # Low temperature for analytical consistency
    llm = get_llm(temperature=0.0)
    structured_llm = llm.with_structured_output(InventoryImpact)
    
    prompt = PromptTemplate(
        input_variables=["location", "severity", "materials", "description"],
        template=(
            "You are an expert Financial and Inventory Analyst AI.\n"
            "A supply chain disruption has been detected:\n"
            "- Location: {location}\n"
            "- Severity: {severity}\n"
            "- Affected Materials: {materials}\n"
            "- Details: {description}\n\n"
            "Given this crisis, estimate the days of inventory left, the financial risk in USD, "
            "and provide a concise qualitative risk assessment."
        )
    )
    
    chain = prompt | structured_llm
    
    # We pass the strongly-typed fields from the Scout's output
    result = chain.invoke({
        "location": disruption.location,
        "severity": disruption.severity_level,
        "materials": ", ".join(disruption.affected_materials),
        "description": disruption.description
    })
    
    return result
