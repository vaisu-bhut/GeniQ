from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from schemas.tabular_schema import TabularRequest
from schemas.qa_schema import QARequest
from core.generation_engine import generate_dataset
import os

app = FastAPI()

@app.post("/generate/tabular")
async def generate_tabular(request: TabularRequest):
    try:
        file_path = await generate_dataset(request, "tabular")
        return FileResponse(
            file_path,
            media_type="text/csv" if request.output_format == "csv" else "application/json",
            filename=f"tabular_dataset.{request.output_format}"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate/qa")
async def generate_qa(request: QARequest):
    try:
        file_path = await generate_dataset(request, "qa")
        return FileResponse(
            file_path,
            media_type="application/json",
            filename="qa_pairs.json"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)