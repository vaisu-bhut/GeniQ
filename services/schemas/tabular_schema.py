from .base_models import ColumnDefinition
from pydantic import BaseModel, field_validator
from typing import List

class TabularRequest(BaseModel):
    columns: List[ColumnDefinition]
    num_rows: int
    description: str
    use_case: str
    output_format: str = "csv"  # 'csv' or 'json'
    
    @field_validator('num_rows')
    def validate_num_rows(cls, v):
        if v <= 0 or v > 1000:
            raise ValueError("Number of rows must be between 1 and 1000")
        return v