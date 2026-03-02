from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
import models
import schemas
from auth import create_access_token, get_current_user
from routes.users import hash_password, verify_password

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/register", response_model=schemas.TokenResponse, status_code=201)
def register(user: schemas.RegisterRequest, db: Session = Depends(get_db)):
    """Register a new user and return a JWT token"""
    existing = db.query(models.User).filter(
        (models.User.email == user.email) | (models.User.username == user.name)
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email or username already in use")

    db_user = models.User(
        username=user.name,
        email=user.email,
        password_hash=hash_password(user.password),
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    token = create_access_token({"sub": str(db_user.user_id)})
    return {"access_token": token, "token_type": "bearer"}


@router.post("/login", response_model=schemas.TokenResponse)
def login(credentials: schemas.LoginRequest, db: Session = Depends(get_db)):
    """Login and return a JWT token"""
    user = db.query(models.User).filter(models.User.email == credentials.email).first()
    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token({"sub": str(user.user_id)})
    return {"access_token": token, "token_type": "bearer"}


@router.get("/me", response_model=schemas.UserResponse)
def get_me(current_user: models.User = Depends(get_current_user)):
    """Return the currently authenticated user"""
    return current_user
