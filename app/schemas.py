from pydantic import BaseModel
from typing import Dict, Union

class UserRequest(BaseModel):
    domain: str
    format: str
    output_type: str
    num_rows: int
    columns: list[str]
    use_case: str

class FinanceRow(BaseModel):
    transaction_id: str
    amount: float
    merchant: str
    category: str
    timestamp: str

class HealthcareRow(BaseModel):
    patient_id: str
    age: int
    diagnosis: str
    treatment: str
    severity: str

DOMAIN_SCHEMAS = {
    "finance": FinanceRow,
    "healthcare": HealthcareRow
}

OutputRow = Union[FinanceRow, HealthcareRow]