import time
from typing import Dict
import logging

logger = logging.getLogger(__name__)

class GenerationMonitor:
    def __init__(self, total_items: int):
        self.total = total_items
        self.completed = 0
        self.valid = 0
        self.invalid = 0
        self.start_time = time.time()
        logger.info(f"GenerationMonitor initialized for {total_items} items")
        
    def log_generation(self, valid: bool = True):
        self.completed += 1
        if valid:
            self.valid += 1
        else:
            self.invalid += 1
            
        # Log progress every 10 items or when complete
        if self.completed % 10 == 0 or self.completed == self.total:
            progress = self.get_progress()
            logger.info(f"Progress: {progress['completed']}/{progress['total']} ({progress['progress']}%) - "
                       f"Valid: {progress['valid']}, Invalid: {progress['invalid']}, "
                       f"Elapsed: {progress['elapsed_seconds']}s")
            
    def get_progress(self) -> Dict[str, any]:
        elapsed = time.time() - self.start_time
        return {
            "total": self.total,
            "completed": self.completed,
            "valid": self.valid,
            "invalid": self.invalid,
            "progress": min(100, int((self.completed / self.total) * 100)),
            "elapsed_seconds": round(elapsed, 1),
            "estimated_remaining": round((elapsed / self.completed) * (self.total - self.completed), 1) if self.completed else 0
        }