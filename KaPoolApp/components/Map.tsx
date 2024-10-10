import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View, Alert } from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import { icons } from "@/constants";
import {
  calculateDriverTimes,
  calculateRegion,
  generateMarkersFromData,
} from "@/lib/map";
import { useDriverStore, useLocationStore } from "@/store";
import { Driver, MarkerData } from "@/types/type";
import axios from "axios";
import MapViewDirections from "react-native-maps-directions";
import debounce from "lodash/debounce";
import { API_URL } from "@/lib/utils";

const directionsAPI = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;

const Map = () => {
  const {
    userLongitude,
    userLatitude,
    destinationLatitude,
    destinationLongitude,
  } = useLocationStore();
  const { drivers, selectedDriver, setDrivers } = useDriverStore();
  
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [travelTime, setTravelTime] = useState(0);
  const [travelDistance, setTravelDistance] = useState(0);

  const fetchDrivers = async () => {
    try {
      const response = await axios.get(`${API_URL}/drivers`);
      const data = response.data;
      setDrivers(data);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'An error occurred.');
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

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

  // Debounced version of calculateDriverTimes to avoid multiple re-renders
  const calculateDriverTimesDebounced = debounce(() => {
    if (markers.length > 0 && destinationLatitude && destinationLongitude) {
      calculateDriverTimes({
        markers,
        userLatitude,
        userLongitude,
        destinationLatitude,
        destinationLongitude,
      }).then((updatedDrivers) => {
        if (updatedDrivers) {
          setDrivers(updatedDrivers);
        }
      });
    }
  }, 10000); // Debounce with 10 seconds

  // Immediate call and subsequent calls after 10 seconds
  useEffect(() => {
    if (markers.length > 0 && destinationLatitude && destinationLongitude) {
      // Call the debounced function immediately
      calculateDriverTimesDebounced();

      // Set up a 10-second interval for the next call
      const interval = setInterval(() => {
        calculateDriverTimesDebounced();
      }, 10000); // 10 seconds delay

      // Clean up the interval on component unmount
      return () => clearInterval(interval);
    }
  }, [markers, destinationLatitude, destinationLongitude]);

  const handleDirectionsReady = (result) => {
    const duration = result.duration; // Duration in minutes
    const distance = result.distance; // Distance in kilometers
    setTravelTime(duration);
    setTravelDistance(distance);
  };

  const region = calculateRegion({
    userLatitude,
    userLongitude,
    destinationLatitude,
    destinationLongitude,
  });

  return (
    <MapView
      provider={PROVIDER_DEFAULT}
      className="w-full h-full rounded-2xl"
      tintColor="black"
      mapType="mutedStandard"
      showsPointsOfInterest={false}
      initialRegion={region}
      showsUserLocation={true}
      userInterfaceStyle="light"
    >
      {markers.map((driver) => (
        <Marker
          key={driver.id}
          coordinate={{ latitude: driver.latitude, longitude: driver.longitude }}
          title={driver.driver_id.name}
          description={`Vehicle: ${driver.vehicle_make}`}
          pinColor="blue"
          image={
            selectedDriver === driver.driver_id._id ? icons.selectedMarker : icons.marker
          }
        />
      ))}

      {destinationLatitude && destinationLongitude && (
        <>
          <Marker
            key="destination"
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
            apikey={directionsAPI!}
            strokeColor="#0286FF"
            strokeWidth={2}
            onReady={handleDirectionsReady}
          />
        </>
      )}
    </MapView>
  );
};

export default Map;
