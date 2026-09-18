import { Redirect } from 'expo-router';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useAmarHisab } from '@/context/AmarHisabContext';
import { useColors } from '@/hooks/useColors';

export default function EntryRoute() {
  const colors = useColors();
  const { profile, isHydrated } = useAmarHisab();
  if (!isHydrated) {
    return (
      <View style={{ alignItems: 'center', backgroundColor: colors.background, flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }
  return <Redirect href={profile.onboarded ? '/(tabs)' : '/onboarding'} />;
}