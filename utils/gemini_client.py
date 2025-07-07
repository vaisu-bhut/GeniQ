import google.generativeai as genai
import os
from dotenv import load_dotenv
import json

load_dotenv()

def init_gemini():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY not found in environment variables")
    genai.configure(api_key=api_key)

def generate_with_gemini(prompt: str, model: str = "gemini-1.5-flash") -> str:
    init_gemini()
    model = genai.GenerativeModel(model)
    response = model.generate_content(
        prompt,
        generation_config=genai.types.GenerationConfig(
            temperature=0.7,
            max_output_tokens=2048
        )
    )
    return response.text

def extract_json_from_response(response: str) -> list:
    try:
        # Handle code block responses
        start = response.find('[')
        end = response.rfind(']') + 1
        return json.loads(response[start:end])
    except json.JSONDecodeError:
        raise ValueError("Failed to parse Gemini response as JSON")