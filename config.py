import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
    MAX_REGENERATION_ATTEMPTS = 3
    MAX_ROWS = 1000
    MAX_QA_PAIRS = 500
    GUARDRAIL_SETTINGS = {
        "pii_threshold": 0.85,
        "max_ethics_violations": 0.05,  # Max 5% violations
        "blocked_domains": ["weapons", "illegal_drugs"]
    }
    FEEDBACK_ANALYSIS_DAYS = 30

config = Config()