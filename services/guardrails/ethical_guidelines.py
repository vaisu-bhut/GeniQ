import re
from typing import Dict, List, Any

ETHICAL_RULES = {
    "healthcare": [
        "No real patient identifiers",
        "Diagnosis codes must be ICD-10 compliant",
        "Drug names must be generic"
    ],
    "finance": [
        "No real account numbers",
        "Transaction amounts below $10,000",
        "Fake bank names only"
    ],
    "general": [
        "No real personal information",
        "No real company names",
        "No real addresses"
    ]
}

class EthicalEnforcer:
    def __init__(self):
        self.patterns = {
            "patient identifiers": [
                r'\b[A-Z]{2}\d{6}\b',  # Medical record numbers
                r'\b\d{3}-\d{2}-\d{4}\b',  # SSN
                r'\b[A-Za-z]+\s+\d{6,}\b'  # Name + number patterns
            ],
            "real account numbers": [
                r'\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b',  # Credit card
                r'\b\d{8,12}\b'  # Account numbers
            ],
            "real company names": [
                r'\b(Apple|Google|Microsoft|Amazon|Facebook|Tesla|Netflix|Uber|Airbnb)\b',
                r'\b(JP Morgan|Goldman Sachs|Morgan Stanley|Bank of America|Wells Fargo)\b'
            ],
            "real addresses": [
                r'\b\d+\s+[A-Za-z\s]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr|Lane|Ln|Way|Place|Pl|Court|Ct)\b'
            ],
            "high amounts": [
                r'\$\d{5,}',  # Amounts $10,000+
                r'\d{5,}\s*dollars',
                r'\d{5,}\s*USD'
            ]
        }
    
    def validate(self, data: list, domain: str) -> dict:
        """Apply domain-specific ethical rules"""
        violations = []
        rules = ETHICAL_RULES.get(domain, ETHICAL_RULES["general"])
        
        for i, item in enumerate(data):
            for rule in rules:
                if not self._complies(item, rule):
                    violations.append({
                        "index": i,
                        "rule": rule,
                        "offending_data": item
                    })
        
        compliance_score = 1 - (len(violations) / len(data)) if data else 1
        
        return {
            "violations": violations,
            "compliance_score": compliance_score,
            "total_items": len(data),
            "violation_count": len(violations),
            "domain": domain
        }
    
    def _complies(self, item: Any, rule: str) -> bool:
        """Check if an item complies with a specific ethical rule"""
        item_str = str(item).lower()
        
        # Check for patient identifiers
        if "patient identifiers" in rule.lower():
            for pattern in self.patterns["patient identifiers"]:
                if re.search(pattern, item_str, re.IGNORECASE):
                    return False
        
        # Check for real account numbers
        if "account numbers" in rule.lower():
            for pattern in self.patterns["real account numbers"]:
                if re.search(pattern, item_str, re.IGNORECASE):
                    return False
        
        # Check for real company names
        if "company names" in rule.lower():
            for pattern in self.patterns["real company names"]:
                if re.search(pattern, item_str, re.IGNORECASE):
                    return False
        
        # Check for real addresses
        if "addresses" in rule.lower():
            for pattern in self.patterns["real addresses"]:
                if re.search(pattern, item_str, re.IGNORECASE):
                    return False
        
        # Check for high amounts
        if "below $10,000" in rule.lower():
            for pattern in self.patterns["high amounts"]:
                if re.search(pattern, item_str, re.IGNORECASE):
                    return False
        
        # Check for generic drug names (healthcare)
        if "generic" in rule.lower() and "drug" in rule.lower():
            # Check if drug names are generic (not brand names)
            brand_patterns = [
                r'\b(Advil|Tylenol|Aspirin|Ibuprofen|Acetaminophen)\b',
                r'\b(Vicodin|OxyContin|Percocet|Codeine|Morphine)\b'
            ]
            for pattern in brand_patterns:
                if re.search(pattern, item_str, re.IGNORECASE):
                    return False
        
        # Check for ICD-10 compliance (healthcare)
        if "icd-10" in rule.lower():
            # Basic ICD-10 format check (A00-Z99.XXX)
            icd10_pattern = r'\b[A-Z]\d{2}\.\d{1,3}\b'
            if re.search(icd10_pattern, item_str, re.IGNORECASE):
                return True  # Valid ICD-10 code
            elif re.search(r'\b[A-Z]\d{2}\b', item_str, re.IGNORECASE):
                return True  # Valid ICD-10 code without decimal
            else:
                # If it looks like a diagnosis but not ICD-10 format, flag it
                diagnosis_keywords = ['diagnosis', 'condition', 'disease', 'syndrome']
                if any(keyword in item_str for keyword in diagnosis_keywords):
                    return False
        
        return True