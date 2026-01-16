# メモアプリ

フルTypeScriptのシンプルなメモアプリ。

## 構成

- **Frontend**: React + TypeScript + Vite (ローカル実行)
- **Backend**: Express + TypeScript (Docker)
- **Database**: MySQL 8.0 (Docker)

## 起動方法

### 1. Backend + MySQL (Docker)

```bash
cd memo-app
docker-compose up -d
```

バックエンドは `http://localhost:3001` で起動します。

### 2. Frontend (ローカル)

```bash
cd memo-app/frontend
npm install
npm run dev
```

フロントエンドは `http://localhost:3000` で起動します。

## API

| Method | Endpoint | 説明 |
|--------|----------|------|
| GET | /api/memos | 全メモ取得 |
| GET | /api/memos/:id | 単一メモ取得 |
| POST | /api/memos | メモ作成 |
| PUT | /api/memos/:id | メモ更新 |
| DELETE | /api/memos/:id | メモ削除 |

## 停止

```bash
docker-compose down
```

データを消す場合:
```bash
docker-compose down -v
```
