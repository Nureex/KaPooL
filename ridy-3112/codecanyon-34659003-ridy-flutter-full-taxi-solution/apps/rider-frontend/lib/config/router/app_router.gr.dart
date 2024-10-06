// GENERATED CODE - DO NOT MODIFY BY HAND

// **************************************************************************
// AutoRouterGenerator
// **************************************************************************

// ignore_for_file: type=lint
// coverage:ignore-file

part of 'app_router.dart';

abstract class _$AppRouter extends RootStackRouter {
  // ignore: unused_element
  _$AppRouter({super.navigatorKey});

  @override
  final Map<String, PageFactory> pagesMap = {
    AddFavoriteLocationRoute.name: (routeData) {
      final args = routeData.argsAs<AddFavoriteLocationRouteArgs>(
          orElse: () => const AddFavoriteLocationRouteArgs());
      return AutoRoutePage<dynamic>(
        routeData: routeData,
        child: AddFavoriteLocationScreen(
          key: args.key,
          defaultAddressType: args.defaultAddressType,
        ),
      );
    },
    AnnouncementsRoute.name: (routeData) {
      return AutoRoutePage<dynamic>(
        routeData: routeData,
        child: const AnnouncementsScreen(),
      );
    },
    AuthRoute.name: (routeData) {
      return AutoRoutePage<dynamic>(
        routeData: routeData,
        child: const AuthScreen(),
      );
    },
    EditFavoriteLocationRoute.name: (routeData) {
      final args = routeData.argsAs<EditFavoriteLocationRouteArgs>();
      return AutoRoutePage<dynamic>(
        routeData: routeData,
        child: EditFavoriteLocationScreen(
          key: args.key,
          entity: args.entity,
        ),
      );
    },
    EditPhoneNumberRoute.name: (routeData) {
      return AutoRoutePage<dynamic>(
        routeData: routeData,
        child: const EditPhoneNumberScreen(),
      );
    },
    FavoriteDriversRoute.name: (routeData) {
      return AutoRoutePage<dynamic>(
        routeData: routeData,
        child: const FavoriteDriversScreen(),
      );
    },
    FavoriteLocationsListRoute.name: (routeData) {
      return AutoRoutePage<dynamic>(
        routeData: routeData,
        child: const FavoriteLocationsListScreen(),
      );
    },
    FavoriteLocationsRoute.name: (routeData) {
      return AutoRoutePage<dynamic>(
        routeData: routeData,
        child: const FavoriteLocationsScreen(),
      );
    },
    HomeRoute.name: (routeData) {
      return AutoRoutePage<dynamic>(
        routeData: routeData,
        child: const HomeScreen(),
      );
    },
    LanguageSettingsRoute.name: (routeData) {
      return AutoRoutePage<dynamic>(
        routeData: routeData,
        child: const LanguageSettingsScreen(),
      );
    },
    LocateFavoriteLocationRoute.name: (routeData) {
      return AutoRoutePage<PlaceEntity>(
        routeData: routeData,
        child: const LocateFavoriteLocationScreen(),
      );
    },
    MapSettingsRoute.name: (routeData) {
      return AutoRoutePage<dynamic>(
        routeData: routeData,
        child: const MapSettingsScreen(),
      );
    },
    NavigationRoute.name: (routeData) {
      return AutoRoutePage<dynamic>(
        routeData: routeData,
        child: const NavigationScreen(),
      );
    },
    PaymentMethodsRoute.name: (routeData) {
      return AutoRoutePage<dynamic>(
        routeData: routeData,
        child: const PaymentMethodsScreen(),
      );
    },
    ProfileInfoRoute.name: (routeData) {
      return AutoRoutePage<dynamic>(
        routeData: routeData,
        child: const ProfileInfoScreen(),
      );
    },
    ProfileParentRoute.name: (routeData) {
      return AutoRoutePage<dynamic>(
        routeData: routeData,
        child: const ProfileParentScreen(),
      );
    },
    ProfileRoute.name: (routeData) {
      return AutoRoutePage<dynamic>(
        routeData: routeData,
        child: const ProfileScreen(),
      );
    },
    RideHistoryDetailsRoute.name: (routeData) {
      final args = routeData.argsAs<RideHistoryDetailsRouteArgs>();
      return AutoRoutePage<dynamic>(
        routeData: routeData,
        child: RideHistoryDetailsScreen(
          key: args.key,
          entity: args.entity,
        ),
      );
    },
    RideHistoryRoute.name: (routeData) {
      return AutoRoutePage<dynamic>(
        routeData: routeData,
        child: const RideHistoryScreen(),
      );
    },
    ScheduledRideDetailsRoute.name: (routeData) {
      final args = routeData.argsAs<ScheduledRideDetailsRouteArgs>();
      return AutoRoutePage<dynamic>(
        routeData: routeData,
        child: ScheduledRideDetailsScreen(
          key: args.key,
          entity: args.entity,
        ),
      );
    },
    ScheduledRidesRoute.name: (routeData) {
      return AutoRoutePage<dynamic>(
        routeData: routeData,
        child: const ScheduledRidesScreen(),
      );
    },
    SettingsParentRoute.name: (routeData) {
      return AutoRoutePage<dynamic>(
        routeData: routeData,
        child: const SettingsParentScreen(),
      );
    },
    SettingsRoute.name: (routeData) {
      return AutoRoutePage<dynamic>(
        routeData: routeData,
        child: const SettingsScreen(),
      );
    },
    WalletParentRoute.name: (routeData) {
      return AutoRoutePage<dynamic>(
        routeData: routeData,
        child: const WalletParentScreen(),
      );
    },
    WalletRoute.name: (routeData) {
      return AutoRoutePage<dynamic>(
        routeData: routeData,
        child: const WalletScreen(),
      );
    },
  };
}

