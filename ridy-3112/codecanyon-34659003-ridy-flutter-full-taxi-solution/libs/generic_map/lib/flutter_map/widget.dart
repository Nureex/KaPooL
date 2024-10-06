import 'dart:math';

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:flutter_map_animations/flutter_map_animations.dart';
import 'package:generic_map/interfaces/interfaces.dart';
import 'package:geolocator/geolocator.dart';
import 'package:latlong2/latlong.dart';
import 'package:generic_map/flutter_map/controller.dart';
import '../interfaces/circle_marker.dart' as circle_marker;
import 'package:flutter_map/flutter_map.dart' as fmap;
import 'provider.dart';
import 'tile_layers/mapbox_tile_layer.dart';
import 'tile_layers/openstreet_tile_layer.dart';

class FlutterMapView extends StatefulWidget {
  final Function(Place?)? onMapMoved;
  final MapProvider provider;
  final MapViewMode mode;
  final bool interactive;
  final bool goToCurrentLocation;
  final Place? initialLocation;
  final List<PolyLineLayer> polylines;
  final List<CustomMarker> markers;
  final Function(MapViewController)? onControllerReady;
  final AddressResolver? addressResolver;
  final EdgeInsets padding;
  final GlobalKey markerKey;
  final CenterMarker? centerMarker;
  final List<circle_marker.CircleMarker> circleMarkers;

  const FlutterMapView({
    super.key,
    required this.initialLocation,
    required this.polylines,
    required this.markers,
    required this.mode,
    this.onControllerReady,
    required this.onMapMoved,
    required this.interactive,
    required this.padding,
    this.goToCurrentLocation = false,
    required this.provider,
    required this.markerKey,
    required this.addressResolver,
    required this.centerMarker,
    required this.circleMarkers,
  });

  @override
  State<FlutterMapView> createState() => FlutterMapViewState();
}

class FlutterMapViewState extends State<FlutterMapView>
    with TickerProviderStateMixin {
  static const useTransformerId = 'useTransformerId';
  late final FlutterMapController controller = FlutterMapController(
    mapController: AnimatedMapController(vsync: this),
    padding: widget.padding,
  );
  final GlobalKey mapKey = GlobalKey();

  @override
  void initState() {
    if (widget.goToCurrentLocation) {
      Geolocator.requestPermission().then((value) {
        if (value == LocationPermission.denied ||
            value == LocationPermission.deniedForever) {
          Geolocator.openAppSettings();
        }
        Geolocator.getCurrentPosition().then(
          (value) {
            controller.moveCamera(LatLng(value.latitude, value.longitude), 18);
          },
        );
      });
    }

    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return FlutterMap(
      key: mapKey,
      mapController: controller.mapController.mapController,
      options: MapOptions(
        maxZoom: 20,
        interactionOptions: InteractionOptions(
          flags:
              widget.interactive ? (InteractiveFlag.all) : InteractiveFlag.none,
        ),
        initialCenter:
            widget.initialLocation?.latLng ?? const LatLng(50.5, 30.51),
        initialZoom: 16,
        onMapEvent: widget.mode != MapViewMode.picker
            ? null
            : (event) async {
                if (event is MapEventMoveStart) {
                  widget.onMapMoved?.call(null);
                } else if (event is MapEventMoveEnd) {
                  if (widget.centerMarker == null) {
                    if (kDebugMode) {
                      print(
                        'interactive but no center marker provided, skipping address retrieval',
                      );
                    }

                    return;
                  }
                  // RenderBox markerBox = widget.markerKey.currentContext
                  //     ?.findRenderObject() as RenderBox;
                  // Offset position = markerBox.localToGlobal(Offset.zero);
                  // RenderBox mapBox =
                  //     mapKey.currentContext?.findRenderObject() as RenderBox;
                  // Offset mapPosition = mapBox.localToGlobal(Offset.zero);
                  // final latLng = event.camera.pointToLatLng(
                  //   Point(
                  //     (position.dx + (markerBox.size.width / 2)) -
                  //         mapPosition.dx,
                  //     (position.dy + markerBox.size.height) - mapPosition.dy,
                  //   ),
                  // );
                  final markerBox = widget.markerKey.currentContext
                      ?.findRenderObject() as RenderBox;
                  final centerMarkerSize = widget.centerMarker!.size;
                  final markerAlignment = widget.centerMarker!.alignment;
                  final markerCenter = Offset(
                    markerBox.size.width / 2,
                    markerBox.size.height / 2,
                  );
                  final markerAlignmentOffset = Offset(
                    (markerAlignment.x) * (centerMarkerSize.width / 2),
                    (-markerAlignment.y) * (centerMarkerSize.height / 2),
                  );
                  RenderBox mapBox =
                      mapKey.currentContext?.findRenderObject() as RenderBox;
                  Offset mapPosition = mapBox.localToGlobal(Offset.zero);

                  Offset position = markerBox.localToGlobal(markerCenter);
                  position = position + markerAlignmentOffset - mapPosition;
                  final latLng = event.camera.pointToLatLng(
                    Point(position.dx, position.dy),
                  );
                  widget.onMapMoved?.call(Place(latLng, "", ""));
                  print('latLng: $latLng');
                  final place = await widget.addressResolver?.call(
                    widget.provider is MapBoxProvider
                        ? MapProviderEnum.mapBox
                        : MapProviderEnum.openStreetMaps,
                    latLng,
                  );
                  widget.onMapMoved?.call(place);
                }
              },
        onMapReady: widget.onControllerReady != null
            ? () {
                widget.onControllerReady!(controller);
              }
            : null,
      ),
      children: [
        if (widget.provider is OpenStreetMapProvider) openStreetTileLayer,
        if (widget.provider is MapBoxProvider)
          mapBoxTileLayer(
            accessToken: (widget.provider as MapBoxProvider).secretKey,
            userId: (widget.provider as MapBoxProvider).userId,
            tileSetId: (widget.provider as MapBoxProvider).tileSetId,
          ),

        if (widget.polylines.isNotEmpty)
          PolylineLayer(
            polylines: widget.provider.parsePolyLines(widget.polylines).toList()
                as List<Polyline>,
          ),
        CircleLayer(
          circles: widget.provider.parseCircleMarkers(widget.circleMarkers)
              as List<fmap.CircleMarker>,
        ),
        MarkerLayer(
          alignment: Alignment.bottomCenter,
          markers: widget.provider.parseMarkers(widget.markers).toList()
              as List<Marker>,
        ),
        // CurrentLocationLayer(
        //   followOnLocationUpdate: FollowOnLocationUpdate.never,
        // )
      ],
    );
  }
}
