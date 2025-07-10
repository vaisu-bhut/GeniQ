from utils.validation_rules import evaluate_rule
from typing import List, Dict, Any
import logging

logger = logging.getLogger(__name__)

def validate_tabular_row(row: Dict[str, Any], columns: List[Dict]) -> bool:
    logger.debug(f"Validating row: {row}")
    
    for col in columns:
        col_name = col['name']
        value = row.get(col_name)
        
        logger.debug(f"Checking column '{col_name}' with value '{value}' (type: {type(value)})")
        
        # Check existence
        if value is None:
            logger.warning(f"Column '{col_name}' is missing or None")
            return False
            
        # Convert string values to appropriate types for validation
        expected_type = col['dtype']
        logger.debug(f"Expected type: {expected_type}, Actual type: {type(value)}")
        
        try:
            if expected_type == 'int':
                # Convert string to int for validation
                if isinstance(value, str):
                    converted_value = int(value)
                elif isinstance(value, (int, float)):
                    converted_value = int(value)
                else:
                    logger.warning(f"Column '{col_name}' cannot be converted to int: {value}")
                    return False
                    
            elif expected_type == 'float':
                # Convert string to float for validation
                if isinstance(value, str):
                    converted_value = float(value)
                elif isinstance(value, (int, float)):
                    converted_value = float(value)
                else:
                    logger.warning(f"Column '{col_name}' cannot be converted to float: {value}")
                    return False
                    
            elif expected_type == 'str':
                # Ensure it's a string
                if isinstance(value, str):
                    converted_value = value
                else:
                    converted_value = str(value)
                    
            elif expected_type == 'bool':
                # Convert string to bool for validation
                if isinstance(value, str):
                    if value.lower() in ['true', '1', 'yes']:
                        converted_value = True
                    elif value.lower() in ['false', '0', 'no']:
                        converted_value = False
                    else:
                        logger.warning(f"Column '{col_name}' cannot be converted to bool: {value}")
                        return False
                elif isinstance(value, bool):
                    converted_value = value
                else:
                    logger.warning(f"Column '{col_name}' cannot be converted to bool: {value}")
                    return False
            else:
                converted_value = value
                
        except (ValueError, TypeError) as e:
            logger.warning(f"Column '{col_name}' type conversion failed: {e}")
            return False
            
        # Check validation rule with converted value
        if col['validation']:
            logger.debug(f"Evaluating validation rule: {col['validation']} for value: {converted_value}")
            if not evaluate_rule(converted_value, col['validation']):
                logger.warning(f"Column '{col_name}' failed validation rule: {col['validation']}")
                return False
            
    logger.debug("Row validation passed")
    return True

def validate_qa_pair(qa_pair: Dict) -> bool:
    logger.debug(f"Validating QA pair: {qa_pair}")
    
    if not isinstance(qa_pair, dict):
        logger.warning("QA pair is not a dictionary")
        return False
        
    if 'question' not in qa_pair:
        logger.warning("QA pair missing 'question' field")
        return False
        
    if 'answer' not in qa_pair:
        logger.warning("QA pair missing 'answer' field")
        return False
        
    if not isinstance(qa_pair['question'], str):
        logger.warning("Question is not a string")
        return False
        
    if not isinstance(qa_pair['answer'], str):
        logger.warning("Answer is not a string")
        return False
        
    if len(qa_pair['question']) <= 5:
        logger.warning("Question too short")
        return False
        
    if len(qa_pair['answer']) <= 5:
        logger.warning("Answer too short")
        return False
        
    logger.debug("QA pair validation passed")
    return True