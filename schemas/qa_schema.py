from pydantic import BaseModel, field_validator

class QARequest(BaseModel):
    domain: str
    complexity: str  # 'beginner', 'intermediate', 'advanced'
    num_pairs: int
    context: str = ""
    constraints: str = ""
    
    @field_validator('num_pairs')
    def validate_num_pairs(cls, v):
        if v <= 0 or v > 500:
            raise ValueError("Number of Q&A pairs must be between 1 and 500")
        return v