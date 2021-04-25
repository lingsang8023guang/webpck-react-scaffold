import React, { useState } from 'react';
import { Input, DatePicker } from 'antd'
import Styles from './app.less'

function App() {
  let list = [
    { key: 0, title: '吃饭', done: false },
    { key: 1, title: '睡觉', done: false },
    { key: 2, title: '玩耍', done: false }
  ];
  let [todos, setTodos] = useState(list)
  let [count, setCount] = useState(0)
  return (
    <div className={Styles.AppWrap}>
      <div>
        <h1>Welcome to Webpack!</h1>
        <Input value={count} />

        <h1>Count22: {count}</h1>
        <button onClick={()=>{setCount(count=>count+1)}}>Add</button>
      </div>
      <div>
        <ul>
          {todos.map((item, index)=>{
            return(<li key={item.key}>{item.title}</li>)
          })}
        </ul>
      </div>
      
    </div>
  );
}

export default App