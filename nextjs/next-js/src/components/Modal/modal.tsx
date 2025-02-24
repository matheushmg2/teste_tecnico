import { PedidoI } from "@/components/types/pedidos.interface";
import { Modal } from "antd";

interface RenderModalProps {
    title: string;
    open: boolean;
    onCancel: () => void;
    onOk: () => void;
    children: React.ReactNode;
    editingOrder?: PedidoI | null;
    form?: any;
    setEditingOrder?: (order: any) => void;
    setIsModalOpen?: (open: boolean) => void;
}

const RenderModal: React.FC<RenderModalProps> = ({
    title,
    open,
    onCancel,
    onOk,
    children,
    editingOrder,
    form,
    setEditingOrder,
    setIsModalOpen,
}) => {
    if (title === "Confirmar Exclusão") {
        return (
            <Modal title={title} open={open} onCancel={onCancel} onOk={onOk}>
                {children}
            </Modal>
        );
    }

    return (
        <Modal
            title={editingOrder ? "Editar Pedido" : "Novo Pedido"}
            open={open}
            onCancel={() => {
                setIsModalOpen?.(false);
                setEditingOrder?.(null);
                form?.resetFields();
            }}
            onOk={() => form?.submit()}
        >
            {children}
        </Modal>
    );
};

export default RenderModal;
