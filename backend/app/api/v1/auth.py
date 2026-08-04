from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.middleware.auth import get_current_user
from app.models.user import User
from app.schemas.user import UserRegisterRequest, UserLoginRequest, TokenResponse, UserResponse, UserUpdateRequest
from app.services.auth_service import AuthService

router = APIRouter(tags=["Authentication"])

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(request: UserRegisterRequest, db: Session = Depends(get_db)):
    return AuthService.register(db, request)

@router.post("/login", response_model=TokenResponse)
def login(request: UserLoginRequest, db: Session = Depends(get_db)):
    return AuthService.login(db, request)

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return UserResponse.model_validate(current_user)

@router.put("/me", response_model=UserResponse)
def update_me(request: UserUpdateRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return AuthService.update_user_profile(db, current_user.id, request.full_name)
