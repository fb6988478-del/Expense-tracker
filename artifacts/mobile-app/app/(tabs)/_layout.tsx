import React from 'react';
import { Platform, StyleSheet, useColorScheme, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { Feather } from '@expo/vector-icons';
import { isLiquidGlassAvailable } from 'expo-glass-effect';
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { Tabs } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useColors } from '@/hooks/useColors';

function NativeTabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Icon sf={{ default: 'house', selected: 'house.fill' }} />
        <NativeTabs.Trigger.Label>হোম</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="budgets">
        <NativeTabs.Trigger.Icon sf={{ default: 'chart.pie', selected: 'chart.pie.fill' }} />
        <NativeTabs.Trigger.Label>বাজেট</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="insights">
        <NativeTabs.Trigger.Icon sf={{ default: 'sparkles', selected: 'sparkles' }} />
        <NativeTabs.Trigger.Label>অনুপ্রেরণা</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Icon sf={{ default: 'person', selected: 'person.fill' }} />
        <NativeTabs.Trigger.Label>আমার</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

export default function TabsLayout() {
  const colors = useColors();
  const scheme = useColorScheme();
  const isIOS = Platform.OS === 'ios';
  const isWeb = Platform.OS === 'web';
  if (isLiquidGlassAvailable()) return <NativeTabLayout />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
        tabBarLabelStyle: { fontFamily: 'Inter_600SemiBold', fontSize: 10 },
        tabBarStyle: {
          backgroundColor: isIOS ? 'transparent' : colors.card,
          borderTopColor: colors.border,
          borderTopWidth: isWeb ? 1 : 0,
          elevation: 0,
          height: isWeb ? 84 : 68,
          paddingTop: 7,
        },
        tabBarBackground: () =>
          isIOS ? (
            <BlurView intensity={90} tint={scheme === 'dark' ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
          ) : (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.card }]} />
          ),
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'হোম', tabBarIcon: ({ color }) => isIOS ? <SymbolView name="house" tintColor={color} size={22} /> : <Feather name="home" size={20} color={color} /> }} />
      <Tabs.Screen name="budgets" options={{ title: 'বাজেট', tabBarIcon: ({ color }) => isIOS ? <SymbolView name="chart.pie" tintColor={color} size={22} /> : <Feather name="pie-chart" size={20} color={color} /> }} />
      <Tabs.Screen name="insights" options={{ title: 'অনুপ্রেরণা', tabBarIcon: ({ color }) => isIOS ? <SymbolView name="sparkles" tintColor={color} size={22} /> : <Feather name="sun" size={20} color={color} /> }} />
      <Tabs.Screen name="profile" options={{ title: 'আমার', tabBarIcon: ({ color }) => isIOS ? <SymbolView name="person" tintColor={color} size={22} /> : <Feather name="user" size={20} color={color} /> }} />
    </Tabs>
  );
}