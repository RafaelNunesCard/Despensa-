import { abrirBanco } from './db';

export type Produto = {
  id: number;
  nome: string;
  local: string;
  quantidade: number;
  validade: string;            // 'AAAA-MM-DD'
  dias_alerta: number | null;
  notificacao_id: string | null;
  foto: string | null;
};

type NovoProduto = {
  nome: string;
  local: string;
  quantidade: number;
  validade: string;
  diasAlerta?: number;
  foto?: string;
};

export async function salvarProduto(p: NovoProduto) {
  const db = await abrirBanco();
  const resultado = await db.runAsync(
    `INSERT INTO produtos (nome, local, quantidade, validade, dias_alerta, foto)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [p.nome, p.local, p.quantidade, p.validade, p.diasAlerta ?? null, p.foto ?? null]
  );
  return resultado.lastInsertRowId; // id do produto criado
}

export async function listarProdutos() {
  const db = await abrirBanco();
  return db.getAllAsync<Produto>('SELECT * FROM produtos ORDER BY validade');
}