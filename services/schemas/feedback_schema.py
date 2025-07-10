from pydantic import BaseModel, Field

class FeedbackSubmission(BaseModel):
    dataset_id: str = Field(..., description="UUID of generated dataset")
    rating: int = Field(1, ge=1, le=5, description="User satisfaction score")
    comments: str = Field(None, description="Free-text feedback")
    improvements: str = Field(None, description="Suggested enhancements")