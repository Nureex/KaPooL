import { View, Text, FlatList, Image, ActivityIndicator, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { API_URL } from '@/lib/utils';
import { useUserStore } from '@/store';
import RideCard from '@/components/RideCard';
import { images } from '@/constants';

const MyRide = () => {
    const { user } = useUserStore();
    const [recentRides, setRecentRides] = useState([]);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        const fetchRides = async () => {
            setLoading(true)
          try {
            const response = await axios.get(`${API_URL}/users/${user._id}/rides`); // Adjust endpoint as necessary
            setRecentRides(response.data);
          } catch (error) {
            console.error('Error fetching rides:', error);
          } finally {
            setLoading(false)
          }
        };

        fetchRides()
      
      }, [recentRides]); // Depend on ride so it updates when ride changes

    return (
        <SafeAreaView className="bg-general-500 flex-1">
          <FlatList
            data={recentRides}
            renderItem={({ item }) => <RideCard ride={item} />}
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
                      source={images.noResult}
                      className="w-40 h-40"
                      alt="No recent rides found"
                      resizeMode="contain"
                    />
                    <Text className="text-sm">No recent rides found</Text>
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

export default MyRide