import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateTodoDto } from './dto/create-todo.dto'; 
import { Todo } from './entity/todo.entity'; 


const todos:Todo[] = [
{ id:'todo1', title: 'Todo 1' },
{ id:'todo2', title: 'Todo 2' },
]

@ApiBearerAuth()
@ApiTags('todo')
@Controller('todo')
export class TodoController {
  @Get()
  @ApiOperation({ summary: 'Get all todos' })
  @ApiResponse({
    status: 200,
    description: 'All todos',
    type: [Todo],
  })
  findAll():Todo[] {
    return  todos;
  }

  @Post()
  @ApiResponse({
    status: 200,
    description: 'Created  todo',
    type: Todo,
  })
  async addPost(@Body() createTodoDto: CreateTodoDto): Promise<Todo>{
    const newTodo = {
      id:`${Math.floor(Math.random() * 1000)}`,
      title: createTodoDto.title,
    }
    return newTodo;
  }
}
