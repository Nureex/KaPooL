import React, { useEffect, useState } from "react";
import { Image, Text, View, Alert, Button } from "react-native";
import Modal from "react-native-modal";
import RideLayout from "@/components/RideLayout";
import { icons } from "@/constants";
import { formatTime } from "@/lib/utils";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import CustomButton from "@/components/CustomButton";
import { useLocationStore, useRideStore, useDriverStore, useUserStore } from "@/store";
import axios from 'axios';
import { Redirect, router } from "expo-router";
import { API_URL } from '@/lib/utils'
import PaystackPayment from "@/components/PaystackPayment";


const TrackRide = () => {
  const { userAddress, destinationAddress } = useLocationStore();
  const { setRide, ride} = useRideStore();
  const { drivers } = useDriverStore();
  const { user } = useUserStore();


  const [rideStatus, setRideStatus] = useState(ride.ride_status);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  const [isPaymentVisible, setPaymentVisible] = useState(false);

  const filteredDriver = drivers.filter((driver) => driver.driver_id._id === ride.driver_id);

  useEffect(() => {
    if (!ride) return; // Exit if there is no ride
  
    const checkRideStatus = async () => {
      try {
        const response = await axios.get(`${API_URL}/rides/${ride._id}`); // Adjust endpoint as necessary
        setRideStatus(response.data.ride_status);
        // Redirect to review page if ride is completed
        if (response.data.ride_status === 'completed') {
          setPaymentVisible(true);
          // return <Redirect href={`/(root)/(user)/review/${ride._id}`} />
          // setRide(null)
        }
      } catch (error) {
        console.error('Error fetching ride status:', error);
      }
    };
  
    // Initial check
    checkRideStatus();
  
    // Set up interval to check status every 3 seconds
    const intervalId = setInterval(checkRideStatus, 5000);
  
    // Cleanup function
    return () => clearInterval(intervalId);
  }, [drivers]); // Depend on ride so it updates when ride changes
  
  useEffect(() => {
    if (rideStatus === 'completed') {
      setPaymentVisible(true);
    }
  }, [rideStatus]); 
  


  const handleEndRide = async () => {
    setIsLoading(true); // Start loading state
  
    try {
      const response = await axios.put(`${API_URL}/rides/status`, 
        {
          ride_status: "canceled",
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
  
      // If the response is successful
      Alert.alert('Ride Ended', 'You have successfully ended the ride.');
      setRide(null); // Clear the ride state
      router.push('/(root)/(user)/ride/find-ride'); // Navigate to the next screen
    } catch (error) {
      handleError(error); // Handle any errors that occur
    } finally {
      setIsLoading(false); // Ensure loading state is reset
    }
  };
  
  const handleError = (error) => {
    if (error.response) {
      console.error('Response error:', error.response.data);
      Alert.alert('Error', error.response.data.message || 'Failed to end the ride.');
    } else if (error.request) {
      console.error('No response received:', error.request);
      Alert.alert('Error', 'No response from the server. Please try again.');
    } else {
      console.error('Error setting up the request:', error.message);
      Alert.alert('Error', 'Failed to end the ride. Please try again.');
    }
  };
  

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleCancelRide = async () => {
    try {
      // Make API call to cancel the ride
      await axios.delete(`${API_URL}/rides/${ride._id}`); // Adjust endpoint as necessary
      Alert.alert('Ride Cancelled', 'You have successfully cancelled the ride.');
      // Update the state or navigate to another screen as needed
      setModalVisible(false);
    } catch (error) {
      console.error('Error cancelling ride:', error);
      Alert.alert('Error', 'Failed to cancel the ride. Please try again.');
    }
  };

  const handlePaymentSuccess = (response) => {
    // Handle post-payment success actions (e.g., updating ride status)
    Alert.alert('Payment Successful', 'Your payment was successful');
    return <Redirect href={`/(root)/(user)/review/${ride._id}`} />
    setRide(null)
    setPaymentVisible(false);

  };

  return (
    <RideLayout title="Track Ride">
      <>
        <Text className="text-2xl font-semibold mb-2">
          {rideStatus === "arrived" ? (
            "Arrived at Destination"
          ) : rideStatus === "in_progress" ? (
            "Driving to destination"
          ) : (
            `Arriving in ${formatTime(Number(filteredDriver[0]?.time?.toFixed(0)) || 0)}`
          )}
        </Text>

        <Text className="text-md font-medium text-gray-500 mb-3">
          Toyota Corolla, Grey 1321
        </Text>

        <View className="flex flex-row w-full py-5 items-start border-y border-gray-100 justify-around">
          {/* Driver Info */}
          <View className="flex flex-col items-center">
            <Image
              source={require('@/assets/images/icon.png')}
              className="w-18 h-18 rounded-full"
            />
            <Text className="text-md font-medium">John Doe</Text>
            <View className="flex flex-row items-center space-x-0.5">
              <Image
                source={icons.star}
                className="w-3 h-3"
                resizeMode="contain"
              />
              <Text className="text-md font-normal">4.5</Text>
            </View>
          </View>

          {/* Contact Driver */}
          <View className="flex flex-col items-center">
            <View className="bg-slate-200 flex items-center justify-center w-14 h-14 rounded-full p-3">
              <FontAwesome name="phone" size={24} color="black" />
            </View>
            <Text className="text-md font-medium">Contact driver</Text>
          </View>

          {/* Safety Section */}
          <View className="flex flex-col items-center">
            <View className="bg-slate-200 flex items-center justify-center w-14 h-14 rounded-full p-3">
              <FontAwesome6 name="shield" size={24} color="black" />
            </View>
            <Text className="text-md font-medium">Safety</Text>
          </View>
        </View>

        {/* Ride Info */}
        <View className="flex flex-col w-full items-start justify-center">
          <View className="flex flex-row items-center justify-between w-full border-b border-white py-2">
            <Text className="text-md font-normal">Ride Price</Text>
            <Text className="text-md font-normal text-[#0CC25F]">₦{Number(ride.fare_price).toFixed(0)}</Text>
          </View>

          <View className="flex flex-row items-center justify-between w-full border-b border-white py-2">
            <Text className="text-md font-normal">Ride Time</Text>
            <Text className="text-md font-normal">{formatTime(Number(ride.ride_time?.toFixed(0))!)}</Text>
          </View>

          <View className="flex flex-row items-center justify-between w-full py-2">
            <Text className="text-md font-normal">Car Seats</Text>
            <Text className="text-md font-normal">{filteredDriver[0]?.vehicle_seats} seats</Text>
          </View>
        </View>

        {/* Location Info */}
        <View className="flex flex-col w-full items-start justify-center">
          <View className="flex flex-row items-center justify-start mt-3 border-t border-b border-general-700 w-full py-3">
            <Image source={icons.to} className="w-6 h-6" />
            <Text className="text-md font-normal ml-2">{userAddress}</Text>
          </View>

          <View className="flex flex-row items-center justify-start border-b border-general-700 w-full py-3">
            <Image source={icons.point} className="w-6 h-6" />
            <Text className="text-md font-normal ml-2">{destinationAddress}</Text>
          </View>
        </View>

        {/* Cancel Ride Button */}
        <CustomButton 
          title="Cancel Ride"
          handlePress={toggleModal}
          containerStyles="w-full bg-danger-500 mt-5"
          isLoading={false}
        />

        {/* Confirmation Modal */}
        <Modal isVisible={isModalVisible} className="bottom-0" onBackdropPress={toggleModal}>
          <View className="bg-white text-center items-center rounded-lg p-5">
            <Text className="font-semibold text-2xl">Are you sure?</Text>
            <Text className="my-3 text-lg text-gray-600 text-center">You have to wait longer if you cancel. Rebooking may not get you to your destination more quickly.</Text>
            <View className="space-y-1 justify-between w-full">
              <CustomButton title="Confirm" isLoading onPress={handleCancelRide} color="#FF0000" />
              <CustomButton title="Cancel" onPress={toggleModal} containerStyles="w-full bg-danger-500 mt-5" />
            </View>
          </View>
        </Modal>

        {isPaymentVisible && (
          <PaystackPayment
            amount={ride.fare_price} // Paystack expects the amount in kobo (1 Naira = 100 kobo)
            email={user.email} // Replace with actual user email
            reference={`ride-${ride._id}`}
            onSuccess={handlePaymentSuccess}
            ride={ride}
          />
        )}
      </>
    </RideLayout>
  );
};

export default TrackRide;
