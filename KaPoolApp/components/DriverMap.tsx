import React, { useEffect, useState } from "react";
import { ActivityIndicator, View, Text } from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import { icons } from "@/constants";
import axios from "axios";
import MapViewDirections from "react-native-maps-directions";
import { API_URL } from "@/lib/utils";
import { useRideStore, useLocationStore, useUserStore } from "@/store";
import * as Location from "expo-location";
import Constants from "expo-constants"; // Import Expo constants

const googleApiKey = Constants.expoConfig?.extra?.googleApiKey; // Access API key

const DriverMap = () => {
  const { userLongitude, userLatitude } = useLocationStore();
  const { user } = useUserStore();
  const { ride } = useRideStore();

  const [loading, setLoading] = useState(true);
  const [mapRegion, setMapRegion] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const [hasPermission, setHasPermission] = useState(null); // Track permission status

  // Request permission and set initial location
  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        setHasPermission(status === "granted");

        if (status !== "granted") {
          console.warn("Permission to access location was denied");
          setLoading(false);
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        const address = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        setDriverLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        // Set region based on ride or user's current location
        setMapRegion(
          ride
            ? {
                latitude: ride.origin_latitude,
                longitude: ride.origin_longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }
            : {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }
        );
        setLoading(false);
      } catch (error) {
        console.error("Error setting location:", error);
        setLoading(false);
      }
    })();
  }, [ride]);

  // Periodically update driver location
  useEffect(() => {
    if (!ride || !driverLocation || !user) return;

    const updateDriverLocation = async (longitude, latitude) => {
      try {
        await axios.put(`${API_URL}/drivers/${user._id}/location`, {
          longitude,
          latitude,
        });
        setDriverLocation({ latitude, longitude });
      } catch (error) {
        console.error("Error updating driver location:", error);
      }
    };

    const updateLocationInterval = setInterval(async () => {
      try {
        let location = await Location.getCurrentPositionAsync({});
        updateDriverLocation(
          location.coords.longitude,
          location.coords.latitude
        );
      } catch (error) {
        console.error("Error fetching location:", error);
      }
    }, 10000);

    return () => clearInterval(updateLocationInterval);
  }, [ride, driverLocation, user]);

  const handleDirectionsReady = (result) => {
    console.log("Travel time:", result.duration, "mins");
    console.log("Travel distance:", result.distance, "km");
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#000" />
        <Text>Loading Map...</Text>
      </View>
    );
  }

  if (!hasPermission) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Location permission is required to use this feature.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        provider={PROVIDER_DEFAULT}
        style={{ width: "100%", height: "100%" }}
        region={mapRegion}
        showsUserLocation={!!driverLocation} // Show user location only if driverLocation is not null
        loadingEnabled={true}
      >
        {ride && (
          <>
            {/* Driver's current location marker */}
            {driverLocation && (
              <Marker
                coordinate={{
                  latitude: driverLocation.latitude,
                  longitude: driverLocation.longitude,
                }}
                title={`${ride.driver_id.name}`}
                description="Driver's current location"
                image={icons.marker}
              />
            )}

            {/* Origin marker */}
            <Marker
              coordinate={{
                latitude: ride?.origin_latitude,
                longitude: ride?.origin_longitude,
              }}
              title="Origin"
              description={ride?.origin_address}
              image={icons.pin}
            />

            {/* Destination marker */}
            <Marker
              coordinate={{
                latitude: ride?.destination_latitude,
                longitude: ride?.destination_longitude,
              }}
              title="Destination"
              description={ride?.destination_address}
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
                apikey={googleApiKey}
                strokeWidth={3}
                strokeColor="blue"
                onReady={handleDirectionsReady}
              />
            )}
          </>
        )}
      </MapView>
    </View>
  );
};

export default DriverMap;
