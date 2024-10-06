import 'package:flutter_map/flutter_map.dart';
import 'package:flutter_map_cancellable_tile_provider/flutter_map_cancellable_tile_provider.dart';

TileLayer mapBoxTileLayer(
    {required String accessToken,
    required String tileSetId,
    required String userId}) {
  return TileLayer(
    urlTemplate:
        "https://api.mapbox.com/styles/v1/$userId/$tileSetId/tiles/256/{z}/{x}/{y}@2x?access_token=$accessToken",
    additionalOptions: {"access_token": accessToken},
    maxNativeZoom: 18,
    maxZoom: 20,
    tileProvider: CancellableNetworkTileProvider(silenceExceptions: true),
  );
}
