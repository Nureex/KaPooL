import { View, Text, FlatList, Image, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { API_URL } from '@/lib/utils'; // Make sure this points to your API
import { useUserStore } from '@/store';
import ReviewCard from '@/components/ReviewCard'; // Import the ReviewCard component
import { images } from '@/constants'; // Adjust image imports as needed

const Review = () => {
    const { user } = useUserStore();
    const [reviews, setReviews] = useState([]); // Renamed for clarity
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchReviews = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${API_URL}/reviews/${user._id}/driver`);
                setReviews(response.data);
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching reviews:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [user._id]); // Fetch reviews when user ID changes

    return (
        <SafeAreaView className="bg-general-500 flex-1">
            <FlatList
                data={reviews}
                renderItem={({ item }) => <ReviewCard review={item} />}
                keyExtractor={(item, index) => index.toString()}
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
                                <Text className="text-sm">No reviews found</Text>
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

export default Review;
