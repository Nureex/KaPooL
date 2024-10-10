import { ScrollView, Text, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import CustomButton from '@/components/CustomButton';
import { useUserStore } from '@/store';
import axios from 'axios';
import { API_URL } from '@/lib/utils';
import { useRouter } from 'expo-router';
import FormField from '@/components/FormField';
import * as Location from 'expo-location';  // Import Location

const VehiclePage = () => {
    const { user } = useUserStore();
    const router = useRouter();

    

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);

    const [form, setForm] = useState({
        vehicle_make: '',
        vehicle_model: '',
        vehicle_license_plate: '',
        vehicle_color: '',
        license_number: '',
        vehicle_seats: '4',
        cost_per_minute: '',
        cost_per_kilometer: '',
        latitude: latitude,  // Add latitude
        longitude:longitude, // Add longitude
    });

    const fetchVehicleDetails = async () => {
        try {
            const response = await axios.get(`${API_URL}/drivers/${user._id}/vehicle`);
            if (response.data) {
                const vehicle = response.data[0];
                setForm({
                    vehicle_make: vehicle.vehicle_make || '',
                    vehicle_model: vehicle.vehicle_model || '',
                    vehicle_license_plate: vehicle.vehicle_license_plate || '',
                    vehicle_color: vehicle.vehicle_color || '',
                    license_number: vehicle.license_number || '',
                    vehicle_seats: vehicle.vehicle_seats?.toString() || '4',
                    cost_per_minute: vehicle.cost_per_minute?.toString() || '',
                    cost_per_kilometer: vehicle.cost_per_kilometer?.toString() || '',
                    latitude: latitude || null, // If available
                    longitude: longitude || null, // If available
                });
                setIsUpdating(true);
            }
        } catch (error) {
            console.error("Error fetching vehicle details", error.response?.data);
            setErrorMessage('Failed to load vehicle details.');
        }
    };

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                setHasPermission(false);
                return;
            }

            let location = await Location.getCurrentPositionAsync({});

            setLongitude(location?.coords?.longitude);
            setLatitude(location?.coords?.latitude)
        })();
    }, []);

    useEffect(() => {
        fetchVehicleDetails();
    }, []);
    

    const submitVehicle = async () => {
        setIsSubmitting(true);
        setErrorMessage('');

        const payload = {
            driver_id: user._id,
            ...form,
            vehicle_seats: parseInt(form.vehicle_seats, 10),
        };

        try {
            if (isUpdating) {
                await axios.put(`${API_URL}/drivers/${user._id}/vehicle`, payload);
                Alert.alert('Success', 'Vehicle updated successfully');
            } else {
                await axios.post(`${API_URL}/drivers`, payload);
                Alert.alert('Success', 'Vehicle added successfully');
            }
            router.push('/(driver)');
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'An error occurred.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ScrollView className="p-4">
            <Text className="text-2xl font-bold mb-4">
                {isUpdating ? 'Update Vehicle Details' : 'Add Vehicle Details'}
            </Text>

            <FormField
                title="Vehicle Make"
                value={form.vehicle_make}
                handleChangeText={(e) => setForm({ ...form, vehicle_make: e })}
                otherStyles="mt-3"
                placeholder="Enter vehicle make"
            />

            <FormField
                title="Vehicle Model"
                value={form.vehicle_model}
                handleChangeText={(e) => setForm({ ...form, vehicle_model: e })}
                otherStyles="mt-3"
                placeholder="Enter vehicle model"
            />

            <FormField
                title="License Plate"
                value={form.vehicle_license_plate}
                handleChangeText={(e) => setForm({ ...form, vehicle_license_plate: e })}
                otherStyles="mt-3"
                placeholder="Enter license plate number"
            />

            <FormField
                title="Vehicle Color"
                value={form.vehicle_color}
                handleChangeText={(e) => setForm({ ...form, vehicle_color: e })}
                otherStyles="mt-3"
                placeholder="Enter vehicle color"
            />

            <FormField
                title="License Number"
                value={form.license_number}
                handleChangeText={(e) => setForm({ ...form, license_number: e })}
                otherStyles="mt-3"
                placeholder="Enter driver's license number"
            />

            <FormField
                title="Seats"
                value={form.vehicle_seats}
                handleChangeText={(e) => setForm({ ...form, vehicle_seats: e })}
                otherStyles="mt-3"
                placeholder="Enter number of seats"
                keyboardType="numeric"
            />

            <FormField
                title="Cost per Minute"
                value={form.cost_per_minute}
                handleChangeText={(e) => setForm({ ...form, cost_per_minute: e })}
                otherStyles="mt-3"
                placeholder="Enter cost per minute"
                keyboardType="numeric"
            />

            <FormField
                title="Cost per Kilometer"
                value={form.cost_per_kilometer}
                handleChangeText={(e) => setForm({ ...form, cost_per_kilometer: e })}
                otherStyles="mt-3"
                placeholder="Enter cost per kilometer"
                keyboardType="numeric"
            />

            {errorMessage && <Text className="text-red-500 mt-2">{errorMessage}</Text>}

            <CustomButton
                title={isUpdating ? "Update Vehicle" : "Add Vehicle"}
                handlePress={submitVehicle}
                isLoading={isSubmitting}
                containerStyles="my-7"
            />
        </ScrollView>
    );
};

export default VehiclePage;
