import { View, Text, Image } from "react-native";
import React from "react";
import { icons } from "@/constants"; // Ensure you have icons for ratings if needed

const ReviewCard = ({ review }) => {
    const profileImageUrl = review.reviewee_id.profile_image_url ? { uri: review.reviewee_id.profile_image_url} : require('@/assets/images/icon.png');
  return (
    <View className="bg-white rounded-lg shadow-sm shadow-neutral-300 mb-3 p-4">
      <View className="flex-row items-center mb-2">
        <Image
          source={profileImageUrl} // Default profile image if none provided
          className="w-10 h-10 rounded-full"
        />
        <Text className="text-lg font-semibold ml-2">{review.reviewee_id.name}</Text>
      </View>
      <Text className="text-md text-gray-700">{review.comment}</Text>
      <View className="flex-row items-center mt-2">
        {/* Display the rating */}
        {Array.from({ length: review.rating }, (_, index) => (
          <Image key={index} source={icons.star} className="w-4 h-4" />
        ))}
      </View>
      <Text className="text-sm text-gray-500 mt-1">
        {new Date(review.createdAt).toLocaleDateString()} {/* Format the date as needed */}
      </Text>
    </View>
  );
};

export default ReviewCard;
