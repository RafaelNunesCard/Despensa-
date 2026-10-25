export type produto = {
    id: string;
    nome: string;
    local: "Geladeira" | "Despensa";
    quantidade: number;
    validade: string;
    diasAlerta: number;
    foto?: string;
}