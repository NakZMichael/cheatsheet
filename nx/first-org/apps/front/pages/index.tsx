import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import {Todo,TodoApi,Configuration} from '@first-org/data'
import { Todos } from '@first-org/ui';


const StyledPage = styled.div`
  .todo{
    color: red;
  }
`;

const todoApi = new TodoApi(new Configuration({
  basePath:'/api',
}))

export function Index() {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    todoApi.todoControllerFindAll().then((res)=>{
      const fetchedTodos = res.data;
      setTodos(fetchedTodos)
    })
  }, []);

  function addTodo() {
    todoApi.todoControllerAddPost({
      createTodoDto:{
        title: `TODO: ${Math.floor(Math.random() * 1000)}`
      }
    }).then(res=>{
      const addedTodo = res.data;
      setTodos((prev)=>[...prev,addedTodo])
    })
  }
  return (
    <StyledPage>
      <h1>Todos</h1>
      <ul>
        <Todos todos={todos} />
        <button id={'add-todo'} onClick={addTodo}>
          Add Todo
        </button>
      </ul>
    </StyledPage>
  );
}

export default Index;
