from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from typing import Optional
from uuid import UUID
from sqlmodel import Session, select
from ..database import get_session
from ..models import User, UserRead

router = APIRouter(prefix="/admin", tags=["admin"])

@router.post("/generate")
async def generate_blank_profile(
    file: Optional[UploadFile] = File(None),
    session: Session = Depends(get_session)
):
    """
    Generate a blank, unclaimed user profile.
    Returns the User ID and a direct link to the public view/claim page.
    """
    user = User(is_claimed=False)
    
    if file:
        content = await file.read()
        user.image_data = content
        user.image_content_type = file.content_type

    session.add(user)
    session.commit()
    session.refresh(user)
    
    # In a real app, you might generate a signed URL or such, 
    # but here just the ID is enough for the frontend to claim it.
    base_url = "http://localhost:5173" # Should be env var in prod
    claim_link = f"{base_url}/view/{user.id}"
    
    return {
        "user_id": user.id,
        "status": "created",
        "claim_link": claim_link
    }

from typing import List
@router.get("/users", response_model=List[UserRead])
def list_users(session: Session = Depends(get_session)):
    """List all users/profiles for admin view."""
    users = session.exec(select(User)).all()
    return users

@router.delete("/users/{user_id}")
def delete_user(user_id: UUID, session: Session = Depends(get_session)):
    """Delete a user/profile."""
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    session.delete(user)
    session.commit()
    return {"ok": True}
