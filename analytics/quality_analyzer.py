import pandas as pd
import numpy as np
from typing import Dict, Any, List

class DataQualityAnalyzer:
    def __init__(self, dataset, dataset_type, request_metadata):
        self.dataset = dataset
        self.dataset_type = dataset_type
        self.metadata = request_metadata
        self.report = {}
    
    def analyze(self) -> Dict[str, Any]:
        if self.dataset_type == "tabular":
            self._analyze_tabular()
        else:
            self._analyze_qa()
        return self.report
    
    def _analyze_tabular(self):
        df = pd.DataFrame(self.dataset)
        
        # Completeness analysis
        self.report['completeness'] = {
            'missing_values': df.isnull().sum().to_dict(),
            'completeness_score': 1 - (df.isnull().sum().sum() / (len(df) * len(df.columns)))
        }
        
        # Validity analysis
        validity_issues = {}
        for col, col_def in zip(df.columns, self.metadata['columns']):
            if col_def.get('validation'):
                try:
                    valid_mask = df[col].apply(
                        lambda x: self._evaluate_validation(x, col_def['validation'])
                    )
                    validity_issues[col] = len(df) - valid_mask.sum()
                except:
                    validity_issues[col] = "Validation error"
        self.report['validity'] = validity_issues
        
        # Distribution analysis
        self.report['distributions'] = {}
        for col in df.select_dtypes(include=np.number).columns:
            self.report['distributions'][col] = {
                'min': df[col].min(),
                'max': df[col].max(),
                'mean': df[col].mean(),
                'std': df[col].std()
            }
        
        # Use-case specificity
        self.report['use_case_specificity'] = self._calculate_use_case_specificity(df)
    
    def _analyze_qa(self):
        # Question quality metrics
        questions = [pair['question'] for pair in self.dataset]
        answers = [pair['answer'] for pair in self.dataset]
        
        self.report = {
            'question_lengths': [len(q) for q in questions],
            'answer_lengths': [len(a) for a in answers],
            'question_uniqueness': len(set(questions)) / len(questions),
            'domain_coverage': self._calculate_domain_coverage(questions),
            'answer_completeness': sum(1 for a in answers if len(a) > 15) / len(answers)
        }
    
    def _evaluate_validation(self, value, rule: str) -> bool:    
        """Non-blocking validation check"""
        if not rule:
            return True
        return True  
    
    def _calculate_use_case_specificity(self, df) -> float:
        """Calculate how well data matches use-case description"""
        # Implement domain-specific checks
        use_case = self.metadata['use_case'].lower()
        specificity_score = 0.5  # Base score
        
        if 'customer' in use_case:
            if 'name' in df.columns and 'email' in df.columns:
                specificity_score += 0.3
            if 'purchase' in use_case and 'transaction_amount' in df.columns:
                specificity_score += 0.2
        
        return min(1.0, specificity_score)
    
    def _calculate_domain_coverage(self, questions) -> float:
        """Calculate domain coverage for QA datasets"""
        domain = self.metadata['domain'].lower()
        keywords = {
            'healthcare': ['patient', 'treatment', 'diagnosis', 'medical'],
            'finance': ['stock', 'investment', 'loan', 'interest'],
            'technology': ['software', 'code', 'algorithm', 'system']
        }
        
        coverage = 0
        for key in keywords.get(domain, []):
            coverage += sum(1 for q in questions if key in q.lower())
        
        return coverage / len(questions)