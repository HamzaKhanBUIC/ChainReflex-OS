import os
from huggingface_hub import InferenceClient
from dotenv import load_dotenv

load_dotenv()


def draft_legal_notice(
    disruption_data: dict, contract_text: str = "Standard MSA"
) -> str:
    """
    The Legal Brain uses Meta-Llama-3-8B-Instruct to draft professional
    Force Majeure notices based on scout intelligence.
    """
    print(
        f"\n[LEGAL BRAIN] Drafting official legal response for: {disruption_data.get('location', 'Unknown')}..."
    )

    hf_token = os.getenv("HF_TOKEN")

    system_prompt = """Role:
You are the Lead Legal Counsel for ChainReflex OS. Your objective is to turn raw logistical threat data into professional, ready-to-send enterprise legal notices.

Task:
Draft an official email notice based on the provided disruption. Use a tone that is authoritative, urgent, and professional.

Output Format:
You must respond with a clean Markdown document using this exact format:

Subject: CRITICAL INCIDENT REPORT / FORCE MAJEURE WARNING

Context: [A summary of the location_context and analysis of the threat]

Action Plan: [A brief recommendation on rerouting supply chains or notifying stakeholders]

---
Dear [Supplier Name],

[Full professional email body including the disruption details and the legal/logistical demand]
"""

    try:
        if not hf_token:
            raise Exception("HF_TOKEN not found.")

        client = InferenceClient(api_key=hf_token)

        # Prepare context for the prompt
        context_str = f"Disruption Location: {disruption_data.get('location')}\nMaterials: {disruption_data.get('materials') or disruption_data.get('affected_materials')}\nDetails: {disruption_data.get('description')}"

        response = client.chat.completions.create(
            model="meta-llama/Meta-Llama-3-8B-Instruct",
            messages=[
                {"role": "system", "content": system_prompt},
                {
                    "role": "user",
                    "content": f"Disruption Data:\n{context_str}\nContract: {contract_text}",
                },
            ],
            max_tokens=800,
        )

        return response.choices[0].message.content

    except Exception as e:
        print(f"   [!] Legal Brain failed: {e}")
        print("   -> Falling back to simulation notice...")

        location = disruption_data.get("location", "Unknown Location")
        materials = disruption_data.get("materials") or disruption_data.get(
            "affected_materials", "Unknown Materials"
        )

        return f"""Subject: CRITICAL INCIDENT REPORT / FORCE MAJEURE WARNING

Context: Severe disruption detected at {location} impacting {materials}.

Action Plan: Immediate activation of secondary logistics partners and invocation of Force Majeure clause per the {contract_text}.

---
Dear Supplier Management,

This serves as formal notification of a material disruption at {location}. We require immediate status updates on all shipments containing {materials} and a 24-hour mitigation plan.

Sincerely,
ChainReflex Automated Legal Operations"""


if __name__ == "__main__":
    test_data = {
        "location": "Coastal Port Facility",
        "affected_materials": "Semiconductors",
        "description": "Severe flooding from a Category 4 hurricane has halted all crane operations.",
    }
    print("--- Testing Legal Brain ---")
    notice = draft_legal_notice(test_data)
    print(notice)
