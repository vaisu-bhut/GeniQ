from datetime import datetime
import pandas as pd
from agents.data_generator import generate_tabular_data, generate_qa_pairs
from agents.monitor import GenerationMonitor
from core.file_writer import write_tabular, write_qa_pairs
from analytics.quality_analyzer import DataQualityAnalyzer
from analytics.business_value import BusinessValueCalculator
from analytics.efficiency_calculator import EfficiencyMetrics
from typing import Union
from schemas.tabular_schema import TabularRequest
from schemas.qa_schema import QARequest
from guardrails.content_safety import ContentGuard
from guardrails.ethical_guidelines import EthicalEnforcer
import logging
import time

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def identify_domain(use_case: str) -> str:
    """Extract domain from use case description"""
    use_case_lower = use_case.lower()
    
    # Common domain keywords
    domains = {
        'healthcare': ['health', 'medical', 'patient', 'hospital', 'doctor', 'treatment'],
        'finance': ['financial', 'banking', 'investment', 'stock', 'market', 'loan', 'credit'],
        'education': ['education', 'student', 'school', 'university', 'learning', 'academic'],
        'ecommerce': ['ecommerce', 'retail', 'shopping', 'product', 'customer', 'sales'],
        'technology': ['tech', 'software', 'programming', 'computer', 'digital', 'app'],
        'marketing': ['marketing', 'advertising', 'campaign', 'brand', 'promotion'],
        'human_resources': ['hr', 'employee', 'recruitment', 'personnel', 'workforce'],
        'logistics': ['logistics', 'supply chain', 'transportation', 'shipping', 'warehouse']
    }
    
    for domain, keywords in domains.items():
        if any(keyword in use_case_lower for keyword in keywords):
            return domain
    
    # Default to general domain if no specific keywords found
    return "general"

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
    start_time = time.time()
    
    # Generate raw dataset
    raw_data = generate_tabular_data(request)
    
    # Convert to dict for analysis
    columns = [col.model_dump() for col in request.columns]
    
    # Generate quality report
    quality_analyzer = DataQualityAnalyzer(
        raw_data, 
        "tabular",
        {
            "columns": columns,
            "use_case": request.use_case,
            "num_items": request.num_rows
        }
    )
    quality_report = quality_analyzer.analyze()
    
    # Generate business value report
    value_calculator = BusinessValueCalculator(
        "tabular",
        quality_report,
        {"num_items": request.num_rows}
    )
    business_value = value_calculator.calculate()
    
    # Calculate efficiency metrics
    efficiency = EfficiencyMetrics(start_time, request.num_rows).calculate()

     # Apply guardrails
    content_guard = ContentGuard()
    safety_report = content_guard.check(raw_data, domain=identify_domain(request.use_case))
    
    ethical_enforcer = EthicalEnforcer()
    ethics_report = ethical_enforcer.validate(raw_data, domain=identify_domain(request.use_case))
    
    # Prepare enhanced output
    enhanced_data = {
        "data": raw_data,  # Using raw_data directly now
        "metadata": {
            "generated_at": datetime.utcnow().isoformat(),
            "quality_report": quality_report,
            "business_value": business_value,
            "efficiency_metrics": efficiency,
            "columns_definition": columns,
            "safety_report": safety_report,
            "ethics_report": ethics_report,
            "guardrails_version": "1.0"
        }
    }
    
    return write_tabular(enhanced_data, columns, request.output_format)

async def generate_qa_dataset(request: QARequest) -> str:
    start_time = time.time()
    
    # Generate raw QA pairs
    raw_pairs = generate_qa_pairs(request)
    
    # Generate quality report
    quality_analyzer = DataQualityAnalyzer(
        raw_pairs,
        "qa",
        {
            "domain": request.domain,
            "complexity": request.complexity,
            "num_items": request.num_pairs
        }
    )
    quality_report = quality_analyzer.analyze()
    
    # Generate business value report
    value_calculator = BusinessValueCalculator(
        "qa",
        quality_report,
        {"num_items": request.num_pairs}
    )
    business_value = value_calculator.calculate()
    
    # Calculate efficiency metrics
    efficiency = EfficiencyMetrics(start_time, request.num_pairs).calculate()

     # Apply guardrails
    content_guard = ContentGuard()
    safety_report = content_guard.check(raw_pairs, domain=request.domain)
    
    ethical_enforcer = EthicalEnforcer()
    ethics_report = ethical_enforcer.validate(raw_pairs, domain=request.domain)
    
    # Prepare enhanced output
    enhanced_data = {
        "data": raw_pairs,  # Using raw_pairs directly
        "metadata": {
            "generated_at": datetime.utcnow().isoformat(),
            "quality_report": quality_report,
            "business_value": business_value,
            "efficiency_metrics": efficiency,
            "safety_report": safety_report,
            "ethics_report": ethics_report,
            "guardrails_version": "1.0"
        }
    }
    
    return write_qa_pairs(enhanced_data)