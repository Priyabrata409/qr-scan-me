from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID

class EmergencyContactCreate(BaseModel):
    name: str
    phone_number: str

class EmergencyContactRead(EmergencyContactCreate):
    id: int
    user_id: UUID

class UserCreate(BaseModel):
    phone_number: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None

class UserRead(BaseModel):
    id: UUID
    phone_number: Optional[str] = None
    name: Optional[str] = None
    email: Optional[str] = None
    contacts: List[EmergencyContactRead] = []
    is_claimed: bool = False

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserRead

class SendOTPRequest(BaseModel):
    phone_number: str
    user_id: Optional[UUID] = None  # If claiming a profile

class VerifyOTPRequest(BaseModel):
    phone_number: str
    otp: str
    user_id: Optional[UUID] = None

