# n8n Self-hosted セットアップ

Notion → Design Doc 自動同期ワークフロー用のn8n環境。

## 起動方法

### 1. 環境変数を設定

```bash
cp .env.example .env
# .envを編集してCredentialsを設定
```

**暗号化キーの生成:**
```bash
openssl rand -hex 32
```

### 2. 起動

```bash
docker-compose up -d
```

### 3. アクセス

http://localhost:5678

- ユーザー名: `.env`の`N8N_USER`
- パスワード: `.env`の`N8N_PASSWORD`

## ワークフローのインポート

1. n8nにログイン
2. 左メニュー「Workflows」→「Add Workflow」→「Import from File」
3. `../n8n-workflow.json` を選択

## Credentials設定

n8n UIで以下のCredentialsを作成:

### Notion API
- Type: `Notion API`
- API Key: NotionのIntegration Token

### GitHub API
- Type: `GitHub API`
- Access Token: Personal Access Token (repo権限)

### Claude API (HTTP Header Auth)
- Type: `Header Auth`
- Name: `x-api-key`
- Value: Claude API Key

## 停止

```bash
docker-compose down
```

データを消す場合:
```bash
docker-compose down -v
```

## トラブルシューティング

### n8nが起動しない
```bash
docker-compose logs n8n
```

### DBに接続できない
```bash
docker-compose logs n8n-db
```

### Credentialsが復号できない
`N8N_ENCRYPTION_KEY`を変更すると既存のCredentialsは復号できなくなります。
再設定が必要です。
