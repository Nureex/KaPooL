import { View, Text, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { useRideStore } from '@/store';
import axios from 'axios';
import { API_URL } from '@/lib/utils';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
import DriverRideLayout from '@/components/DriverRideLayout';

const TrackRide = () => {
  const { ride } = useRideStore(); // Get the ride details from the store
  
  const handleAccept = async () => {
    try {
      const response = await axios.put(`${API_URL}/rides/${ride._id}/status`, {
        ride_status: 'approved',
      });
      Alert.alert('Success', 'Ride has been accepted');
      router.push('/(driver)/track-ride'); // Redirect to the home screen or any other page
    } catch (error) {
      Alert.alert('Error', 'Failed to accept ride. Please try again.');
      console.error('Error updating ride status:', error);
    }
  };

  const handleReject = async () => {
    try {
      const response = await axios.put(`${API_URL}/rides/${ride._id}/status`, {
        ride_status: 'rejected',
      });
      Alert.alert('Ride Rejected', 'You have rejected the ride.');
      router.push('/(root)/home');
    } catch (error) {
      Alert.alert('Error', 'Failed to reject ride. Please try again.');
    }
  };

  return (
    <DriverRideLayout snapPoints={["45%", "85%"]}>
      <View className="flex-1 p-4">
        {/* Ride Details */}
        <View className="bg-white p-5 rounded-xl shadow-md mb-4">
          <Text className="text-lg font-bold text-gray-900 mb-2">Ride Details</Text>
          <Text className="text-gray-700">Passenger: {ride.user_id?.name}</Text>
          <Text className="text-gray-700">From: {ride.origin_address}</Text>
          <Text className="text-gray-700">To: {ride.destination_address}</Text>
          <Text className="text-gray-700">Fare: ${ride.fare_price}</Text>
          <Text className="text-gray-700">Status: {ride.ride_status}</Text>
        </View>

        {/* Action Buttons */}
        <View className="flex-row gap-3 justify-between">
          
          <TouchableOpacity
            onPress={handleReject}
            className="bg-red-600 py-3 px-6 rounded-xl flex-1"
          >
            <Text className="text-center text-white font-bold">Reject Ride</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleAccept}
            className="bg-primary py-3 px-6 rounded-xl flex-1"
          >
            <Text className="text-center text-white font-bold">Accept Ride</Text>
          </TouchableOpacity>
        </View>
      </View>
    </DriverRideLayout>
  );
};

export default TrackRide;
