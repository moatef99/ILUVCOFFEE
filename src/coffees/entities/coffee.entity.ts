import { type } from 'os';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn
} from 'typeorm';
import { Flavor } from './flavor.entity';

@Entity()
export class Coffee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  homs: string;

  @Column()
  brand: string;

  @JoinTable({
    name: 'coffee_flavor', // table name for the junction table of this relation
    joinColumn: {
      name: 'coffeeId',
      referencedColumnName: 'id'
    },
    inverseJoinColumn: {
      name: 'flavorId',
      referencedColumnName: 'id'
    }
  })
  @ManyToMany((type) => Flavor, (flavor) => flavor.coffees, { cascade: true })
  flavors: Flavor[];
}