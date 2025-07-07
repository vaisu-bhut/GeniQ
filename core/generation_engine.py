from agents.data_generator import generate_tabular_data, generate_qa_pairs
from agents.validator import validate_tabular_row, validate_qa_pair
from agents.monitor import GenerationMonitor
from core.file_writer import write_tabular, write_qa_pairs
import asyncio
from typing import Union
from schemas.tabular_schema import TabularRequest
from schemas.qa_schema import QARequest

async def generate_dataset(request: Union[TabularRequest, QARequest], dataset_type: str) -> str:
    if dataset_type == "tabular":
        return await generate_tabular_dataset(request)
    else:
        return await generate_qa_dataset(request)

async def generate_tabular_dataset(request: TabularRequest) -> str:
    # Convert to dict for easier processing
    columns = [col.model_dump() for col in request.columns]
    monitor = GenerationMonitor(request.num_rows)
    
    # Generate initial dataset
    data = generate_tabular_data(request)
    
    # Validate and regenerate invalid rows
    validated_data = []
    for row in data:
        if validate_tabular_row(row, columns):
            validated_data.append(row)
            monitor.log_generation(valid=True)
        else:
            # Regenerate invalid rows
            for _ in range(3):  # Max 3 regeneration attempts
                new_row = generate_tabular_data(request)[0]
                if validate_tabular_row(new_row, columns):
                    validated_data.append(new_row)
                    monitor.log_generation(valid=True)
                    break
            else:
                monitor.log_generation(valid=False)
    
    # Write to file
    return write_tabular(validated_data, columns, request.output_format)

async def generate_qa_dataset(request: QARequest) -> str:
    monitor = GenerationMonitor(request.num_pairs)
    
    # Generate initial QA pairs
    qa_pairs = generate_qa_pairs(request)
    
    # Validate and regenerate invalid pairs
    validated_pairs = []
    for pair in qa_pairs:
        if validate_qa_pair(pair):
            validated_pairs.append(pair)
            monitor.log_generation(valid=True)
        else:
            # Regenerate invalid pairs
            for _ in range(3):  # Max 3 regeneration attempts
                new_pair = generate_qa_pairs(request)[0]
                if validate_qa_pair(new_pair):
                    validated_pairs.append(new_pair)
                    monitor.log_generation(valid=True)
                    break
            else:
                monitor.log_generation(valid=False)
    
    # Write to file
    return write_qa_pairs(validated_pairs)