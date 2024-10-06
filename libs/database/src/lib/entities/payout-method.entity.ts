import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MediaEntity } from './media.entity';
import { PayoutMethodType } from './enums/payout-method-type.enum';
import { PayoutAccountEntity } from './payout-account.entity';
import { PayoutSessionEntity } from './payout-session.entity';
import { DriverTransactionEntity } from './driver-transaction.entity';

@Entity('payout_method')
export class PayoutMethodEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    default: true,
  })
  enabled!: boolean;

  @Column()
  name!: string;

  @Column()
  currency!: string;

  @Column({
    nullable: true,
  })
  description?: string;

  @Column('enum', {
    enum: PayoutMethodType,
  })
  type!: PayoutMethodType;

  @Column({
    nullable: true,
    type: 'text',
  })
  publicKey?: string;

  @Column({
    nullable: true,
    type: 'text',
  })
  privateKey?: string;

  @Column({ nullable: true, type: 'text' })
  saltKey?: string;

  @Column({
    nullable: true,
    type: 'text',
  })
  merchantId?: string;

  @DeleteDateColumn()
  deletedAt?: Date;

  @OneToOne(() => MediaEntity, (media) => media.payoutMethod, {
    nullable: true,
  })
  @JoinColumn()
  media?: MediaEntity;

  @Column({ nullable: true })
  mediaId?: number;

  @OneToMany(
    () => PayoutAccountEntity,
    (payoutAccount) => payoutAccount.payoutMethod,
  )
  payoutAccounts?: PayoutAccountEntity[];

  @ManyToMany(
    () => PayoutSessionEntity,
    (payoutSession) => payoutSession.payoutMethods,
  )
  payoutSessions?: PayoutSessionEntity[];

  @OneToMany(
    () => DriverTransactionEntity,
    (driverTransaction) => driverTransaction.payoutMethod,
  )
  driverTransactions?: DriverTransactionEntity[];
}
