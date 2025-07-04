import re

PII_PATTERNS = [
    r'\b\d{3}-\d{2}-\d{4}\b',  # SSN
    r'\b\d{16}\b',             # Credit card
    r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'  # Email
]

BLOCKED_TERMS = ["fuck", "shit", "kill", "bomb", "terrorist"]  # Add domain-specific terms

def check_pii(text: str) -> bool:
    for pattern in PII_PATTERNS:
        if re.search(pattern, text):
            return True
    return False

def check_hallucinations(row: dict) -> bool:
    """Check for absurd values"""
    if "amount" in row and abs(row["amount"]) > 1000000:
        return True
    if "age" in row and not (0 < row["age"] < 120):
        return True
    return False