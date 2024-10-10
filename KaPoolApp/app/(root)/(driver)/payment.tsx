import { View, Text, FlatList, Image, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { API_URL } from '@/lib/utils'; // Ensure this points to your API
import { useUserStore } from '@/store';
import PaymentCard from '@/components/PaymentCard'; // Import the PaymentCard component
import { images } from '@/constants'; // Adjust image imports as needed

const Payment = () => {
    const { user } = useUserStore();
    const [payments, setPayments] = useState([]); // Renamed for clarity
    const [loading, setLoading] = useState(false);

    const filteredPayment = payments.filter((payment) => payment.ride_id.driver_id === user._id);

    useEffect(() => {
        const fetchPayments = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${API_URL}/payments`); // Adjust endpoint as necessary
                setPayments(response.data);
            } catch (error) {
                console.error('Error fetching payments:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPayments();
    }, [user._id]); // Fetch payments when user ID changes

    return (
        <SafeAreaView className="bg-general-500 flex-1">
            <FlatList
                data={filteredPayment}
                renderItem={({ item }) => <PaymentCard payment={item} />}
                keyExtractor={(item) => item.transaction_id} // Use unique ID
                className="px-5"
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{
                    paddingBottom: 100,
                }}
                ListEmptyComponent={() => (
                    <View className="flex flex-col items-center justify-center">
                        {!loading ? (
                            <>
                                <Image
                                    source={images.noResult} // Ensure this image exists
                                    className="w-40 h-40"
                                    resizeMode="contain"
                                />
                                <Text className="text-sm">No payments found</Text>
                            </>
                        ) : (
                            <ActivityIndicator size="small" color="#000" />
                        )}
                    </View>
                )}
            />
        </SafeAreaView>
    );
}

export default Payment;
