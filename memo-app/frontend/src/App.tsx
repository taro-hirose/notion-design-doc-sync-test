import { useState, useEffect } from 'react'

interface Memo {
  id: number
  title: string
  content: string | null
  created_at: string
  updated_at: string
}

const API_URL = '/api/memos'

function App() {
  const [memos, setMemos] = useState<Memo[]>([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  // メモ一覧取得
  const fetchMemos = async () => {
    try {
      const res = await fetch(API_URL)
      const data = await res.json()
      setMemos(data)
    } catch (error) {
      console.error('Failed to fetch memos:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMemos()
  }, [])

  // メモ作成/更新
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    try {
      if (editingId) {
        // 更新
        await fetch(`${API_URL}/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, content }),
        })
      } else {
        // 作成
        await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, content }),
        })
      }
      setTitle('')
      setContent('')
      setEditingId(null)
      fetchMemos()
    } catch (error) {
      console.error('Failed to save memo:', error)
    }
  }

  // 編集モード
  const handleEdit = (memo: Memo) => {
    setTitle(memo.title)
    setContent(memo.content || '')
    setEditingId(memo.id)
  }

  // キャンセル
  const handleCancel = () => {
    setTitle('')
    setContent('')
    setEditingId(null)
  }

  // 削除
  const handleDelete = async (id: number) => {
    if (!confirm('削除しますか？')) return
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      fetchMemos()
    } catch (error) {
      console.error('Failed to delete memo:', error)
    }
  }

  // 日時フォーマット
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('ja-JP')
  }

  if (loading) {
    return <div className="container">読み込み中...</div>
  }

  return (
    <div className="container">
      <h1>メモアプリ</h1>

      <form className="memo-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="タイトル"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="内容"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div>
          <button type="submit">
            {editingId ? '更新' : '追加'}
          </button>
          {editingId && (
            <button type="button" className="cancel" onClick={handleCancel}>
              キャンセル
            </button>
          )}
        </div>
      </form>

      <div className="memo-list">
        {memos.length === 0 ? (
          <p>メモがありません</p>
        ) : (
          memos.map((memo) => (
            <div key={memo.id} className="memo-card">
              <h3>{memo.title}</h3>
              {memo.content && <p>{memo.content}</p>}
              <small>更新: {formatDate(memo.updated_at)}</small>
              <div className="actions">
                <button className="edit" onClick={() => handleEdit(memo)}>
                  編集
                </button>
                <button className="delete" onClick={() => handleDelete(memo.id)}>
                  削除
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default App
