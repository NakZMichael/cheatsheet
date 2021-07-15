import React from 'react';
import './App.css';

function App() {
  return (
    <div>
      <MyComponent />
      <CustomTextInput />
      <AutoFocusTextInput />
      <CustomTextInputWithCallbackRef />
    </div>
  );
}

class MyComponent extends React.Component{
  myRef:React.RefObject<HTMLDivElement>
  constructor(props:{}){
    super(props)
    this.myRef = React.createRef()
  }
  // componentDidMountのなかで初期化するとよい
  componentDidMount(){
    this.myRef.current!.innerText = 'Hello Ref'
  }

  render(){
    console.log(this.myRef)
    return <div ref={this.myRef}/>
  }
}

class CustomTextInput extends React.Component{
  textInput:React.RefObject<HTMLInputElement>

  constructor(props:{}){
    super(props)
    // コンポーネントがマウントされると
    // React は current プロパティに DOM 要素を割り当て、
    // マウントが解除されると null に戻します。
    // ref の更新は componentDidMount または componentDidUpdate ライフサイクルメソッドの前に
    // 行われます。
    this.textInput = React.createRef()
  }

  focusTextInput = ()=>{
    this.textInput.current?.focus()
  }
  render(){
    return (
      <div>
        <input 
          type="text"
          ref={this.textInput} />
        <input type="button" 
          value="Focus the text input"
          onClick={this.focusTextInput} />
      </div>
    )
  }
}

class AutoFocusTextInput extends React.Component {
  textInput:React.RefObject<CustomTextInput>
  constructor(props:{}) {
    super(props);
    this.textInput = React.createRef();
  }

  componentDidMount() {
    this.textInput.current!.focusTextInput();
  }

  render() {
    return (
      <>
        <h1>Auto Focus</h1>
        <CustomTextInput ref={this.textInput} />
      </>
    );
  }
}

class CustomTextInputWithCallbackRef extends React.Component {
  textInput?:HTMLInputElement

  setTextInputRef = (element:HTMLInputElement) =>{
    this.textInput = element
  }
  focusTextInput = () => {
    // 生の DOM API を使用して明示的にテキストの入力にフォーカスします。
    if (this.textInput) this.textInput.focus();
  };

  componentDidMount() {
    // マウント時に入力をオートフォーカスします。
    this.focusTextInput();
  }

  render() {
    // インスタンスフィールド（例えば this.textInput）にテキスト入力の DOM 要素への
    // 参照を保存するために `ref` コールバックを使用してください。
    return (
      <div>
        <input
          type="text"
          ref={this.setTextInputRef}
        />
        <input
          type="button"
          value="Focus the text input"
          onClick={this.focusTextInput}
        />
      </div>
    );
  }
}

export default App;
