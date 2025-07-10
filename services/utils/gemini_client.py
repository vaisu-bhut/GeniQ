import google.generativeai as genai
import os
from dotenv import load_dotenv
import json
import logging
import time

logger = logging.getLogger(__name__)

load_dotenv()

def init_gemini():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY not found in environment variables")
    genai.configure(api_key=api_key)

def generate_with_gemini(prompt: str, model: str = "gemini-1.5-flash") -> str:
    logger.info(f"Initializing Gemini with model: {model}")
    init_gemini()
    model = genai.GenerativeModel(model)
    
    logger.info("Sending request to Gemini API...")
    api_start = time.time()
    response = model.generate_content(
        prompt,
        generation_config=genai.types.GenerationConfig(
            temperature=0.7,
            max_output_tokens=2048
        )
    )
    api_time = time.time() - api_start
    logger.info(f"Gemini API response received in {api_time:.2f} seconds")
    
    return response.text

def extract_json_from_response(response: str) -> list:
    logger.info("Attempting to extract JSON from response...")
    logger.debug(f"Raw response: {response[:500]}...")  # Log first 500 chars
    
    try:
        # Handle code block responses
        start = response.find('[')
        end = response.rfind(']') + 1
        
        if start == -1 or end == 0:
            logger.error("No JSON array found in response")
            logger.error(f"Full response: {response}")
            raise ValueError("No JSON array found in response")
            
        json_str = response[start:end]
        logger.debug(f"Extracted JSON string: {json_str}")
        
        result = json.loads(json_str)
        logger.info(f"Successfully extracted JSON with {len(result)} items")
        logger.debug(f"Parsed data: {result}")
        return result
    except json.JSONDecodeError as e:
        logger.error(f"Failed to parse Gemini response as JSON: {e}")
        logger.error(f"Response preview: {response[:200]}...")
        logger.error(f"Full response: {response}")
        raise ValueError("Failed to parse Gemini response as JSON")