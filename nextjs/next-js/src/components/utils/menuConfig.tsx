import { MenuProps } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import Link from "next/link";

export const getMenuItems = (handleLogout: () => void): MenuProps["items"] => [
    {
        key: "1",
        label: "My Account",
        disabled: true,
    },
    {
        type: "divider",
    },
    {
        key: "3",
        label: <span onClick={handleLogout}>Logout</span>,
        icon: <SettingOutlined />,
        extra: "⌘S",
    },
];

export const getMenus = () => [
    { key: "Home", label: <Link href="/">Home</Link> },
    {
        key: "Pedidos",
        label: <Link href="/pedidos">Pedidos</Link>,
    },
];
