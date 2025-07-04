import csv
import json
import os
from datetime import datetime

OUTPUT_DIR = "outputs/datasets"

def save_dataset(data: list, format: str, filename: str) -> str:
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    full_path = f"{OUTPUT_DIR}/{filename}.{format}"
    
    if format == "csv":
        with open(full_path, 'w', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=data[0].keys())
            writer.writeheader()
            writer.writerows(data)
            
    elif format == "json":
        with open(full_path, 'w') as f:
            json.dump(data, f, indent=2)
            
    return full_path