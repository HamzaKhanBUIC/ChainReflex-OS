from pydantic import BaseModel, Field
from typing import List

class SupplyChainDisruption(BaseModel):
    """
    Represents a detected disruption in the supply chain.
    """
    location: str = Field(..., description="The geographical location of the disruption")
    severity_level: str = Field(..., description="The severity level (e.g., Low, Medium, High, Critical)")
    affected_materials: List[str] = Field(..., description="List of materials impacted by the disruption")
    description: str = Field(..., description="Detailed explanation of the disruption event")

class InventoryImpact(BaseModel):
    """
    Evaluates how a disruption affects current inventory levels and financial risk.
    """
    days_of_inventory_left: int = Field(..., description="Estimated days of inventory remaining")
    financial_risk_usd: float = Field(..., description="Estimated financial risk in USD")
    risk_assessment: str = Field(..., description="Qualitative summary of the risk (e.g., 'Requires immediate supplier pivot')")

class SupplierQuote(BaseModel):
    """
    A quote from an alternative supplier to mitigate the disruption.
    """
    supplier_name: str = Field(..., description="Name of the alternative supplier")
    proposed_price_usd: float = Field(..., description="Proposed price in USD for the required materials")
    delivery_time_days: int = Field(..., description="Estimated delivery time in days")
    is_expedited: bool = Field(..., description="Indicates if the delivery is expedited")
