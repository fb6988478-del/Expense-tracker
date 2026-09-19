import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareScrollViewCompat } from '@/components/KeyboardAwareScrollViewCompat';
import { AgraMascot } from '@/components/AgraMascot';
import { EXPENSE_CATEGORIES, OCCASION_SUBOPTIONS, formatMoney, useAmarHisab } from '@/context/AmarHisabContext';
import { useColors } from '@/hooks/useColors';

export default function AddExpenseScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { profile, addExpense } = useAmarHisab();
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('food');
  const [occasionOption, setOccasionOption] = useState<string>('');
  const [note, setNote] = useState('');
  const [wallet, setWallet] = useState<'personal' | 'business'>('personal');
  const categories = useMemo(() => {
    const visible = EXPENSE_CATEGORIES.filter((item) => (!item.audiences || item.audiences.includes(profile.userType ?? 'professional')) && (profile.userType === 'business' || item.wallet !== 'business'));
    return profile.userType === 'business' ? [...visible.filter((item) => item.wallet === 'business'), ...visible.filter((item) => item.wallet !== 'business')] : visible;
  }, [profile.userType]);
  const category = categories.find((item) => item.id === categoryId) ?? categories[0];
  const parsedAmount = Number(amount.replace(/,/g, ''));
  const isStudent = profile.userType === 'student';
  const isBusiness = profile.userType === 'business';

  const save = () => {
    if (!parsedAmount || !category) return;
    addExpense({ amount: parsedAmount, categoryId: category.id, categoryTitle: occasionOption ? `উপলক্ষ · ${occasionOption}` : category.title, subCategory: occasionOption || undefined, note: note.trim(), wallet: isBusiness ? wallet : 'personal' });
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
      <View style={styles.intro}><Text style={[styles.kicker, { color: colors.primary }]}>{isBusiness ? 'ব্যবসার হিসাব সহজ রাখুন' : isStudent ? 'স্টুডেন্টদের জন্য দ্রুত হিসাব' : 'একটু সময়, অনেক স্বস্তি'}</Text><Text style={[styles.title, { color: colors.foreground }]}>আজ কী জন্য খরচ হলো?</Text><Text style={[styles.subtitle, { color: colors.mutedForeground }]}>{isBusiness ? 'দোকান, স্টক আর ব্যক্তিগত খরচ—অগ্র এগুলো আলাদা করে রাখবে।' : isStudent ? 'ডাটা, কোর্স আর সাইড কাজের খরচও এক ট্যাপে লিখে রাখুন।' : 'নিখুঁত হতে হবে না—শুধু সত্যিটা লিখে রাখুন।'}</Text></View>
      <View style={styles.helperRow}><AgraMascot size={52} showName={false} mood="hello" /><Text style={[styles.helperText, { color: colors.mutedForeground }]}>{isBusiness ? 'অগ্র আগে ব্যবসার category দেখাচ্ছে, যাতে খুঁজতে সময় না লাগে।' : 'অগ্র আপনার খরচটা মনে রাখবে—আপনাকে শুধু পরিমাণটা লিখতে হবে।'}</Text></View>
      <View style={[styles.amountBox, { backgroundColor: colors.card, borderColor: colors.border }]}><Text style={[styles.amountLabel, { color: colors.mutedForeground }]}>পরিমাণ ({profile.currency})</Text><View style={styles.amountRow}><Text style={[styles.currency, { color: colors.primary }]}>{formatMoney(0, profile.currency).slice(0, 1)}</Text><TextInput value={amount} onChangeText={(value) => setAmount(value.replace(/[^0-9.,]/g, ''))} onSubmitEditing={save} placeholder="0" placeholderTextColor={colors.border} keyboardType="decimal-pad" returnKeyType="done" style={[styles.amountInput, { color: colors.foreground }]} autoFocus testID="expense-amount" /></View><View style={styles.quickAmounts}>{[100, 500, 1000, 5000].map((value) => <Pressable key={value} onPress={() => setAmount(String(value))} style={[styles.quickChip, { backgroundColor: colors.muted }]}><Text style={[styles.quickChipText, { color: colors.primary }]}>৳{value.toLocaleString('en-IN')}</Text></Pressable>)}</View></View>
      {profile.userType === 'business' ? <View style={[styles.walletRow, { backgroundColor: colors.card, borderColor: colors.border }]}><Text style={[styles.walletLabel, { color: colors.foreground }]}>হিসাবটি কোথায় রাখবেন?</Text><View style={styles.toggleRow}>{(['personal', 'business'] as const).map((item) => <Pressable key={item} onPress={() => setWallet(item)} style={[styles.toggle, { backgroundColor: wallet === item ? colors.primary : colors.muted }]}><Ionicons name={item === 'personal' ? 'person-outline' : 'storefront-outline'} size={15} color={wallet === item ? colors.primaryForeground : colors.mutedForeground} /><Text style={[styles.toggleText, { color: wallet === item ? colors.primaryForeground : colors.mutedForeground }]}>{item === 'personal' ? 'ব্যক্তিগত' : 'ব্যবসা'}</Text></Pressable>)}</View></View> : null}
      <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{isBusiness ? 'কোন ব্যবসার খাতে?' : 'কোন খাতে?'}</Text>
      <View style={styles.categoryGrid}>{categories.map((item) => { const selected = categoryId === item.id; return <Pressable key={item.id} onPress={() => setCategoryId(item.id)} style={({ pressed }) => [styles.category, { backgroundColor: selected ? colors.accent : colors.card, borderColor: selected ? colors.primary : colors.border }, pressed && styles.pressed]}><View style={[styles.categoryIcon, { backgroundColor: selected ? colors.primary : colors.muted }]}><Ionicons name={item.icon as keyof typeof Ionicons.glyphMap} size={19} color={selected ? colors.primaryForeground : colors.primary} /></View><Text style={[styles.categoryTitle, { color: colors.foreground }]}>{item.title}</Text><Text style={[styles.categorySub, { color: colors.mutedForeground }]}>{item.subtitle}</Text></Pressable>; })}</View>
      {category?.id === 'occasion' ? <View style={[styles.subOptionBox, { backgroundColor: colors.accent }]}><Text style={[styles.subOptionTitle, { color: colors.foreground }]}>উপলক্ষটি একটু পরিষ্কার করে বলুন</Text><View style={styles.subOptionGrid}>{OCCASION_SUBOPTIONS.map((item) => <Pressable key={item} onPress={() => setOccasionOption(item)} style={[styles.subOption, { backgroundColor: occasionOption === item ? colors.primary : colors.card, borderColor: occasionOption === item ? colors.primary : colors.border }]}><Text style={[styles.subOptionText, { color: occasionOption === item ? colors.primaryForeground : colors.foreground }]}>{item}</Text></Pressable>)}</View></View> : null}
      <Text style={[styles.sectionTitle, { color: colors.foreground }]}>মনে রাখার মতো কিছু? <Text style={{ color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }}>(ঐচ্ছিক)</Text></Text>
      <TextInput value={note} onChangeText={setNote} placeholder="যেমন: অফিস থেকে ফেরার পথে" placeholderTextColor={colors.mutedForeground} style={[styles.noteInput, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]} multiline numberOfLines={3} />
      <Pressable onPress={save} disabled={!parsedAmount || !category} testID="save-expense" style={({ pressed }) => [styles.saveButton, { backgroundColor: parsedAmount && category ? colors.primary : colors.muted }, pressed && styles.pressed]}><Ionicons name="checkmark-circle-outline" size={20} color={parsedAmount && category ? colors.primaryForeground : colors.mutedForeground} /><Text style={[styles.saveText, { color: parsedAmount && category ? colors.primaryForeground : colors.mutedForeground }]}>হিসাবটি রেখে দিন</Text></Pressable>
    </KeyboardAwareScrollViewCompat>
  );
}

