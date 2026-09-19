import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AgraMascot } from '@/components/AgraMascot';
import { KeyboardAwareScrollViewCompat } from '@/components/KeyboardAwareScrollViewCompat';
import { CURRENCIES, USER_TYPES, CurrencyCode, UserType, useAmarHisab } from '@/context/AmarHisabContext';
import { useColors } from '@/hooks/useColors';

export default function OnboardingScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { completeOnboarding } = useAmarHisab();
  const [name, setName] = useState('');
  const [selectedType, setSelectedType] = useState<UserType | null>(null);
  const [currency, setCurrency] = useState<CurrencyCode>('BDT');

  const start = () => {
    if (!selectedType) return;
    completeOnboarding(name, selectedType, currency);
    router.replace('/(tabs)');
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <LinearGradient colors={[colors.background, colors.accent, colors.background]} locations={[0, 0.48, 1]} style={[StyleSheet.absoluteFill, styles.noPointer]} />
      <View style={[styles.artOrb, styles.noPointer, { backgroundColor: colors.secondary }]} />
      <KeyboardAwareScrollViewCompat
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 18, paddingBottom: insets.bottom + 28 }]}
        bottomOffset={28}
        keyboardShouldPersistTaps="handled"
      >
      <View style={styles.brandRow}>
        <View style={[styles.logo, { backgroundColor: colors.primary }]}>
          <Ionicons name="wallet-outline" size={25} color={colors.primaryForeground} />
        </View>
        <Text style={[styles.brand, { color: colors.foreground }]}>অগ্রহায়ণ</Text>
      </View>
      <View style={styles.heroRow}><View style={styles.hero}><Text style={[styles.kicker, { color: colors.primary }]}>আপনার নিজের টাকার সঙ্গী</Text><Text style={[styles.title, { color: colors.foreground }]}>হিসাব রাখুন,{'\n'}মনটা হালকা রাখুন।</Text><Text style={[styles.subtitle, { color: colors.mutedForeground }]}>কোথা থেকে শুরু করবেন, সেটা না জানলেও সমস্যা নেই। অগ্র ধীরে ধীরে একসাথে গুছিয়ে নেবে।</Text></View><AgraMascot size={82} mood="hello" /></View>

      <Text style={[styles.label, { color: colors.foreground }]}>আপনাকে কী নামে ডাকব?</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="আপনার নাম (ঐচ্ছিক)"
        placeholderTextColor={colors.mutedForeground}
        style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
        testID="onboarding-name"
      />

      <Text style={[styles.label, { color: colors.foreground }]}>আপনার জন্য কোনটা সবচেয়ে কাছের?</Text>
      <View style={styles.typeList}>
        {USER_TYPES.map((type) => {
          const selected = selectedType === type.id;
          return (
            <Pressable
              key={type.id}
              onPress={() => setSelectedType(type.id)}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              style={({ pressed }) => [
                styles.typeCard,
                { backgroundColor: selected ? colors.accent : colors.card, borderColor: selected ? colors.primary : colors.border },
                pressed && styles.pressed,
              ]}
            >
              <View style={[styles.typeIcon, { backgroundColor: selected ? colors.primary : colors.muted }]}>
                <Ionicons name={type.icon as keyof typeof Ionicons.glyphMap} size={20} color={selected ? colors.primaryForeground : colors.primary} />
              </View>
              <View style={styles.typeCopy}>
                <Text style={[styles.typeTitle, { color: colors.foreground }]}>{type.title}</Text>
                <Text style={[styles.typeSubtitle, { color: colors.mutedForeground }]}>{type.subtitle}</Text>
              </View>
              <Ionicons name={selected ? 'checkmark-circle' : 'ellipse-outline'} size={22} color={selected ? colors.primary : colors.border} />
            </Pressable>
          );
        })}
      </View>

      <Text style={[styles.label, { color: colors.foreground }]}>আপনার হিসাব কোন currency-তে?</Text>
      <View style={styles.currencyRow}>
        {CURRENCIES.slice(0, 4).map((item) => (
          <Pressable
            key={item.id}
            onPress={() => setCurrency(item.id)}
            style={[styles.currencyChip, { backgroundColor: currency === item.id ? colors.primary : colors.card, borderColor: currency === item.id ? colors.primary : colors.border }]}
          >
            <Text style={[styles.currencySymbol, { color: currency === item.id ? colors.primaryForeground : colors.primary }]}>{item.symbol}</Text>
            <Text style={[styles.currencyCode, { color: currency === item.id ? colors.primaryForeground : colors.foreground }]}>{item.id}</Text>
          </Pressable>
        ))}
      </View>

      <Pressable
        onPress={start}
        disabled={!selectedType}
        testID="onboarding-start"
        style={({ pressed }) => [styles.startButton, { backgroundColor: selectedType ? colors.primary : colors.muted }, pressed && styles.pressed]}
      >
        <Text style={[styles.startButtonText, { color: selectedType ? colors.primaryForeground : colors.mutedForeground }]}>চলুন শুরু করি</Text>
        <Ionicons name="arrow-forward" size={19} color={selectedType ? colors.primaryForeground : colors.mutedForeground} />
      </Pressable>
      <Text style={[styles.privacy, { color: colors.mutedForeground }]}>আপনার হিসাব আপনার কাছেই থাকবে। এখন কোনো account বা payment লাগবে না।</Text>
      </KeyboardAwareScrollViewCompat>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scroll: { backgroundColor: 'transparent' },
  noPointer: { pointerEvents: 'none' },
  content: { gap: 14, paddingHorizontal: 20 },
  artOrb: { borderRadius: 99, height: 170, opacity: 0.5, position: 'absolute', right: -65, top: 85, width: 170 },
  brandRow: { alignItems: 'center', flexDirection: 'row', gap: 10 },
  logo: { alignItems: 'center', borderRadius: 15, height: 44, justifyContent: 'center', width: 44 },
  brand: { fontFamily: 'Inter_700Bold', fontSize: 17 },
  heroRow: { alignItems: 'flex-end', gap: 4, marginBottom: 12, marginTop: 24 },
  hero: { flex: 1, gap: 10 },
  kicker: { fontFamily: 'Inter_700Bold', fontSize: 12, letterSpacing: 0.4 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 33, letterSpacing: -1, lineHeight: 39 },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 21 },
  label: { fontFamily: 'Inter_600SemiBold', fontSize: 14, marginTop: 8 },
  input: { borderRadius: 16, borderWidth: 1, fontFamily: 'Inter_400Regular', fontSize: 14, minHeight: 52, paddingHorizontal: 16 },
  typeList: { gap: 8 },
  typeCard: { alignItems: 'center', borderRadius: 18, borderWidth: 1, flexDirection: 'row', gap: 11, minHeight: 70, padding: 11 },
  typeIcon: { alignItems: 'center', borderRadius: 14, height: 43, justifyContent: 'center', width: 43 },
  typeCopy: { flex: 1, gap: 3 },
  typeTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 13 },
  typeSubtitle: { fontFamily: 'Inter_400Regular', fontSize: 11, lineHeight: 15 },
  currencyRow: { flexDirection: 'row', gap: 8 },
  currencyChip: { alignItems: 'center', borderRadius: 14, borderWidth: 1, flex: 1, gap: 2, paddingVertical: 9 },
  currencySymbol: { fontFamily: 'Inter_700Bold', fontSize: 15 },
  currencyCode: { fontFamily: 'Inter_600SemiBold', fontSize: 10 },
  startButton: { alignItems: 'center', borderRadius: 17, flexDirection: 'row', gap: 10, justifyContent: 'center', minHeight: 54, marginTop: 8 },
  startButtonText: { fontFamily: 'Inter_700Bold', fontSize: 15 },
  privacy: { fontFamily: 'Inter_400Regular', fontSize: 11, lineHeight: 16, textAlign: 'center' },
  pressed: { opacity: 0.72 },
});