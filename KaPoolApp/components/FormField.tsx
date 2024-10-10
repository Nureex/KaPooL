import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import { icons } from '@/constants'

const FormField = ({title, value, placeholder, handleChangeText, otherStyles, ...props}: any) => {
    const [showPassword, setShowPassword] = useState(false)
    return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-gray-800 font-pmedium">{title}</Text>

      <View className="border-2 border-gray-200 w-full h-[58px] px-4 bg-[#E1E1E1] rounded-2xl items-center focus:border-primary flex-row">
        <TextInput
            className="flex-1 text-gray-800 font-psemibold text-base"
            value={value}
            placeholder={placeholder}
            placeholderTextColor="#7b7b8b"
            onChangeText={handleChangeText}
            secureTextEntry={title === 'Password' && !showPassword}
        />

        {title === 'Password' && (
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Image source={!showPassword ? icons.eyecross : icons.lock } className="w-6 h-6" resizeMode='contain' />
            </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

export default FormField