import { Stack } from "expo-router";

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen name="(user)/ride" options={{ headerShown: false }} />  
      <Stack.Screen name="(user)/review" options={{ headerShown: false }} />  
      <Stack.Screen name="(user)/payment" options={{ headerTitle: 'My Payment' }} />  
      <Stack.Screen name="(driver)" options={{ headerShown: false }} />  
    </Stack>
  );
};

export default Layout;
