# Smart Inventory AI: reorder suggestions (rule-based + optional LinearRegression)
import random
from typing import List, Dict, Any

try:
    from sklearn.linear_model import LinearRegression
    import numpy as np
    HAS_SKLEARN = True
except ImportError:
    HAS_SKLEARN = False


def get_inventory_summary() -> Dict[str, Any]:
    items = [
        {"name": "Widget A", "stock": random.randint(10, 80), "reorder_at": 30},
        {"name": "Widget B", "stock": random.randint(5, 40), "reorder_at": 20},
        {"name": "Widget C", "stock": random.randint(50, 150), "reorder_at": 50},
    ]
    low_stock = [i for i in items if i["stock"] < i["reorder_at"]]
    return {
        "items": items,
        "low_stock_count": len(low_stock),
        "suggestions": [f"Reorder {i['name']} soon" for i in low_stock[:3]],
    }


def get_inventory_forecast() -> List[Dict[str, Any]]:
    if HAS_SKLEARN:
        np.random.seed(42)
        X = np.array([[i] for i in range(10)])
        y = 100 - np.cumsum(np.random.rand(10) * 5)
        model = LinearRegression().fit(X, y)
        future = np.array([[i] for i in range(10, 14)])
        pred = model.predict(future)
        return [{"week": f"W{i}", "predicted_stock": max(0, round(p, 1))} for i, p in enumerate(pred, 1)]
    return [{"week": f"W{i}", "predicted_stock": max(0, 80 - i * 8 + random.randint(-5, 5))} for i in range(1, 5)]
