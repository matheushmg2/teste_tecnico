"use client";

import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export const verificarExpiracaoToken = () => {
    const token = Cookies.get("token");

    if (!token) return true;

    try {
        const decoded: { exp: number } = jwtDecode(token);
        const agora = Math.floor(Date.now() / 1000);

        return decoded.exp < agora;
    } catch (error) {
        console.error(error);
        return true;
    }
};
