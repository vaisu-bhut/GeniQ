from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from .agents import prompt_engineer, prompt_composer, data_generator
from .utils import storage
import uuid
import os

app = FastAPI()

class UserRequest(BaseModel):
    domain: str
    format: str  # "csv" or "json"
    output_type: str
    num_rows: int
    columns: list[str]
    use_case: str

@app.post("/generate")
async def generate_dataset(request: UserRequest):
    try:
        # Agent 1: Create prompt arrays
        prompt_arrays = prompt_engineer.generate_arrays(
            request.domain, 
            request.columns,
            request.use_case
        )
        
        dataset = []
        for _ in range(request.num_rows):
            # Agent 2: Build single prompt
            prompt = prompt_composer.build_prompt(prompt_arrays)
            
            # Agent 3: Generate & validate row
            row = data_generator.generate_valid_row(
                prompt, 
                request.domain,
                request.format
            )
            dataset.append(row)
        
        # Save locally
        filename = f"{request.domain}_{uuid.uuid4().hex[:6]}"
        filepath = storage.save_dataset(
            dataset, 
            request.format, 
            filename
        )
        
        return {
            "status": "success",
            "filepath": filepath,
            "num_generated": len(dataset)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))