import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RiderEntity } from './rider-entity';
import { DriverEntity } from './driver.entity';
import { RequestEntity } from './request.entity';

@Entity('rider_review')
export class RiderReviewEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('tinyint')
  score!: number;

  @Column({ name: 'review', nullable: true })
  description?: string;

  @ManyToOne(() => RiderEntity, (rider) => rider.reviewsForRider)
  rider!: RiderEntity;

  @Column()
  riderId!: number;

  @ManyToOne(() => DriverEntity, (driver) => driver.reviewsByDriver)
  driver!: DriverEntity;

  @Column()
  driverId!: number;

  @CreateDateColumn()
  reviewTimestamp!: Date;

  @OneToOne(() => RequestEntity, (order) => order.driverReviewForRider)
  @JoinColumn()
  request?: RequestEntity;

  @Column()
  orderId!: number;
}
