import {  ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateTodoDto {

  @IsString()
  @ApiProperty({ 
    example: 'Recipes of good restaurants'!,
    type:String
  })
  readonly title: string;
}