"use client";

import { useEffect, useState } from "react";
import { Button, Card, Table, Form, Input } from "antd";
import axios from "axios";
import Cookies from "js-cookie";

import "@ant-design/v5-patch-for-react-19";
import { useRouter } from "next/navigation";
import { verificarExpiracaoToken } from "@/components/utils/verificarExpiracaoToken";
import RenderModal from "@/components/Modal/modal";
import { API_URL } from "../../api/api";
import { ClienteI, PedidoI } from "../../components/types/pedidos.interface";

export default function Pedido() {
    const [cliente, setCliente] = useState<ClienteI>();
    const router = useRouter();

    const [orders, setOrders] = useState([]);
    const [indicator, setIndicator] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [editingOrder, setEditingOrder] = useState<PedidoI | null>(null);
    const [form] = Form.useForm();

    const [orderToDelete, setOrderToDelete] = useState<string | null>(null);

    useEffect(() => {
        const verificarEBuscarCliente = async () => {
            if (verificarExpiracaoToken()) {
                Cookies.remove("token");
                router.push("/login");
                return;
            }

            const token = Cookies.get("token");

            if (!token || verificarExpiracaoToken()) {
                router.push("/login");
                return;
            }

            try {
                const response = await axios.get(`${API_URL}/cliente/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setCliente(response.data);
            } catch (error) {
                console.log(error);
            }

            try {
                const response = await axios.get(`${API_URL}/cliente/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setCliente(response.data);
            } catch (error: any) {
                console.error("Erro ao buscar dados do cliente:", error);
                router.push("/");
            }
        };

        verificarEBuscarCliente();
    }, []);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        const { data } = await axios.get(`${API_URL}/pedidos`);
        const returnIndicador = await axios.get(`${API_URL}/indicador`);

        const formattedData = data.map(
            (order: { cliente: { nome: string; email: string } }) => ({
                ...order,
                clienteNome: order.cliente
                    ? order.cliente.nome
                    : "Desconhecido",
                clienteEmail: order.cliente ? order.cliente.email : "Sem email",
            })
        );

        setOrders(formattedData);

        setIndicator(returnIndicador.data.indicador);
    };

    const handleAddOrEdit = async (values: {
        valor: string;
        descricao: string;
    }) => {
        if (editingOrder) {
            const valores = {
                idcliente: cliente?.id as string,
                valor: values.valor,
                descricao: values.descricao,
            };

            const id = editingOrder.id as string;

            console.log("id: ", id);

            console.log("editingOrder: ", editingOrder);

            await axios.put(
                `${API_URL}/pedidos/${editingOrder.id as string}`,
                valores,
                {
                    headers: {
                        Authorization: `Bearer ${Cookies.get("token")}`,
                    },
                }
            );
        } else {
            const valores = {
                idcliente: cliente?.id,
                valor: values.valor,
                descricao: values.descricao,
            };

            await axios.post(`${API_URL}/pedidos`, valores, {
                headers: {
                    Authorization: `Bearer ${Cookies.get("token")}`,
                },
            });
        }
        fetchOrders();
        setIsModalOpen(false);
        setEditingOrder(null);
        form.resetFields();
    };

    const showDeleteConfirm = (orderId: string) => {
        setOrderToDelete(orderId);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`${API_URL}/pedidos/${orderToDelete}`, {
                headers: {
                    Authorization: `Bearer ${Cookies.get("token")}`,
                },
            });

            setOrders(
                orders.filter(
                    (order: { id: null }) => order.id !== orderToDelete
                )
            );
            setIsModalOpen(false);
            fetchOrders();
        } catch (error) {
            console.error(error);
            setIsModalOpen(false);
        }
        setIsDeleteModalOpen(false);
    };

    return (
        <div>
            <Card title="Indicador" style={{ marginBottom: 16 }}>
                Média de pedidos por cliente: {indicator.toFixed(2)}
            </Card>
            <Button type="primary" onClick={() => setIsModalOpen(true)}>
                Novo Pedido
            </Button>

            <Table dataSource={orders} rowKey="id" style={{ marginTop: 16 }}>
                <Table.Column
                    title="Nome Cliente"
                    dataIndex="clienteNome"
                    key="clienteNome"
                />
                <Table.Column
                    title="Email Cliente"
                    dataIndex="clienteEmail"
                    key="clienteEmail"
                />
                <Table.Column
                    title="Descrição do Pedido"
                    dataIndex="descricao"
                    key="descricao"
                />
                <Table.Column
                    title="Valor do Pedido (R$)"
                    dataIndex="valor"
                    key="valor"
                />
                <Table.Column
                    title="Criação do Pedido"
                    dataIndex="data_criacao"
                    key="data_criacao"
                    sorter={(a, b) =>
                        new Date(b.data_criacao).getTime() -
                        new Date(a.data_criacao).getTime()
                    }
                    defaultSortOrder="ascend"
                />
                <Table.Column
                    title="Ações"
                    render={(text, record: PedidoI) => {
                        const canEditOrDelete =
                            cliente &&
                            (cliente.tipo_usuario === "root" ||
                                cliente.id === record.cliente.id);

                        return (
                            <>
                                {canEditOrDelete && (
                                    <>
                                        <Button
                                            onClick={() => {
                                                setEditingOrder(record);
                                                setIsModalOpen(true);
                                                form.setFieldsValue(record);
                                            }}
                                        >
                                            Editar
                                        </Button>
                                        <Button
                                            danger
                                            onClick={() => {
                                                showDeleteConfirm(record.id);
                                            }}
                                        >
                                            Deletar
                                        </Button>
                                    </>
                                )}
                            </>
                        );
                    }}
                />
            </Table>

            <RenderModal
                title="Confirmar Exclusão"
                open={isDeleteModalOpen}
                onCancel={() => setIsDeleteModalOpen(false)}
                onOk={handleDelete}
            >
                <p>Você tem certeza que deseja deletar este pedido?</p>
            </RenderModal>
            <RenderModal
                title={editingOrder ? "Editar Pedido" : "Novo Pedido"}
                open={isModalOpen}
                onCancel={() => {
                    setIsModalOpen(false);
                    setEditingOrder(null);
                    form.resetFields();
                }}
                onOk={() => form.submit()}
                editingOrder={editingOrder}
                form={form}
                setEditingOrder={setEditingOrder}
                setIsModalOpen={setIsModalOpen}
            >
                <Form form={form} onFinish={handleAddOrEdit} layout="vertical">
                    <Form.Item
                        name="valor"
                        label="Valor"
                        rules={[{ required: true }]}
                    >
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item
                        name="descricao"
                        label="Descrição"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </RenderModal>
        </div>
    );
}
