import { useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { verifyOtp } from '../../src/services/auth.service';
import { getApiError } from '../../src/services/api';
import { useAuth } from '../../src/context/AuthContext';
import { theme } from '../../src/theme';

export default function VerifyOtpScreen() {
  const { clientId } = useLocalSearchParams<{ clientId: string }>();
  const [otp, setOtp] = useState('');
  const [busy, setBusy] = useState(false);
  const { completeLogin } = useAuth();

  async function submit() {
    if (!clientId) return Alert.alert('Missing client', 'Go back and register again.');
    if (!/^\d{4,8}$/.test(otp.trim())) return Alert.alert('Invalid OTP', 'Enter the OTP from your email.');
    setBusy(true);
    try {
      const result = await verifyOtp(clientId, otp);
      if (!result.success || !result.token || !result.user) return Alert.alert('Verification failed', result.message || 'Check the OTP and try again.');
      await completeLogin(result.token, result.user);
      router.replace('/(protected)/home');
    } catch (error) {
      Alert.alert('Verification failed', getApiError(error));
    } finally {
      setBusy(false);
    }
  }

  return <KeyboardAvoidingView style={styles.page} behavior={Platform.OS === 'ios' ? 'padding' : undefined}><View style={styles.content}>
    <View style={styles.icon}><Text style={styles.iconText}>✉</Text></View>
    <Text style={styles.title}>Check your email</Text>
    <Text style={styles.subtitle}>Enter the one-time password sent to your email address. It expires after five minutes.</Text>
    <Text style={styles.label}>One-time password</Text>
    <TextInput value={otp} onChangeText={setOtp} placeholder="Enter OTP" placeholderTextColor="#94A3B8" keyboardType="number-pad" maxLength={8} style={styles.input} autoFocus />
    <Pressable style={styles.button} onPress={submit} disabled={busy}>{busy ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Verify and continue</Text>}</Pressable>
    <Pressable onPress={() => router.back()} style={styles.back}><Text style={styles.backText}>Back to login</Text></Pressable>
  </View></KeyboardAvoidingView>;
}

const styles = StyleSheet.create({ page: { flex: 1, backgroundColor: theme.colors.background, justifyContent: 'center', padding: 24 }, content: { backgroundColor: '#fff', borderRadius: 24, padding: 24, borderWidth: 1, borderColor: theme.colors.border }, icon: { width: 54, height: 54, borderRadius: 17, backgroundColor: theme.colors.softGreen, alignItems: 'center', justifyContent: 'center', marginBottom: 20 }, iconText: { color: theme.colors.accent, fontSize: 26 }, title: { fontSize: 27, fontWeight: '800', color: theme.colors.primary }, subtitle: { fontSize: 14, lineHeight: 21, color: theme.colors.muted, marginTop: 9, marginBottom: 24 }, label: { color: theme.colors.text, fontSize: 13, fontWeight: '700', marginBottom: 8 }, input: { borderWidth: 1, borderColor: theme.colors.border, borderRadius: 13, padding: 15, fontSize: 20, letterSpacing: 5, color: theme.colors.text, textAlign: 'center' }, button: { backgroundColor: theme.colors.primary, borderRadius: 14, minHeight: 52, alignItems: 'center', justifyContent: 'center', marginTop: 16 }, buttonText: { color: '#fff', fontWeight: '800', fontSize: 15 }, back: { padding: 15, alignItems: 'center', marginTop: 4 }, backText: { color: theme.colors.muted, fontWeight: '700' } });
