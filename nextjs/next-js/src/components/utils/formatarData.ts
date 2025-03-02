export const formatarData = (dataString: string): string => {
    const data = new Date(dataString);
    const formatador = new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
    return formatador.format(data).replace(",", " às");
};