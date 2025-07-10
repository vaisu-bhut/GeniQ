from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from schemas.tabular_schema import TabularRequest
from schemas.qa_schema import QARequest
from core.generation_engine import generate_dataset
from feedback.feedback_handler import FeedbackSystem
from schemas.feedback_schema import FeedbackSubmission
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = FastAPI()

# Add CORS middleware to allow access from everywhere
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

feedback_handler = FeedbackSystem()

@app.get("/")
async def health_check():
    """Health check endpoint to verify server is running"""
    return {
        "status": "healthy",
        "message": "GeniQ API server is running",
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check_detailed():
    """Detailed health check endpoint"""
    return {
        "status": "healthy",
        "message": "GeniQ API server is running",
        "version": "1.0.0",
        "endpoints": {
            "tabular": "/generate/tabular",
            "qa": "/generate/qa",
            "feedback": "/feedback"
        }
    }

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

@app.post("/feedback")
async def submit_feedback(feedback: dict):
    """Submit feedback from the contact form"""
    try:
        # Log the feedback for debugging
        logger.info(f"Received feedback: {feedback}")
        
        # For now, just return success
        # In a real implementation, you'd save this to a database
        return {"status": "success", "message": "Feedback submitted successfully"}
    except Exception as e:
        logger.error(f"Feedback submission failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/submit-feedback")
async def submit_feedback_legacy(feedback: FeedbackSubmission):
    feedback_handler.save_feedback(
        feedback.dataset_id,
        feedback.rating,
        feedback.comments,
        feedback.improvements
    )
    return {"status": "feedback_saved"}

@app.get("/feedback-report")
async def get_feedback_report():
    return feedback_handler.analyze_feedback_trends()

if __name__ == "__main__":
    import uvicorn
    logger.info("Starting GeniQ API server...")
    uvicorn.run(app, host="0.0.0.0", port=8000)