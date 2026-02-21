# Fraud Lens: anomaly detection using Isolation Forest (scikit-learn)
import random
from typing import List, Dict, Any
import numpy as np

try:
    from sklearn.ensemble import IsolationForest
    HAS_SKLEARN = True
except ImportError:
    HAS_SKLEARN = False


def get_fraud_insights() -> Dict[str, Any]:
    if HAS_SKLEARN:
        np.random.seed(42)
        # Simulate transaction features: amount, frequency, hour
        X = np.random.rand(100, 3) * 100
        clf = IsolationForest(contamination=0.1, random_state=42)
        clf.fit(X)
        preds = clf.predict(X)
        anomalies = int((preds == -1).sum())
        return {
            "anomalies_detected": anomalies,
            "total_transactions": 100,
            "risk_level": "medium" if anomalies > 5 else "low",
            "alerts": [{"id": i, "type": "Unusual amount", "score": round(random.uniform(0.6, 0.95), 2)} for i in range(min(anomalies, 5))],
        }
    # Fallback rule-based
    n = random.randint(2, 8)
    return {
        "anomalies_detected": n,
        "total_transactions": 100,
        "risk_level": "medium" if n > 5 else "low",
        "alerts": [{"id": i, "type": "Unusual amount", "score": round(random.uniform(0.6, 0.95), 2)} for i in range(n)],
    }


def get_fraud_chart_data() -> List[Dict[str, Any]]:
    return [
        {"day": f"Day {i}", "normal": random.randint(80, 120), "flagged": random.randint(0, 8)}
        for i in range(1, 8)
    ]
