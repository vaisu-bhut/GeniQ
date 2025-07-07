from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from schemas.tabular_schema import TabularRequest
from schemas.qa_schema import QARequest
from core.generation_engine import generate_dataset
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = FastAPI()

@app.post("/generate/tabular")
async def generate_tabular(request: TabularRequest):
    logger.info(f"Received tabular generation request for {request.num_rows} rows")
    try:
        file_path = await generate_dataset(request, "tabular")
        logger.info(f"Tabular generation completed successfully: {file_path}")
        return FileResponse(
            file_path,
            media_type="text/csv" if request.output_format == "csv" else "application/json",
            filename=f"tabular_dataset.{request.output_format}"
        )
    except Exception as e:
        logger.error(f"Tabular generation failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate/qa")
async def generate_qa(request: QARequest):
    logger.info(f"Received QA generation request for {request.num_pairs} pairs")
    try:
        file_path = await generate_dataset(request, "qa")
        logger.info(f"QA generation completed successfully: {file_path}")
        return FileResponse(
            file_path,
            media_type="application/json",
            filename="qa_pairs.json"
        )
    except Exception as e:
        logger.error(f"QA generation failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    logger.info("Starting GeniQ API server...")
    uvicorn.run(app, host="0.0.0.0", port=8000)