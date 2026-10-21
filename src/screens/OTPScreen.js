import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import { useAuth } from '../contexts/AuthContext';

export default function OTPScreen({ routeParams, onNavigate }) {
  const phone = routeParams?.phone || '9876543210';
  const [digits, setDigits] = useState(['', '', '', '']);
  const { verifyOTP } = useAuth();
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  const handleChange = (index, value) => {
    const clean = value.replace(/[^0-9]/g, '');
    const newDigits = [...digits];
    newDigits[index] = clean ? clean[clean.length - 1] : '';
    setDigits(newDigits);

    if (clean && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyPress = (index, e) => {
    if (e.nativeEvent.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleVerify = () => {
    const otpCode = digits.join('');
    const result = verifyOTP(phone, otpCode);
    if (result.isNewUser) {
      onNavigate('onboarding', { phone });
    } else {
      onNavigate('home');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => onNavigate('login')}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={20} color={colors.dark} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <Ionicons name="shield-checkmark" size={32} color={colors.primary} />
          </View>

          <Text style={styles.title}>Enter 4-Digit OTP</Text>
          <Text style={styles.subtitle}>
            Code sent to <Text style={styles.boldPhone}>+91 {phone}</Text>
          </Text>

          <View style={styles.otpRow}>
            {digits.map((digit, i) => (
              <TextInput
                key={i}
                ref={inputRefs[i]}
                style={[
                  styles.otpInput,
                  digit ? styles.otpInputFilled : null,
                ]}
                keyboardType="numeric"
                maxLength={1}
                value={digit}
                onChangeText={(val) => handleChange(i, val)}
                onKeyPress={(e) => handleKeyPress(i, e)}
                textAlign="center"
              />
            ))}
          </View>

          <TouchableOpacity
            style={[styles.btn, digits.some(d => !d) && styles.btnDisabled]}
            activeOpacity={0.8}
            onPress={handleVerify}
            disabled={digits.some(d => !d)}
          >
            <Text style={styles.btnText}>Verify & Continue</Text>
            <Ionicons name="checkmark-circle" size={18} color={colors.white} />
          </TouchableOpacity>

          <View style={styles.resendRow}>
            <Text style={styles.resendPrompt}>Didn't receive code? </Text>
            <TouchableOpacity onPress={() => setDigits(['0', '0', '0', '0'])}>
              <Text style={styles.resendLink}>Auto-fill 0000</Text>
            </TouchableOpacity>
          </View>
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
    padding: 24,
    justifyContent: 'center',
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  backText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.dark,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.dark,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 6,
    marginBottom: 24,
    textAlign: 'center',
  },
  boldPhone: {
    fontWeight: '700',
    color: colors.dark,
  },
  otpRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  otpInput: {
    width: 56,
    height: 56,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.bg,
    fontSize: 22,
    fontWeight: '700',
    color: colors.dark,
  },
  otpInputFilled: {
    borderColor: colors.primary,
    backgroundColor: colors.white,
  },
  btn: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 14,
    width: '100%',
    gap: 8,
  },
  btnDisabled: {
    opacity: 0.5,
  },
  btnText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  resendPrompt: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  resendLink: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
});
