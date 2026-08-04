from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.repositories.user_repo import UserRepository
from app.core.security import get_password_hash, verify_password, create_access_token
from app.schemas.user import UserRegisterRequest, UserLoginRequest, TokenResponse, UserResponse

class AuthService:
    @staticmethod
    def register(db: Session, request: UserRegisterRequest) -> UserResponse:
        existing_user = UserRepository.get_by_email(db, request.email)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email address is already registered"
            )
        hashed_password = get_password_hash(request.password)
        user = UserRepository.create(db, request.full_name, request.email, hashed_password)
        return UserResponse.model_validate(user)

    @staticmethod
    def login(db: Session, request: UserLoginRequest) -> TokenResponse:
        user = UserRepository.get_by_email(db, request.email)
        if not user or not verify_password(request.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        access_token = create_access_token(data={"sub": str(user.id), "email": user.email})
        return TokenResponse(access_token=access_token)

    @staticmethod
    def get_user_profile(db: Session, user_id: int) -> UserResponse:
        user = UserRepository.get_by_id(db, user_id)
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        return UserResponse.model_validate(user)

    @staticmethod
    def update_user_profile(db: Session, user_id: int, full_name: str) -> UserResponse:
        user = UserRepository.get_by_id(db, user_id)
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        updated_user = UserRepository.update(db, user, full_name)
        return UserResponse.model_validate(updated_user)
