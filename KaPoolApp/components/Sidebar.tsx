import { View, Text, Animated, Image, TouchableOpacity } from 'react-native'
import React, { useRef, useState } from 'react'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(-250)).current; // Initial position of sidebar

  const toggleSidebar = () => {
    Animated.timing(slideAnim, {
      toValue: isOpen ? -250 : 0, // Slide in or out
      duration: 300,
      useNativeDriver: true,
    }).start();

    setIsOpen(!isOpen);
  };
  return (
    <>
      <Animated.View
          style={{ transform: [{ translateX: slideAnim }], }}
          className="bg-white h-full w-2/3 z-50 absolute"
        >
          <View className="mx-10 mt-10">
            <View className="flex gap-3 border-b-[1px] border-gray-200 py-5 flex-row items-center">
              <Image
                source={require('@/assets/images/icon.png')}
                className="w-18 h-18 rounded-full"
              />
              
              <View className="flex flex-col items-start space-x-0.5">
                <Text className="text-xl font-semibold">John Doe</Text>
                <Text className="text-md font-normal">Profile</Text>
              </View>
            </View>
            <View>
              <View>
                <Text className="">Home</Text>
              </View>
              
              <Text className="">My Rides</Text>
              <Text className="">Payment</Text>
              <Text className="">Reviews</Text>
            </View>
            
          </View>
          
        </Animated.View>
        <TouchableOpacity onPress={toggleSidebar}>
              <View className="w-10 h-10 bg-white rounded-full items-center justify-center">
                <MaterialIcons name="menu" size={24} color="black" className="w-6 h-6" />
              </View>
            </TouchableOpacity>
    </>
  )
}

export default Sidebar