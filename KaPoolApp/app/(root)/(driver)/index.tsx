import { View, Text, FlatList, ActivityIndicator, Image, Alert, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import PassengerCard from '@/components/PassengerCard';
import { useLocationStore, usePassengerStore, useUserStore } from '@/store';
import axios from 'axios';
import { API_URL } from '@/lib/utils';
import DriverRideLayout from '@/components/DriverRideLayout';
import { images } from '@/constants';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';

const Home = () => {
    const { passengerRide, setPassengerRide } = usePassengerStore();
    const { user } = useUserStore();
    const { setUserLocation } = useLocationStore();
    const [loading, setLoading] = useState(false);
    const [driverExists, setDriverExists] = useState(false); // State to check if driver exists
    const router = useRouter();

    const fetchRides = async () => {
        setLoading(true);
        try {
            // Check if the driver exists
            const driverResponse = await axios.get(`${API_URL}/drivers/${user._id}/vehicle`);
            if (driverResponse.data[0]) {
                setDriverExists(true);
                // Fetch rides only if the driver exists
                const ridesResponse = await axios.get(`${API_URL}/rides/${user._id}/active`);
                setPassengerRide(ridesResponse.data);  // Set the fetched ride data to the store
            } else {
                setDriverExists(false);
            }
        } catch (error) {
            console.log('Error', error.response?.data?.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRides();
    }, []);

    const [hasPermission, setHasPermission] = useState<boolean>(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                setHasPermission(false);
                return;
            }

            let location = await Location.getCurrentPositionAsync({});

            const address = await Location.reverseGeocodeAsync({
                latitude: location.coords?.latitude!,
                longitude: location.coords?.longitude!,
            });

            setUserLocation({
                latitude: location.coords?.latitude,
                longitude: location.coords?.longitude,
                address: `${address[0].name}, ${address[0].region}`,
            });
        })();
    }, []);

    return (
        <DriverRideLayout showSidebar showBackArrow={false} snapPoints={["65%", "85%"]}>
            <View>
                <FlatList
                    data={passengerRide}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <PassengerCard ride={item} />
                    )}
                    ListEmptyComponent={() =>
                        loading ? (
                            <View className="flex flex-col items-center justify-center">
                                <ActivityIndicator size="large" color="green" />
                                <Text className="mt-2">Loading rides...</Text>
                            </View>
                        ) : (
                            <View className="flex flex-col items-center justify-center">
                                <Image
                                    source={images.noResult}
                                    className="w-40 h-40"
                                    alt="No recent rides found"
                                    resizeMode="contain"
                                />
                                <Text className="text-sm">No rides found</Text>
                                {!driverExists && (
                                    <>
                                    <Text className="text-sm">Add your vehicle to start receiving rides</Text>
                                    <TouchableOpacity
                                        className="mt-4 bg-primary px-10 py-3 rounded-md"
                                        onPress={() => router.push('/(driver)/vehicle')}
                                    >
                                        <Text className="text-white text-lg">Add Vehicle</Text>
                                    </TouchableOpacity>
                                    </>
                                )}
                            </View>
                        )
                    }
                />
            </View>
        </DriverRideLayout>
    );
};

export default Home;
