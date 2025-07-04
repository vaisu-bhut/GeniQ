import google.generativeai as genai
from pydantic import ValidationError
from ..schemas import DOMAIN_SCHEMAS, OutputRow
from ..utils import moderation
import json
import time

genai.configure(api_key='YOUR_API_KEY')
model = genai.GenerativeModel('gemini-1.5-flash')

def generate_valid_row(prompt: str, domain: str, format: str, max_retries=3) -> dict:
    schema = DOMAIN_SCHEMAS.get(domain)
    if not schema:
        raise ValueError(f"No schema for domain: {domain}")
    
    for attempt in range(max_retries):
        try:
            # Call LLM
            response = model.generate_content(prompt)
            raw_data = json.loads(response.text.strip('```json\n').rstrip('\n```'))
            
            # Validate structure
            validated = schema(**raw_data).dict()
            
            # Content moderation
            if moderation.check_pii(str(validated)):
                raise ValueError("PII detected in output")
                
            if moderation.check_hallucinations(validated):
                raise ValueError("Hallucinated content detected")
                
            return validated
            
        except (ValidationError, json.JSONDecodeError, ValueError) as e:
            print(f"Attempt {attempt+1} failed: {str(e)}")
            time.sleep(0.5)
    
    raise RuntimeError(f"Failed to generate valid row after {max_retries} attempts")