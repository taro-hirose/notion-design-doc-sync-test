CREATE TABLE IF NOT EXISTS memos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- サンプルデータ
INSERT INTO memos (title, content) VALUES
('最初のメモ', 'これはサンプルメモです。'),
('買い物リスト', '牛乳、パン、卵');
