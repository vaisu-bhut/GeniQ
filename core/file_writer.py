import csv
import json
import os
import tempfile
import pandas as pd
from typing import List, Dict

def write_tabular(data: List[Dict], columns: List[Dict], format: str) -> str:
    df = pd.DataFrame(data)
    
    # Ensure correct data types
    for col in columns:
        if col['dtype'] == 'int':
            df[col['name']] = pd.to_numeric(df[col['name']], errors='coerce', downcast='integer')
        elif col['dtype'] == 'float':
            df[col['name']] = pd.to_numeric(df[col['name']], errors='coerce')
    
    # Create temp file
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=f".{format}")
    
    if format == "csv":
        df.to_csv(temp_file.name, index=False)
    else:  # json
        df.to_json(temp_file.name, orient="records", indent=2)
    
    return temp_file.name

def write_qa_pairs(data: List[Dict]) -> str:
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".json")
    with open(temp_file.name, 'w') as f:
        json.dump(data, f, indent=2)
    return temp_file.name