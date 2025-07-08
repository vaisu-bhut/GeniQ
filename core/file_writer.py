import csv
import json
import os
import tempfile
import pandas as pd
from typing import List, Dict
import logging
import numpy as np

logger = logging.getLogger(__name__)

def convert_np(obj):
    if isinstance(obj, dict):
        return {k: convert_np(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [convert_np(v) for v in obj]
    elif isinstance(obj, (np.integer, )):
        return int(obj)
    elif isinstance(obj, (np.floating, )):
        return float(obj)
    elif isinstance(obj, (np.ndarray, )):
        return obj.tolist()
    else:
        return obj

def write_tabular(data: List[Dict], columns: List[Dict], format: str) -> str:
    logger.info(f"Writing {len(data)} rows to {format} format")
    logger.debug(f"Data to write: {data}")
    logger.debug(f"Columns: {columns}")

    # Separate main data from metadata
    main_data = data.get("data", [])
    metadata = data.get("metadata", {})
    
    df = pd.DataFrame(main_data)
    
    # Create temp file
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=f".{format}")
    logger.info(f"Creating temp file: {temp_file.name}")
    
    if not main_data:
        logger.warning("No data to write, creating empty dataset with headers only")
        # Create empty DataFrame with correct columns
        column_names = [col['name'] for col in columns]
        df = pd.DataFrame(columns=column_names)
        
        # Write empty dataset
        if format == "csv":
            df.to_csv(temp_file.name, index=False)
        else:  # json
            df.to_json(temp_file.name, orient="records", indent=2)
    else:
        # Ensure all expected columns exist
        expected_columns = [col['name'] for col in columns]
        missing_columns = set(expected_columns) - set(df.columns)
        
        if missing_columns:
            logger.warning(f"Missing columns in data: {missing_columns}")
            for col_name in missing_columns:
                df[col_name] = None
        
        # Convert data types properly (handle JSON string values)
        for col in columns:
            col_name = col['name']
            logger.debug(f"Processing column: {col_name} with dtype: {col['dtype']}")
            
            if col_name in df.columns:
                try:
                    if col['dtype'] == 'int':
                        # Convert string/int/float to int
                        df[col_name] = pd.to_numeric(df[col_name], errors='coerce').astype('Int64')
                    elif col['dtype'] == 'float':
                        # Convert string/int/float to float
                        df[col_name] = pd.to_numeric(df[col_name], errors='coerce')
                    elif col['dtype'] == 'bool':
                        # Convert string to bool
                        df[col_name] = df[col_name].astype(str).str.lower().isin(['true', '1', 'yes'])
                    elif col['dtype'] == 'str':
                        # Ensure string type
                        df[col_name] = df[col_name].astype(str)
                except Exception as e:
                    logger.warning(f"Failed to convert column {col_name} to {col['dtype']}: {e}")
        
        # Write data
        if format == "csv":
            df.to_csv(temp_file.name, index=False)
            with open(temp_file.name, 'a') as f:
                f.write(f"\n\n# METADATA_START\n")
                for key, value in convert_np(metadata).items():
                    f.write(f"# {key}: {json.dumps(value)}\n")

        else:  # json
            full_data = {
            "data": df.to_dict(orient='records'),
            "metadata": metadata
            }
            with open(temp_file.name, 'w') as f:
                json.dump(convert_np(full_data), f, indent=2)

    
    logger.info(f"File written successfully: {temp_file.name}")
    return temp_file.name

def write_qa_pairs(data: List[Dict]) -> str:
    logger.info(f"Writing {len(data)} QA pairs to JSON")
    logger.debug(f"QA pairs to write: {data}")
    
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".json")
    logger.info(f"Creating temp file: {temp_file.name}")
    
    with open(temp_file.name, 'w') as f:
        json.dump(data, f, indent=2)
    
    logger.info(f"File written successfully: {temp_file.name}")
    return temp_file.name