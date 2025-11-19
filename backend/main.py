from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from jose import jwt

import models, schemas, crud, auth
from database import SessionLocal, engine

SECRET_KEY = "tu_secreto_super_seguro"
ALGORITHM = "HS256"

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


# ----------------------------
# DEPENDENCIA BASE DE DATOS
# ----------------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ----------------------------
# OBTENER USUARIO ACTUAL (JWT)
# ----------------------------
def get_current_user(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
    except:
        raise HTTPException(status_code=401, detail="Token inválido")

    user = db.query(models.User).filter(models.User.username == username).first()
    if not user:
        raise HTTPException(status_code=401, detail="Usuario no encontrado")

    return user


# ----------------------------
# RUTA: REGISTRO
# ----------------------------
@app.post("/register", response_model=schemas.UserResponse)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    return crud.create_user(db, user)


# ----------------------------
# RUTA: LOGIN
# ----------------------------
@app.post("/login")
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = crud.authenticate_user(db, user.username, user.password)
    if not db_user:
        raise HTTPException(status_code=400, detail="Credenciales inválidas")

    token = auth.create_token({"sub": db_user.username})
    return {"access_token": token, "token_type": "bearer"}


# ----------------------------
# RUTA: OBTENER USUARIOS
# ----------------------------
@app.get("/users", response_model=list[schemas.UserResponse])
def get_users(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return db.query(models.User).all()


# ----------------------------
# RUTA: ELIMINAR USUARIO
# ----------------------------
@app.delete("/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    user = db.query(models.User).filter(models.User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    db.delete(user)
    db.commit()
    return {"message": "Usuario eliminado"}


# ----------------------------
# RUTA: EDITAR USUARIO
# ----------------------------
@app.put("/users/{user_id}", response_model=schemas.UserResponse)
def update_user(user_id: int, data: schemas.UserCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    user = db.query(models.User).filter(models.User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    user.username = data.username
    user.email = data.email
    user.password = auth.hash_password(data.password)

    db.commit()
    db.refresh(user)
    return user