/// generated route for
/// [AddFavoriteLocationScreen]
class AddFavoriteLocationRoute
    extends PageRouteInfo<AddFavoriteLocationRouteArgs> {
  AddFavoriteLocationRoute({
    Key? key,
    AddressType? defaultAddressType,
    List<PageRouteInfo>? children,
  }) : super(
          AddFavoriteLocationRoute.name,
          args: AddFavoriteLocationRouteArgs(
            key: key,
            defaultAddressType: defaultAddressType,
          ),
          initialChildren: children,
        );

  static const String name = 'AddFavoriteLocationRoute';

  static const PageInfo<AddFavoriteLocationRouteArgs> page =
      PageInfo<AddFavoriteLocationRouteArgs>(name);
}

class AddFavoriteLocationRouteArgs {
  const AddFavoriteLocationRouteArgs({
    this.key,
    this.defaultAddressType,
  });

  final Key? key;

  final AddressType? defaultAddressType;

  @override
  String toString() {
    return 'AddFavoriteLocationRouteArgs{key: $key, defaultAddressType: $defaultAddressType}';
  }
}

/// generated route for
/// [AnnouncementsScreen]
class AnnouncementsRoute extends PageRouteInfo<void> {
  const AnnouncementsRoute({List<PageRouteInfo>? children})
      : super(
          AnnouncementsRoute.name,
          initialChildren: children,
        );

  static const String name = 'AnnouncementsRoute';

  static const PageInfo<void> page = PageInfo<void>(name);
}

/// generated route for
/// [AuthScreen]
class AuthRoute extends PageRouteInfo<void> {
  const AuthRoute({List<PageRouteInfo>? children})
      : super(
          AuthRoute.name,
          initialChildren: children,
        );

  static const String name = 'AuthRoute';

  static const PageInfo<void> page = PageInfo<void>(name);
}

/// generated route for
/// [EditFavoriteLocationScreen]
class EditFavoriteLocationRoute
    extends PageRouteInfo<EditFavoriteLocationRouteArgs> {
  EditFavoriteLocationRoute({
    Key? key,
    required FavoriteLocationEntity entity,
    List<PageRouteInfo>? children,
  }) : super(
          EditFavoriteLocationRoute.name,
          args: EditFavoriteLocationRouteArgs(
            key: key,
            entity: entity,
          ),
          initialChildren: children,
        );

  static const String name = 'EditFavoriteLocationRoute';

  static const PageInfo<EditFavoriteLocationRouteArgs> page =
      PageInfo<EditFavoriteLocationRouteArgs>(name);
}

class EditFavoriteLocationRouteArgs {
  const EditFavoriteLocationRouteArgs({
    this.key,
    required this.entity,
  });

  final Key? key;

  final FavoriteLocationEntity entity;

  @override
  String toString() {
    return 'EditFavoriteLocationRouteArgs{key: $key, entity: $entity}';
  }
}

/// generated route for
/// [EditPhoneNumberScreen]
class EditPhoneNumberRoute extends PageRouteInfo<void> {
  const EditPhoneNumberRoute({List<PageRouteInfo>? children})
      : super(
          EditPhoneNumberRoute.name,
          initialChildren: children,
        );

  static const String name = 'EditPhoneNumberRoute';

