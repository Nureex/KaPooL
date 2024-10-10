import { View, Text, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { useRideStore } from '@/store';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
import { icons } from '@/constants';
import { formatDate, formatTime } from '@/lib/utils';

const PassengerCard = ({ ride }) => {
  const { setRide } = useRideStore(); // Access the ride store

  const handleCardPress = () => {
    setRide(ride); // Set the ride in the store
    if(ride.ride_status !== 'approved' || ride.ride_status !== 'requested'){
      router.push('/(root)/(driver)/track-ride'); // Navigate to the track-ride page
    }else{
      router.push('/(root)/(driver)/confirm-ride'); // Navigate to the track-ride page
    }
    
  };

  return (
    <TouchableOpacity
      onPress={handleCardPress}
      className="flex flex-row items-start justify-center bg-white border-general-300 border rounded-lg shadow-md mb-3 p-4"
    >
      <View className="flex-1">
        <View className="flex flex-row items-center mb-4">
          <View className="flex-1">
            <View className="flex flex-row items-center mb-2">
              <Image source={icons.to} className="w-5 h-5 mr-2" />
              <Text className="text-md font-medium" numberOfLines={1}>
                {ride.origin_address}
              </Text>
            </View>

            <View className="flex flex-row items-center">
              <Image source={icons.point} className="w-5 h-5 mr-2" />
              <Text className="text-md font-medium" numberOfLines={1}>
                {ride.destination_address}
              </Text>
            </View>
          </View>
        </View>

        <View className="bg-general-500 rounded-lg p-3">
          <View className="flex flex-row justify-between mb-3">
            <Text className="text-md font-normal text-gray-500">Passenger</Text>
            <Text className="text-md font-semibold" numberOfLines={1}>
              {ride.user_id?.name || 'Passenger'}
            </Text>
          </View>
          <View className="flex flex-row justify-between mb-3">
            <Text className="text-md font-normal text-gray-500">Price</Text>
            <Text className="text-md font-semibold" numberOfLines={1}>
            ₦{ride.fare_price.toFixed(2)}
            </Text>
          </View>
          <View className="flex flex-row justify-between mb-3">
            <Text className="text-md font-normal text-gray-500">Date & Time</Text>
            <Text className="text-md font-semibold" numberOfLines={1}>
              {formatDate(ride.createdAt)}, {formatTime(ride.ride_time)}
            </Text>
          </View>

          <View className="flex flex-row justify-between">
            <Text className="text-md font-normal text-gray-500">Status</Text>
            <Text
              className={`text-md font-semibold ${
                ride.ride_status === "requested" ? "text-yellow-500" : "text-green-500"
              }`}
            >
              {ride.ride_status.charAt(0).toUpperCase() + ride.ride_status.slice(1)}
            </Text>
          </View>
        </View>
      </View>
        
    </TouchableOpacity>
  );
};

export default PassengerCard;
