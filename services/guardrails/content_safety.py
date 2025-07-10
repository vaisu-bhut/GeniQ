import re
from typing import Dict, List, Any

# Define safety categories and thresholds manually since google.generativeai.safety_settings is not available
class SafetyCategory:
    HARM_CATEGORY_MEDICAL = "medical"
    HARM_CATEGORY_FINANCIAL = "financial"
    HARM_CATEGORY_PERSONAL = "personal"
    HARM_CATEGORY_GENERAL = "general"

class SafetyThreshold:
    BLOCK_ONLY_HIGH = "high"
    BLOCK_MEDIUM_AND_ABOVE = "medium"
    BLOCK_ALL = "all"

class SafetySetting:
    def __init__(self, category: str, threshold: str):
        self.category = category
        self.threshold = threshold

# Domain-specific safety configurations
SAFETY_CONFIG = {
    "healthcare": SafetySetting(
        category=SafetyCategory.HARM_CATEGORY_MEDICAL,
        threshold=SafetyThreshold.BLOCK_MEDIUM_AND_ABOVE
    ),
    "finance": SafetySetting(
        category=SafetyCategory.HARM_CATEGORY_FINANCIAL,
        threshold=SafetyThreshold.BLOCK_ONLY_HIGH
    ),
    "default": SafetySetting(
        category=SafetyCategory.HARM_CATEGORY_GENERAL,
        threshold=SafetyThreshold.BLOCK_ONLY_HIGH
    )
}

class ContentGuard:
    def __init__(self):
        self.pii_patterns = {
            'ssn': r'\b\d{3}-\d{2}-\d{4}\b',
            'email': r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',
            'phone': r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b',
            'credit_card': r'\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b',
            'address': r'\b\d+\s+[A-Za-z\s]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr|Lane|Ln|Way|Place|Pl|Court|Ct)\b'
        }
        
        self.domain_specific_patterns = {
            'healthcare': [
                r'\b(patient|medical record|diagnosis|treatment|prescription|medication)\b',
                r'\b\d{10,}\b',  # Medical record numbers
            ],
            'finance': [
                r'\b(account number|routing number|swift code|iban)\b',
                r'\b\d{8,}\b',  # Account numbers
            ]
        }
    
    def check(self, data: List[Dict[str, Any]], domain: str = "default") -> Dict[str, Any]:
        """Scan data for domain-specific risks and PII"""
        results = {
            "flagged": [],
            "passed": True,
            "safety_score": 100,
            "domain": domain,
            "checks_performed": []
        }
        
        safety_config = SAFETY_CONFIG.get(domain, SAFETY_CONFIG["default"])
        results["checks_performed"].append(f"Using {domain} safety configuration")
        
        for item in data:
            item_issues = []
            
            # Check for PII patterns
            pii_found = self._check_pii(item)
            if pii_found:
                item_issues.extend(pii_found)
            
            # Check for domain-specific sensitive patterns
            domain_issues = self._check_domain_specific(item, domain)
            if domain_issues:
                item_issues.extend(domain_issues)
            
            if item_issues:
                results["flagged"].append({
                    "item": item,
                    "issues": item_issues,
                    "severity": "high" if len(item_issues) > 2 else "medium"
                })
        
        # Calculate safety score
        total_items = len(data)
        flagged_items = len(results["flagged"])
        if total_items > 0:
            results["safety_score"] = max(0, 100 - (flagged_items / total_items) * 100)
        
        results["passed"] = len(results["flagged"]) == 0
        results["summary"] = {
            "total_items": total_items,
            "flagged_items": flagged_items,
            "safety_score": results["safety_score"]
        }
        
        return results
    
    def _check_pii(self, item: Any) -> List[str]:
        """Check for personally identifiable information"""
        issues = []
        item_str = str(item).lower()
        
        for pii_type, pattern in self.pii_patterns.items():
            if re.search(pattern, item_str, re.IGNORECASE):
                issues.append(f"Potential {pii_type.upper()} detected")
        
        return issues
    
    def _check_domain_specific(self, item: Any, domain: str) -> List[str]:
        """Check for domain-specific sensitive information"""
        issues = []
        item_str = str(item).lower()
        
        if domain in self.domain_specific_patterns:
            for pattern in self.domain_specific_patterns[domain]:
                if re.search(pattern, item_str, re.IGNORECASE):
                    issues.append(f"Domain-specific sensitive information detected")
                    break
        
        return issues