  static const PageInfo<void> page = PageInfo<void>(name);
}

/// generated route for
/// [FavoriteDriversScreen]
class FavoriteDriversRoute extends PageRouteInfo<void> {
  const FavoriteDriversRoute({List<PageRouteInfo>? children})
      : super(
          FavoriteDriversRoute.name,
          initialChildren: children,
        );

  static const String name = 'FavoriteDriversRoute';

  static const PageInfo<void> page = PageInfo<void>(name);
}

/// generated route for
/// [FavoriteLocationsListScreen]
class FavoriteLocationsListRoute extends PageRouteInfo<void> {
  const FavoriteLocationsListRoute({List<PageRouteInfo>? children})
      : super(
          FavoriteLocationsListRoute.name,
          initialChildren: children,
        );

  static const String name = 'FavoriteLocationsListRoute';

  static const PageInfo<void> page = PageInfo<void>(name);
}

/// generated route for
/// [FavoriteLocationsScreen]
class FavoriteLocationsRoute extends PageRouteInfo<void> {
  const FavoriteLocationsRoute({List<PageRouteInfo>? children})
      : super(
          FavoriteLocationsRoute.name,
          initialChildren: children,
        );

  static const String name = 'FavoriteLocationsRoute';

  static const PageInfo<void> page = PageInfo<void>(name);
}

/// generated route for
/// [HomeScreen]
class HomeRoute extends PageRouteInfo<void> {
  const HomeRoute({List<PageRouteInfo>? children})
      : super(
          HomeRoute.name,
          initialChildren: children,
        );

  static const String name = 'HomeRoute';

  static const PageInfo<void> page = PageInfo<void>(name);
}

/// generated route for
/// [LanguageSettingsScreen]
class LanguageSettingsRoute extends PageRouteInfo<void> {
  const LanguageSettingsRoute({List<PageRouteInfo>? children})
      : super(
          LanguageSettingsRoute.name,
          initialChildren: children,
        );

  static const String name = 'LanguageSettingsRoute';

  static const PageInfo<void> page = PageInfo<void>(name);
}

/// generated route for
/// [LocateFavoriteLocationScreen]
class LocateFavoriteLocationRoute extends PageRouteInfo<void> {
  const LocateFavoriteLocationRoute({List<PageRouteInfo>? children})
      : super(
          LocateFavoriteLocationRoute.name,
          initialChildren: children,
        );

  static const String name = 'LocateFavoriteLocationRoute';

  static const PageInfo<void> page = PageInfo<void>(name);
}

/// generated route for
/// [MapSettingsScreen]
class MapSettingsRoute extends PageRouteInfo<void> {
  const MapSettingsRoute({List<PageRouteInfo>? children})
      : super(
          MapSettingsRoute.name,
          initialChildren: children,
        );

  static const String name = 'MapSettingsRoute';

  static const PageInfo<void> page = PageInfo<void>(name);
}

/// generated route for
/// [NavigationScreen]
class NavigationRoute extends PageRouteInfo<void> {
  const NavigationRoute({List<PageRouteInfo>? children})
      : super(
          NavigationRoute.name,
          initialChildren: children,
        );

  static const String name = 'NavigationRoute';

  static const PageInfo<void> page = PageInfo<void>(name);
}

/// generated route for
/// [PaymentMethodsScreen]
class PaymentMethodsRoute extends PageRouteInfo<void> {
  const PaymentMethodsRoute({List<PageRouteInfo>? children})
      : super(
          PaymentMethodsRoute.name,
          initialChildren: children,
        );

  static const String name = 'PaymentMethodsRoute';

  static const PageInfo<void> page = PageInfo<void>(name);
}

/// generated route for
/// [ProfileInfoScreen]
class ProfileInfoRoute extends PageRouteInfo<void> {
  const ProfileInfoRoute({List<PageRouteInfo>? children})
      : super(
          ProfileInfoRoute.name,
          initialChildren: children,
        );

  static const String name = 'ProfileInfoRoute';

  static const PageInfo<void> page = PageInfo<void>(name);
}

/// generated route for
/// [ProfileParentScreen]
class ProfileParentRoute extends PageRouteInfo<void> {
  const ProfileParentRoute({List<PageRouteInfo>? children})
      : super(
          ProfileParentRoute.name,
          initialChildren: children,
        );

  static const String name = 'ProfileParentRoute';

  static const PageInfo<void> page = PageInfo<void>(name);
}

/// generated route for
/// [ProfileScreen]
class ProfileRoute extends PageRouteInfo<void> {
  const ProfileRoute({List<PageRouteInfo>? children})
      : super(
          ProfileRoute.name,
          initialChildren: children,
        );

