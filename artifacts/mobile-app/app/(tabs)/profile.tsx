import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CURRENCIES, USER_TYPES, useAmarHisab } from '@/context/AmarHisabContext';
import { useColors } from '@/hooks/useColors';

const REMINDERS: { id: 'morning' | 'lunch' | 'evening' | 'streak' | 'monthEnd'; icon: keyof typeof Ionicons.glyphMap; title: string; subtitle: string }[] = [
  { id: 'morning', icon: 'sunny-outline', title: 'সকালের gentle reminder', subtitle: 'আজকের জন্য একটু প্রস্তুতি' },
  { id: 'lunch', icon: 'restaurant-outline', title: 'দুপুরের expense reminder', subtitle: 'ছোট খরচটাও যেন হারিয়ে না যায়' },
  { id: 'evening', icon: 'moon-outline', title: 'সন্ধ্যার daily summary', subtitle: 'দিনটা একবার ফিরে দেখা' },
  { id: 'streak', icon: 'flame-outline', title: 'Streak protection', subtitle: 'আপনার অভ্যাসটাকে পাশে রাখা' },
  { id: 'monthEnd', icon: 'calendar-outline', title: 'Month-end budget alert', subtitle: 'মাস শেষের আগে নরম একটা মনে করানো' },
];

export default function ProfileTab() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { profile, toggleNotification, setCurrency } = useAmarHisab();
  const [showCurrencies, setShowCurrencies] = useState(false);
  const typeInfo = USER_TYPES.find((item) => item.id === profile.userType);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 12), paddingBottom: insets.bottom + 28 }]} showsVerticalScrollIndicator={false}>
        <Text style={[styles.eyebrow, { color: colors.primary }]}>আপনার space</Text><Text style={[styles.title, { color: colors.foreground }]}>আমার হিসাব</Text>
        <View style={[styles.profileCard, { backgroundColor: colors.card, borderColor: colors.border }]}><View style={[styles.avatar, { backgroundColor: colors.accent }]}><Text style={[styles.avatarText, { color: colors.accentForeground }]}>{(profile.name || 'আ').slice(0, 1)}</Text></View><View style={styles.profileCopy}><Text style={[styles.profileName, { color: colors.foreground }]}>{profile.name || 'আমার বন্ধু'}</Text><Text style={[styles.profileType, { color: colors.mutedForeground }]}>{typeInfo?.title || 'আমার হিসাবের সঙ্গী'}</Text></View><Ionicons name="sparkles-outline" size={22} color={colors.primary} /></View>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>আমার পছন্দ</Text>
        <View style={[styles.settingsCard, { backgroundColor: colors.card, borderColor: colors.border }]}><Pressable onPress={() => setShowCurrencies((current) => !current)} style={styles.settingRow}><View style={[styles.settingIcon, { backgroundColor: colors.secondary }]}><Ionicons name="cash-outline" size={18} color={colors.primary} /></View><View style={styles.settingCopy}><Text style={[styles.settingTitle, { color: colors.foreground }]}>হিসাবের currency</Text><Text style={[styles.settingSubtitle, { color: colors.mutedForeground }]}>{CURRENCIES.find((item) => item.id === profile.currency)?.title}</Text></View><Text style={[styles.currentValue, { color: colors.primary }]}>{profile.currency}</Text></Pressable>{showCurrencies ? <View style={styles.currencyList}>{CURRENCIES.map((item) => <Pressable key={item.id} onPress={() => { setCurrency(item.id); setShowCurrencies(false); }} style={[styles.currencyOption, { backgroundColor: profile.currency === item.id ? colors.accent : colors.muted }]}><Text style={[styles.currencyOptionText, { color: colors.foreground }]}>{item.symbol}  {item.title}</Text>{profile.currency === item.id ? <Ionicons name="checkmark" size={17} color={colors.primary} /> : null}</Pressable>)}</View> : null}</View>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>নরম মনে করানো</Text>
        <View style={[styles.settingsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>{REMINDERS.map((reminder, index) => <View key={reminder.id} style={[styles.settingRow, index < REMINDERS.length - 1 && { borderBottomColor: colors.border, borderBottomWidth: 1 }]}><View style={[styles.settingIcon, { backgroundColor: colors.muted }]}><Ionicons name={reminder.icon} size={17} color={colors.primary} /></View><View style={styles.settingCopy}><Text style={[styles.settingTitle, { color: colors.foreground }]}>{reminder.title}</Text><Text style={[styles.settingSubtitle, { color: colors.mutedForeground }]}>{reminder.subtitle}</Text></View><Switch value={profile.notifications[reminder.id]} onValueChange={() => toggleNotification(reminder.id)} trackColor={{ false: colors.muted, true: colors.accent }} thumbColor={profile.notifications[reminder.id] ? colors.primary : colors.mutedForeground} /></View>)}</View>
        <View style={[styles.supportCard, { backgroundColor: colors.accent }]}><Ionicons name="heart-circle-outline" size={23} color={colors.accentForeground} /><View style={styles.supportCopy}><Text style={[styles.supportTitle, { color: colors.foreground }]}>আপনি একা নন</Text><Text style={[styles.supportText, { color: colors.accentForeground }]}>কখনো হিসাব মিস হলে নিজেকে দোষ দেবেন না। আবার আজ থেকেই শুরু করা যায়।</Text></View></View>
        <Pressable onPress={() => Alert.alert('Amar Hisab', 'আপনার হিসাব, আপনার গতিতে। এই app-টি শুরুতে সম্পূর্ণ free।')} style={[styles.aboutButton, { borderColor: colors.border }]}><Ionicons name="information-circle-outline" size={18} color={colors.primary} /><Text style={[styles.aboutText, { color: colors.foreground }]}>আমার হিসাব সম্পর্কে</Text><Ionicons name="chevron-forward" size={17} color={colors.mutedForeground} /></Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 }, content: { gap: 16, paddingHorizontal: 20 }, eyebrow: { fontFamily: 'Inter_700Bold', fontSize: 11, letterSpacing: 1.1, textTransform: 'uppercase' }, title: { fontFamily: 'Inter_700Bold', fontSize: 28, letterSpacing: -0.8, marginTop: 3 }, profileCard: { alignItems: 'center', borderRadius: 21, borderWidth: 1, flexDirection: 'row', gap: 12, padding: 15 }, avatar: { alignItems: 'center', borderRadius: 25, height: 50, justifyContent: 'center', width: 50 }, avatarText: { fontFamily: 'Inter_700Bold', fontSize: 21 }, profileCopy: { flex: 1, gap: 4 }, profileName: { fontFamily: 'Inter_700Bold', fontSize: 16 }, profileType: { fontFamily: 'Inter_400Regular', fontSize: 11 }, sectionTitle: { fontFamily: 'Inter_700Bold', fontSize: 16, marginTop: 3 }, settingsCard: { borderRadius: 19, borderWidth: 1, overflow: 'hidden' }, settingRow: { alignItems: 'center', flexDirection: 'row', gap: 11, minHeight: 68, paddingHorizontal: 13 }, settingIcon: { alignItems: 'center', borderRadius: 12, height: 36, justifyContent: 'center', width: 36 }, settingCopy: { flex: 1, gap: 3 }, settingTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 12 }, settingSubtitle: { fontFamily: 'Inter_400Regular', fontSize: 10 }, currentValue: { fontFamily: 'Inter_700Bold', fontSize: 12 }, currencyList: { gap: 6, padding: 10, paddingTop: 0 }, currencyOption: { alignItems: 'center', borderRadius: 12, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 10 }, currencyOptionText: { fontFamily: 'Inter_500Medium', fontSize: 11 }, supportCard: { alignItems: 'flex-start', borderRadius: 19, flexDirection: 'row', gap: 10, padding: 16 }, supportCopy: { flex: 1, gap: 5 }, supportTitle: { fontFamily: 'Inter_700Bold', fontSize: 13 }, supportText: { fontFamily: 'Inter_400Regular', fontSize: 11, lineHeight: 17 }, aboutButton: { alignItems: 'center', borderRadius: 16, borderWidth: 1, flexDirection: 'row', gap: 9, minHeight: 48, paddingHorizontal: 13 }, aboutText: { flex: 1, fontFamily: 'Inter_600SemiBold', fontSize: 12 },
});