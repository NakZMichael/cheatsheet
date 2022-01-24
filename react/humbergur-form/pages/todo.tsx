import { pink } from '@material-ui/core/colors';
import { Box, IconButton } from '@mui/material';
import { blue, green } from '@mui/material/colors';
import { AddCircle } from '@mui/icons-material';
import React, {
  useEffect, useRef, useState,
} from 'react';
import { useForm } from 'react-hook-form';

const Todo = () => {
  const [todos, setTodos] = useState<string[]>([]);
  const { handleSubmit, register } = useForm<{
    newTodo:string,
    // position:number,
  }>();
  const positionShouldBeFocused = useRef<number>();
  const [refs, setRefs] = useState<React.RefObject<HTMLDivElement>[]>([]);
  // 下のuseEffectはtodosが増えて増えた要素が描画されたレンダの後に実行される
  useEffect(() => {
    console.log('after todos created');
    console.log(`the length of todos is ${todos.length}`);
    console.log(`the length of refs is ${refs.length}`);
    console.log(`positionShouldBeFocused is ${positionShouldBeFocused.current}`);
    console.log(refs);
    setRefs(todos.map(() => React.createRef()));
  }, [todos]);
  // 上のuseEffectでrefsが増えた後、増えてそれを反映してレンダーされた後に
  // 下のuseEffectが実行されるのでrefsには増えたtodosがレンダーされた後のdivの値が入っている。
  useEffect(() => {
    console.log('after refs created');
    console.log(`the length of todos is ${todos.length}`);
    console.log(`the length of refs is ${refs.length}`);
    console.log(`positionShouldBeFocused is ${positionShouldBeFocused.current}`);
    console.log(refs);
    if (!positionShouldBeFocused.current) {
      return;
    }
    const focusedEl = refs.at(positionShouldBeFocused.current);
    if (focusedEl) {
      focusedEl.current?.scrollIntoView({
        block: 'center',
        behavior: 'smooth',
      });
      focusedEl.current?.focus({
        preventScroll: true,
      });
      // フォーカスを当て終わった後は念の為undefinedに戻しておく
      positionShouldBeFocused.current = undefined;
    }
  }, [refs]);

  // /** todosのpositionで指定された位置にinput.newTodoを追加する */
  const insertAt = (position: number) => handleSubmit((input) => {
    console.log(`insert at ${position}`);
    // フォーカスを当てるべき場所を同期的に更新する
    positionShouldBeFocused.current = position;
    setTodos((prev) => {
      const formerTodos = prev.slice(0, position);
      const laterTodos = prev.slice(position, prev.length);
      return [...formerTodos, input.newTodo, ...laterTodos];
    });
  })();
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div>
        <label htmlFor="newTodo">新規Todo:</label>
        <input
          type="text"
          id="newTodo"
          {...register('newTodo')}
        />
      </div>
      <Box sx={{
        display: 'block', marginX: 'auto', marginY: 3,
      }}
      >
        <IconButton onClick={() => insertAt(0)}>
          <AddCircle sx={{ color: green[200] }} />
        </IconButton>
      </Box>
      {todos.map((todo, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <Box key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box
            ref={refs[index]}
            // tabIndex={0}と指定するとdiv要素にfocusできる。
            tabIndex={0}
            sx={{
              p: 10,
              py: 20,
              backgroundColor: pink[200],
              border: 3,
              m: 3,
              // focusが当たると背景色が変わる
              '&:focus': {
                backgroundColor: blue[200],
              },
            }}
          >
            <h3>{ todo }</h3>
          </Box>
          <Box sx={{
            display: 'block', marginX: 'auto', marginY: 3,
          }}
          >
            {/* このボタンを押すとボタンのすぐ下にTodoが増える */}
            <IconButton onClick={() => insertAt(index + 1)}>
              <AddCircle sx={{ color: green[200] }} />
            </IconButton>
          </Box>
        </Box>
      ))}

    </Box>
  );
};

export default Todo;
