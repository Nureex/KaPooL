import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { icons } from '@/constants'
import { router, usePathname } from 'expo-router'

const SearchInput = ({ initialQuery, placeholder, params }:any) => {
    const pathname = usePathname();
    const [query, setQuery] = useState(initialQuery || '');

    return (
        <View className="border-2 border-black-200 w-full h-16 px-4 bg-black-100 rounded-2xl items-center focus:border-secondary flex-row space-x-4">
            <TextInput
                className="flex-1 text-white mt-0.5 font-pregular text-base"
                value={query}
                placeholder={placeholder || 'Search for a video topic'}
                placeholderTextColor="#cdcdE0"
                onChangeText={(e: string) => setQuery(e)}
            />

            <TouchableOpacity
                onPress={() => {
                    if (!query) {
                        return Alert.alert('Missing query', 'Please input something to search results across the database');
                    }

                    if (pathname.startsWith('/search')) {
                        router.setParams({ query, params });
                    } else {
                        router.push(`/search/${query}?params=${params}`);
                    }
                }}
            >
                <Image source={icons.search} className="w-5 h-5" resizeMode="contain" />
            </TouchableOpacity>
        </View>
    );
};
export default SearchInput