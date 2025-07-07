def build_tabular_prompt(request) -> str:
    columns_desc = "\n".join(
        [f"- {col.name} ({col.dtype}): {col.description}. Validation: {col.validation}"
        for col in request.columns]
    )
    
    return f"""
    Generate a synthetic dataset with these specifications:
    Use Case: {request.use_case}
    Description: {request.description}
    Number of Rows: {request.num_rows}
    
    Columns:
    {columns_desc}
    
    Output Requirements:
    1. Generate exactly {request.num_rows} rows
    2. Strictly follow data types and validation rules
    3. Output ONLY a JSON array of objects with the following structure:
        [{{"{request.columns[0].name}": value, "{request.columns[1].name}": value, ...}}]
    4. Do not include any explanations or markdown formatting
    5. Ensure data diversity and realism
    """

def build_qa_prompt(request) -> str:
    return f"""
    Generate {request.num_pairs} question-answer pairs with these specifications:
    Domain: {request.domain}
    Complexity: {request.complexity}
    Context: {request.context}
    Constraints: {request.constraints}
    
    Output Requirements:
    1. Output STRICTLY as a JSON array of objects: [{{"question": "...", "answer": "..."}}]
    2. Ensure questions are diverse and cover different aspects of the domain
    3. Answers should be accurate and comprehensive
    4. Do not include any explanations or markdown formatting
    5. Maintain consistent difficulty level
    """