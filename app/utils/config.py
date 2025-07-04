import os

class SETTINGS:
    GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY", "test-key")
    MAX_RETRIES = 3
    OUTPUT_INSTRUCTIONS = "\n\nOutput: Pure JSON without commentary"
    DOMAINS = ["finance", "healthcare", "retail", "education"]