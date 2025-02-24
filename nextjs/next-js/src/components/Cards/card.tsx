import { Card, Col, Row } from "antd";
import React from "react";
import styles from './../../styles/card.module.scss'
import { formatarData } from "../utils/formatarData";
import { PedidoI } from "@/components/types/pedidos.interface";

interface CardsProps {
    orders: PedidoI[];
}

export const Cards = ({orders}: CardsProps) => {
    return (
        <div className={styles.page}>
            <Row gutter={16}>
                {orders.map((order, index) => {
                    return (
                        <Col
                            key={`col-${index}`}
                            xs={{ flex: "100%" }}
                            sm={{ flex: "50%" }}
                            md={{ flex: "40%" }}
                            lg={{ flex: "20%" }}
                            xl={{ flex: "20%" }}
                            span={8}
                        >
                            <Card
                                title={"Pedido realizado por:"}
                                type="inner"
                                className={styles.card}
                                extra={order.cliente.nome}
                            >
                                <Card.Grid className={styles.values}>
                                    Valor: <span>R$ {order.valor}</span>
                                </Card.Grid>

                                <Card.Grid className={styles.description}>
                                    Descrição do pedido:
                                    <span> {order.descricao}</span>
                                </Card.Grid>
                                <Card.Grid className={styles.date}>
                                    Quando foi pedido:
                                    <span>
                                        {formatarData(order.data_criacao)}
                                    </span>
                                </Card.Grid>
                            </Card>
                        </Col>
                    );
                })}
            </Row>
        </div>
    );
};