const styles = StyleSheet.create({
  content: { gap: 15, paddingHorizontal: 20 }, topbar: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', minHeight: 40 }, topTitle: { fontFamily: 'Inter_700Bold', fontSize: 17 }, intro: { gap: 7, marginBottom: 1, marginTop: 20 }, kicker: { fontFamily: 'Inter_700Bold', fontSize: 11, letterSpacing: 0.4 }, title: { fontFamily: 'Inter_700Bold', fontSize: 27, letterSpacing: -0.7 }, subtitle: { fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 20 }, helperRow: { alignItems: 'center', backgroundColor: 'rgba(220,233,225,0.54)', borderRadius: 17, flexDirection: 'row', gap: 10, minHeight: 66, paddingHorizontal: 11 }, helperText: { flex: 1, fontFamily: 'Inter_500Medium', fontSize: 11, lineHeight: 17 }, amountBox: { borderRadius: 19, borderWidth: 1, padding: 16 }, amountLabel: { fontFamily: 'Inter_500Medium', fontSize: 12 }, amountRow: { alignItems: 'center', flexDirection: 'row', marginTop: 4 }, currency: { fontFamily: 'Inter_700Bold', fontSize: 30 }, amountInput: { flex: 1, fontFamily: 'Inter_700Bold', fontSize: 34, height: 58, marginLeft: 5 }, quickAmounts: { flexDirection: 'row', gap: 7, marginTop: 4 }, quickChip: { borderRadius: 10, flex: 1, paddingVertical: 8 }, quickChipText: { fontFamily: 'Inter_600SemiBold', fontSize: 10, textAlign: 'center' }, walletRow: { borderRadius: 17, borderWidth: 1, gap: 10, padding: 13 }, walletLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 12 }, toggleRow: { flexDirection: 'row', gap: 7 }, toggle: { alignItems: 'center', borderRadius: 12, flex: 1, flexDirection: 'row', gap: 6, justifyContent: 'center', paddingVertical: 9 }, toggleText: { fontFamily: 'Inter_600SemiBold', fontSize: 11 }, sectionTitle: { fontFamily: 'Inter_700Bold', fontSize: 15, marginTop: 4 }, categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 }, category: { borderRadius: 17, borderWidth: 1, minHeight: 93, padding: 10, width: '48%' }, categoryIcon: { alignItems: 'center', borderRadius: 10, height: 32, justifyContent: 'center', width: 32 }, categoryTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 12, marginTop: 8 }, categorySub: { fontFamily: 'Inter_400Regular', fontSize: 10, marginTop: 3 }, subOptionBox: { borderRadius: 17, gap: 10, padding: 13 }, subOptionTitle: { fontFamily: 'Inter_700Bold', fontSize: 12 }, subOptionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 }, subOption: { borderRadius: 11, borderWidth: 1, paddingHorizontal: 9, paddingVertical: 8 }, subOptionText: { fontFamily: 'Inter_500Medium', fontSize: 10 }, noteInput: { borderRadius: 17, borderWidth: 1, fontFamily: 'Inter_400Regular', fontSize: 13, minHeight: 78, padding: 14, textAlignVertical: 'top' }, saveButton: { alignItems: 'center', borderRadius: 17, flexDirection: 'row', gap: 8, justifyContent: 'center', minHeight: 53, marginTop: 3 }, saveText: { fontFamily: 'Inter_700Bold', fontSize: 14 }, pressed: { opacity: 0.72 },
});