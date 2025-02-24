from sqlalchemy import Column, String, BINARY, DateTime, ForeignKey, DECIMAL
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime
from sqlalchemy.dialects.mysql import CHAR

from app.database import Base

class Cliente(Base):
    __tablename__ = "cliente"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    nome = Column(String(255), index=True)
    email = Column(String(255), unique=True, index=True)
    senha = Column(String(255))
    idade = Column(String(255))
    tipo_usuario = Column(String(255), nullable=True)

class Pedido(Base):
    __tablename__ = "pedidos"

    id = Column(CHAR(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    idcliente = Column(CHAR(36), ForeignKey("cliente.id"))
    valor = Column(DECIMAL(10, 2))
    data_criacao = Column(DateTime, default=datetime.utcnow)
    descricao = Column(String(255))

    cliente = relationship("Cliente", backref="pedidos")
