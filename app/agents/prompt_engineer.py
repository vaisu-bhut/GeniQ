import google.generativeai as genai
from ..utils.config import SETTINGS

genai.configure(api_key=SETTINGS.GOOGLE_API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')

DOMAIN_TEMPLATES = {
    "finance": [
        "Generate a {transaction_type} transaction",
        "Create financial data for {merchant_category}",
        "Simulate {account_type} banking activity"
    ],
    "healthcare": [
        "Describe a {condition} patient case",
        "Generate {treatment_type} medical record",
        "Create {demographic} health profile"
    ]
}

def generate_arrays(domain: str, columns: list, use_case: str) -> list:
    if domain not in DOMAIN_TEMPLATES:
        raise ValueError(f"Unsupported domain: {domain}")
    
    prompt = f"""
    Generate 3-4 prompt fragments for {domain} domain data generation.
    Include variables for: {', '.join(columns)}
    Use case: {use_case}
    Output format: Python list of strings
    """
    
    response = model.generate_content(prompt)
    return eval(response.text)  # Safe for MVP (use ast.literal_eval in prod)