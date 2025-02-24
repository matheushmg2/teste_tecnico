export interface ClienteI {
    id: string;
    nome: string;
    email: string;
    idade: string;
    tipo_usuario?: string;
}

export interface PedidoI {
    id: string;
    idcliente: string;
    cliente: ClienteI;
    descricao: string;
    valor: number;
    data_criacao: string;
}
