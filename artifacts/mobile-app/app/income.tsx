import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareScrollViewCompat } from '@/components/KeyboardAwareScrollViewCompat';
import { formatMoney, useAmarHisab } from '@/context/AmarHisabContext';
import { useColors } from '@/hooks/useColors';

const SOURCES = [
  { id: 'salary' as const, title: 'মাসিক salary', subtitle: 'চাকরি / মূল আয়', icon: 'briefcase-outline' },
  { id: 'passive' as const, title: 'Passive income', subtitle: 'ফ্রিল্যান্স, ভাড়া, মুনাফা', icon: 'sparkles-outline' },
  { id: 'business' as const, title: 'ব্যবসার আয়', subtitle: 'বিক্রয় / কমিশন', icon: 'storefront-outline' },
  { id: 'other' as const, title: 'অন্যান্য', subtitle: 'উপহার / এককালীন', icon: 'gift-outline' },
];

export default function IncomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { profile, addIncome } = useAmarHisab();
  const [amount, setAmount] = useState('');
  const [source, setSource] = useState<(typeof SOURCES)[number]['id']>('salary');
  const [note, setNote] = useState('');
  const parsedAmount = Number(amount.replace(/,/g, ''));
  const sourceInfo = SOURCES.find((item) => item.id === source) ?? SOURCES[0];

  const save = () => {
    if (!parsedAmount) return;
    addIncome({ amount: parsedAmount, source: sourceInfo.title, sourceType: source, note: note.trim() });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
    router.back();
  };

  return (
    <KeyboardAwareScrollViewCompat style={{ backgroundColor: colors.background }} contentContainerStyle={[styles.content, { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 24 }]} bottomOffset={70} keyboardShouldPersistTaps="handled">
      <View style={styles.topbar}><Pressable onPress={() => router.back()} hitSlop={10} accessibilityLabel="ফিরে যান"><Ionicons name="arrow-back" size={24} color={colors.foreground} /></Pressable><Text style={[styles.topTitle, { color: colors.foreground }]}>আয় যোগ করুন</Text><View style={{ width: 24 }} /></View>
      <View style={styles.hero}><View style={[styles.heroIcon, { backgroundColor: colors.accent }]}><Ionicons name="trending-up-outline" size={25} color={colors.primary} /></View><Text style={[styles.title, { color: colors.foreground }]}>আয় মানে নতুন সম্ভাবনা</Text><Text style={[styles.subtitle, { color: colors.mutedForeground }]}>ছোট-বড় সব income লিখে রাখুন। নিজের পরিশ্রমটাকে দেখতে ভালো লাগবে।</Text></View>
      <View style={[styles.amountBox, { backgroundColor: colors.card, borderColor: colors.border }]}><Text style={[styles.label, { color: colors.mutedForeground }]}>পরিমাণ ({profile.currency})</Text><View style={styles.amountRow}><Text style={[styles.currency, { color: colors.primary }]}>{formatMoney(0, profile.currency).slice(0, 1)}</Text><TextInput value={amount} onChangeText={(value) => setAmount(value.replace(/[^0-9.,]/g, ''))} placeholder="0" placeholderTextColor={colors.border} keyboardType="decimal-pad" style={[styles.amountInput, { color: colors.foreground }]} autoFocus testID="income-amount" /></View></View>
      <Text style={[styles.sectionTitle, { color: colors.foreground }]}>আয়টি কোথা থেকে?</Text>
      <View style={styles.sourceList}>{SOURCES.map((item) => { const selected = source === item.id; return <Pressable key={item.id} onPress={() => setSource(item.id)} style={({ pressed }) => [styles.sourceCard, { backgroundColor: selected ? colors.accent : colors.card, borderColor: selected ? colors.primary : colors.border }, pressed && styles.pressed]}><View style={[styles.sourceIcon, { backgroundColor: selected ? colors.primary : colors.muted }]}><Ionicons name={item.icon as keyof typeof Ionicons.glyphMap} size={20} color={selected ? colors.primaryForeground : colors.primary} /></View><View style={styles.sourceCopy}><Text style={[styles.sourceTitle, { color: colors.foreground }]}>{item.title}</Text><Text style={[styles.sourceSubtitle, { color: colors.mutedForeground }]}>{item.subtitle}</Text></View><Ionicons name={selected ? 'checkmark-circle' : 'ellipse-outline'} size={22} color={selected ? colors.primary : colors.border} /></Pressable>; })}</View>
      <Text style={[styles.sectionTitle, { color: colors.foreground }]}>একটু note রাখবেন?</Text>
      <TextInput value={note} onChangeText={setNote} placeholder="যেমন: মার্চ মাসের salary" placeholderTextColor={colors.mutedForeground} style={[styles.noteInput, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]} />
      <Pressable onPress={save} disabled={!parsedAmount} style={({ pressed }) => [styles.saveButton, { backgroundColor: parsedAmount ? colors.primary : colors.muted }, pressed && styles.pressed]}><Ionicons name="checkmark-circle-outline" size={20} color={parsedAmount ? colors.primaryForeground : colors.mutedForeground} /><Text style={[styles.saveText, { color: parsedAmount ? colors.primaryForeground : colors.mutedForeground }]}>আয়টি রেখে দিন</Text></Pressable>
    </KeyboardAwareScrollViewCompat>
  );
}

const styles = StyleSheet.create({
  content: { gap: 15, paddingHorizontal: 20 }, topbar: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', minHeight: 40 }, topTitle: { fontFamily: 'Inter_700Bold', fontSize: 17 }, hero: { alignItems: 'center', gap: 8, marginBottom: 5, marginTop: 18 }, heroIcon: { alignItems: 'center', borderRadius: 18, height: 52, justifyContent: 'center', width: 52 }, title: { fontFamily: 'Inter_700Bold', fontSize: 26, letterSpacing: -0.6, textAlign: 'center' }, subtitle: { fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 20, textAlign: 'center' }, amountBox: { borderRadius: 19, borderWidth: 1, padding: 16 }, label: { fontFamily: 'Inter_500Medium', fontSize: 12 }, amountRow: { alignItems: 'center', flexDirection: 'row', marginTop: 4 }, currency: { fontFamily: 'Inter_700Bold', fontSize: 30 }, amountInput: { flex: 1, fontFamily: 'Inter_700Bold', fontSize: 34, height: 58, marginLeft: 5 }, sectionTitle: { fontFamily: 'Inter_700Bold', fontSize: 15, marginTop: 4 }, sourceList: { gap: 8 }, sourceCard: { alignItems: 'center', borderRadius: 17, borderWidth: 1, flexDirection: 'row', gap: 11, minHeight: 64, padding: 11 }, sourceIcon: { alignItems: 'center', borderRadius: 13, height: 41, justifyContent: 'center', width: 41 }, sourceCopy: { flex: 1, gap: 3 }, sourceTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 13 }, sourceSubtitle: { fontFamily: 'Inter_400Regular', fontSize: 11 }, noteInput: { borderRadius: 17, borderWidth: 1, fontFamily: 'Inter_400Regular', fontSize: 13, minHeight: 52, paddingHorizontal: 14 }, saveButton: { alignItems: 'center', borderRadius: 17, flexDirection: 'row', gap: 8, justifyContent: 'center', minHeight: 53 }, saveText: { fontFamily: 'Inter_700Bold', fontSize: 14 }, pressed: { opacity: 0.72 },
});