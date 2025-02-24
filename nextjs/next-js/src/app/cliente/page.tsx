"use client";

import { Button, DatePicker, Form, Input } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import "@ant-design/v5-patch-for-react-19";
import axios from "axios";
import { useRouter } from "next/navigation";
import { API_URL } from "../../api/api";

export default function Cliente() {
    const [form] = Form.useForm();

    const router = useRouter();

    const handleAdd = async (values: {
        email: string;
        idade: string;
        nome: string;
        senha: string;
    }) => {
        const valores = {
            email: values.email,
            idade: values.idade as string,
            nome: values.nome,
            senha: values.senha,
        };

        try {
            await axios.post(`${API_URL}/cliente`, valores);

            router.push("/login");
        } catch (error) {
            console.error(error);
        }

        form.resetFields();
    };

    return (
        <Form form={form} onFinish={handleAdd} layout="vertical">
            <Form.Item name="email" label="E-mail" rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item name="senha" label="senha" rules={[{ required: true }]}>
                <Input.Password
                    placeholder="input password"
                    iconRender={(visible) =>
                        visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                    }
                />
            </Form.Item>
            <Form.Item
                name="nome"
                label="Nome do cliente"
                rules={[{ required: true }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Idade"
                name="idade"
                rules={[{ required: true, message: "Please input!" }]}
            >
                <DatePicker />
            </Form.Item>

            <Form.Item label=" ">
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    );
}
