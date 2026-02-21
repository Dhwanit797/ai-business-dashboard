from fastapi import APIRouter, Depends
from core.security import get_current_user
from services.fraud_service import get_fraud_insights, get_fraud_chart_data

router = APIRouter(prefix="/fraud", tags=["fraud"])


@router.get("/insights")
def fraud_insights(user=Depends(get_current_user)):
    return get_fraud_insights()


@router.get("/chart")
def fraud_chart(user=Depends(get_current_user)):
    return get_fraud_chart_data()
