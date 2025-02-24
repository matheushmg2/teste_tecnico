"use client";
import { Badge, Card, Col, Row, Space } from "antd";
import React from "react";
import styles from "../../styles/indicator.module.scss";

export const Indicator = ({ props }: any) => {
    const { indicador, total_pedidos, total_clientes } = props;

    return (
        <Row gutter={16} className={styles.container}>
            <Col span={8}>
                <Card title="Indicador" style={{ marginBottom: 16 }}>
                    Média de pedidos por cliente:{" "}
                    <strong>{indicador?.toFixed(2)}</strong>
                </Card>
            </Col>

            <Col span={8}>
                <Space
                    direction="horizontal"
                    size="middle"
                    style={{ width: "100%" }}
                >
                    <Badge.Ribbon text={total_clientes} color="cyan">
                        <Card title="Totais de clientes" size="small">
                            Quantidade de cliente que fizeram os pedidos
                        </Card>
                    </Badge.Ribbon>
                    <Badge.Ribbon text={total_pedidos} color="cyan">
                        <Card title="Totais de pedidos" size="small">
                            Quantidade de pedidos feito pelos clientes
                        </Card>
                    </Badge.Ribbon>
                </Space>
            </Col>
        </Row>
    );
};
