from datetime import datetime
import json

class FeedbackSystem:
    def __init__(self):
        self.feedback_db = "feedback_data.json"
    
    def save_feedback(self, dataset_id: str, rating: int, comments: str, improvements: str):
        """Store structured feedback"""
        feedback = {
            "dataset_id": dataset_id,
            "timestamp": datetime.utcnow().isoformat(),
            "rating": rating,  # 1-5 scale
            "comments": comments,
            "suggested_improvements": improvements
        }
        # Append to JSONL file
        with open(self.feedback_db, "a") as f:
            f.write(json.dumps(feedback) + "\n")
    
    # def analyze_feedback_trends(self):
    #     """Generate monthly improvement reports"""
    #     # NLP analysis of comments
    #     # Sentiment scoring
    #     # Top suggested improvements
    #     return improvement_report