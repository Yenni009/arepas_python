from sqlalchemy.orm import Session
import models, schemas, auth
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException, status

def create_user(db: Session, user: schemas.UserCreate):
    hashed = auth.hash_password(user.password)

    db_user = models.User(
        username=user.username,
        email=user.email,
        password=hashed
    )

    try:
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user

    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El usuario o correo ya existe"
        )

def authenticate_user(db: Session, username: str, password: str):
    user = db.query(models.User).filter(models.User.username == username).first()
    if not user:
        return None
    if not auth.verify_password(password, user.password):
        return None
    return user
