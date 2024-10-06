// GENERATED CODE - DO NOT MODIFY BY HAND

// **************************************************************************
// InjectableConfigGenerator
// **************************************************************************

// ignore_for_file: type=lint
// coverage:ignore-file

// ignore_for_file: no_leading_underscores_for_library_prefixes
import 'package:connectivity_plus/connectivity_plus.dart' as _i8;
import 'package:get_it/get_it.dart' as _i1;
import 'package:graphql/client.dart' as _i3;
import 'package:injectable/injectable.dart' as _i2;
import 'package:rider_flutter/config/locator/locator.dart' as _i105;
import 'package:rider_flutter/config/router/app_router.dart' as _i5;
import 'package:rider_flutter/core/blocs/auth_bloc.dart' as _i37;
import 'package:rider_flutter/core/blocs/location.dart' as _i85;
import 'package:rider_flutter/core/blocs/place_lookup.dart' as _i77;
import 'package:rider_flutter/core/blocs/route.dart' as _i7;
import 'package:rider_flutter/core/blocs/settings.dart' as _i4;
import 'package:rider_flutter/core/datasources/geo_datasource.dart' as _i75;
import 'package:rider_flutter/core/datasources/geo_datasource.mock.dart'
    as _i76;
import 'package:rider_flutter/core/datasources/geo_datasource.prod.dart'
    as _i89;
import 'package:rider_flutter/core/datasources/graphql_datasource.dart' as _i79;
import 'package:rider_flutter/core/datasources/graphql_datasource.prod.dart'
    as _i80;
import 'package:rider_flutter/core/datasources/location_datasource.dart'
    as _i31;
import 'package:rider_flutter/core/datasources/location_datasource.mock.dart'
    as _i32;
import 'package:rider_flutter/core/datasources/location_datasource.prod.dart'
    as _i66;
import 'package:rider_flutter/core/datasources/upload_datasource.dart' as _i56;
import 'package:rider_flutter/core/datasources/upload_datasource.prod.dart'
    as _i57;
import 'package:rider_flutter/core/repositories/firebase_repository.dart'
    as _i25;
import 'package:rider_flutter/core/repositories/firebase_repository.mock.dart'
    as _i26;
import 'package:rider_flutter/core/repositories/firebase_repository.prod.dart'
    as _i86;
import 'package:rider_flutter/core/repositories/order_repository.dart' as _i41;
import 'package:rider_flutter/core/repositories/order_repository.mock.dart'
    as _i42;
import 'package:rider_flutter/core/repositories/order_repository.prod.dart'
    as _i94;
import 'package:rider_flutter/core/repositories/profile_repository.dart'
    as _i27;
import 'package:rider_flutter/core/repositories/profile_repository.mock.dart'
    as _i28;
import 'package:rider_flutter/core/repositories/profile_repository.prod.dart'
    as _i101;
import 'package:rider_flutter/core/repositories/wallet_repository.dart' as _i33;
import 'package:rider_flutter/core/repositories/wallet_repository.mock.dart'
    as _i34;
import 'package:rider_flutter/core/repositories/wallet_repository.prod.dart'
    as _i104;
import 'package:rider_flutter/features/announcements/data/repositories/announcements_repository.mock.dart'
    as _i20;
import 'package:rider_flutter/features/announcements/data/repositories/announcements_repository.prod.dart'
    as _i96;
import 'package:rider_flutter/features/announcements/domain/repositories/announcements_repository.dart'
    as _i19;
import 'package:rider_flutter/features/announcements/presentation/blocs/announcements.dart'
    as _i71;
import 'package:rider_flutter/features/auth/data/repositories/auth_repository.mock.dart'
    as _i55;
import 'package:rider_flutter/features/auth/data/repositories/auth_repository.prod.dart'
    as _i93;
import 'package:rider_flutter/features/auth/domain/repositories/auth_repository.dart'
    as _i54;
import 'package:rider_flutter/features/auth/presentation/blocs/login.dart'
    as _i69;
import 'package:rider_flutter/features/auth/presentation/blocs/onboarding_cubit.dart'
    as _i6;
import 'package:rider_flutter/features/favorite_locations/data/repositories/favorite_locations_repository.mock.dart'
    as _i39;
