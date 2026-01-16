# Notion → Design Doc 自動同期

NotionのProduct Spec DocとGitHubのDesign Docを自動同期するプロジェクト。

## 概要

```
[Notion更新] → [n8n検知] → [Claude API変換] → [MR作成] → [エンジニアレビュー]
```

### ドキュメントの役割

| 場所 | ドキュメント | 目的 |
|------|-------------|------|
| Notion | Product Spec Doc | ステークホルダーとの合意形成（What/Why） |
| GitHub | Design Doc | エンジニア・AIによる技術設計（How） |

## セットアップ

### 1. 必要なCredentials

- **Notion API Key**: Integration作成後に取得
- **GitHub Token**: repo権限が必要
- **Claude API Key**: Anthropic Consoleから取得

### 2. n8nセットアップ

1. n8n Cloud or Self-hostedを用意
2. `n8n-workflow.json` をインポート
3. 各Credentialを設定

### 3. Notion側の準備

1. [Notion Integrations](https://www.notion.so/my-integrations) でIntegration作成
2. 同期対象のページで「コネクトを追加」からIntegrationを追加

### 4. 環境変数

```bash
NOTION_API_KEY=secret_xxx
NOTION_PAGE_ID=xxx-xxx-xxx
GITHUB_TOKEN=ghp_xxx
GITHUB_REPO=owner/repo
CLAUDE_API_KEY=sk-ant-xxx
```

## ファイル構成

```
.
├── README.md
├── .gitignore
├── n8n-workflow.json          # n8nワークフロー定義
└── docs/
    ├── specs/
    │   └── product-spec.md    # Notionから同期（frontmatter付き）
    └── design/
        └── design-doc.md      # AIが生成・更新
```

## 同期フロー詳細

### バージョン管理

`product-spec.md` のfrontmatterでNotionのバージョンを追跡:

```yaml
---
notion_page_id: "xxx-xxx-xxx"
notion_version: "2024-01-15T10:30:00.000Z"
last_synced: "2024-01-15T11:00:00.000Z"
---
```

### 差分検知ロジック

1. GitHubの `notion_version` を取得
2. Notion APIで `last_edited_time` を取得
3. 差分があれば同期処理を実行
4. 既存のopen MRがあれば、そのMRに追加コミット

## ローカル開発

```bash
# Notion APIテスト
curl -X GET "https://api.notion.com/v1/pages/{page_id}" \
  -H "Authorization: Bearer ${NOTION_API_KEY}" \
  -H "Notion-Version: 2022-06-28"

# Claude APIテスト
curl -X POST "https://api.anthropic.com/v1/messages" \
  -H "x-api-key: ${CLAUDE_API_KEY}" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{"model":"claude-sonnet-4-20250514","max_tokens":1024,"messages":[{"role":"user","content":"Hello"}]}'
```

## 注意事項

- Notionの頻繁な更新に対応するため、日次実行を推奨
- MRは自動マージせず、必ずエンジニアがレビュー
- Design Docへのエンジニアの手動編集は、次回同期で上書きされる可能性あり
