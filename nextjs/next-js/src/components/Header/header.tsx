"use client";
import React, { useEffect, useState } from "react";
import { DownOutlined } from "@ant-design/icons";
import { Dropdown, Space, Menu } from "antd";
import { Header as Headeres } from "antd/es/layout/layout";
import Link from "next/link";
import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation";
import { verificarExpiracaoToken } from "../utils/verificarExpiracaoToken";
import { getMenuItems, getMenus } from "../utils/menuConfig";
import styles from "../../styles/header.module.scss";
import "@ant-design/v5-patch-for-react-19";

export const Header = () => {
    const router = useRouter();
    const pathname = usePathname();

    const [isTokenExpired, setIsTokenExpired] = useState<boolean | null>(null);

    useEffect(() => {
        setIsTokenExpired(verificarExpiracaoToken());
    }, []);

    const handleLogout = () => {
        Cookies.remove("token");
        setIsTokenExpired(true);
        router.push("/");
    };

    const getSelectedKey = () => {
        if (pathname === "/") return "Home";
        if (pathname.startsWith("/pedidos")) return "Pedidos";
        return "";
    };

    const filteredMenus = getMenus();

    return (
        <Headeres className={styles.header}>
            <Menu
                theme="dark"
                mode="horizontal"
                selectedKeys={[getSelectedKey()]}
                items={filteredMenus}
                style={{ flex: 1, minWidth: 0 }}
            />

            {isTokenExpired ? (
                <div className={styles.login}>
                    <Link href="/login">Login</Link>
                    <Link href="/cliente">Cadastrar</Link>
                </div>
            ) : (
                <Dropdown menu={{ items: getMenuItems(handleLogout) }}>
                    <Space className={styles.space}>
                        Hover me
                        <DownOutlined />
                    </Space>
                </Dropdown>
            )}
        </Headeres>
    );
};