import 'package:rider_flutter/features/favorite_locations/data/repositories/favorite_locations_repository.prod.dart'
    as _i103;
import 'package:rider_flutter/features/favorite_locations/domain/repositories/favorite_locations_repository.dart'
    as _i38;
import 'package:rider_flutter/features/favorite_locations/presentation/blocs/add.dart'
    as _i44;
import 'package:rider_flutter/features/favorite_locations/presentation/blocs/desktop_map.dart'
    as _i12;
import 'package:rider_flutter/features/favorite_locations/presentation/blocs/edit.dart'
    as _i45;
import 'package:rider_flutter/features/favorite_locations/presentation/blocs/favorite_locations.dart'
    as _i43;
import 'package:rider_flutter/features/home/data/home_repository.mock.dart'
    as _i53;
import 'package:rider_flutter/features/home/data/home_repository.prod.dart'
    as _i95;
import 'package:rider_flutter/features/home/domain/repositories/home_repository.dart'
    as _i52;
import 'package:rider_flutter/features/home/features/apply_coupon/data/repositories/coupon_repository.mock.dart'
    as _i36;
import 'package:rider_flutter/features/home/features/apply_coupon/data/repositories/coupon_repository.prod.dart'
    as _i100;
import 'package:rider_flutter/features/home/features/apply_coupon/domain/repositories/coupon_repository.dart'
    as _i35;
import 'package:rider_flutter/features/home/features/order_preview/data/repositories/order_preview_repository.mock.dart'
    as _i22;
import 'package:rider_flutter/features/home/features/order_preview/data/repositories/order_preview_repository.prod.dart'
    as _i91;
import 'package:rider_flutter/features/home/features/order_preview/domain/repositories/order_preview_repository.dart'
    as _i21;
import 'package:rider_flutter/features/home/features/order_preview/presentation/blocs/order_preview.dart'
    as _i65;
import 'package:rider_flutter/features/home/features/order_preview/presentation/blocs/order_preview_args.dart'
    as _i10;
import 'package:rider_flutter/features/home/features/order_preview/presentation/blocs/order_preview_options.dart'
    as _i11;
import 'package:rider_flutter/features/home/features/rate_order/data/repositories/rate_order_repository.mock.dart'
    as _i14;
import 'package:rider_flutter/features/home/features/rate_order/data/repositories/rate_order_repository.prod.dart'
    as _i97;
import 'package:rider_flutter/features/home/features/rate_order/domain/repositories/rate_order_repository.dart'
    as _i13;
import 'package:rider_flutter/features/home/features/rate_order/presentation/blocs/rate_order.dart'
    as _i72;
import 'package:rider_flutter/features/home/features/track_order/data/repositories/track_order_repository.mock.dart'
    as _i16;
import 'package:rider_flutter/features/home/features/track_order/data/repositories/track_order_repository.prod.dart'
    as _i92;
import 'package:rider_flutter/features/home/features/track_order/domain/repositories/track_order_repository.dart'
    as _i15;
import 'package:rider_flutter/features/home/features/track_order/presentation/blocs/cancel_reason.dart'
    as _i73;
import 'package:rider_flutter/features/home/features/track_order/presentation/blocs/pay_for_ride.dart'
    as _i68;
import 'package:rider_flutter/features/home/features/track_order/presentation/blocs/track_order.dart'
    as _i58;
import 'package:rider_flutter/features/home/features/waypoints/presentation/blocs/selected_location_field.dart'
    as _i9;
import 'package:rider_flutter/features/home/features/welcome/data/repositories/new_order_repository.mock.dart'
    as _i51;
import 'package:rider_flutter/features/home/features/welcome/data/repositories/new_order_repository.prod.dart'
    as _i102;
import 'package:rider_flutter/features/home/features/welcome/domain/repositories/new_order_repository.dart'
    as _i50;
import 'package:rider_flutter/features/home/presentation/blocs/destination_suggestions.dart'
    as _i64;
import 'package:rider_flutter/features/home/presentation/blocs/home.dart'
    as _i87;
import 'package:rider_flutter/features/home/presentation/blocs/place_confirm.dart'
    as _i78;
import 'package:rider_flutter/features/payment_methods/data/repositories/payment_methods_repository.mock.dart'
    as _i18;
import 'package:rider_flutter/features/payment_methods/data/repositories/payment_methods_repository.prod.dart'
    as _i98;
