import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Linking, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import { useAppData } from '../contexts/AppDataContext';

export default function SOSAlertModal() {
  const { sosActive, dismissSOS } = useAppData();

  if (!sosActive) return null;

  const handleCallSecurity = () => {
    // Direct call protocol
    const phoneUrl = `tel:100`;
    if (Platform.OS !== 'web') {
      Linking.openURL(phoneUrl).catch(() => {});
    } else {
      alert('Dialing Emergency Security: 100 / 112');
    }
  };

  const handleCallResident = () => {
    const phoneUrl = `tel:${sosActive.phone || '9876543210'}`;
    if (Platform.OS !== 'web') {
      Linking.openURL(phoneUrl).catch(() => {});
    } else {
      alert(`Calling ${sosActive.senderName}: ${sosActive.phone || '9876543210'}`);
    }
  };

  return (
    <Modal
      transparent
      animationType="fade"
      visible={!!sosActive}
      onRequestClose={dismissSOS}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.sirenCircle}>
            <Ionicons name="warning" size={44} color={colors.white} />
          </View>

          <Text style={styles.title}>EMERGENCY SOS ALERT!</Text>
          <Text style={styles.subtitle}>
            A neighbor has pressed the panic emergency button.
          </Text>

          <View style={styles.residentBox}>
            <View style={styles.residentAvatar}>
              <Text style={styles.avatarText}>
                {sosActive.senderName?.charAt(0) || 'U'}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.residentName}>{sosActive.senderName}</Text>
              <Text style={styles.residentLocation}>
                Flat: {sosActive.flat || 'B-Block'} • {sosActive.society}
              </Text>
              <Text style={styles.timeTag}>Triggered Just Now</Text>
            </View>
          </View>

          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={[styles.btn, styles.btnSecurity]}
              activeOpacity={0.8}
              onPress={handleCallSecurity}
            >
              <Ionicons name="call" size={18} color={colors.white} />
              <Text style={styles.btnTextWhite}>Call Society Guard / 112</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, styles.btnResident]}
              activeOpacity={0.8}
              onPress={handleCallResident}
            >
              <Ionicons name="person" size={18} color={colors.danger} />
              <Text style={styles.btnTextDanger}>Call Resident Direct</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.btnDismiss}
              activeOpacity={0.7}
              onPress={dismissSOS}
            >
              <Text style={styles.btnTextDismiss}>I have responded / Dismiss</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 420,
    alignItems: 'center',
    borderTopWidth: 8,
    borderTopColor: colors.danger,
    shadowColor: colors.danger,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  sirenCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.danger,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -40,
    marginBottom: 16,
    borderWidth: 4,
    borderColor: colors.white,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.danger,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 18,
  },
  residentBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dangerLight,
    padding: 14,
    borderRadius: 14,
    width: '100%',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  residentAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.danger,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 18,
  },
  residentName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.dark,
  },
  residentLocation: {
    fontSize: 13,
    color: colors.dangerDark,
    marginTop: 2,
    fontWeight: '500',
  },
  timeTag: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  actionsContainer: {
    width: '100%',
    gap: 10,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    borderRadius: 12,
    gap: 8,
  },
  btnSecurity: {
    backgroundColor: colors.danger,
  },
  btnResident: {
    backgroundColor: colors.dangerLight,
    borderWidth: 1,
    borderColor: colors.danger,
  },
  btnTextWhite: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 14,
  },
  btnTextDanger: {
    color: colors.danger,
    fontWeight: '700',
    fontSize: 14,
  },
  btnDismiss: {
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 4,
  },
  btnTextDismiss: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '500',
  },
});
