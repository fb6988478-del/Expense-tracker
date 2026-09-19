import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SmartMessage } from '@/context/AmarHisabContext';
import { useColors } from '@/hooks/useColors';

type MascotMood = SmartMessage['mood'];

export function AgraMascot({
  size = 88,
  mood = 'happy',
  showName = true,
}: {
  size?: number;
  mood?: MascotMood;
  showName?: boolean;
}) {
  const colors = useColors();
  const scale = size / 88;
  const expression = mood === 'thinking' ? 'help-circle-outline' : mood === 'celebrate' ? 'sparkles-outline' : 'happy-outline';

  return (
    <View accessible accessibilityLabel="অগ্র" style={{ alignItems: 'center', height: size * 1.18, width: size }}>
      <View style={[styles.sparkle, { right: size * 0.03, top: size * 0.08, transform: [{ scale }], backgroundColor: colors.secondary }]}>
        <Ionicons name="sparkles" size={12 * scale} color={colors.primary} />
      </View>
      <View style={[styles.head, { backgroundColor: colors.primary, borderColor: colors.primaryDeep, height: size * 0.62, left: size * 0.08, top: size * 0.08, width: size * 0.84 }]}>
        <View style={[styles.ear, { backgroundColor: colors.primaryDeep, height: size * 0.18, left: size * 0.1, top: -size * 0.07, width: size * 0.18 }]} />
        <View style={[styles.ear, { backgroundColor: colors.primaryDeep, height: size * 0.18, right: size * 0.1, top: -size * 0.07, width: size * 0.18 }]} />
        <View style={styles.eyeRow}>
          <View style={[styles.eye, { height: size * 0.14, width: size * 0.14 }]}><View style={[styles.pupil, { height: size * 0.055, width: size * 0.055 }]} /></View>
          <View style={[styles.eye, { height: size * 0.14, width: size * 0.14 }]}><View style={[styles.pupil, { height: size * 0.055, width: size * 0.055 }]} /></View>
        </View>
        <View style={[styles.beak, { backgroundColor: colors.secondary, height: size * 0.09, width: size * 0.2 }]} />
        <Ionicons name={expression} size={size * 0.18} color={colors.primaryForeground} style={styles.expression} />
      </View>
      <View style={[styles.body, { backgroundColor: colors.accent, borderColor: colors.accentForeground, height: size * 0.55, left: size * 0.2, width: size * 0.6 }]}>
        <View style={[styles.belly, { backgroundColor: colors.card, height: size * 0.25, width: size * 0.32 }]} />
        <Ionicons name="leaf" size={size * 0.22} color={colors.accentForeground} style={styles.leaf} />
      </View>
      <View style={[styles.foot, { backgroundColor: colors.secondary, left: size * 0.25, width: size * 0.18 }]} />
      <View style={[styles.foot, { backgroundColor: colors.secondary, right: size * 0.25, width: size * 0.18 }]} />
      {showName ? <Text style={[styles.name, { color: colors.primaryDeep }]}>অগ্র</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  head: { alignItems: 'center', borderRadius: 99, borderWidth: 2, justifyContent: 'center', position: 'absolute', zIndex: 2 },
  ear: { borderRadius: 99, position: 'absolute' },
  eyeRow: { flexDirection: 'row', gap: 14 },
  eye: { alignItems: 'center', backgroundColor: '#FFFDF8', borderRadius: 99, justifyContent: 'center' },
  pupil: { backgroundColor: '#25332D', borderRadius: 99 },
  beak: { borderRadius: 99, marginTop: 4, transform: [{ rotate: '8deg' }] },
  expression: { bottom: 5, position: 'absolute', right: 5 },
  body: { alignItems: 'center', borderRadius: 99, borderWidth: 1, bottom: 17, justifyContent: 'center', position: 'absolute' },
  belly: { borderRadius: 99, opacity: 0.78 },
  leaf: { bottom: 6, position: 'absolute', right: -7, transform: [{ rotate: '26deg' }] },
  foot: { borderRadius: 99, bottom: 11, height: 7, position: 'absolute' },
  sparkle: { alignItems: 'center', borderRadius: 99, height: 24, justifyContent: 'center', position: 'absolute', width: 24, zIndex: 4 },
  name: { bottom: 0, fontFamily: 'Inter_700Bold', fontSize: 11, position: 'absolute' },
});