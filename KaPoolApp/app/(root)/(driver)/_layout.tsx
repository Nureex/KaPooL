import { Stack } from "expo-router";

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />   
      <Stack.Screen name="confirm-ride" options={{ headerShown: false }} />   
      <Stack.Screen name="track-ride" options={{ headerShown: false }} />   
      <Stack.Screen name="payment" options={{ headerTitle: 'My Payment' }} />  
      <Stack.Screen name="ride" options={{ headerTitle: 'My Rides' }} />  
      <Stack.Screen name="review" options={{ headerTitle: 'My Reviews' }} />  
      <Stack.Screen name="vehicle" options={{ headerTitle: 'My Vehicle' }} />  
    </Stack>
  );
};

export default Layout;
