import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareScrollViewCompat } from '@/components/KeyboardAwareScrollViewCompat';
import { EXPENSE_CATEGORIES, formatMoney, useAmarHisab } from '@/context/AmarHisabContext';
import { useColors } from '@/hooks/useColors';

export default function AddExpenseScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { profile, addExpense } = useAmarHisab();
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('food');
  const [note, setNote] = useState('');
  const [wallet, setWallet] = useState<'personal' | 'business'>('personal');
  const categories = useMemo(() => EXPENSE_CATEGORIES.filter((item) => profile.userType === 'business' || item.wallet !== 'business'), [profile.userType]);
  const category = categories.find((item) => item.id === categoryId) ?? categories[0];
  const parsedAmount = Number(amount.replace(/,/g, ''));

  const save = () => {
    if (!parsedAmount || !category) return;
    addExpense({ amount: parsedAmount, categoryId: category.id, categoryTitle: category.title, note: note.trim(), wallet: profile.userType === 'business' ? wallet : 'personal' });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
    router.back();
  };

  return (
    <KeyboardAwareScrollViewCompat
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 22 }]}
      bottomOffset={75}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.topbar}><Pressable onPress={() => router.back()} hitSlop={10} accessibilityLabel="ফিরে যান"><Ionicons name="arrow-back" size={24} color={colors.foreground} /></Pressable><Text style={[styles.topTitle, { color: colors.foreground }]}>খরচ যোগ করুন</Text><View style={{ width: 24 }} /></View>
      <View style={styles.intro}><Text style={[styles.kicker, { color: colors.primary }]}>একটু সময়, অনেক স্বস্তি</Text><Text style={[styles.title, { color: colors.foreground }]}>আজ কী জন্য খরচ হলো?</Text><Text style={[styles.subtitle, { color: colors.mutedForeground }]}>নিখুঁত হতে হবে না—শুধু সত্যিটা লিখে রাখুন।</Text></View>
      <View style={[styles.amountBox, { backgroundColor: colors.card, borderColor: colors.border }]}><Text style={[styles.amountLabel, { color: colors.mutedForeground }]}>পরিমাণ ({profile.currency})</Text><View style={styles.amountRow}><Text style={[styles.currency, { color: colors.primary }]}>{formatMoney(0, profile.currency).slice(0, 1)}</Text><TextInput value={amount} onChangeText={(value) => setAmount(value.replace(/[^0-9.,]/g, ''))} placeholder="0" placeholderTextColor={colors.border} keyboardType="decimal-pad" style={[styles.amountInput, { color: colors.foreground }]} autoFocus testID="expense-amount" /></View></View>
      {profile.userType === 'business' ? <View style={[styles.walletRow, { backgroundColor: colors.card, borderColor: colors.border }]}><Text style={[styles.walletLabel, { color: colors.foreground }]}>হিসাবটি কোথায় রাখবেন?</Text><View style={styles.toggleRow}>{(['personal', 'business'] as const).map((item) => <Pressable key={item} onPress={() => setWallet(item)} style={[styles.toggle, { backgroundColor: wallet === item ? colors.primary : colors.muted }]}><Ionicons name={item === 'personal' ? 'person-outline' : 'storefront-outline'} size={15} color={wallet === item ? colors.primaryForeground : colors.mutedForeground} /><Text style={[styles.toggleText, { color: wallet === item ? colors.primaryForeground : colors.mutedForeground }]}>{item === 'personal' ? 'ব্যক্তিগত' : 'ব্যবসা'}</Text></Pressable>)}</View></View> : null}
      <Text style={[styles.sectionTitle, { color: colors.foreground }]}>কোন category?</Text>
      <View style={styles.categoryGrid}>{categories.map((item) => { const selected = categoryId === item.id; return <Pressable key={item.id} onPress={() => setCategoryId(item.id)} style={({ pressed }) => [styles.category, { backgroundColor: selected ? colors.accent : colors.card, borderColor: selected ? colors.primary : colors.border }, pressed && styles.pressed]}><View style={[styles.categoryIcon, { backgroundColor: selected ? colors.primary : colors.muted }]}><Ionicons name={item.icon as keyof typeof Ionicons.glyphMap} size={19} color={selected ? colors.primaryForeground : colors.primary} /></View><Text style={[styles.categoryTitle, { color: colors.foreground }]}>{item.title}</Text><Text style={[styles.categorySub, { color: colors.mutedForeground }]}>{item.subtitle}</Text></Pressable>; })}</View>
      <Text style={[styles.sectionTitle, { color: colors.foreground }]}>মনে রাখার মতো কিছু? <Text style={{ color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }}>(ঐচ্ছিক)</Text></Text>
      <TextInput value={note} onChangeText={setNote} placeholder="যেমন: অফিস থেকে ফেরার পথে" placeholderTextColor={colors.mutedForeground} style={[styles.noteInput, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]} multiline numberOfLines={3} />
      <Pressable onPress={save} disabled={!parsedAmount || !category} testID="save-expense" style={({ pressed }) => [styles.saveButton, { backgroundColor: parsedAmount && category ? colors.primary : colors.muted }, pressed && styles.pressed]}><Ionicons name="checkmark-circle-outline" size={20} color={parsedAmount && category ? colors.primaryForeground : colors.mutedForeground} /><Text style={[styles.saveText, { color: parsedAmount && category ? colors.primaryForeground : colors.mutedForeground }]}>হিসাবটি রেখে দিন</Text></Pressable>
    </KeyboardAwareScrollViewCompat>
  );
}

