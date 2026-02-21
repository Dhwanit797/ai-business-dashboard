# Expense Sense: simple categorization and trends (rule-based + optional sklearn)
import random
from typing import List, Dict, Any

# Mock expense data for demo
def get_expense_summary() -> Dict[str, Any]:
    categories = ["Operations", "Marketing", "R&D", "Salaries", "Utilities", "Travel"]
    data = [{"name": c, "value": random.randint(5, 35)} for c in categories]
    total = sum(d["value"] for d in data)
    return {
        "by_category": data,
        "total": total,
        "trend": "up" if random.random() > 0.5 else "down",
        "trend_percent": round(random.uniform(-8, 12), 1),
    }


def get_expense_trend_data() -> List[Dict[str, Any]]:
    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
    return [{"month": m, "amount": random.randint(20, 80)} for m in months]