  static const String name = 'ProfileRoute';

  static const PageInfo<void> page = PageInfo<void>(name);
}

/// generated route for
/// [RideHistoryDetailsScreen]
class RideHistoryDetailsRoute
    extends PageRouteInfo<RideHistoryDetailsRouteArgs> {
  RideHistoryDetailsRoute({
    Key? key,
    required OrderCompactEntity entity,
    List<PageRouteInfo>? children,
  }) : super(
          RideHistoryDetailsRoute.name,
          args: RideHistoryDetailsRouteArgs(
            key: key,
            entity: entity,
          ),
          initialChildren: children,
        );

  static const String name = 'RideHistoryDetailsRoute';

  static const PageInfo<RideHistoryDetailsRouteArgs> page =
      PageInfo<RideHistoryDetailsRouteArgs>(name);
}

class RideHistoryDetailsRouteArgs {
  const RideHistoryDetailsRouteArgs({
    this.key,
    required this.entity,
  });

  final Key? key;

  final OrderCompactEntity entity;

  @override
  String toString() {
    return 'RideHistoryDetailsRouteArgs{key: $key, entity: $entity}';
  }
}

/// generated route for
/// [RideHistoryScreen]
class RideHistoryRoute extends PageRouteInfo<void> {
  const RideHistoryRoute({List<PageRouteInfo>? children})
      : super(
          RideHistoryRoute.name,
          initialChildren: children,
        );

  static const String name = 'RideHistoryRoute';

  static const PageInfo<void> page = PageInfo<void>(name);
}

/// generated route for
/// [ScheduledRideDetailsScreen]
class ScheduledRideDetailsRoute
    extends PageRouteInfo<ScheduledRideDetailsRouteArgs> {
  ScheduledRideDetailsRoute({
    Key? key,
    required OrderCompactEntity entity,
    List<PageRouteInfo>? children,
  }) : super(
          ScheduledRideDetailsRoute.name,
          args: ScheduledRideDetailsRouteArgs(
            key: key,
            entity: entity,
          ),
          initialChildren: children,
        );

  static const String name = 'ScheduledRideDetailsRoute';

  static const PageInfo<ScheduledRideDetailsRouteArgs> page =
      PageInfo<ScheduledRideDetailsRouteArgs>(name);
}

class ScheduledRideDetailsRouteArgs {
  const ScheduledRideDetailsRouteArgs({
    this.key,
    required this.entity,
  });

  final Key? key;

  final OrderCompactEntity entity;

  @override
  String toString() {
    return 'ScheduledRideDetailsRouteArgs{key: $key, entity: $entity}';
  }
}

/// generated route for
/// [ScheduledRidesScreen]
class ScheduledRidesRoute extends PageRouteInfo<void> {
  const ScheduledRidesRoute({List<PageRouteInfo>? children})
      : super(
          ScheduledRidesRoute.name,
          initialChildren: children,
        );

  static const String name = 'ScheduledRidesRoute';

  static const PageInfo<void> page = PageInfo<void>(name);
}

/// generated route for
/// [SettingsParentScreen]
class SettingsParentRoute extends PageRouteInfo<void> {
  const SettingsParentRoute({List<PageRouteInfo>? children})
      : super(
          SettingsParentRoute.name,
          initialChildren: children,
        );

  static const String name = 'SettingsParentRoute';

  static const PageInfo<void> page = PageInfo<void>(name);
}

/// generated route for
/// [SettingsScreen]
class SettingsRoute extends PageRouteInfo<void> {
  const SettingsRoute({List<PageRouteInfo>? children})
      : super(
          SettingsRoute.name,
          initialChildren: children,
        );

  static const String name = 'SettingsRoute';

  static const PageInfo<void> page = PageInfo<void>(name);
}

/// generated route for
/// [WalletParentScreen]
class WalletParentRoute extends PageRouteInfo<void> {
  const WalletParentRoute({List<PageRouteInfo>? children})
      : super(
          WalletParentRoute.name,
          initialChildren: children,
        );

  static const String name = 'WalletParentRoute';

  static const PageInfo<void> page = PageInfo<void>(name);
}

/// generated route for
/// [WalletScreen]
class WalletRoute extends PageRouteInfo<void> {
  const WalletRoute({List<PageRouteInfo>? children})
      : super(
          WalletRoute.name,
          initialChildren: children,
        );

  static const String name = 'WalletRoute';

  static const PageInfo<void> page = PageInfo<void>(name);
}
