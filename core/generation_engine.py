from agents.data_generator import generate_tabular_data, generate_qa_pairs
from agents.monitor import GenerationMonitor
from core.file_writer import write_tabular, write_qa_pairs
import asyncio
from typing import Union
from schemas.tabular_schema import TabularRequest
from schemas.qa_schema import QARequest
import logging
import time

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

async def generate_dataset(request: Union[TabularRequest, QARequest], dataset_type: str) -> str:
    logger.info(f"Starting dataset generation for type: {dataset_type}")
    start_time = time.time()
    
    if dataset_type == "tabular":
        result = await generate_tabular_dataset(request)
    else:
        result = await generate_qa_dataset(request)
    
    total_time = time.time() - start_time
    logger.info(f"Dataset generation completed in {total_time:.2f} seconds")
    return result

async def generate_tabular_dataset(request: TabularRequest) -> str:
    logger.info(f"Starting tabular dataset generation for {request.num_rows} rows")
    
    # Convert to dict for easier processing
    columns = [col.model_dump() for col in request.columns]
    logger.info(f"Processing {len(columns)} columns")
    
    monitor = GenerationMonitor(request.num_rows)
    
    # Generate dataset
    logger.info("Generating dataset...")
    generation_start = time.time()
    data = generate_tabular_data(request)
    generation_time = time.time() - generation_start
    logger.info(f"Dataset generated in {generation_time:.2f} seconds with {len(data)} rows")
    
    # Log all data as valid
    for i, row in enumerate(data):
        monitor.log_generation(valid=True)
        if i % 10 == 0:  # Log every 10th row
            logger.info(f"Processed row {i+1}/{len(data)}")
    
    logger.info(f"Final dataset: {len(data)} rows")
    
    # Write to file
    logger.info("Writing dataset to file...")
    write_start = time.time()
    file_path = write_tabular(data, columns, request.output_format)
    write_time = time.time() - write_start
    logger.info(f"File written in {write_time:.2f} seconds: {file_path}")
    
    return file_path

async def generate_qa_dataset(request: QARequest) -> str:
    logger.info(f"Starting QA dataset generation for {request.num_pairs} pairs")
    
    monitor = GenerationMonitor(request.num_pairs)
    
    # Generate QA pairs
    logger.info("Generating QA pairs...")
    generation_start = time.time()
    qa_pairs = generate_qa_pairs(request)
    generation_time = time.time() - generation_start
    logger.info(f"QA pairs generated in {generation_time:.2f} seconds with {len(qa_pairs)} pairs")
    
    # Log all pairs as valid
    for i, pair in enumerate(qa_pairs):
        monitor.log_generation(valid=True)
        if i % 5 == 0:  # Log every 5th pair
            logger.info(f"Processed pair {i+1}/{len(qa_pairs)}")
    
    logger.info(f"Final dataset: {len(qa_pairs)} pairs")
    
    # Write to file
    logger.info("Writing QA pairs to file...")
    write_start = time.time()
    file_path = write_qa_pairs(qa_pairs)
    write_time = time.time() - write_start
    logger.info(f"File written in {write_time:.2f} seconds: {file_path}")
    
    return file_path