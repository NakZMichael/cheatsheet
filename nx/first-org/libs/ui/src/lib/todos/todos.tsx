import styled from '@emotion/styled';
import { Todo } from '@first-org/data';

/* eslint-disable-next-line */
export interface TodosProps {
  todos: Todo[];
}

const StyledTodos = styled.div`
  color: pink;
`;

export function Todos(props: TodosProps) {
  return (
    <StyledTodos>
      <ul>
      {props.todos.map((t) => (
        <li
          key={`todos-${t.id}`}
          className={'todo'}
        >
          {t.title}!!
        </li>
      ))}
    </ul>
    </StyledTodos>
  );
}

export default Todos;
