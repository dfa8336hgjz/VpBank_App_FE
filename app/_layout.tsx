import { useColorScheme } from '@/hooks/useColorScheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { Provider } from 'react-redux';
import { getBalanceApi, getJarInfoApi } from '../services/api';
import { store } from '../store';
import { updateBalances, updateJarPercentagesFromApi } from '../store/jarSlice';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const router = useRouter()
  useEffect(() => {
    async function checkToken() {
      const token = await AsyncStorage.getItem('accessToken')
      if (token) {
        try {
          const jarInfo = await getJarInfoApi()
          if (jarInfo && jarInfo.code === 1000 && !jarInfo.result) {
            router.replace('/survey')
          } else if (jarInfo && jarInfo.code === 1000 && jarInfo.result) {
            const percentages = jarInfo.result
            store.dispatch(updateJarPercentagesFromApi({
              necessitiesPercentage: percentages.necessitiesPercentage,
              educationPercentage: percentages.educationPercentage,
              entertainmentPercentage: percentages.entertainmentPercentage,
              savingsPercentage: percentages.savingsPercentage,
              investmentPercentage: percentages.investmentPercentage,
              givingPercentage: percentages.givingPercentage
            }))
            
            try {
              const balanceData = await getBalanceApi()
              if (balanceData && balanceData.result) {
                const balance = balanceData.result
                store.dispatch(updateBalances({
                  necessitiesBalance: balance.necessitiesBalance || 0,
                  educationBalance: balance.educationBalance || 0,
                  entertainmentBalance: balance.entertainmentBalance || 0,
                  savingsBalance: balance.savingsBalance || 0,
                  investmentBalance: balance.investmentBalance || 0,
                  givingBalance: balance.givingBalance || 0,
                  totalBalance: balance.totalBalance || 0
                }))
              }
            } catch (balanceError) {
              console.error('Failed to fetch balance:', balanceError)
            }
            
            router.replace('/(tabs)')
          } else {
            router.replace('/(tabs)')
          }
        } catch (e) {
          router.replace('/(tabs)')
        }
      } else {
        router.replace('/login')
      }
    }
    checkToken()
  }, [])
  if (!loaded) {
    return null;
  }
  return (
    <Provider store={store}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack initialRouteName="login">
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="register" options={{ headerShown: false }} />
          <Stack.Screen name="transfer-new" options={{ headerShown: false }} />
          <Stack.Screen name="transfer-confirm" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </Provider>
  );
}
