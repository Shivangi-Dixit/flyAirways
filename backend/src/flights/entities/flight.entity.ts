import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('flights')
export class Flight {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  flightNumber: string;

  @Column()
  origin: string;

  @Column()
  destination: string;

  @Column({ type: 'timestamp' })
  departureTime: Date;

  @Column({ type: 'timestamp' })
  arrivalTime: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('int')
  availableSeats: number;
}
