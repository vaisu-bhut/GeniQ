import random
from ..utils.config import SETTINGS

def build_prompt(arrays: list) -> str:
    """
    Creates randomized prompt from thematic arrays
    Example output: "Generate a retail transaction for electronics merchant"
    """
    selected_fragments = [random.choice(arr) for arr in arrays]
    base_prompt = "Generate realistic synthetic data for: "
    return base_prompt + ". ".join(selected_fragments) + SETTINGS.OUTPUT_INSTRUCTIONS

# config.py supplement
class SETTINGS:
    OUTPUT_INSTRUCTIONS = "\n\nOutput format: Strict JSON without markdown"