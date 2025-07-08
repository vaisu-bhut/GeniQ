from typing import Dict, Any, List

class BusinessValueCalculator:
    def __init__(self, dataset_type, quality_report, metadata):
        self.dataset_type = dataset_type
        self.quality = quality_report
        self.metadata = metadata
        self.value_report = {}
    
    def calculate(self) -> Dict[str, Any]:
        self.value_report['potential_use_cases'] = self._identify_use_cases()
        self.value_report['time_savings'] = self._estimate_time_savings()
        self.value_report['cost_benefit'] = self._calculate_cost_benefit()
        return self.value_report
    
    def _identify_use_cases(self) -> List[str]:
        use_cases = []
        if self.dataset_type == "tabular":
            if 'age' in self.quality.get('distributions', {}):
                use_cases.append('Customer segmentation')
            if 'price' in self.quality.get('distributions', {}):
                use_cases.append('Pricing analysis')
            if 'diagnosis' in self.metadata.get('use_case', '').lower():
                use_cases.append('Medical research')
        else:
            if self.quality.get('domain_coverage', 0) > 0.7:
                use_cases.append('Chatbot training')
                use_cases.append('Knowledge base')
            if self.quality.get('answer_completeness', 0) > 0.8:
                use_cases.append('FAQ generation')
        
        return use_cases
    
    def _estimate_time_savings(self) -> Dict[str, float]:
        """Estimate time savings compared to manual creation"""
        base_time_per_row = 120 if self.dataset_type == "tabular" else 180  # seconds
        estimated_time = base_time_per_row * self.metadata['num_items']
        
        # Quality adjustments
        completeness = self.quality.get('completeness_score', 1.0)
        validity = 1 - (sum(v for v in self.quality.get('validity', {}).values() 
                        if isinstance(v, int)) / self.metadata['num_items'])
        
        quality_factor = 0.3 * completeness + 0.7 * validity
        adjusted_time = estimated_time * quality_factor
        
        return {
            'estimated_manual_time_hours': round(estimated_time / 3600, 1),
            'quality_adjusted_time_hours': round(adjusted_time / 3600, 1),
            'time_savings_percent': round((1 - quality_factor) * 100)
        }
    
    def _calculate_cost_benefit(self) -> Dict[str, Any]:
        """Calculate cost-benefit metrics"""
        time_savings = self._estimate_time_savings()
        hourly_rate = 50  # Average data specialist hourly rate
        
        return {
            'estimated_cost_savings': round(
                time_savings['quality_adjusted_time_hours'] * hourly_rate
            ),
            'roi_per_row': round(
                (time_savings['estimated_manual_time_hours'] - 
                 time_savings['quality_adjusted_time_hours']) * hourly_rate / 
                self.metadata['num_items'], 2
            )
        }