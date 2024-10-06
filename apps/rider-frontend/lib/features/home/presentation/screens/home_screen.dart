import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:rider_flutter/config/locator/locator.dart';
import 'package:rider_flutter/core/blocs/auth_bloc.dart';
import 'package:rider_flutter/core/blocs/location.dart';
import 'package:rider_flutter/core/blocs/settings.dart';
import 'package:rider_flutter/core/extensions/extensions.dart';
import 'package:rider_flutter/features/home/presentation/blocs/home.dart';
import 'package:rider_flutter/features/home/presentation/blocs/place_confirm.dart';

import '../blocs/destination_suggestions.dart';
import 'home_screen.desktop.dart';
import 'home_screen.mobile.dart';

@RoutePage()
class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  late final AppLifecycleListener _listener;

  final locationCubit = locator<LocationCubit>();
  final homeCubit = locator<HomeCubit>();
  final authBloc = locator<AuthBloc>();
  final settingsCubit = locator<SettingsCubit>();

  @override
  void initState() {
    super.initState();
    _listener = AppLifecycleListener(
      onStateChange: _onStateChanged,
    );
    locationCubit.fetchCurrentLocation(
      language: settingsCubit.state.locale,
      mapProvider: settingsCubit.state.mapProviderEnum,
    );
    locationCubit.state.mapOrNull(
      determined: (determined) {
        homeCubit.initializeWelcome(
          pickupPoint: determined.place,
        );
      },
    );
    homeCubit.onStarted(
      authenticated: authBloc.state.isAuthenticated,
      currentLocationPlace: locationCubit.state.place,
    );
    authBloc.state.mapOrNull(
      authenticated: (authenticated) {
        authBloc.requestUserInfo();
        locator<DestinationSuggestionsCubit>().onStarted();
      },
    );
  }

  @override
  void dispose() {
    _listener.dispose();
    super.dispose();
  }

  void _onStateChanged(AppLifecycleState state) {
    switch (state) {
      case AppLifecycleState.resumed:
        homeCubit.onStarted(
          authenticated: authBloc.state.isAuthenticated,
          currentLocationPlace: locationCubit.state.place,
        );
        break;

      default:
        break;
    }
  }

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        BlocProvider.value(
          value: locator<LocationCubit>(),
        ),
        BlocProvider.value(
          value: locator<HomeCubit>(),
        ),
        BlocProvider.value(
          value: locator<PlaceConfirmCubit>(),
        )
      ],
      child: MultiBlocListener(
        listeners: [
          BlocListener<AuthBloc, AuthState>(
            listener: (context, state) {
              homeCubit.onStarted(
                authenticated: state.isAuthenticated,
                currentLocationPlace: locationCubit.state.place,
              );
              locator<DestinationSuggestionsCubit>().onStarted();
            },
          ),
          BlocListener<LocationCubit, LocationState>(
            listenWhen: (previous, current) => previous is LocationStateLoading && current is LocationStateDetermined,
            listener: (context, state) {
              homeCubit.state.maybeMap(
                rideInProgress: (_) {},
                rateDriver: (_) {},
                ridePreview: (_) {},
                orElse: () {
                  homeCubit.initializeWelcome(
                    pickupPoint: state.place,
                  );
                },
              );
            },
          ),
        ],
        child: context.responsive(
          const HomeScreenMobile(),
          xl: const HomeScreenDesktop(),
        ),
      ),
    );
  }
}
