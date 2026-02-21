# Smart Green Grid Optimizer: energy/savings suggestions (rule-based)
import random
from typing import List, Dict, Any


def get_green_grid_data() -> Dict[str, Any]:
    return {
        "current_usage_kwh": round(random.uniform(1200, 1800), 1),
        "suggested_peak_shift": round(random.uniform(5, 15), 1),
        "potential_savings_percent": round(random.uniform(8, 20), 1),
        "recommendations": [
            "Shift heavy loads to off-peak hours",
            "Enable smart thermostat schedules",
            "Consider solar for daytime load",
        ],
    }


def get_energy_chart_data() -> List[Dict[str, Any]]:
    return [
        {"hour": f"{h}:00", "usage": random.randint(30, 90)}
        for h in range(8, 20)
    ]
