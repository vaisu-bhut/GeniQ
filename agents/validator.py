from utils.validation_rules import evaluate_rule
from typing import List, Dict, Any

def validate_tabular_row(row: Dict[str, Any], columns: List[Dict]) -> bool:
    for col in columns:
        col_name = col['name']
        value = row.get(col_name)
        
        # Check existence
        if value is None:
            return False
            
        # Check data type
        if col['dtype'] == 'int' and not isinstance(value, int):
            return False
        elif col['dtype'] == 'float' and not isinstance(value, float):
            return False
        elif col['dtype'] == 'str' and not isinstance(value, str):
            return False
            
        # Check validation rule
        if col['validation'] and not evaluate_rule(value, col['validation']):
            return False
            
    return True

def validate_qa_pair(qa_pair: Dict) -> bool:
    return bool(
        isinstance(qa_pair, dict) and 
        'question' in qa_pair and 
        'answer' in qa_pair and
        isinstance(qa_pair['question'], str) and
        isinstance(qa_pair['answer'], str) and
        len(qa_pair['question']) > 5 and
        len(qa_pair['answer']) > 5
    )