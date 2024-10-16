import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import RideLayout from "@/components/RideLayout";
import GoogleTextInput from "@/components/GoogleTextInput";
import CustomButton from "@/components/CustomButton";
import { Redirect, router } from "expo-router";
import * as Location from "expo-location";
import { useLocationStore, useRideStore } from "@/store";
import { icons } from "@/constants";

const FindRide = () => {
  const {
    userAddress,
    userLatitude,
    userLongitude,
    destinationAddress,
    setUserLocation,
    setDestinationLocation,
  } = useLocationStore();

  const { setRide, ride } = useRideStore();
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Redirect if a ride is already in progress
  if (ride) return <Redirect href="/(root)/(user)/ride/track-ride" />;

  return (
    <RideLayout title="Ride" showSidebar showBackArrow={false}>
      {errorMsg ? <Text>{errorMsg}</Text> : null}

      <View className="my-3">
        <Text className="text-md font-semibold mb-3">From</Text>

        <GoogleTextInput
          icon={icons.target}
          initialLocation={userAddress || "Enter your current location"}
          containerStyle="bg-neutral-100"
          textInputBackgroundColor="#f5f5f5"
          handlePress={(location) => setUserLocation(location)}
        />
      </View>

      <View className="my-3">
        <Text className="text-md font-semibold mb-3">To</Text>

        <GoogleTextInput
          icon={icons.map}
          initialLocation={destinationAddress || "Enter your destination"}
          containerStyle="bg-neutral-100"
          textInputBackgroundColor="transparent"
          handlePress={(location) => setDestinationLocation(location)}
        />
      </View>

      <CustomButton
        title="Find Now"
        handlePress={() => router.push("/(root)/(user)/ride/confirm-ride")}
        containerStyles="w-full mt-7"
      />
    </RideLayout>
  );
};

export default FindRide;
