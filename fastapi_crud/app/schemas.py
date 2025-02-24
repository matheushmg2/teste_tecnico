from datetime import datetime
from pydantic import BaseModel
from typing import Optional
import uuid

class ClienteCreate(BaseModel):
    nome: str
    email: str
    senha: str
    idade: str
    tipo_usuario: Optional[str] = None

class ClienteOut(BaseModel):
    id: uuid.UUID
    nome: str
    email: str
    idade: Optional[str] = None  
    quantidade_pedidos: Optional[int] = None  
    tipo_usuario: Optional[str] = None
    
    class Config:
        from_attributes = True
        orm_mode = True

class PedidoCreate(BaseModel):
    idcliente: uuid.UUID
    valor: float
    descricao: Optional[str] = None

class PedidoOut(BaseModel):
    id: uuid.UUID
    #idcliente: uuid.UUID
    valor: float
    descricao: Optional[str] = None
    data_criacao: datetime 
    cliente: Optional[ClienteOut] = None

    class Config:
        orm_mode = True
        from_attributes = True


class Login(BaseModel):
    email: str
    senha: str

class PedidoUpdate(BaseModel):
    valor: Optional[float] = None
    descricao: Optional[str] = None