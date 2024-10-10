import { router } from "expo-router";
import { ActivityIndicator, Alert, FlatList, Image, Text, View } from "react-native";

import CustomButton from "@/components/CustomButton";
import DriverCard from "@/components/DriverCard";
import RideLayout from "@/components/RideLayout";
import { useCallback, useState } from "react";
import { useDriverStore, useLocationStore, useRideStore, useUserStore } from "@/store";
import axios from "axios";
import { images } from "@/constants";
import { API_URL } from '@/lib/utils'

const ConfirmRide = () => {
  const { drivers, selectedDriver, setSelectedDriver } = useDriverStore();
  const { user } = useUserStore(); 
  const { setRide, ride } = useRideStore();
  const {
    userLongitude,
    userLatitude,
    destinationLatitude,
    destinationLongitude,
    userAddress, destinationAddress
  } = useLocationStore();

  const [isLoading, setIsLoading] = useState(false);
  
  const handleBookRide = useCallback(async () => {
    setIsLoading(true);

    if (!selectedDriver) {
      Alert.alert('Error', 'Please select a driver before booking.');
      setIsLoading(false);
      return;
    }

    const filteredDriver = drivers.filter((driver) => driver.driver_id._id === selectedDriver);

    if (filteredDriver.length === 0) {
      Alert.alert('Error', 'No driver found for this selection.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/rides`, 
        {
          driver_id: selectedDriver,
          user_id: user._id,
          origin_address: userAddress,
          destination_address: destinationAddress,
          origin_latitude: userLatitude,
          origin_longitude: userLongitude,
          destination_latitude: destinationLatitude,
          destination_longitude: destinationLongitude,
          ride_time: filteredDriver[0].ride_time,
          fare_price: Number(filteredDriver[0].price),
          payment_status: 'pending',
          ride_status: 'requested',
        });
      Alert.alert('Success', 'Ride created successfully!');
      setRide(response.data);
      router.push('/(root)/(user)/ride/track-ride'); // Navigate to the next screen after success
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false); // Ensure loading state is reset
    }
  }, [drivers, selectedDriver, user]);

  const handleError = (error) => {
    if (error.response) {
      console.error('Response error:', error.response.data);
      Alert.alert('Error', error.response.data.message || 'Failed to create ride.');
    } else if (error.request) {
      console.error('No response received:', error.request);
      Alert.alert('Error', 'No response from the server. Please try again.');
    } else {
      console.error('Error setting up the request:', error.message);
      Alert.alert('Error', 'Failed to create ride. Please try again.');
    }
  };

  return (
    <RideLayout title={"Choose a Rider"} snapPoints={["65%", "85%"]}>
      <View>
        <FlatList
          data={drivers}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => {
            // if (!item.price && !item.time) {
            //   return (
            //     <View className="flex flex-col items-center justify-center">
            //       <ActivityIndicator size={"large"} color="green" />
            //       <Text>Loading drivers...</Text>
            //     </View>
            //   );
            // }
            return (
              <DriverCard
                item={item}
                selected={selectedDriver}
                setSelected={() => setSelectedDriver(item.driver_id._id!)}
              />
            );
          }}
          // ListFooterComponent={() => (
          //   <View className="mx-5 mt-10">
          //     <CustomButton 
          //       title="Book Ride"
          //       handlePress={handleBookRide}
          //       isLoading={selectedDriver == null || isLoading}
          //     />
          //   </View>
          // )}
          ListEmptyComponent={() => (
            <View className="flex flex-col items-center justify-center">
                <Image
                  source={images.noResult}
                  className="w-40 h-40"
                  alt="No recent rides found"
                  resizeMode="contain"
                />
                <Text className="text-sm">No driver found</Text>
            </View>
          )}
        />
      </View>
      <View className="mx-5 mt-10">
        <CustomButton 
          title="Book Ride"
          handlePress={handleBookRide}
          isLoading={selectedDriver == null || isLoading}
        />
      </View>
    </RideLayout>
  );  
};

export default ConfirmRide;
