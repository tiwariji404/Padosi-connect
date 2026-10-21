import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, SafeAreaView, Platform, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import { useAuth } from '../contexts/AuthContext';
import { useAppData } from '../contexts/AppDataContext';

export default function BloodDirectoryScreen({ onNavigate }) {
  const { user } = useAuth();
  const { donors, addNotification } = useAppData();

  const [selectedGroup, setSelectedGroup] = useState('All');
  const [search, setSearch] = useState('');
  const [broadcastSent, setBroadcastSent] = useState(false);

  const bloodGroups = ['All', 'O+', 'A+', 'B+', 'AB+', 'O-', 'B-', 'AB-'];

  const filteredDonors = donors.filter(d => {
    const matchesGroup = selectedGroup === 'All' || d.group === selectedGroup;
    const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.flat.toLowerCase().includes(search.toLowerCase()) ||
      d.group.toLowerCase().includes(search.toLowerCase());
    return matchesGroup && matchesSearch;
  });

  const handleUrgentRequest = () => {
    setBroadcastSent(true);
    addNotification({
      type: 'blood',
      text: `🚨 URGENT: Blood donor requested for resident in ${user?.society} (Flat: ${user?.flat || 'B-402'})`
    });

    if (Platform.OS === 'web') {
      alert(`Urgent Blood Request broadcasted to all ${user?.society} residents!`);
    } else {
      Alert.alert('Broadcast Sent', `Urgent Blood Alert broadcasted to all ${user?.society} residents!`);
    }

    setTimeout(() => setBroadcastSent(false), 4000);
  };

  const handleCallDonor = (donor) => {
    if (Platform.OS === 'web') {
      alert(`Calling ${donor.name} (${donor.group}) at +91 ${donor.phone}`);
    } else {
      Linking.openURL(`tel:${donor.phone}`).catch(() => {
        Alert.alert('Direct Call', `Calling ${donor.name}: +91 ${donor.phone}`);
      });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => onNavigate('home')}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={22} color={colors.white} />
          </TouchableOpacity>
          <View style={{ flex: 1, marginLeft: 8 }}>
            <Text style={styles.title}>Blood Directory</Text>
            <Text style={styles.subtitle}>
              Emergency resident blood donors • {user?.society || 'Sunrise Apartments'}
            </Text>
          </View>
        </View>

        {/* Urgent Broadcast Card */}
        <View style={styles.urgentCard}>
          <View style={styles.urgentRow}>
            <View style={styles.urgentIconBox}>
              <Ionicons name="alert-circle" size={28} color="#E11D48" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.urgentTitle}>Need Blood in Emergency?</Text>
              <Text style={styles.urgentSub}>
                Send an immediate SOS broadcast to all voluntary donors in our society
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.urgentBtn, broadcastSent && styles.urgentBtnSent]}
            activeOpacity={0.85}
            onPress={handleUrgentRequest}
          >
            <Ionicons
              name={broadcastSent ? 'checkmark-circle' : 'megaphone'}
              size={18}
              color={colors.white}
            />
            <Text style={styles.urgentBtnText}>
              {broadcastSent ? 'Broadcast Sent to Society!' : 'Request Urgent Blood Broadcast'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Filter Blood Groups */}
        <Text style={styles.sectionTitle}>Filter by Blood Group</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.groupScroll}>
          <View style={styles.groupRow}>
            {bloodGroups.map(bg => (
              <TouchableOpacity
                key={bg}
                style={[styles.groupChip, selectedGroup === bg && styles.groupChipActive]}
                onPress={() => setSelectedGroup(bg)}
              >
                <Text style={[styles.groupText, selectedGroup === bg && styles.groupTextActive]}>
                  {bg}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Search */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search donor by name, flat or group..."
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Donors List */}
        <View style={styles.listSection}>
          <Text style={styles.donorsCountText}>
            {filteredDonors.length} Donors Registered
          </Text>

          {filteredDonors.map(donor => (
            <View key={donor.id} style={styles.donorCard}>
              <View style={styles.groupCircle}>
                <Text style={styles.groupCircleText}>{donor.group}</Text>
              </View>

              <View style={styles.donorInfo}>
                <Text style={styles.donorName}>{donor.name}</Text>
                <Text style={styles.donorFlat}>Flat: {donor.flat}</Text>
                <View style={styles.availabilityRow}>
                  <View style={[styles.statusDot, { backgroundColor: donor.available ? colors.primary : colors.textMuted }]} />
                  <Text style={[styles.availabilityText, { color: donor.available ? colors.primaryDark : colors.textMuted }]}>
                    {donor.available ? 'Available to Donate' : `Donated (${donor.lastDonated})`}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={[styles.callBtn, !donor.available && styles.callBtnDisabled]}
                activeOpacity={0.8}
                onPress={() => handleCallDonor(donor)}
              >
                <Ionicons name="call" size={18} color={donor.available ? colors.primaryDark : colors.textMuted} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF1F2',
  },
  scroll: {
    padding: 16,
    paddingBottom: 40,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E11D48',
    padding: 16,
    borderRadius: 18,
    marginBottom: 16,
  },
  backBtn: {
    padding: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.white,
  },
  subtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 2,
  },
  urgentCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  urgentRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  urgentIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFE4E6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  urgentTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#E11D48',
  },
  urgentSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  urgentBtn: {
    backgroundColor: '#E11D48',
    borderRadius: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  urgentBtnSent: {
    backgroundColor: colors.primary,
  },
  urgentBtnText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 13,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.dark,
    marginBottom: 8,
  },
  groupScroll: {
    marginBottom: 14,
  },
  groupRow: {
    flexDirection: 'row',
    gap: 8,
  },
  groupChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  groupChipActive: {
    backgroundColor: '#E11D48',
    borderColor: '#E11D48',
  },
  groupText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#E11D48',
  },
  groupTextActive: {
    color: colors.white,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FECDD3',
    marginBottom: 16,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 13,
    color: colors.dark,
  },
  listSection: {
    gap: 10,
  },
  donorsCountText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
    marginBottom: 4,
  },
  donorCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FECDD3',
    gap: 12,
  },
  groupCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFE4E6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FDA4AF',
  },
  groupCircleText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#E11D48',
  },
  donorInfo: {
    flex: 1,
  },
  donorName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.dark,
  },
  donorFlat: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  availabilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  availabilityText: {
    fontSize: 11,
    fontWeight: '600',
  },
  callBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  callBtnDisabled: {
    backgroundColor: '#F1F5F9',
  },
});
