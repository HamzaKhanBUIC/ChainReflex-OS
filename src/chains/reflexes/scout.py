from langchain_core.prompts import PromptTemplate
from src.core.llm_engine import get_llm
from src.core.schemas import SupplyChainDisruption


def run_scout(context: str) -> SupplyChainDisruption:
    """
    The Scout Agent analyzes raw text (news, alerts, emails) to detect supply chain disruptions.
    It extracts the disruption details and maps them to the strict SupplyChainDisruption schema.

    Args:
        context (str): The raw text/alert describing the situation.

    Returns:
        SupplyChainDisruption: A validated Pydantic object containing the extracted data.
    """
    # Initialize our AMD ROCm vLLM engine with low temperature for extraction
    llm = get_llm(temperature=0.0)

    # We use LangChain's structured output capability.
    # This forces the local Llama-3 model to return JSON that perfectly matches our Pydantic schema.
    structured_llm = llm.with_structured_output(SupplyChainDisruption)

    prompt = PromptTemplate(
        input_variables=["context"],
        template=(
            "You are an expert Supply Chain Scout AI.\n"
            "Analyze the following intelligence report and extract the details "
            "of any supply chain disruption.\n\n"
            "Intelligence Report:\n{context}\n\n"
            "Extract the location, severity level, affected materials, and write a brief description."
        ),
    )

    # Create the extraction chain
    chain = prompt | structured_llm

    try:
        # Invoke the chain to get the validated Pydantic object
        result = chain.invoke({"context": context})
        return result
    except Exception as e:
        print(f"   [!] Scout failed: {e}")
        return SupplyChainDisruption(
            location="Reported Facility",
            severity_level="Medium",
            affected_materials=["General Cargo"],
            description=f"[Fallback] Raw report: {context[:100]}...",
        )
