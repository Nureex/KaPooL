import { Image, Text, View } from "react-native";

import { icons } from "@/constants";
import { formatDate, formatTime } from "@/lib/utils";
import { Ride } from "@/types/type";

const RideCard = ({ ride }: { ride: Ride }) => {
    return (
        <View className="flex flex-row items-start justify-center bg-white rounded-lg shadow-md mb-3 p-4">
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
                <Text className="text-md font-normal text-gray-500">Date & Time</Text>
                <Text className="text-md font-semibold">
                  {formatDate(ride.createdAt)}, {formatTime(ride.ride_time)}
                </Text>
              </View>
    
              <View className="flex flex-row justify-between mb-3">
                <Text className="text-md font-normal text-gray-500">Driver</Text>
                <Text className="text-md font-semibold">{ride.driver_id.name}</Text>
              </View>
    
              <View className="flex flex-row justify-between mb-3">
                <Text className="text-md font-normal text-gray-500">Car Seats</Text>
                <Text className="text-md font-semibold">4</Text>
              </View>
    
              <View className="flex flex-row justify-between">
                <Text className="text-md font-normal text-gray-500">Payment Status</Text>
                <Text
                  className={`text-md font-semibold ${
                    ride.payment_status === "paid" ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {ride.payment_status}
                </Text>
              </View>
            </View>
          </View>
        </View>
      );
};

export default RideCard;
