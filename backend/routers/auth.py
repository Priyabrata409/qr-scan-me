from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from ..database import get_session
from ..models import User
from ..schemas import SendOTPRequest, VerifyOTPRequest, Token
from ..auth import create_access_token

router = APIRouter(prefix="/auth", tags=["auth"])

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from ..database import get_session
from ..models import User
from ..schemas import SendOTPRequest, VerifyOTPRequest, Token
from ..auth import create_access_token
import random

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/send-otp")
def send_otp(request: SendOTPRequest, session: Session = Depends(get_session)):
    otp = "123456" # Hardcoded for demo/MVP
    
    if request.user_id:
        # Claim Flow
        user = session.get(User, request.user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        if user.is_claimed:
            raise HTTPException(status_code=400, detail="Profile already claimed")
        
        # Check if phone is already taken by another user
        existing_user = session.exec(select(User).where(User.phone_number == request.phone_number)).first()
        if existing_user and existing_user.id != user.id:
             raise HTTPException(status_code=400, detail="Phone number already registered with another account")
             
        user.otp = otp
        session.add(user)
        session.commit()
    else:
        # Login Flow
        user = session.exec(select(User).where(User.phone_number == request.phone_number)).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found. Please scan a QR code to activate a profile.")
        
        user.otp = otp
        session.add(user)
        session.commit()
        
    return {"message": "OTP sent successfully", "debug_otp": otp}

@router.post("/verify-otp", response_model=Token)
def verify_otp(request: VerifyOTPRequest, session: Session = Depends(get_session)):
    if request.user_id:
        # Claim Flow Verification
        user = session.get(User, request.user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
            
        if user.otp != request.otp:
            raise HTTPException(status_code=400, detail="Invalid OTP")
            
        # Claim the profile
        user.phone_number = request.phone_number
        user.is_claimed = True
        user.otp = None # Clear OTP
        session.add(user)
        session.commit()
        session.refresh(user)
    else:
        # Login Flow Verification
        user = session.exec(select(User).where(User.phone_number == request.phone_number)).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
            
        if user.otp != request.otp:
            raise HTTPException(status_code=400, detail="Invalid OTP")
            
        user.otp = None
        session.add(user)
        session.commit()
        session.refresh(user)
    
    access_token = create_access_token(data={"sub": str(user.id)})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }
