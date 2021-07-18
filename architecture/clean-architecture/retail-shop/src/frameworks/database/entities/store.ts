import {Entity, PrimaryGeneratedColumn, Column} from 'typeorm';

@Entity()
export class Store {
  @PrimaryGeneratedColumn()
  id?:number;

  @Column()
  name!:string;

  @Column()
  phoneNumber!:string;
}
