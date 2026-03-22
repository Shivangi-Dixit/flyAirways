import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Flight } from '../../flights/entities/flight.entity';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Flight, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'flightId' })
  flight: Flight;

  @Column()
  flightId: string;

  @Column('int')
  passengers: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  totalPrice: number;

  @Column({ default: 'CONFIRMED' })
  status: string;

  @Column({ unique: true })
  pnr: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
