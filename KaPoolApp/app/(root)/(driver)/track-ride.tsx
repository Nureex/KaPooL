import { View, Text, ActivityIndicator } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { useRideStore } from '@/store';
import { API_URL } from '@/lib/utils';
import { router } from 'expo-router';
import DriverRideLayout from '@/components/DriverRideLayout';
import CustomButton from '@/components/CustomButton';
import Modal from "react-native-modal";

const TrackRide = () => {
  const { ride, setRide } = useRideStore(); // Get the ride details and setter from the store
  const [rideStatus, setRideStatus] = useState(ride.ride_status);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(ride.payment_status); // Payment status state
  const [paymentCheckInterval, setPaymentCheckInterval] = useState(null); // Interval ID for polling
  const [isModalVisible, setModalVisible] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const MAX_RETRIES = 3;

  // Fetch ride status periodically
  const checkRideStatus = async () => {
    try {
      const response = await axios.get(`${API_URL}/rides/${ride._id}`);
      setRideStatus(response.data.ride_status);
      setRide(response.data); // Update the ride state
    } catch (error) {
      console.error('Error fetching ride status:', error);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(checkRideStatus, 5000); // Check status every 5 seconds
    return () => clearInterval(intervalId);
  }, []);

  // Handler to accept the ride
  const handleAccept = async () => {
    setIsLoading(true);
    try {
      await axios.put(`${API_URL}/rides/${ride._id}/status`, {
        ride_status: 'approved',
      });
      setRideStatus('approved');
    } catch (error) {
      console.error('Error updating ride status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handler to mark as arrived at destination
  const handleArrived = async () => {
    setIsLoading(true);
    try {
      await axios.put(`${API_URL}/rides/${ride._id}/status`, {
        ride_status: 'arrived',
      });
      setRideStatus('arrived');
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handler to start the ride
  const handleStartRide = async () => {
    setIsLoading(true);
    try {
      await axios.put(`${API_URL}/rides/${ride._id}/status`, {
        ride_status: 'in_progress',
      });
      setRideStatus('in_progress');
    } catch (error) {
      console.error('Error starting the ride:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handler to complete the ride
  const handleCompleteRide = async () => {
    setIsLoading(true);
    try {
      await axios.put(`${API_URL}/rides/${ride._id}/status`, {
        ride_status: 'completed',
      });
      setRideStatus('completed');
    } catch (error) {
      console.error('Error completing the ride:', error);
    } finally {
      setIsLoading(false);
    }
  };

  

  // Function to poll payment status
  const pollPaymentStatus = useCallback(async () => {
    if (retryCount >= MAX_RETRIES) {
      setIsLoading(false);
      return;
    }
    try {
      const response = await axios.get(`${API_URL}/payments/${ride._id}`);
      if (response.data.paymentStatus === 'paid') {
        setPaymentStatus('paid');
        setIsLoading(false);
        setRetryCount(0); // Reset retry count once payment is confirmed
      } else {
        setRetryCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error checking payment status:', error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  }, [retryCount, ride._id]);

  // Effect to periodically check payment status while modal is visible
  useEffect(() => {
    if (isModalVisible && paymentStatus !== 'paid') {
      const intervalId = setInterval(pollPaymentStatus, 10000); // Poll every 10 seconds
      return () => clearInterval(intervalId); // Cleanup the interval on unmount
    }
  }, [isModalVisible, paymentStatus, pollPaymentStatus]);

  // Handler to show modal and start polling
  const handleCheckPayment = () => {
    setModalVisible(true);
    setIsLoading(true); // Start loader
    pollPaymentStatus(); // Initial check
  };

  // Conditional button rendering based on ride status
  const renderActionButton = () => {
    switch (rideStatus) {
      case 'approved':
        return (
          <CustomButton
            title="Arrived at destination"
            isLoading={isLoading}
            handlePress={handleArrived}
          />
        );
      case 'arrived':
        return (
          <CustomButton
            title="Start Ride"
            isLoading={isLoading}
            handlePress={handleStartRide}
          />
        );
      case 'in_progress':
        return (
          <CustomButton
            title="Complete Ride"
            isLoading={isLoading}
            handlePress={handleCompleteRide}
          />
        );
      case 'completed':
        return (
          <View>
            {isLoading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              <CustomButton
                title="Check Payment"
                isLoading={isLoading}
                handlePress={handleCheckPayment}
                disabled={isLoading} // Disable button during loading
              />
            )}
          </View>
        );
      case 'paid':
        return (
          <Text className="text-green-500 text-xl">Payment has been completed</Text>
        );
      default:
        return (
          <CustomButton
            title="Accept Ride"
            isLoading={isLoading}
            handlePress={handleAccept}
          />
        );
    }
  };

  return (
    <DriverRideLayout snapPoints={["40%", "50%"]}>
      <View className="flex-1">
        {/* Ride Details */}
        <View className="bg-white px-5 rounded-xl shadow-md mb-4">
          <Text className="text-lg font-bold text-gray-900 mb-2">Ride Details</Text>
          <Text className="text-gray-700">Passenger: {ride.user_id?.name}</Text>
          <Text className="text-gray-700">From: {ride.origin_address}</Text>
          <Text className="text-gray-700">To: {ride.destination_address}</Text>
          <Text className="text-gray-700">Fare: ₦{Number(ride.fare_price).toFixed(0)}</Text>
          <Text className="text-gray-700">Status: {rideStatus}</Text>
          <Text className="text-gray-700">Payment: {paymentStatus}</Text>
        </View>

        {/* Render action buttons based on ride status */}
        {renderActionButton()}

        {/* Modal for payment status */}
        <Modal isVisible={isModalVisible} className="bottom-0">
          <View className="bg-white text-center items-center rounded-lg p-5">
            {isLoading ? (
              <View className="flex flex-col items-center justify-center">
                <ActivityIndicator size="large" color="green" />
                <Text className="mt-2">Verifying payment...</Text>
              </View>
            ) : paymentStatus === 'paid' ? (
              <>
                <Text className="font-semibold text-2xl">Payment Success</Text>
                <Text className="my-3 text-lg text-gray-600 text-center">The payment for this ride has been completed.</Text>
                <CustomButton
                  title="Ok"
                  handlePress={() => {
                    setModalVisible(false); // Close modal
                    router.push('/(driver)'); // Navigate away
                  }}
                  containerStyles="mt-7 w-full"
                />
              </>
            ) : retryCount >= MAX_RETRIES ? (
              <Text className="text-red-500">Payment verification failed. Please try again later.</Text>
            ) : null}
          </View>
        </Modal>
      </View>
    </DriverRideLayout>
  );
};

export default TrackRide;