import 'package:rider_flutter/features/payment_methods/domain/repositories/payment_methods_repository.dart'
    as _i17;
import 'package:rider_flutter/features/payment_methods/presentation/blocs/payment_methods.dart'
    as _i40;
import 'package:rider_flutter/features/profile/data/repositories/profile_repository.mock.dart'
    as _i30;
import 'package:rider_flutter/features/profile/data/repositories/profile_repository.prod.dart'
    as _i99;
import 'package:rider_flutter/features/profile/domain/repositories/profile_repository.dart'
    as _i29;
import 'package:rider_flutter/features/profile/presentation/blocs/favorite_drivers.dart'
    as _i62;
import 'package:rider_flutter/features/profile/presentation/blocs/profile.dart'
    as _i63;
import 'package:rider_flutter/features/redeem_gift_card/data/repositories/redeem_gift_card_repository.mock.dart'
    as _i49;
import 'package:rider_flutter/features/redeem_gift_card/data/repositories/redeem_gift_card_repository.prod.dart'
    as _i82;
import 'package:rider_flutter/features/redeem_gift_card/domain/repositories/redeem_gift_card_repository.dart'
    as _i48;
import 'package:rider_flutter/features/redeem_gift_card/presentation/blocs/redeem_gift_card.dart'
    as _i88;
import 'package:rider_flutter/features/ride_history/data/repositories/ride_history_repository.mock.dart'
    as _i60;
import 'package:rider_flutter/features/ride_history/data/repositories/ride_history_repository.prod.dart'
    as _i83;
import 'package:rider_flutter/features/ride_history/domain/repositories/ride_history_repository.dart'
    as _i59;
import 'package:rider_flutter/features/ride_history/presentation/blocs/report_issue.dart'
    as _i74;
import 'package:rider_flutter/features/ride_history/presentation/blocs/ride_history.dart'
    as _i84;
import 'package:rider_flutter/features/scheduled_rides/data/repositories/scheduled_rides_repository.mock.dart'
    as _i24;
import 'package:rider_flutter/features/scheduled_rides/data/repositories/scheduled_rides_repository.prod.dart'
    as _i81;
import 'package:rider_flutter/features/scheduled_rides/domain/repositories/scheduled_rides_repository.dart'
    as _i23;
import 'package:rider_flutter/features/scheduled_rides/presentation/blocs/scheduled_rides.dart'
    as _i70;
import 'package:rider_flutter/features/wallet/data/repositories/wallet_repository.mock.dart'
    as _i47;
import 'package:rider_flutter/features/wallet/data/repositories/wallet_repository.prod.dart'
    as _i90;
import 'package:rider_flutter/features/wallet/domain/repositories/wallet_repository.dart'
    as _i46;
import 'package:rider_flutter/features/wallet/presentation/blocs/top_up_wallet.dart'
    as _i67;
import 'package:rider_flutter/features/wallet/presentation/blocs/wallet.dart'
    as _i61;

const String _dev = 'dev';
const String _prod = 'prod';

