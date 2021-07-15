# Refの使い方の復習用

普段使わないので忘れがち

## 関数コンポーネントにおいて

[このドキュメント](https://ja.reactjs.org/docs/hooks-reference.html#useref)を読むとわかり安いと思うが、関数コンポーネントにおいて`useRef()`を用いることによって擬似的なインスタンス変数として振る舞わせることができる。



## 注意点

- 乱用はしない方がいい
  - 宣言的でないし、predictableじゃない
- 関数コンポーネントに`ref`プロパティを指定することはできない。
- 反対に関数コンポーネントないで`useRef`を使って関数をクラスコンポーネントか組み込みのDOMオブジェクトに渡すことはできる。

```javascript
function CustomTextInput(props) {
  // ref が参照できるように、textInput をここで宣言する必要があります。
  const textInput = useRef(null);
  
  function handleClick() {
    textInput.current.focus();
  }

  return (
    <div>
      <input
        type="text"
        ref={textInput} />
      <input
        type="button"
        value="Focus the text input"
        onClick={handleClick}
      />
    </div>
  );
}
```

- コールバック Ref の注意事項
  - ref コールバックがインライン関数として定義されている場合、更新中に 2 回呼び出されます。最初は null、次に DOM 要素で呼び出されます。これは、それぞれのレンダーで関数の新しいインスタンスが作成されるため、React は古い ref を削除し、新しい ref を設定する必要があるためです。ref コールバックをクラス内のバインドされたメソッドとして定義することでこれを回避できますが、ほとんどの場合は問題にならないはずです。