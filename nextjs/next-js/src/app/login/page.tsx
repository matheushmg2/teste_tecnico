"use client";

import { Alert, Button, Form, Input } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import "@ant-design/v5-patch-for-react-19";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Cookies from "js-cookie";
import styles from "../../styles/login.module.scss";
import { API_URL } from "../../api/api";

export default function Login() {
    const [form] = Form.useForm();

    const router = useRouter();

    const [errorMessage, setErrorMessage] = useState("");

    const handleToken = async (values: { email: string; senha: string }) => {
        const valores = {
            email: values.email,
            senha: values.senha,
        };

        try {
            const response = await axios.post(`${API_URL}/token`, valores);

            const { access_token } = response.data;

            Cookies.set("token", access_token, { expires: 1 });

            router.push("/pedidos");
        } catch (error: any) {
            if (error.response && error.response.status === 401) {
                setErrorMessage(error.response.data.detail);
            } else {
                setErrorMessage("Erro ao tentar fazer login.");
            }
        }

        form.resetFields();
    };

    return (
        <div className={styles.login}>
            {errorMessage && (
                <Alert
                    message="Error"
                    description={"E-mail ou senha inválida"}
                    type="error"
                    showIcon
                    closable
                />
            )}

            <Form
                form={form}
                onFinish={handleToken}
                layout="vertical"
                style={{ maxWidth: 600 }}
            >
                <Form.Item
                    name="email"
                    label="E-mail"
                    rules={[{ required: true }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="senha"
                    label="senha"
                    rules={[{ required: true }]}
                >
                    <Input.Password
                        placeholder="input password"
                        iconRender={(visible) =>
                            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                        }
                    />
                </Form.Item>
                <Form.Item label=" ">
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}
