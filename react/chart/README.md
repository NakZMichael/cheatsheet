## 環境構築

npmをインストールする。

```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
```

必要があれば`~/.zshrc`に以下の行を追加してください。

```
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
```

その後`nvm install 16`とすれば最新版のnpmがインストールされます。
このアプリケーションではnpmの代わりにyarnを使用しているので
コマンドラインで

```
npm i -g yarn
```

を実行してください。
その後、このディレクトリに移動した後、コマンドラインで以下のコマンドを実行すれば必要なパッケージがインストールされます。

```
yarn
```

これで環境構築は完了です。

## 実行方法

コマンドラインで以下のコマンドを入力してください。

```
yarn start
```

初回の起動には少し時間がかかりますが、その後はコードの変更を自動で検知してブラウザに反映してくれます。

## ディレクトリ構成

物理関係のコードは全て`./src/physics/index.ts`に置かれています。
プロット関係のコードは全て`./src/pages/charts/index.tsx`に置かれています。

シミュレーションの変数などを変更する場合は
`./src/pages/charts/index.tsx`内の
`simpleSimulator`,`optimalSimulator`,`simpleKFunction`,`simplePotentialCenterFunction`などを変更してください。

