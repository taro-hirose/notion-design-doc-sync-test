import express, { Request, Response } from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';

const app = express();
app.use(cors());
app.use(express.json());

// DB接続プール
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'memo_user',
  password: process.env.DB_PASSWORD || 'memo_password',
  database: process.env.DB_NAME || 'memo_app',
  waitForConnections: true,
  connectionLimit: 10,
});

// 型定義
interface Memo {
  id: number;
  title: string;
  content: string | null;
  created_at: Date;
  updated_at: Date;
}

// GET: 全メモ取得
app.get('/api/memos', async (_req: Request, res: Response) => {
  try {
    const [rows] = await pool.query<mysql.RowDataPacket[]>(
      'SELECT * FROM memos ORDER BY updated_at DESC'
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch memos' });
  }
});

// GET: 単一メモ取得
app.get('/api/memos/:id', async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query<mysql.RowDataPacket[]>(
      'SELECT * FROM memos WHERE id = ?',
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Memo not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch memo' });
  }
});

// POST: メモ作成
app.post('/api/memos', async (req: Request, res: Response) => {
  const { title, content } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  try {
    const [result] = await pool.query<mysql.ResultSetHeader>(
      'INSERT INTO memos (title, content) VALUES (?, ?)',
      [title, content || null]
    );
    const [rows] = await pool.query<mysql.RowDataPacket[]>(
      'SELECT * FROM memos WHERE id = ?',
      [result.insertId]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create memo' });
  }
});

// PUT: メモ更新
app.put('/api/memos/:id', async (req: Request, res: Response) => {
  const { title, content } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  try {
    await pool.query(
      'UPDATE memos SET title = ?, content = ? WHERE id = ?',
      [title, content || null, req.params.id]
    );
    const [rows] = await pool.query<mysql.RowDataPacket[]>(
      'SELECT * FROM memos WHERE id = ?',
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Memo not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update memo' });
  }
});

// DELETE: メモ削除
app.delete('/api/memos/:id', async (req: Request, res: Response) => {
  try {
    const [result] = await pool.query<mysql.ResultSetHeader>(
      'DELETE FROM memos WHERE id = ?',
      [req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Memo not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete memo' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
