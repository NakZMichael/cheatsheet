import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import {Todo} from '@first-org/data'
import { Todos } from '@first-org/ui';

const StyledPage = styled.div`
  .todo{
    color: red;
  }
`;

export function Index() {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    fetch('/api/todo')
      .then((_) => _.json())
      .then(setTodos);
  }, []);

  function addTodo() {
    fetch('/api/todo', {
      method: 'POST',
      body: '',
    })
      .then((_) => _.json())
      .then((newTodo) => {
        setTodos([...todos, newTodo]);
      });
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
