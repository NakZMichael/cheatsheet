import { ApiProperty } from '@nestjs/swagger';

export class Todo {

  @ApiProperty({
    example: '703',
    description: 'The ID of the Todo',
  })
  id: string;

  @ApiProperty({
    example: 'Read the book.',
    description: 'The title of the todo',
  })
  title: string;

}