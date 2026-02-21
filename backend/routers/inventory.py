from fastapi import APIRouter, Depends
from core.security import get_current_user
from services.inventory_service import get_inventory_summary, get_inventory_forecast

router = APIRouter(prefix="/inventory", tags=["inventory"])


@router.get("/summary")
def inventory_summary(user=Depends(get_current_user)):
    return get_inventory_summary()


@router.get("/forecast")
def inventory_forecast(user=Depends(get_current_user)):
    return get_inventory_forecast()
