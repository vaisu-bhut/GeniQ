import time
from typing import Dict

class GenerationMonitor:
    def __init__(self, total_items: int):
        self.total = total_items
        self.completed = 0
        self.valid = 0
        self.invalid = 0
        self.start_time = time.time()
        
    def log_generation(self, valid: bool = True):
        self.completed += 1
        if valid:
            self.valid += 1
        else:
            self.invalid += 1
            
    def get_progress(self) -> Dict[str, Any]:
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