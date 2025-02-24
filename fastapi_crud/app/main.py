from datetime import datetime
import random
from typing import List
import uuid
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy import UUID
from sqlalchemy.orm import Session
from app.database import SessionLocal, engine
from app import models, schemas, crud, auth
from fastapi.middleware.cors import CORSMiddleware

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_cliente(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    payload = auth.verify_token(token)
    email = payload.get("sub")
    if email is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    db_cliente = db.query(models.Cliente).filter(models.Cliente.email == email).first()
    if db_cliente is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return db_cliente

@app.post("/cliente", response_model=schemas.ClienteOut)
def create_cliente_view(cliente: schemas.ClienteCreate, db: Session = Depends(get_db)):
    return crud.create_cliente(db, cliente)

@app.post("/pedidos", response_model=schemas.PedidoOut)
def create_pedido_view(pedido: schemas.PedidoCreate, db: Session = Depends(get_db)):
    return crud.create_pedido(db, pedido)

@app.get("/pedidos", response_model=list[schemas.PedidoOut])
def read_pedidos(db: Session = Depends(get_db)):
    return crud.get_pedidos(db)

@app.get("/pedidos/{id}", response_model=schemas.PedidoOut)
def get_pedido_view(id: uuid.UUID, db: Session = Depends(get_db)):
    pedido = crud.get_pedido(db, id)
    if not pedido:
        raise HTTPException(status_code=404, detail="Pedido não encontrado")
    return pedido

@app.post("/token")
def login_for_access_token(form_data: schemas.Login, db: Session = Depends(get_db)):
    return crud.login_cliente(db, form_data.email, form_data.senha)

@app.put("/pedidos/{id}", response_model=schemas.PedidoOut)
def atualizar_pedido_view(id: uuid.UUID, pedido_update: schemas.PedidoUpdate, db: Session = Depends(get_db), usuario=Depends(get_current_cliente)):
    pedido = crud.atualizar_pedido(db, id, pedido_update, usuario)
    return pedido

@app.delete("/pedidos/{id}")
def remover_pedido(id: uuid.UUID, db: Session = Depends(get_db), usuario=Depends(get_current_cliente)):
    pedido_id = str(id)

    pedido = db.query(models.Pedido).filter(models.Pedido.id == pedido_id).first()
    if not pedido:
        raise HTTPException(status_code=404, detail="Pedido não encontrado")

    if pedido.idcliente != usuario.id:
        raise HTTPException(status_code=403, detail="Você não tem permissão para excluir este pedido")

    db.delete(pedido)
    db.commit()
    return {"message": "Pedido removido com sucesso"}

@app.get("/indicador")
def indicador(db: Session = Depends(get_db)):
    total_pedidos = db.query(models.Pedido).count()
    total_clientes = db.query(models.Cliente).count()

    if total_clientes == 0:
        return {"indicador": 0}
    return {
        "indicador": total_pedidos / total_clientes,
        "total_pedidos": total_pedidos,
        "total_clientes": total_clientes
        }

@app.get("/cliente/me", response_model=schemas.ClienteOut)
def get_cliente_me(current_cliente: models.Cliente = Depends(get_current_cliente)):
    return current_cliente

@app.get("/clientes/com-pedidos", response_model=List[schemas.ClienteOut])
def clientes_com_pedidos(db: Session = Depends(get_db)):
    clientes = crud.clientes_com_pedidos(db)

    return clientes


@app.post("/criar_pedidos_aleatorios")
def criar_pedidos_aleatorios(db: Session = Depends(get_db)):
    clientes = db.query(models.Cliente).all()

    if not clientes:
        raise HTTPException(status_code=404, detail="Nenhum cliente encontrado.")

    pedidos_criados = []
    for cliente in clientes:
        pedido_aleatorio = crud.gerar_pedido_aleatorio(cliente.id)
        pedido = models.Pedido(
            idcliente=pedido_aleatorio.idcliente,
            valor=pedido_aleatorio.valor,
            descricao=pedido_aleatorio.descricao,
            data_criacao=datetime.utcnow()
        )
        db.add(pedido)
        pedidos_criados.append(pedido)

    db.commit()

    return {"pedidos_criados": [pedido.id for pedido in pedidos_criados]}