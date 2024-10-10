import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

import { icons } from "@/constants";
import { formatTime } from "@/lib/utils";
import { DriverCardProps } from "@/types/type";

const DriverCard = ({ item, selected, setSelected }: DriverCardProps) => {
  const profileImageUrl = item.profile_image_url ? { uri: item.profile_image_url} : require('@/assets/images/icon.png');
  const carImageUrl = item.car_image_url ? { uri: item.car_image_url } : require('@/assets/icons/marker.png');

  return (
    <TouchableOpacity
      onPress={setSelected}
      className={`${
        selected === item.driver_id._id ? "bg-general-600" : "bg-white"
      } flex flex-row items-center justify-between py-5 px-3 rounded-xl`}
    >
      {/* Driver Profile Image */}
      <Image
        source={profileImageUrl}
        className="w-14 h-14 rounded-full"
        resizeMode="cover"
      />

      <View className="flex-1 flex flex-col items-start justify-center mx-3">
        {/* Driver Name and Rating */}
        <View className="flex flex-row items-center justify-start mb-1">
          <Text className="text-lg font-medium">{item.driver_id.name}</Text>

          <View className="flex flex-row items-center space-x-1 ml-2">
            <Image source={icons.star} className="w-3.5 h-3.5" />
            <Text className="text-sm font-medium">{item.rating}</Text>
          </View>
        </View>

        {/* Price, Time, and Seats */}
        <View className="flex flex-row items-center justify-start">
          {/* Price */}
          <View className="flex flex-row items-center">
            <Image source={icons.dollar} className="w-4 h-4" />
            <Text className="text-sm font-medium ml-1">
              ₦{Number(item.price).toFixed(0)}
            </Text>
          </View>

          {/* Divider */}
          <Text className="text-sm font-medium text-general-800 mx-1">|</Text>

          {/* Travel Time */}
          <Text className="text-sm font-medium text-general-800">
            {formatTime(Number(item.time?.toFixed(0))!)}
          </Text>

          {/* Divider */}
          <Text className="text-sm font-medium text-general-800 mx-1">|</Text>

          {/* Seats */}
          <Text className="text-sm font-medium text-general-800">
            {item.vehicle_seats} seats
          </Text>
        </View>
      </View>

      {/* Car Image */}
      <Image
        source={carImageUrl}
        className="h-14 w-14"
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
};

export default DriverCard;
