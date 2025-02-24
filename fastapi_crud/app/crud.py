import random
import uuid
from faker import Faker
from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from app import models
from app import schemas
from app.database import get_db
from app.models import Cliente, Pedido
from app.schemas import ClienteCreate, PedidoCreate, PedidoOut, PedidoUpdate
from app.auth import create_access_token, hash_password, verify_password
from sqlalchemy import func
from sqlalchemy.orm import joinedload

def create_cliente(db: Session, cliente: ClienteCreate):
    db_cliente = Cliente(
        nome=cliente.nome,
        email=cliente.email,
        senha=hash_password(cliente.senha),
        idade=cliente.idade,
        tipo_usuario=cliente.tipo_usuario
    )
    db.add(db_cliente)
    db.commit()
    db.refresh(db_cliente)
    return db_cliente

def create_pedido(db: Session, pedido: PedidoCreate):
    db_pedido = Pedido(
        idcliente=pedido.idcliente,
        valor=pedido.valor,
        descricao=pedido.descricao
    )
    db.add(db_pedido)
    db.commit()
    db.refresh(db_pedido)
    return db_pedido

def get_cliente(db: Session, cliente_id: uuid.UUID):
    return db.query(Cliente).filter(Cliente.id == cliente_id).first()

def get_pedido(db: Session, id: uuid.UUID):
    pedido_id = str(id) 
    return db.query(Pedido).filter(Pedido.id == pedido_id).first()

def get_pedidos(db: Session = Depends(get_db)):
    pedidos = (
        db.query(Pedido)
        .options(joinedload(Pedido.cliente))  
        .all()
    )

    return pedidos


def login_cliente(db: Session, email: str, senha: str):
    db_cliente = db.query(Cliente).filter(Cliente.email == email).first()
    
    if not db_cliente:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="E-mail não encontrado",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not verify_password(senha, db_cliente.senha):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Senha inválida",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    token = create_access_token(data={"sub": db_cliente.email})

    return {"access_token": token, "token_type": "bearer"}


def atualizar_pedido(db: Session, id: uuid.UUID, pedido_update: PedidoUpdate, usuario):
    pedido_id = str(id)  

    pedido = db.query(Pedido).filter(Pedido.id == pedido_id).first()

    if not pedido:
        raise HTTPException(status_code=404, detail="Pedido não encontrado")

    
    if pedido.idcliente != usuario.id:
        raise HTTPException(status_code=403, detail="Você não tem permissão para alterar este pedido")

    
    for key, value in pedido_update.dict(exclude_unset=True).items():
        setattr(pedido, key, value)

    db.commit()
    db.refresh(pedido)
    
    return PedidoOut.from_orm(pedido)

def clientes_com_pedidos(db: Session):
    clientes_com_pedidos = db.query(models.Cliente).filter(models.Cliente.pedidos.any()).all()
    return [
        schemas.ClienteOut(
            id=cliente.id,
            nome=cliente.nome,
            email=cliente.email,
            idade=cliente.idade,  
            quantidade_pedidos=len(cliente.pedidos),
            tipo_usuario=cliente.tipo_usuario, 
        )
        for cliente in clientes_com_pedidos
    ]

fake = Faker()

def gerar_pedido_aleatorio(cliente_id):
    valor = round(random.uniform(50.0, 500.0), 2)  
    descricao = fake.sentence(nb_words=5)  
    return PedidoCreate(idcliente=cliente_id, valor=valor, descricao=descricao)