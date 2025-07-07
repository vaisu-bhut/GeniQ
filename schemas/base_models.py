from pydantic import BaseModel, field_validator
from typing import List, Dict, Union

class ColumnDefinition(BaseModel):
    name: str
    dtype: str  # 'int', 'float', 'str', 'bool', 'datetime'
    description: str
    validation: str = ""  # e.g., ">=18 and <=35"
    options: List[Union[str, int, float]] = None  # For categorical data