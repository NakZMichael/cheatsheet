# 要点

- 同一pod内のコンテナはIPアドレスを共有してるので`localhost`で通信できる。
  - redisとかnginxとかはPodの移動容易性が損なわれるので推奨されていない。
  - 基本的には一つのPodに一つのコンテナ
    - 複数個のコンテナを含めるときはメインのコンテナ以外に補助的にローカルキャッシュ用のコンテナや設定用のコンテナなどが使われる
  - 外部のデータベースと通信するときはアンバサダーパターンを使うと良さそう