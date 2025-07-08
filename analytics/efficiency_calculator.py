import time
from typing import Dict

class EfficiencyMetrics:
    def __init__(self, start_time: float, num_items: int):
        self.start_time = start_time
        self.end_time = time.time()
        self.num_items = num_items
    
    def calculate(self) -> Dict[str, any]:
        total_time = self.end_time - self.start_time
        return {
            'total_time_seconds': round(total_time, 2),
            'items_per_second': round(self.num_items / total_time, 2),
            'generation_efficiency': self._calculate_efficiency_score(total_time),
            'resource_utilization': self._estimate_resource_usage(total_time)
        }
    
    def _calculate_efficiency_score(self, total_time: float) -> float:
        """Calculate efficiency score (0-1) based on dataset size"""
        base_time_per_item = 0.5  # Target seconds per item
        expected_time = base_time_per_item * self.num_items
        return min(1.0, expected_time / total_time)
    
    def _estimate_resource_usage(self, total_time: float) -> Dict[str, float]:
        """Estimate resource usage metrics"""
        # These are estimates for reporting purposes
        return {
            'cpu_seconds': total_time * 0.8,
            'memory_mb': self.num_items * 0.5,
            'energy_kwh': total_time * 0.0001
        }