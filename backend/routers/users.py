from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlmodel import Session, select
from typing import List
from uuid import UUID
from ..database import get_session
from ..models import User, EmergencyContact
from ..schemas import UserRead, UserUpdate, EmergencyContactCreate, EmergencyContactRead
from ..deps import get_current_user

router = APIRouter(tags=["users"])

@router.get("/users/me", response_model=UserRead)
def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/users/me", response_model=UserRead)
def update_user_me(user_in: UserUpdate, session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    if user_in.name is not None:
        current_user.name = user_in.name
    if user_in.email is not None:
        current_user.email = user_in.email
    session.add(current_user)
    session.commit()
    session.refresh(current_user)
    return current_user

@router.put("/users/me/contacts", response_model=UserRead)
def update_contacts(contacts: List[EmergencyContactCreate], session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    # Delete existing contacts
    statement = select(EmergencyContact).where(EmergencyContact.user_id == current_user.id)
    existing_contacts = session.exec(statement).all()
    for contact in existing_contacts:
        session.delete(contact)
    
    # Add new contacts
    for contact_in in contacts:
        contact = EmergencyContact(name=contact_in.name, phone_number=contact_in.phone_number, user_id=current_user.id)
        session.add(contact)
    
    session.commit()
    session.refresh(current_user)
    return current_user

@router.get("/public/{user_id}", response_model=UserRead)
def read_user_public(user_id: UUID, session: Session = Depends(get_session)):
    user = session.get(User, user_id)
    return user

@router.post("/users/me/image")
async def upload_image(file: UploadFile = File(...), session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    contents = await file.read()
    current_user.image_data = contents
    current_user.image_content_type = file.content_type
    session.add(current_user)
    session.commit()
    return {"message": "Image uploaded successfully"}

@router.get("/users/{user_id}/image")
def get_user_image(user_id: UUID, session: Session = Depends(get_session)):
    user = session.get(User, user_id)
    if not user or not user.image_data:
        # Return a placeholder or 404. For now 404 is fine, frontend can handle fallback.
        raise HTTPException(status_code=404, detail="Image not found")
    
    from fastapi.responses import Response
    return Response(content=user.image_data, media_type=user.image_content_type)

