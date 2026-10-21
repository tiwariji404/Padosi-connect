import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import { useAuth } from '../contexts/AuthContext';

export default function LoginScreen({ onNavigate }) {
  const [phone, setPhone] = useState('9876543210');
  const { loginWithPhone } = useAuth();

  const handleGetOTP = () => {
    if (phone.length >= 10) {
      loginWithPhone(phone);
      onNavigate('otp', { phone });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.headerArea}>
          <View style={styles.logoBadge}>
            <Ionicons name="home" size={40} color={colors.white} />
          </View>
          <Text style={styles.appName}>PadosiConnect</Text>
          <Text style={styles.tagline}>Apne Padosiyon Se Judey, Surakshit Rahein</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>Welcome Resident!</Text>
          <Text style={styles.subtitle}>Enter your phone number to login or sign up</Text>

          <View style={styles.inputWrapper}>
            <View style={styles.countryCode}>
              <Text style={styles.flag}>🇮🇳</Text>
              <Text style={styles.codeText}>+91</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="10-digit mobile number"
              placeholderTextColor={colors.textMuted}
              keyboardType="phone-pad"
              maxLength={10}
              value={phone}
              onChangeText={(text) => setPhone(text.replace(/[^0-9]/g, ''))}
            />
          </View>

          <TouchableOpacity
            style={[styles.btn, phone.length < 10 && styles.btnDisabled]}
            activeOpacity={0.8}
            onPress={handleGetOTP}
            disabled={phone.length < 10}
          >
            <Text style={styles.btnText}>Get OTP Code</Text>
            <Ionicons name="arrow-forward" size={18} color={colors.white} />
          </TouchableOpacity>

          <View style={styles.demoHint}>
            <Ionicons name="bulb-outline" size={16} color={colors.primary} />
            <Text style={styles.demoText}>
              Demo test: Any 10 digits works (OTP: 0000 or any 4 digits)
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.termsText}>
            By continuing, you agree to PadosiConnect Terms of Service and Privacy Policy.
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  headerArea: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoBadge: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  appName: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.dark,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.dark,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 14,
    backgroundColor: colors.bg,
    overflow: 'hidden',
    marginBottom: 18,
  },
  countryCode: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRightWidth: 1,
    borderRightColor: colors.border,
    backgroundColor: '#F1F5F9',
    gap: 4,
  },
  flag: {
    fontSize: 16,
  },
  codeText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.dark,
  },
  input: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.dark,
    fontWeight: '600',
  },
  btn: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 14,
    gap: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  btnDisabled: {
    opacity: 0.5,
  },
  btnText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
  demoHint: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    padding: 10,
    borderRadius: 10,
    marginTop: 16,
    gap: 8,
  },
  demoText: {
    fontSize: 12,
    color: colors.primaryDark,
    fontWeight: '500',
    flex: 1,
  },
  footer: {
    marginTop: 32,
    alignItems: 'center',
  },
  termsText: {
    fontSize: 11,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 16,
  },
});
