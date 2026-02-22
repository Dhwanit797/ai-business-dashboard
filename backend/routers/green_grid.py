from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.orm import Session
from core.security import get_current_user
from database import get_db
from services.green_grid_service import get_green_grid_data, get_energy_chart_data, upload_green_csv

router = APIRouter(prefix="/green-grid", tags=["green-grid"])


@router.get("/data")
def green_grid_data(user=Depends(get_current_user), db: Session = Depends(get_db)):
    return get_green_grid_data(db)


@router.get("/chart")
def energy_chart(user=Depends(get_current_user), db: Session = Depends(get_db)):
    return get_energy_chart_data(db)


@router.post("/upload-csv")
def upload_csv(file: UploadFile = File(...), user=Depends(get_current_user), db: Session = Depends(get_db)):
    return upload_green_csv(file, db)
