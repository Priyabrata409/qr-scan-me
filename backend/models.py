from typing import List, Optional
from uuid import UUID, uuid4
from sqlmodel import Field, SQLModel, Relationship

class EmergencyContactBase(SQLModel):
    name: str = Field(index=True)
    phone_number: str

class EmergencyContact(EmergencyContactBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: Optional[UUID] = Field(default=None, foreign_key="user.id")
    user: Optional["User"] = Relationship(back_populates="contacts")

from datetime import datetime

class UserBase(SQLModel):
    phone_number: Optional[str] = Field(default=None, unique=True, index=True)
    name: Optional[str] = None
    email: Optional[str] = None

class User(UserBase, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    contacts: List[EmergencyContact] = Relationship(back_populates="user")
    image_data: Optional[bytes] = None
    image_content_type: Optional[str] = None
    is_claimed: bool = Field(default=False)
    otp: Optional[str] = None
    otp_expiry: Optional[datetime] = None

class UserRead(UserBase):
    id: UUID
    is_claimed: bool
    contacts: List[EmergencyContact] = []
    # Intentionally exclude image_data, otp, etc.
