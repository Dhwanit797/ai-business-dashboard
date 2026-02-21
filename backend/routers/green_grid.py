from fastapi import APIRouter, Depends
from core.security import get_current_user
from services.green_grid_service import get_green_grid_data, get_energy_chart_data

router = APIRouter(prefix="/green-grid", tags=["green-grid"])


@router.get("/data")
def green_grid_data(user=Depends(get_current_user)):
    return get_green_grid_data()


@router.get("/chart")
def energy_chart(user=Depends(get_current_user)):
    return get_energy_chart_data()