extension GetItInjectableX on _i1.GetIt {
// initializes the registration of main-scope dependencies inside of GetIt
  _i1.GetIt init({
    String? environment,
    _i2.EnvironmentFilter? environmentFilter,
  }) {
    final gh = _i2.GetItHelper(
      this,
      environment,
      environmentFilter,
    );
    final serviceModule = _$ServiceModule();
    gh.factory<_i3.GraphQLClient>(() => serviceModule.create());
    gh.singleton<_i4.SettingsCubit>(() => _i4.SettingsCubit());
    gh.singleton<_i5.AppRouter>(() => _i5.AppRouter());
    gh.singleton<_i6.OnboardingCubit>(() => _i6.OnboardingCubit());
    gh.lazySingleton<_i7.RouteCubit>(() => _i7.RouteCubit());
    gh.lazySingleton<_i8.Connectivity>(() => serviceModule.connectivity);
    gh.lazySingleton<_i9.SelectedLocationFieldCubit>(
        () => _i9.SelectedLocationFieldCubit());
    gh.lazySingleton<_i10.OrderPreviewArgsCubit>(
        () => _i10.OrderPreviewArgsCubit());
    gh.lazySingleton<_i11.OrderPreviewOptionsCubit>(
        () => _i11.OrderPreviewOptionsCubit());
    gh.lazySingleton<_i12.FavoriteLocationsDesktopMapCubit>(
        () => _i12.FavoriteLocationsDesktopMapCubit());
    gh.lazySingleton<_i13.RateOrderRepository>(
      () => _i14.RateOrderRepositoryMock(),
      registerFor: {_dev},
    );
    gh.lazySingleton<_i15.TrackOrderRepository>(
      () => _i16.TrackOrderRepositoryMock(),
      registerFor: {_dev},
    );
    gh.lazySingleton<_i17.PaymentMethodsRepository>(
      () => _i18.PaymentMethodsRepositoryMock(),
      registerFor: {_dev},
    );
    gh.lazySingleton<_i19.AnnouncementsRepository>(
      () => _i20.AnnouncementsRepositoryMock(),
      registerFor: {_dev},
    );
    gh.lazySingleton<_i21.OrderPreviewRepository>(
      () => _i22.OrderPreviewRepositoryMock(),
      registerFor: {_dev},
    );
    gh.lazySingleton<_i23.ScheduledRidesRepository>(
      () => _i24.ScheduledRidesRepositoryMock(),
      registerFor: {_dev},
    );
    gh.lazySingleton<_i25.FirebaseRepository>(
      () => _i26.FirebaseRepositoryMock(),
      registerFor: {_dev},
    );
    gh.lazySingleton<_i27.ProfileRepository>(
      () => _i28.ProfileRepositoryMock(),
      registerFor: {_dev},
    );
    gh.lazySingleton<_i29.ProfileRepository>(
      () => _i30.ProfileRepositoryMock(),
      registerFor: {_dev},
    );
    gh.lazySingleton<_i31.LocationDatasource>(
      () => _i32.LocationDatasourceImpl(),
      registerFor: {_dev},
    );
    gh.lazySingleton<_i33.WalletRepository>(
      () => _i34.WalletRepositoryMock(),
      registerFor: {_dev},
    );
    gh.lazySingleton<_i35.CouponRepository>(
      () => _i36.CouponRepositoryMock(),
      registerFor: {_dev},
    );
    gh.lazySingleton<_i37.AuthBloc>(
        () => _i37.AuthBloc(gh<_i27.ProfileRepository>()));
    gh.lazySingleton<_i38.FavoriteLocationsRepository>(
      () => _i39.FavoriteLocationsRepositoryMock(),
      registerFor: {_dev},
    );
    gh.lazySingleton<_i40.PaymentMethodsBloc>(
        () => _i40.PaymentMethodsBloc(gh<_i17.PaymentMethodsRepository>()));
    gh.lazySingleton<_i41.OrderRepository>(
      () => _i42.OrderRepositoryMock(),
      registerFor: {_dev},
    );
    gh.lazySingleton<_i43.FavoriteLocationsCubit>(() =>
        _i43.FavoriteLocationsCubit(gh<_i38.FavoriteLocationsRepository>()));
    gh.lazySingleton<_i44.AddFavoriteLocationCubit>(() =>
        _i44.AddFavoriteLocationCubit(gh<_i38.FavoriteLocationsRepository>()));
    gh.lazySingleton<_i45.EditFavoriteLocationCubit>(() =>
        _i45.EditFavoriteLocationCubit(gh<_i38.FavoriteLocationsRepository>()));
    gh.lazySingleton<_i46.WalletRepository>(
      () => _i47.WalletRepositoryMock(),
      registerFor: {_dev},
    );
    gh.lazySingleton<_i48.RedeemGiftCardRepository>(
      () => _i49.RedeemGiftCardRepositoryMock(),
      registerFor: {_dev},
    );
    gh.lazySingleton<_i50.NewOrderRepository>(
      () => _i51.NewOrderRepositoryMock(),
      registerFor: {_dev},
    );
    gh.lazySingleton<_i52.HomeRepository>(
      () => _i53.HomeRepositoryMock(),
      registerFor: {_dev},
    );
    gh.lazySingleton<_i54.AuthRepository>(
      () => _i55.AuthRepositoryMock(),
      registerFor: {_dev},
    );
    gh.lazySingleton<_i56.UploadDatasource>(() => _i57.UploadDatasourceImpl());
    gh.lazySingleton<_i58.TrackOrderBloc>(
      () => _i58.TrackOrderBloc(gh<_i15.TrackOrderRepository>()),
      dispose: (i) => i.dispose(),
    );
    gh.lazySingleton<_i59.RideHistoryRepository>(
      () => _i60.RideHistoryRepositoryMock(),
      registerFor: {_dev},
    );
    gh.lazySingleton<_i61.WalletBloc>(
        () => _i61.WalletBloc(gh<_i46.WalletRepository>()));
    gh.lazySingleton<_i62.FavoriteDriversCubit>(
        () => _i62.FavoriteDriversCubit(gh<_i29.ProfileRepository>()));
    gh.lazySingleton<_i63.ProfileBloc>(
        () => _i63.ProfileBloc(gh<_i29.ProfileRepository>()));
    gh.lazySingleton<_i64.DestinationSuggestionsCubit>(
        () => _i64.DestinationSuggestionsCubit(gh<_i50.NewOrderRepository>()));
    gh.lazySingleton<_i65.OrderPreviewCubit>(() => _i65.OrderPreviewCubit(
          gh<_i41.OrderRepository>(),
          gh<_i21.OrderPreviewRepository>(),
          gh<_i25.FirebaseRepository>(),
        ));
    gh.lazySingleton<_i31.LocationDatasource>(
      () => _i66.LocationDatasourceImpl(),
      registerFor: {_prod},
    );
    gh.lazySingleton<_i67.TopUpWalletBloc>(
        () => _i67.TopUpWalletBloc(gh<_i33.WalletRepository>()));
    gh.lazySingleton<_i68.PayForRideCubit>(() => _i68.PayForRideCubit(
          gh<_i15.TrackOrderRepository>(),
          gh<_i33.WalletRepository>(),
        ));
    gh.lazySingleton<_i69.LoginBloc>(
        () => _i69.LoginBloc(gh<_i54.AuthRepository>()));
    gh.lazySingleton<_i70.ScheduledRidesBloc>(
        () => _i70.ScheduledRidesBloc(gh<_i23.ScheduledRidesRepository>()));
    gh.lazySingleton<_i71.AnnouncementsBloc>(
        () => _i71.AnnouncementsBloc(gh<_i19.AnnouncementsRepository>()));
    gh.lazySingleton<_i72.RateOrderBloc>(
        () => _i72.RateOrderBloc(gh<_i13.RateOrderRepository>()));
    gh.lazySingleton<_i73.CancelReasonCubit>(
        () => _i73.CancelReasonCubit(gh<_i15.TrackOrderRepository>()));
    gh.lazySingleton<_i74.ReportIssueCubit>(
        () => _i74.ReportIssueCubit(gh<_i59.RideHistoryRepository>()));
    gh.lazySingleton<_i75.GeoDatasource>(
      () => _i76.GeoDatasourceImpl(gh<_i31.LocationDatasource>()),
      registerFor: {_dev},
    );
    gh.lazySingleton<_i77.PlaceLookupBloc>(
        () => _i77.PlaceLookupBloc(gh<_i75.GeoDatasource>()));
    gh.lazySingleton<_i78.PlaceConfirmCubit>(
        () => _i78.PlaceConfirmCubit(gh<_i75.GeoDatasource>()));
    gh.lazySingleton<_i79.GraphqlDatasource>(() => _i80.GraphqlDatasourceImpl(
          client: gh<_i3.GraphQLClient>(),
          connectivity: gh<_i8.Connectivity>(),
        ));
    gh.lazySingleton<_i23.ScheduledRidesRepository>(
      () => _i81.ScheduledRidesRepositoryImpl(gh<_i79.GraphqlDatasource>()),
      registerFor: {_prod},
    );
    gh.lazySingleton<_i48.RedeemGiftCardRepository>(
      () => _i82.RedeemGiftCardRepositoryImpl(gh<_i79.GraphqlDatasource>()),
      registerFor: {_prod},
    );
    gh.lazySingleton<_i59.RideHistoryRepository>(
      () => _i83.RideHistoryRepositoryImpl(gh<_i79.GraphqlDatasource>()),
      registerFor: {_prod},
    );
    gh.lazySingleton<_i84.RideHistoryBloc>(
        () => _i84.RideHistoryBloc(gh<_i59.RideHistoryRepository>()));
    gh.lazySingleton<_i85.LocationCubit>(() => _i85.LocationCubit(
          gh<_i31.LocationDatasource>(),
          gh<_i75.GeoDatasource>(),
        ));
    gh.lazySingleton<_i25.FirebaseRepository>(
      () => _i86.FirebaseRepositoryImpl(gh<_i79.GraphqlDatasource>()),
      registerFor: {_prod},
    );
    gh.lazySingleton<_i87.HomeCubit>(() => _i87.HomeCubit(
          gh<_i52.HomeRepository>(),
          gh<_i75.GeoDatasource>(),
        ));
    gh.lazySingleton<_i88.RedeemGiftCardBloc>(
        () => _i88.RedeemGiftCardBloc(gh<_i48.RedeemGiftCardRepository>()));
    gh.lazySingleton<_i75.GeoDatasource>(
      () => _i89.GeoDatasourceImpl(
        gh<_i79.GraphqlDatasource>(),
        gh<_i31.LocationDatasource>(),
      ),
      registerFor: {_prod},
    );
    gh.lazySingleton<_i46.WalletRepository>(
      () => _i90.WalletRepositoryImpl(gh<_i79.GraphqlDatasource>()),
      registerFor: {_prod},
    );
    gh.lazySingleton<_i21.OrderPreviewRepository>(
      () => _i91.OrderPreviewRepositoryImpl(gh<_i79.GraphqlDatasource>()),
      registerFor: {_prod},
    );
    gh.lazySingleton<_i15.TrackOrderRepository>(
      () => _i92.TrackOrderRepositoryImpl(gh<_i79.GraphqlDatasource>()),
      registerFor: {_prod},
    );
    gh.lazySingleton<_i54.AuthRepository>(
      () => _i93.LoginRepositoryImpl(gh<_i79.GraphqlDatasource>()),
      registerFor: {_prod},
    );
    gh.lazySingleton<_i41.OrderRepository>(
      () => _i94.OrderRepositoryImpl(gh<_i79.GraphqlDatasource>()),
      registerFor: {_prod},
    );
    gh.lazySingleton<_i52.HomeRepository>(
      () => _i95.HomeRepositoryImpl(gh<_i79.GraphqlDatasource>()),
      registerFor: {_prod},
    );
    gh.lazySingleton<_i19.AnnouncementsRepository>(
      () => _i96.AnnouncementsRepositoryImpl(gh<_i79.GraphqlDatasource>()),
      registerFor: {_prod},
    );
    gh.lazySingleton<_i13.RateOrderRepository>(
      () => _i97.RateOrderRepositoryImpl(gh<_i79.GraphqlDatasource>()),
      registerFor: {_prod},
    );
    gh.lazySingleton<_i17.PaymentMethodsRepository>(
      () => _i98.PaymentMethodsRepositoryImpl(gh<_i79.GraphqlDatasource>()),
      registerFor: {_prod},
    );
    gh.lazySingleton<_i29.ProfileRepository>(
      () => _i99.ProfileRepositoryProd(gh<_i79.GraphqlDatasource>()),
      registerFor: {_prod},
    );
    gh.lazySingleton<_i35.CouponRepository>(
      () => _i100.CouponRepositoryImpl(gh<_i79.GraphqlDatasource>()),
      registerFor: {_prod},
    );
    gh.lazySingleton<_i27.ProfileRepository>(
      () => _i101.ProfileRepositoryProd(gh<_i79.GraphqlDatasource>()),
      registerFor: {_prod},
    );
    gh.lazySingleton<_i50.NewOrderRepository>(
      () => _i102.NewOrderRepositoryImpl(gh<_i79.GraphqlDatasource>()),
      registerFor: {_prod},
    );
    gh.lazySingleton<_i38.FavoriteLocationsRepository>(
      () => _i103.FavoriteLocationsRepositoryImpl(gh<_i79.GraphqlDatasource>()),
      registerFor: {_prod},
    );
    gh.lazySingleton<_i33.WalletRepository>(
      () => _i104.WalletRepositoryImpl(gh<_i79.GraphqlDatasource>()),
      registerFor: {_prod},
    );
    return this;
  }
}

class _$ServiceModule extends _i105.ServiceModule {}
