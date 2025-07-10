def build_tabular_prompt(request) -> str:
    columns_desc = "\n".join(
        [f"- {col.name} ({col.dtype}): {col.description}. Validation: {col.validation}"
        for col in request.columns]
    )
    
    # Create example structure with actual column names
    example_items = []
    for col in request.columns:
        if col.dtype == 'int':
            example_items.append(f'"{col.name}": 25')
        elif col.dtype == 'float':
            example_items.append(f'"{col.name}": 50000.0')
        elif col.dtype == 'str':
            example_items.append(f'"{col.name}": "John Doe"')
        elif col.dtype == 'bool':
            example_items.append(f'"{col.name}": true')
        else:
            example_items.append(f'"{col.name}": "value"')
    
    example_structure = ", ".join(example_items)
    
    return f"""
    Generate a synthetic dataset with these specifications:
    Use Case: {request.use_case}
    Description: {request.description}
    Number of Rows: {request.num_rows}
    
    Columns:
    {columns_desc}
    
    CRITICAL OUTPUT REQUIREMENTS:
    1. Generate exactly {request.num_rows} rows
    2. Output ONLY a JSON array with this EXACT structure:
        [{{"{example_structure}"}}]
    3. Ensure all values match the specified data types:
       - int: whole numbers only (e.g., 25, 30, 45)
       - float: decimal numbers (e.g., 50000.0, 75000.5)
       - str: text strings (e.g., "John Doe", "Engineer")
       - bool: true/false values only
    4. Do NOT include any explanations, markdown, code blocks, or extra text
    5. Do NOT include any comments or formatting
    6. The response must start with [ and end with ]
    7. Each object must contain ALL the specified columns
    8. Ensure data diversity and realism
    9. Validate that all data passes the specified validation rules
    
    Example output format:
    [{{"{example_structure}"}}, {{"{example_structure}"}}]
    """

def build_qa_prompt(request) -> str:
    return f"""
    Generate {request.num_pairs} question-answer pairs with these specifications:
    Domain: {request.domain}
    Complexity: {request.complexity}
    Context: {request.context}
    Constraints: {request.constraints}
    
    CRITICAL OUTPUT REQUIREMENTS:
    1. Output STRICTLY as a JSON array: [{{"question": "...", "answer": "..."}}]
    2. Do NOT include any explanations, markdown, or code blocks
    3. Each question and answer must be at least 5 characters long
    4. Ensure questions are diverse and cover different aspects of the domain
    5. Answers should be accurate and comprehensive
    6. The response must start with [ and end with ]
    7. Do NOT include any comments or formatting
    """