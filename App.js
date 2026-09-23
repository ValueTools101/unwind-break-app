import React, { useCallback, useEffect, useState } from 'react';
import { BackHandler } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import HomeScreen from './src/screens/HomeScreen';
import BreatheScreen from './src/screens/BreatheScreen';
import GamesHomeScreen from './src/screens/games/GamesHomeScreen';
import BubblePopScreen from './src/screens/games/BubblePopScreen';
import SlidingPuzzleScreen from './src/screens/games/SlidingPuzzleScreen';
import MemoryMatchScreen from './src/screens/games/MemoryMatchScreen';
import VentScreen from './src/screens/VentScreen';
import ShopHomeScreen from './src/screens/shop/ShopHomeScreen';
import ShopCategoryScreen from './src/screens/shop/ShopCategoryScreen';
import CartScreen from './src/screens/shop/CartScreen';
import LaughScreen from './src/screens/LaughScreen';
import AboutScreen from './src/screens/AboutScreen';
import LoginScreen from './src/screens/auth/LoginScreen';
import SignUpScreen from './src/screens/auth/SignUpScreen';
import ForgotPasswordScreen from './src/screens/auth/ForgotPasswordScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const SCREENS = {
  home: HomeScreen,
  breathe: BreatheScreen,
  games: GamesHomeScreen,
  bubblePop: BubblePopScreen,
  slidingPuzzle: SlidingPuzzleScreen,
  memoryMatch: MemoryMatchScreen,
  vent: VentScreen,
  shop: ShopHomeScreen,
  shopCategory: ShopCategoryScreen,
  cart: CartScreen,
  laugh: LaughScreen,
  about: AboutScreen,
  login: LoginScreen,
  signup: SignUpScreen,
  forgotPassword: ForgotPasswordScreen,
  profile: ProfileScreen,
};

function Navigator() {
  const [stack, setStack] = useState([{ name: 'home' }]);

  const push = useCallback((name, params) => {
    setStack((s) => [...s, { name, params }]);
  }, []);

  const pop = useCallback(() => {
    setStack((s) => (s.length > 1 ? s.slice(0, -1) : s));
  }, []);

  const replace = useCallback((name, params) => {
    setStack((s) => [...s.slice(0, -1), { name, params }]);
  }, []);

  const resetTo = useCallback((name, params) => {
    setStack([{ name, params }]);
  }, []);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (stack.length > 1) {
        pop();
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, [stack.length, pop]);

  const current = stack[stack.length - 1];
  const Screen = SCREENS[current.name] || HomeScreen;

  return (
    <Screen
      params={current.params}
      onNavigate={push}
      onBack={pop}
      onReplace={replace}
      onResetTo={resetTo}
    />
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar style="dark" />
        <Navigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
