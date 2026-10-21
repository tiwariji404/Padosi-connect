import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, SafeAreaView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import { useAuth } from '../contexts/AuthContext';
import { useAppData } from '../contexts/AppDataContext';

export default function ServicesScreen() {
  const { user } = useAuth();
  const { services, addNotification } = useAppData();

  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedService, setSelectedService] = useState(null);
  const [requestConfirmed, setRequestConfirmed] = useState(false);

  const categories = ['All', 'Repairs', 'Security', 'Home', 'Amenities', 'Payments'];

  const filteredServices = services.filter(s => {
    const matchesCategory = activeCategory === 'All' || s.category === activeCategory;
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.desc.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleBookService = () => {
    if (!selectedService) return;
    setRequestConfirmed(true);
    addNotification({
      type: 'service',
      text: `Request booked for ${selectedService.name} (Flat: ${user?.flat || 'B-402'})`
    });

    setTimeout(() => {
      setRequestConfirmed(false);
      setSelectedService(null);
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Society Services</Text>
          <Text style={styles.subtitle}>
            Verified amenities, maintenance & repairs for {user?.society || 'Sunrise Apartments'}
          </Text>
        </View>

        {/* Maintenance Status Banner */}
        <View style={styles.statusBanner}>
          <View style={styles.statusIcon}>
            <Ionicons name="card" size={24} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.statusTitle}>Monthly Maintenance Due</Text>
            <Text style={styles.statusSub}>Flat {user?.flat || 'B-402'} • ₹2,400 for October</Text>
          </View>
          <TouchableOpacity
            style={styles.payBtn}
            activeOpacity={0.8}
            onPress={() => setSelectedService(services.find(s => s.id === 's1'))}
          >
            <Text style={styles.payBtnText}>Pay Now</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search plumber, electrician, passes..."
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Category Pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
          <View style={styles.categoriesRow}>
            {categories.map(c => (
              <TouchableOpacity
                key={c}
                style={[styles.categoryChip, activeCategory === c && styles.categoryChipActive]}
                onPress={() => setActiveCategory(c)}
              >
                <Text style={[styles.categoryText, activeCategory === c && styles.categoryTextActive]}>
                  {c}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Services Grid */}
        <View style={styles.grid}>
          {filteredServices.map(service => (
            <TouchableOpacity
              key={service.id}
              style={styles.card}
              activeOpacity={0.75}
              onPress={() => setSelectedService(service)}
            >
              <View style={[styles.cardIconBox, { backgroundColor: service.bg }]}>
                <Ionicons name={service.icon} size={28} color={service.color} />
              </View>
              <Text style={styles.cardTitle}>{service.name}</Text>
              <Text style={styles.cardCategory}>{service.category}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Service Booking Modal */}
      <Modal
        visible={!!selectedService}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedService(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            {selectedService && (
              <>
                <View style={styles.modalHeader}>
                  <View style={[styles.cardIconBox, { backgroundColor: selectedService.bg, width: 44, height: 44 }]}>
                    <Ionicons name={selectedService.icon} size={24} color={selectedService.color} />
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.modalTitle}>{selectedService.name}</Text>
                    <Text style={styles.modalCategory}>{selectedService.category}</Text>
                  </View>
                  <TouchableOpacity onPress={() => setSelectedService(null)}>
                    <Ionicons name="close" size={24} color={colors.dark} />
                  </TouchableOpacity>
                </View>

                <Text style={styles.modalDesc}>{selectedService.desc}</Text>

                <View style={styles.bookingDetails}>
                  <View style={styles.detailRow}>
                    <Ionicons name="home-outline" size={16} color={colors.textSecondary} />
                    <Text style={styles.detailText}>
                      Service Unit: Flat {user?.flat || 'B-402'}, {user?.society}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Ionicons name="person-outline" size={16} color={colors.textSecondary} />
                    <Text style={styles.detailText}>
                      Resident: {user?.name} (+91 {user?.phone || '9876543210'})
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
                    <Text style={styles.detailText}>
                      Slot: Today (Earliest Available Resident Desk)
                    </Text>
                  </View>
                </View>

                {requestConfirmed ? (
                  <View style={styles.successBox}>
                    <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
                    <Text style={styles.successText}>Request Confirmed! Society desk notified.</Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={[styles.bookBtn, { backgroundColor: selectedService.color }]}
                    activeOpacity={0.8}
                    onPress={handleBookService}
                  >
                    <Ionicons name="checkmark-done" size={20} color={colors.white} />
                    <Text style={styles.bookBtnText}>Confirm Service Request</Text>
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scroll: {
    padding: 16,
    paddingBottom: 40,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.dark,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    padding: 14,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.primaryMuted,
    gap: 12,
  },
  statusIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  statusSub: {
    fontSize: 12,
    color: colors.primaryDark,
    opacity: 0.8,
    marginTop: 1,
  },
  payBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  payBtnText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 13,
    color: colors.dark,
  },
  categoriesScroll: {
    marginBottom: 16,
  },
  categoriesRow: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  categoryTextActive: {
    color: colors.white,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    width: '48%',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  cardIconBox: {
    width: 56,
    height: 56,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.dark,
    textAlign: 'center',
  },
  cardCategory: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 22,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.dark,
  },
  modalCategory: {
    fontSize: 12,
    color: colors.textMuted,
  },
  modalDesc: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  bookingDetails: {
    backgroundColor: colors.bg,
    padding: 14,
    borderRadius: 14,
    gap: 10,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 12,
    color: colors.dark,
    fontWeight: '500',
  },
  bookBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
  },
  bookBtnText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 15,
  },
  successBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
  },
  successText: {
    color: colors.primaryDark,
    fontWeight: '700',
    fontSize: 14,
  },
});
