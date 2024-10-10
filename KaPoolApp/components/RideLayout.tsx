import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { Link, Redirect, router } from "expo-router";
import React, { useRef, useState } from "react";
import { Animated, Image, Text, TouchableOpacity, View, TouchableWithoutFeedback } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { icons } from "@/constants";
import Map from "./Map";
import {Ionicons, MaterialIcons} from '@expo/vector-icons';
import { SafeAreaView } from "react-native-safe-area-context";
import { useRideStore, useUserStore } from "@/store";

const RideLayout = ({
  title,
  snapPoints,
  children,
  showSidebar = false,
  showBackArrow = true
}: {
  title: string;
  snapPoints?: string[];
  children: React.ReactNode;
  showSidebar: boolean;
  showBackArrow: boolean;
}) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [isOpen, setIsOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(-250)).current; // Initial position of sidebar
  const { user, logOut } = useUserStore();
  const { setRide } = useRideStore();

  if(!user) return <Redirect href="/(auth)/sign-in" />

  const toggleSidebar = () => {
    Animated.timing(slideAnim, {
      toValue: isOpen ? -250 : 0, // Slide in or out
      duration: 300,
      useNativeDriver: true,
    }).start();

    setIsOpen(!isOpen);
  };

  const handleOutsidePress = () => {
    if (isOpen) {
      toggleSidebar(); // Close sidebar if it's open
    }
  };

  return (
    <GestureHandlerRootView className="flex-1">
      {/* Main Wrapper */}
      <TouchableWithoutFeedback onPress={handleOutsidePress}>
        <View className="flex-1">
          {/* Sidebar */}
          <Animated.View
            style={{ transform: [{ translateX: slideAnim }], }}
            className="bg-white h-full w-60 z-50 absolute"
          >
            <View className="mx-5 mt-10">
              <TouchableOpacity onPress={toggleSidebar} className="items-end">
                <View className="w-10 h-10 bg-white rounded-full items-center justify-center">
                  <Ionicons name="close" size={24} color="black" className="w-6 h-6" />
                </View>
              </TouchableOpacity>
              <View className="flex gap-3 border-b-[1px] border-gray-200 py-5 flex-row items-center">
                <Image
                  source={require('@/assets/images/icon.png')}
                  className="w-18 h-18 rounded-full"
                />
                <View className="flex flex-col items-start space-x-0.5">
                  <Text className="text-xl font-semibold">{user.name}</Text>
                  <Link href="/(root)/(user)/review" className="text-md font-normal text-primary">User</Link>
                </View>
              </View>
              <View className="mt-5">
                <TouchableOpacity onPress={() => router.push('/(root)/(user)/ride/find-ride')} className="flex-row items-center gap-3 py-2">
                  <Ionicons name="home-outline" size={24} color="black" className="w-6 h-6" />
                  <Text className="text-lg">Home</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push('/(root)/(user)/ride')} className="flex-row items-center gap-3 py-2">
                  <Ionicons name="car-outline" size={24} color="black" className="w-6 h-6" />
                  <Text className="text-lg">My Rides</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push('/(root)/(user)/payment')} className="flex-row items-center gap-3 py-2">
                  <Ionicons name="card-outline" size={24} color="black" className="w-6 h-6" />
                  <Text className="text-lg">Payment</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push('/(root)/(user)/review')} className="flex-row items-center gap-3 py-2">
                  <Ionicons name="star-outline" size={24} color="black" className="w-6 h-6" />
                  <Text className="text-lg">Reviews</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    logOut();
                  }} className="flex-row items-center gap-3 py-2">
                  <MaterialIcons name="logout" size={24} color="red" className="w-6 h-6" />
                  <Text className="text-lg text-danger-600">Logout</Text>
                </TouchableOpacity>
              </View>
              
            </View>
          </Animated.View>

          {/* Main Content */}
          <View className="flex-1 bg-white">
            <View className="flex flex-col h-screen bg-blue-500">
              <SafeAreaView className="flex flex-row absolute z-10 items-center justify-start px-5">
                {/* Hamburger Icon */}
                {showSidebar && (
                  <TouchableOpacity onPress={toggleSidebar} className="mt-5">
                    <View className="w-10 h-10 bg-white rounded-full shadow-2xl shadow-gray-800 items-center justify-center">
                      <Ionicons name="menu" size={24} color="black" className="w-8 h-8" />
                    </View>
                  </TouchableOpacity>
                )}

                {/* Back Arrow */}
                {showBackArrow && (
                  <>
                    <TouchableOpacity onPress={() => router.back()}>
                      <View className="w-10 h-10 bg-white rounded-full items-center justify-center">
                        <Image
                          source={icons.backArrow}
                          resizeMode="contain"
                          className="w-6 h-6"
                        />
                      </View>
                    </TouchableOpacity>
                    <Text className="text-xl font-JakartaSemiBold ml-5">
                      {title || "Go Back"}
                    </Text>
                  </>
                )}
              </SafeAreaView>

              {/* Map Component */}
              <Map />
            </View>

            {/* BottomSheet */}
            <BottomSheet
              ref={bottomSheetRef}
              snapPoints={snapPoints || ["40%", "85%"]}
              index={0}
            >
              <BottomSheetView style={{ flex: 1, padding: 20 }}>
                {children}
              </BottomSheetView>
            </BottomSheet>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </GestureHandlerRootView>
  );
};

export default RideLayout;
