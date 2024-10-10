import { Image, ScrollView, Text, View } from 'react-native'
import React from 'react'
import { Redirect, router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomButton from '@/components/CustomButton'
import { StatusBar } from 'expo-status-bar'
import { useUserStore } from '@/store'

const App = () => {
  // const { user } = useUserStore();
  const user = useUserStore((state) => state.user);
// console.log(user)
  if(user) 
  if (user.user_type === 'user') {
    return <Redirect href="/(root)/(user)/ride/find-ride" />
  } else if (user.user_type === 'driver') {
    return <Redirect href="/(root)/(driver)" />
  } 
  
  return (
    <SafeAreaView className="h-full">
      <ScrollView contentContainerStyle={{height: '100%'}}>
        <View className="w-full justify-center items-center min-h-[85vh] px-4">
          <Image
            source={require('../assets/images/logo.png')}
            className="w-[130px] h-[84px]"
            resizeMode="contain"
          />

          <Image
            source={require('../assets/images/card.png')}
            className="max-w-[480px] w-full h-[400px]"
            resizeMode="contain"
          />

          <View className="relative mt-5">
            <Text className="text-3xl text-gray-800 font-bold text-center">
              Discover Endless Possibilities with{' '} 
              <Text className="text-primary">KaPool</Text>
            </Text>
    
          </View>

          <Text className="text-sm font-pregular text-gray-500 text-center mt-7">Where creativity meets innovation: embark on a journey of limitless expiration with KaPool</Text>

          <CustomButton 
            title="Continue with Email"
            handlePress={() => router.push('/sign-in')}
            containerStyles="w-full mt-7"
          />

        </View>
      </ScrollView>

      <StatusBar backgroundColor='#161622' style='light' />
    </SafeAreaView>
  )
}

export default App