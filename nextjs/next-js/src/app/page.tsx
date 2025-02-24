"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import "@ant-design/v5-patch-for-react-19";
import { Cards } from "@/components/Cards/card";
import { Indicator } from "@/components/Indicator/indicator";
import { API_URL } from "../api/api";
import { PedidoI } from "../components/types/pedidos.interface";

export default function Home() {
    const [orders, setOrders] = useState<PedidoI[] | []>([]);
    const [indicator, setIndicator] = useState(0);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        const { data } = await axios.get(`${API_URL}/pedidos`);
        const returnIndicador = await axios.get(`${API_URL}/indicador`);

        setOrders(data);

        setIndicator(returnIndicador.data);
    };

    return (
        <>
            <Indicator props={indicator} />
            <Cards orders={orders} />
        </>
    );
}
