import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

export async function abrirBanco() {
  if (db) return db;
  
  db = await SQLite.openDatabaseAsync('despensa.db');
  await db.execAsync(`
        CREATE TABLE IF NOT EXISTS produtos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            local TEXT NOT NULL,
            quantidade INTEGER NOT NULL DEFAULT 1,
            validade TEXT NOT NULL,        -- 'AAAA-MM-DD'
            dias_alerta INTEGER,           -- 1, 2... (null = sem alerta)
            notificacao_id TEXT,           -- id devolvido pelo expo-notifications
            foto TEXT                      -- caminho do arquivo
        );
    `);

  return db;
}