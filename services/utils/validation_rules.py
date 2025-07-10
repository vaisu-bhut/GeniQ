def evaluate_rule(value, rule: str) -> bool:
    """Evaluate validation rules using safe evaluation"""
    if not rule:
        return True
        
    try:
        # Create safe evaluation context
        context = {
            'value': value,
            'min': min,
            'max': max,
            'len': len
        }
        
        # Add common math functions
        for name in ['abs', 'round', 'pow', 'sum']:
            context[name] = getattr(__builtins__, name, None)
        
        # Evaluate the rule
        return eval(rule, {"__builtins__": None}, context)
    except:
        return False