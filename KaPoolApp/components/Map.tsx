import React, { useEffect, useState, useCallback } from "react";
import { ActivityIndicator, View, Alert, Text } from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import { icons } from "@/constants";
import {
  calculateDriverTimes,
  calculateRegion,
  generateMarkersFromData,
} from "@/lib/map";
import { useDriverStore, useLocationStore } from "@/store";
import { MarkerData } from "@/types/type";
import axios from "axios";
import MapViewDirections from "react-native-maps-directions";
import debounce from "lodash/debounce";
import { API_URL } from "@/lib/utils";
import * as Location from "expo-location";
import Constants from "expo-constants"; // Import Expo constants

const googleApiKey = Constants.expoConfig?.extra?.googleApiKey; // Access API key

const Map = () => {
  const {
    userLongitude,
    userLatitude,
    destinationLatitude,
    destinationLongitude,
    setUserLocation,
  } = useLocationStore();
  const { drivers, selectedDriver, setDrivers } = useDriverStore();

  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [loading, setLoading] = useState(true); // For indicating the map load state
  const [error, setError] = useState(null);

  const fetchDrivers = async () => {
    try {
      const response = await axios.get(`${API_URL}/drivers`);
      const data = response.data;
      setDrivers(data);
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "An error occurred while fetching drivers."
      );
    }
  };

  // Check for location permissions
  const checkLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        setHasLocationPermission(true);

        let location = await Location.getCurrentPositionAsync({});

        const address = await Location.reverseGeocodeAsync({
          latitude: location.coords?.latitude!,
          longitude: location.coords?.longitude!,
        });

        setUserLocation({
          latitude: location.coords?.latitude,
          longitude: location.coords?.longitude,
          address: `${address[0].name}, ${address[0].region}`,
        });
      } else {
        Alert.alert(
          "Location Permission",
          "Permission to access location was denied."
        );
        setHasLocationPermission(false);
      }
    } catch (e) {
      setError("Failed to check location permission");
      setHasLocationPermission(false);
    }
  };

  useEffect(() => {
    checkLocationPermission();
  }, []);

  useEffect(() => {
    if (hasLocationPermission) {
      fetchDrivers();
    }
  }, [hasLocationPermission]);

  // Generate markers from driver data
  useEffect(() => {
    if (Array.isArray(drivers) && userLatitude && userLongitude) {
      const newMarkers = generateMarkersFromData({
        data: drivers,
        userLatitude,
        userLongitude,
      });
      setMarkers(newMarkers);
    }
  }, [drivers, userLatitude, userLongitude]);

  // Memoize the debounced function using useCallback to avoid re-creating it on every render
  const calculateDriverTimesDebounced = useCallback(
    debounce(() => {
      if (markers.length > 0 && destinationLatitude && destinationLongitude) {
        calculateDriverTimes({
          markers,
          userLatitude,
          userLongitude,
          destinationLatitude,
          destinationLongitude,
        }).then((updatedDrivers) => {
          if (
            updatedDrivers &&
            JSON.stringify(updatedDrivers) !== JSON.stringify(drivers)
          ) {
            setDrivers(updatedDrivers); // Only update if drivers have changed
          }
        });
      }
    }, 10000),
    [markers, destinationLatitude, destinationLongitude]
  );

  useEffect(() => {
    if (
      markers.length > 0 &&
      destinationLatitude !== undefined &&
      destinationLongitude !== undefined
    ) {
      calculateDriverTimesDebounced();
    }
  }, [
    markers,
    destinationLatitude,
    destinationLongitude,
    calculateDriverTimesDebounced,
  ]);

  const region = calculateRegion({
    userLatitude,
    userLongitude,
    destinationLatitude,
    destinationLongitude,
  });

  // Render fallback UI in case of error or missing permissions
  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "red" }}>{error}</Text>
      </View>
    );
  }

  if (!hasLocationPermission) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>
          No location permissions granted. Please enable location services.
        </Text>
      </View>
    );
  }

  return userLatitude && userLongitude && region ? ( // Ensure coordinates are valid before rendering
    <MapView
      provider={PROVIDER_DEFAULT}
      className="w-full h-full rounded-2xl"
      tintColor="black"
      showsPointsOfInterest={false}
      initialRegion={region}
      showsUserLocation={true}
      userInterfaceStyle="light"
      onMapReady={() => setLoading(false)} // Map has loaded successfully
      onError={(e: any) =>
        setError("Failed to load the map. Please try again.")
      }
    >
      {markers?.map(
        (driver) =>
          driver.latitude &&
          driver.longitude && ( // Ensure driver's coordinates are valid
            <Marker
              key={driver._id}
              coordinate={{
                latitude: driver.latitude,
                longitude: driver.longitude,
              }}
              title={driver.driver_id.name}
              description={`Vehicle: ${driver.vehicle_make}`}
              pinColor="blue"
              image={
                selectedDriver === driver.driver_id._id
                  ? icons.selectedMarker
                  : icons.marker
              }
            />
          )
      )}

      {destinationLatitude &&
        destinationLongitude && ( // Ensure destination coordinates are valid
          <>
            <Marker
              key={destinationLatitude}
              coordinate={{
                latitude: destinationLatitude,
                longitude: destinationLongitude,
              }}
              title="Destination"
              image={icons.pin}
            />
            <MapViewDirections
              origin={{
                latitude: userLatitude!,
                longitude: userLongitude!,
              }}
              destination={{
                latitude: destinationLatitude,
                longitude: destinationLongitude,
              }}
              apikey={googleApiKey}
              strokeColor="#0286FF"
              strokeWidth={2}
              onError={(e) =>
                setError("Failed to load directions. Please try again.")
              }
            />
          </>
        )}
    </MapView>
  ) : (
    <ActivityIndicator size="large" color="#0000ff" /> // Show loading indicator if coordinates are not available yet
  );
};

export default Map;
