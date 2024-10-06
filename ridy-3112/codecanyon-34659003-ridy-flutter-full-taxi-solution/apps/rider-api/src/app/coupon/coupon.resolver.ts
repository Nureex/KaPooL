import { Inject, UseGuards } from '@nestjs/common';
import { Args, CONTEXT, Query, Mutation, Resolver } from '@nestjs/graphql';
import { CommonCouponService } from '@ridy/coupon';

import { UserContext } from '../auth/authenticated-user';
import { GqlAuthGuard } from '../auth/jwt-gql-auth.guard';
import { OrderDTO } from '../order/dto/order.dto';
import { RiderOrderService } from '../order/rider-order.service';
import { CommonGiftCardService } from '@ridy/coupon';
import { CouponDTO } from './dto/coupon.dto';
import { GiftCardDTO } from '../wallet/dto/gift-card.dto';

@Resolver(() => OrderDTO)
@UseGuards(GqlAuthGuard)
export class CouponResolver {
  constructor(
    private commonCouponService: CommonCouponService,
    private commonGiftCardService: CommonGiftCardService,
    private riderOrderService: RiderOrderService,
    @Inject(CONTEXT)
    private context: UserContext,
  ) {}

  @Mutation(() => OrderDTO)
  async applyCoupon(
    @Args('code', { type: () => String }) code: string,
  ): Promise<OrderDTO> {
    const currentOrder = await this.riderOrderService.getCurrentOrder(
      this.context.req.user.id,
    );
    return this.commonCouponService.applyCoupon(
      code,
      currentOrder.id,
      this.context.req.user.id,
    );
  }

  @Query(() => CouponDTO)
  async couponInfo(
    @Args('code', { type: () => String }) code: string,
  ): Promise<CouponDTO> {
    return this.commonCouponService.getCouponInfo({
      code,
      riderId: this.context.req.user.id,
    });
  }

  @Mutation(() => GiftCardDTO)
  async redeemGiftCard(
    @Args('code', { type: () => String }) code: string,
  ): Promise<GiftCardDTO> {
    return this.commonGiftCardService.redeemGiftCard({
      code,
      userType: 'rider',
      userId: this.context.req.user.id,
    });
  }
}
