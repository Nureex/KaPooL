import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import { icons } from "@/constants";
import axios from "axios";
import MapViewDirections from "react-native-maps-directions";
import { API_URL } from "@/lib/utils";
import { useRideStore, useLocationStore, useUserStore } from "@/store";
import * as Location from 'expo-location';

const directionsAPI = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;

const DriverMap = () => {
  const { userLongitude, userLatitude } = useLocationStore();
  const { user } = useUserStore();
  const { ride } = useRideStore();

  const [loading, setLoading] = useState(false);
  const [mapRegion, setMapRegion] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);

  // Update driver location periodically
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setHasPermission(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});

      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords?.latitude!,
        longitude: location.coords?.longitude!,
      });

      setDriverLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (!ride) {
        setMapRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
      } else {
        setMapRegion({
          latitude: ride.origin_latitude,
          longitude: ride.origin_longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
      }
    })();
  }, []);

  useEffect(() => {
    if (!ride || !driverLocation || !user) return;

    const updateDriverLocation = async (longitude, latitude) => {
      try {
        const response = await axios.put(`${API_URL}/drivers/${user._id}/location`, {
          longitude,
          latitude,
        });
        setDriverLocation({ latitude, longitude });
      } catch (error) {
        console.error('Error updating driver location:', error);
      }
    };

    const updateLocationInterval = setInterval(async () => {
      let location = await Location.getCurrentPositionAsync({});
      updateDriverLocation(location.coords.longitude, location.coords.latitude);
    }, 10000);

    return () => clearInterval(updateLocationInterval);
  }, [ride, driverLocation, user]);

  const handleDirectionsReady = (result) => {
    console.log("Travel time:", result.duration, "mins");
    console.log("Travel distance:", result.distance, "km");
  };

  return (
    <View style={{ flex: 1 }}>
      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <MapView
          provider={PROVIDER_DEFAULT}
          style={{ width: "100%", height: "100%" }}
          region={mapRegion}
          showsUserLocation={driverLocation !== null ? false : true}
          loadingEnabled={true}
        >
          {ride && (
            <>
              {/* Driver's moving location marker */}
              {driverLocation && (
                <Marker
                  coordinate={{
                    latitude: driverLocation.latitude,
                    longitude: driverLocation.longitude,
                  }}
                  title={`${ride.driver_id.name}`}
                  description="Driver's current location"
                  image={icons.marker} // Use a custom car icon for the driver's marker
                />
              )}

              {/* Origin marker */}
              <Marker
                coordinate={{
                  latitude: ride.origin_latitude,
                  longitude: ride.origin_longitude,
                }}
                title="Origin"
                description={ride.origin_address}
                image={icons.pin}
              />

              {/* Destination marker */}
              <Marker
                coordinate={{
                  latitude: ride.destination_latitude,
                  longitude: ride.destination_longitude,
                }}
                title="Destination"
                description={ride.destination_address}
                
              />

              {/* Route from driver's location to destination */}
              {driverLocation && (
                <MapViewDirections
                  origin={{
                    latitude: driverLocation.latitude,
                    longitude: driverLocation.longitude,
                  }}
                  destination={{
                    latitude: ride.destination_latitude,
                    longitude: ride.destination_longitude,
                  }}
                  apikey={directionsAPI}
                  strokeWidth={3}
                  strokeColor="blue"
                  onReady={handleDirectionsReady}
                />
              )}
            </>
          )}
        </MapView>
      )}
    </View>
  );
};

export default DriverMap;
