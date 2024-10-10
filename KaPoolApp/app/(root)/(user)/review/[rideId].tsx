import { View, Text, TextInput, Alert, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import CustomButton from '@/components/CustomButton';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import { icons } from '@/constants';
import { useLocationStore, useRideStore } from '@/store';
import { API_URL } from '@/lib/utils'

const ViewReview = () => {
  const { rideId } = useLocalSearchParams(); // Get the rideId from the dynamic route
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [rideData, setRideData] = useState(null)
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { setRide } = useRideStore();
  const { clearLocation } = useLocationStore();


  const getRide = async () => {
    try {
      const response = await axios.get(`${API_URL}/rides/${rideId}`); // Adjust endpoint as necessary
      setRideData(response.data);
    } catch (error) {
      console.error('Error fetching ride status:', error);
    }
  };

  useEffect(() => {
    setRide(null);
    clearLocation()
    if (!rideId) return; // Exit if there is no ride
    getRide();
  }, []); // Depend on ride so it updates when ride changes

  const handleSubmitReview = async () => {
    if (rating === 0) {
      Alert.alert('Error', 'Please provide a rating.');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await axios.post(`${API_URL}/reviews`, {
        review: reviewText,
        ride_id: rideId,
        reviewer_id: rideData?.user_id._id,
        reviewee_id: rideData?.driver_id._id,
        rating,
        comment: reviewText,
      });
      Alert.alert('Success', 'Review submitted successfully.');
      router.push('/(root)/(user)/ride/find-ride');
    } catch (error) {
      Alert.alert('Error', 'Failed to submit review. Try again later.');
    } finally {
      setIsLoading(false);
    }
  };

const profileImageUrl = rideData?.driver_id?.profile_image_url ? { uri: rideData?.driver_id?.profile_image_url} : require('@/assets/images/icon.png');

  return (
    <SafeAreaView className="p-5">
      <Text className="text-2xl text-center font-semibold mb-5">How was your ride?</Text>

      <View className="flex flex-col w-full items-center justify-center mt-10">
        <Image
          source={profileImageUrl}
          className="w-28 h-28 rounded-full"
        />

        <View className="flex flex-row items-center justify-center mt-5 space-x-2">
          <Text className="text-lg font-semibold">
            {rideData?.driver_id.name}
          </Text>
        </View>
      </View>
      
      <View className="my-5">
        <Text className="text-lg font-medium">Rate the Ride</Text>
        <View className="flex flex-row justify-evenly mt-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Text key={star} onPress={() => setRating(star)} style={{ fontSize: 30 }}>
              {star <= rating ? '★' : '☆'}
            </Text>
          ))}
        </View>
      </View>

      <View className="mb-5">
        <Text className="text-lg font-medium">Write a Review</Text>
        <TextInput
          multiline
          value={reviewText}
          onChangeText={setReviewText}
          placeholder="Write your review here"
          className="w-full p-3 border border-gray-300 h-28 rounded-md mt-2"
        />
      </View>

      <CustomButton
        title="Submit Review"
        handlePress={handleSubmitReview}
        isLoading={isLoading}
        containerStyles="bg-[#0CC25F] w-full mt-5"
      />

      <CustomButton
        title="Cancel"
        handlePress={() => router.push('/(root)/(user)/ride/find-ride')}
        isLoading={isLoading}
        containerStyles="bg-gray-500 w-full mt-5"
      />
    </SafeAreaView>
  );
};

export default ViewReview