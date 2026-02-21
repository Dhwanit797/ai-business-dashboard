from fastapi import APIRouter, Depends
from core.security import get_current_user
from services.expense_service import get_expense_summary, get_expense_trend_data

router = APIRouter(prefix="/expense", tags=["expense"])


@router.get("/summary")
def expense_summary(user=Depends(get_current_user)):
    return get_expense_summary()


@router.get("/trends")
def expense_trends(user=Depends(get_current_user)):
    return get_expense_trend_data()
