import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import { useAuth } from '../contexts/AuthContext';

const CITIES = ['Raipur', 'Bhilai', 'Durg', 'Bilaspur', 'Korba', 'Rajnandgaon'];

export default function OnboardingScreen({ routeParams, onNavigate }) {
  const phone = routeParams?.phone || '9876543210';
  const { completeOnboarding } = useAuth();

  const [name, setName] = useState('');
  const [society, setSociety] = useState('Sunrise Apartments');
  const [flat, setFlat] = useState('B-402');
  const [city, setCity] = useState('Raipur');
  const [bio, setBio] = useState('');

  const handleJoin = () => {
    if (!name.trim()) return;
    completeOnboarding({
      name: name.trim(),
      phone,
      society: society.trim(),
      flat: flat.trim(),
      city,
      bio: bio.trim()
    });
    onNavigate('home');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <View style={styles.badge}>
            <Ionicons name="person-add" size={28} color={colors.primary} />
          </View>
          <Text style={styles.title}>Resident Profile</Text>
          <Text style={styles.subtitle}>Tell your neighbors a bit about yourself</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Full Name *</Text>
          <View style={styles.inputGroup}>
            <Ionicons name="person-outline" size={18} color={colors.textMuted} />
            <TextInput
              style={styles.input}
              placeholder="e.g. Aman Verma"
              placeholderTextColor={colors.textMuted}
              value={name}
              onChangeText={setName}
            />
          </View>

          <Text style={styles.label}>Apartment / Society Name *</Text>
          <View style={styles.inputGroup}>
            <Ionicons name="business-outline" size={18} color={colors.textMuted} />
            <TextInput
              style={styles.input}
              placeholder="e.g. Sunrise Apartments"
              placeholderTextColor={colors.textMuted}
              value={society}
              onChangeText={setSociety}
            />
          </View>

          <Text style={styles.label}>Flat / Unit Number *</Text>
          <View style={styles.inputGroup}>
            <Ionicons name="key-outline" size={18} color={colors.textMuted} />
            <TextInput
              style={styles.input}
              placeholder="e.g. Flat B-402"
              placeholderTextColor={colors.textMuted}
              value={flat}
              onChangeText={setFlat}
            />
          </View>

          <Text style={styles.label}>City</Text>
          <View style={styles.cityChips}>
            {CITIES.map(c => (
              <TouchableOpacity
                key={c}
                style={[styles.cityChip, city === c && styles.cityChipActive]}
                onPress={() => setCity(c)}
              >
                <Text style={[styles.cityChipText, city === c && styles.cityChipTextActive]}>
                  {c}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Short Bio (Optional)</Text>
          <View style={[styles.inputGroup, styles.bioGroup]}>
            <TextInput
              style={[styles.input, styles.bioInput]}
              placeholder="e.g. Software engineer, passionate about gardening & community events"
              placeholderTextColor={colors.textMuted}
              multiline
              numberOfLines={3}
              value={bio}
              onChangeText={setBio}
            />
          </View>

          <TouchableOpacity
            style={[styles.btn, !name.trim() && styles.btnDisabled]}
            activeOpacity={0.8}
            onPress={handleJoin}
            disabled={!name.trim()}
          >
            <Text style={styles.btnText}>Join My Neighborhood</Text>
            <Ionicons name="checkmark-done" size={20} color={colors.white} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scroll: {
    padding: 24,
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  badge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.dark,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 8,
    marginTop: 12,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: colors.bg,
    gap: 8,
  },
  bioGroup: {
    alignItems: 'flex-start',
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.dark,
  },
  bioInput: {
    height: 60,
    textAlignVertical: 'top',
  },
  cityChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 6,
  },
  cityChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  cityChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  cityChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  cityChipTextActive: {
    color: colors.white,
  },
  btn: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 14,
    marginTop: 24,
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
});
