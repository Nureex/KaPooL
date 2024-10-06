import 'package:collection/collection.dart';
import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:hydrated_bloc/hydrated_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:rider_flutter/config/locator/locator.dart';
import 'package:rider_flutter/core/datasources/geo_datasource.dart';
import 'package:flutter_common/core/entities/driver_location.dart';
import 'package:rider_flutter/core/entities/order.dart';
import 'package:flutter_common/core/entities/place.dart';
import 'package:flutter_common/core/enums/order_status.dart';
import 'package:rider_flutter/features/home/features/track_order/presentation/blocs/track_order.dart';

import '../../domain/repositories/home_repository.dart';

part 'home.state.dart';
part 'home.freezed.dart';
part 'home.g.dart';

@lazySingleton
class HomeCubit extends Cubit<HomeState> {
  final HomeRepository homeRepository;
  final GeoDatasource geoDatasource;

  HomeCubit(this.homeRepository, this.geoDatasource)
      : super(
          const HomeState.welcome(waypoints: [null, null], driversAround: []),
        );

  void onStarted({
    required bool authenticated,
    required PlaceEntity? currentLocationPlace,
  }) async {
    if (authenticated) {
      final currentOrder = await homeRepository.getCurrentOrder();
      await currentOrder.fold(
        (l) async => emit(HomeState.error(error: l.errorMessage)),
        (r) async {
          if (r == null) {
            // no active order returned from server
            switch (state) {
              case RideInProgressState():
              case RateDriverState():
                initializeWelcome(pickupPoint: currentLocationPlace);
                break;
              default:
            }
          } else {
            // active order returned from server
            if (r.$1.status != OrderStatus.waitingForReview) {
              emit(
                HomeState.rideInProgress(
                  order: r.$1,
                  driverLocation: r.$2,
                ),
              );
            } else {
              locator.resetLazySingleton<TrackOrderBloc>();
              emit(
                HomeState.rateDriver(
                  order: r.$1,
                ),
              );
            }
          }
        },
      );
    } else {
      //initializeWelcome(pickupPoint: currentLocationPlace);
    }
  }

  void initializeWelcome({
    required PlaceEntity? pickupPoint,
  }) async {
    emit(
      HomeState.welcome(
        waypoints: [pickupPoint, null],
        driversAround: [],
      ),
    );
    _showDriversAround(waypoints: [pickupPoint, null]);
  }

  void closeWaypointsInput({
    required List<PlaceEntity?> waypoints,
  }) async {
    emit(HomeState.welcome(waypoints: waypoints, driversAround: []));
    _showDriversAround(
      waypoints: waypoints,
    );
  }

  void onMapMoved({
    required PlaceEntity selectedLocation,
  }) async {
    state.mapOrNull(
      welcome: (welcome) async {
        _showDriversAround(
          waypoints: welcome.waypoints.mapIndexed((index, e) => index == 0 ? selectedLocation : e).toList(),
        );
      },
      confirmLocation: (confirmLocation) async {
        emit(
          HomeState.confirmLocation(
            waypoints: confirmLocation.waypoints,
            index: confirmLocation.index,
            selectedLocation: selectedLocation,
          ),
        );
      },
    );
  }

  void _showDriversAround({
    required List<PlaceEntity?> waypoints,
  }) async {
    if (waypoints.first == null) {
      emit(
        HomeState.welcome(
          waypoints: waypoints,
          driversAround: [],
        ),
      );
      return;
    }
    final driversAround = await homeRepository.getDriversAround(
      waypoints.first!.latLng2,
    );
    driversAround.fold(
      (l) async => emit(HomeState.error(error: l.errorMessage)),
      (r) async {
        switch (state) {
          case _Loading():
          case WelcomeState():
            emit(
              HomeState.welcome(
                waypoints: waypoints,
                driversAround: r,
              ),
            );

          default:
        }
      },
    );
  }

  void onAddStop() {
    state.maybeMap(
      orElse: () => throw Exception('Invalid state'),
      inputWaypoints: (inputWaypoints) {
        emit(
          inputWaypoints.copyWith(
            waypoints: inputWaypoints.waypoints.followedBy([null]).toList(),
          ),
        );
      },
    );
  }

  void onRemoveStop(int index) {
    state.maybeMap(
      orElse: () => throw Exception('Invalid state'),
      inputWaypoints: (inputWaypoints) {
        final locations = [...inputWaypoints.waypoints];
        locations.removeAt(index);
        emit(inputWaypoints.copyWith(waypoints: locations));
      },
    );
  }

  void onLocationSelected(int index, PlaceEntity place) {
    state.maybeMap(
      orElse: () => throw Exception('Invalid state'),
      inputWaypoints: (inputWaypoints) {
        final locations = [...inputWaypoints.waypoints];
        locations[index] = place;
        emit(inputWaypoints.copyWith(waypoints: locations));
      },
    );
  }

  void showWaypoints({
    required List<PlaceEntity?> waypoints,
  }) =>
      emit(
        HomeState.inputWaypoints(
          waypoints: waypoints,
        ),
      );

  void showConfirmLocation({
    required List<PlaceEntity?> waypoints,
    required int index,
    required PlaceEntity selectedLocation,
  }) =>
      emit(
        HomeState.confirmLocation(
          waypoints: waypoints,
          index: index,
          selectedLocation: selectedLocation,
        ),
      );

  void showPreview({
    required List<PlaceEntity> waypoints,
    required List<LatLngEntity> directions,
  }) =>
      emit(
        HomeState.ridePreview(
          waypoints: waypoints,
          directions: directions,
        ),
      );

  void showInProgress({
    required OrderEntity order,
    required DriverLocation? driverLocation,
  }) =>
      emit(
        HomeState.rideInProgress(
          order: order,
          driverLocation: driverLocation,
        ),
      );

  void showRate({
    required OrderEntity order,
  }) =>
      emit(
        HomeState.rateDriver(
          order: order,
        ),
      );

  // @override
  // HomeState? fromJson(Map<String, dynamic> json) => HomeState.fromJson(json);

  // @override
  // Map<String, dynamic>? toJson(HomeState state) => state.toJson();
}
