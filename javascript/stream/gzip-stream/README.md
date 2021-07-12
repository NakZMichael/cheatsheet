stream APIを使用した実例として

- ファイルをgzipで圧縮してサーバーに送るクライアントのコード `gzip-send.ts`
- リクエストとして圧縮されたファイルを受け取り解答して`received_files`ディレクトリに保存するサーバーのコード `gzip-receive.ts`

の二種類を書いてある。

気が向いたら色々試すように一応jestの設定はしているが特にテストを書く予定はない

## 本筋には関係ないが割と使えそうなライブラリ

- `path.basename`
  - ディレクトリ名を取り除いてファイル名のみを取り出す
  - 例: `/usr/local/very-important-file` -> `very-important-file`