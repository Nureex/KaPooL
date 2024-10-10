import { View, Text, ScrollView, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import FormField from '@/components/FormField'
import CustomButton from '@/components/CustomButton'
import { Link, router } from 'expo-router'
import axios from 'axios'
import { useUserStore } from '@/store'
import { API_URL } from '@/lib/utils'

const SignIn = () => {
  const { setUser } = useUserStore(); // Use the updated useUserStore
  const [form, setForm] = useState({
    email: '',
    password: '',
  })
  const [errorMessage, setErrorMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const submit = async () => {
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email: form.email,
        password: form.password,
      });
  
      const userData = response.data;
      console.log(userData)
      if (userData.status === 'success') {
        if (userData.user.user_type === 'user') {
          setUser(userData.user); // Persist user data
          router.replace('/(root)/(user)/ride/find-ride');
        } else if (userData.user.user_type === 'driver') {
          setUser(userData.user); // Persist user data
          router.replace('/(root)/(driver)');
        } else {
          Alert.alert('Error', 'Unknown user type.');
        }
      } else {
        setErrorMessage(userData.message);
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'An error occurred during login.');
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <SafeAreaView className="h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[83vh] px-4 my-6">
          <Image
            source={require('../../assets/images/logo.png')}
            className="w-[115px] h-[35px]"
            resizeMode="contain"
          />

          <Text className="text-2xl text-gray-800 text-semibold mt-10 font-semibold">Log in to KaPool</Text>

          <FormField 
            title="Email"
            value={form.email}
            handleChangeText={(e:any) => setForm({ ...form, email: e})}
            otherStyles="mt-7"
            keyboardType="email-address"
          />

          <FormField 
            title="Password"
            value={form.password}
            handleChangeText={(e:any) => setForm({ ...form, password: e})}
            otherStyles="mt-7"
            keyboardType="text"
          />

          { errorMessage && (<Text className='text-red-500 mt-3'>{errorMessage}</Text>)}

          <CustomButton
            title="Sign In"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

          

          <View className="justify-center flex-row pt-5">
            <Text className="text-lg text-gray-500 font-pregular">Don't have account? <Link href="/sign-up" className="text-primary font-psemibold">Sign up</Link></Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignIn