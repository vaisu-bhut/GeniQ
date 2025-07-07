from utils.gemini_client import generate_with_gemini, extract_json_from_response
import random
import time

def generate_tabular_data(request) -> list:
    prompt = build_tabular_prompt(request)
    response = generate_with_gemini(prompt)
    return extract_json_from_response(response)

def generate_qa_pairs(request) -> list:
    prompt = build_qa_prompt(request)
    response = generate_with_gemini(prompt)
    return extract_json_from_response(response)