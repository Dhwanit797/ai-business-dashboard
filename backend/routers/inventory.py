from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.orm import Session
from core.security import get_current_user
from database import get_db
from services.inventory_service import get_inventory_summary, get_inventory_forecast, process_inventory_csv

router = APIRouter(prefix="/inventory", tags=["inventory"])

@router.post("/upload-csv")
def upload_inventory_csv(file: UploadFile = File(...), db: Session = Depends(get_db), user=Depends(get_current_user)):
    return process_inventory_csv(file, db)

@router.get("/summary")
def inventory_summary(db: Session = Depends(get_db), user=Depends(get_current_user)):
    return get_inventory_summary(db)


@router.get("/forecast")
def inventory_forecast(user=Depends(get_current_user)):
    return get_inventory_forecast()
