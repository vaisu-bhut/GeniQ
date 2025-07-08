from utils.gemini_client import generate_with_gemini, extract_json_from_response
from agents.prompt_engineer import build_tabular_prompt, build_qa_prompt
import random
import time
import logging

logger = logging.getLogger(__name__)

def generate_tabular_data(request) -> list:
    logger.info("Building tabular prompt...")
    prompt = build_tabular_prompt(request)
    logger.debug(f"Generated prompt: {prompt}")
    
    logger.info("Calling Gemini API for tabular data generation...")
    api_start = time.time()
    response = generate_with_gemini(prompt)
    api_time = time.time() - api_start
    logger.info(f"Gemini API call completed in {api_time:.2f} seconds")
    
    logger.info("Extracting JSON from response...")
    extract_start = time.time()
    try:
        result = extract_json_from_response(response)[:request.num_rows]
    except:
        return [{} for _ in range(request.num_rows)] 

    extract_time = time.time() - extract_start
    logger.info(f"JSON extraction completed in {extract_time:.2f} seconds, got {len(result)} items")
    
    # Log the actual data structure
    if result:
        logger.info(f"First item structure: {result[0]}")
        logger.info(f"Expected columns: {[col.name for col in request.columns]}")
        logger.info(f"Actual keys in first item: {list(result[0].keys()) if result[0] else 'None'}")
    
    return result

def generate_qa_pairs(request) -> list:
    logger.info("Building QA prompt...")
    prompt = build_qa_prompt(request)
    logger.debug(f"Generated prompt: {prompt}")
    
    logger.info("Calling Gemini API for QA pairs generation...")
    api_start = time.time()
    response = generate_with_gemini(prompt)
    api_time = time.time() - api_start
    logger.info(f"Gemini API call completed in {api_time:.2f} seconds")
    
    logger.info("Extracting JSON from response...")
    extract_start = time.time()
    result = extract_json_from_response(response)
    extract_time = time.time() - extract_start
    logger.info(f"JSON extraction completed in {extract_time:.2f} seconds, got {len(result)} items")
    
    return result