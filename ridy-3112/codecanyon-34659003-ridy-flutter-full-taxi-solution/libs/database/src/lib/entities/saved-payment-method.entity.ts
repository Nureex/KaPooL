import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SavedPaymentMethodType } from './enums/saved-payment-method-type';
import { RiderEntity } from './rider-entity';
import { DriverEntity } from './driver.entity';
import { PaymentGatewayEntity } from './payment-gateway.entity';
import { ProviderBrand } from './enums/card-type.enum';
import { RequestEntity } from './request.entity';

@Entity('saved_payment_method')
export class SavedPaymentMethodEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column({
    nullable: true,
  })
  lastFour?: string;

  @Column({
    default: true,
  })
  isEnabled!: boolean;

  @Column({
    default: false,
  })
  isDefault!: boolean;

  @Column('enum', {
    enum: SavedPaymentMethodType,
  })
  type!: SavedPaymentMethodType;

  @Column('enum', {
    enum: ProviderBrand,
    nullable: true,
  })
  providerBrand?: ProviderBrand;

  @Column({
    nullable: true,
  })
  expiryDate?: Date;

  @Column({
    nullable: true,
  })
  holderName?: string;

  @ManyToOne(() => RiderEntity, (rider) => rider.savedPaymentMethods)
  rider?: RiderEntity;

  @Column({
    nullable: true,
  })
  riderId?: number;

  @ManyToOne(() => DriverEntity, (driver) => driver.savedPaymentMethods)
  driver?: DriverEntity;

  @Column({
    nullable: true,
  })
  driverId?: number;

  @Column()
  token!: string;

  @ManyToOne(
    () => PaymentGatewayEntity,
    (gateway) => gateway.savedPaymentMethods,
  )
  paymentGateway?: PaymentGatewayEntity;

  @Column()
  paymentGatewayId!: number;

  @OneToMany(() => RequestEntity, (order) => order.savedPaymentMethod)
  orders!: RequestEntity[];
}