const styles = StyleSheet.create({
  content: { gap: 15, paddingHorizontal: 20 }, topbar: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', minHeight: 40 }, topTitle: { fontFamily: 'Inter_700Bold', fontSize: 17 }, intro: { gap: 7, marginBottom: 4, marginTop: 20 }, kicker: { fontFamily: 'Inter_700Bold', fontSize: 11, letterSpacing: 0.4 }, title: { fontFamily: 'Inter_700Bold', fontSize: 27, letterSpacing: -0.7 }, subtitle: { fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 20 }, amountBox: { borderRadius: 19, borderWidth: 1, padding: 16 }, amountLabel: { fontFamily: 'Inter_500Medium', fontSize: 12 }, amountRow: { alignItems: 'center', flexDirection: 'row', marginTop: 4 }, currency: { fontFamily: 'Inter_700Bold', fontSize: 30 }, amountInput: { flex: 1, fontFamily: 'Inter_700Bold', fontSize: 34, height: 58, marginLeft: 5 }, walletRow: { borderRadius: 17, borderWidth: 1, gap: 10, padding: 13 }, walletLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 12 }, toggleRow: { flexDirection: 'row', gap: 7 }, toggle: { alignItems: 'center', borderRadius: 12, flex: 1, flexDirection: 'row', gap: 6, justifyContent: 'center', paddingVertical: 9 }, toggleText: { fontFamily: 'Inter_600SemiBold', fontSize: 11 }, sectionTitle: { fontFamily: 'Inter_700Bold', fontSize: 15, marginTop: 4 }, categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 }, category: { borderRadius: 17, borderWidth: 1, minHeight: 93, padding: 10, width: '48%' }, categoryIcon: { alignItems: 'center', borderRadius: 10, height: 32, justifyContent: 'center', width: 32 }, categoryTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 12, marginTop: 8 }, categorySub: { fontFamily: 'Inter_400Regular', fontSize: 10, marginTop: 3 }, noteInput: { borderRadius: 17, borderWidth: 1, fontFamily: 'Inter_400Regular', fontSize: 13, minHeight: 78, padding: 14, textAlignVertical: 'top' }, saveButton: { alignItems: 'center', borderRadius: 17, flexDirection: 'row', gap: 8, justifyContent: 'center', minHeight: 53, marginTop: 3 }, saveText: { fontFamily: 'Inter_700Bold', fontSize: 14 }, pressed: { opacity: 0.72 },
});