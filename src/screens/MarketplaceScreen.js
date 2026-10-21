import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, SafeAreaView, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import { useAuth } from '../contexts/AuthContext';
import { useAppData } from '../contexts/AppDataContext';

export default function MarketplaceScreen({ onNavigate }) {
  const { user } = useAuth();
  const { marketplaceItems, addMarketplaceItem } = useAppData();

  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState('Borrow');
  const [newPrice, setNewPrice] = useState('Free / Borrow');

  const filteredItems = marketplaceItems.filter(item => {
    const matchesTab = activeTab === 'All' || item.type === activeTab;
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.owner.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handlePostItem = () => {
    if (!newTitle.trim()) return;
    addMarketplaceItem({
      title: newTitle.trim(),
      type: newType,
      owner: `${user?.name || 'Resident'} (${user?.flat || 'B-402'})`,
      price: newPrice.trim() || (newType === 'Borrow' ? 'Free / Borrow' : '₹500')
    });
    setNewTitle('');
    setShowModal(false);
  };

  const handleContactOwner = (item) => {
    if (Platform.OS === 'web') {
      alert(`Chatting with ${item.owner} about "${item.title}"`);
    } else {
      Alert.alert('Contact Neighbor', `Send message to ${item.owner} for ${item.title}?`, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Chat Now', onPress: () => onNavigate('chat') }
      ]);
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
            <Ionicons name="arrow-back" size={22} color={colors.dark} />
          </TouchableOpacity>
          <View style={{ flex: 1, marginLeft: 8 }}>
            <Text style={styles.title}>Padosi Market</Text>
            <Text style={styles.subtitle}>
              Buy, sell & borrow items in {user?.society || 'Sunrise Apartments'}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.addBtn}
            activeOpacity={0.8}
            onPress={() => setShowModal(true)}
          >
            <Ionicons name="add" size={20} color={colors.white} />
            <Text style={styles.addBtnText}>List Item</Text>
          </TouchableOpacity>
        </View>

        {/* Tab Switcher */}
        <View style={styles.tabBar}>
          {['All', 'Borrow', 'Sell'].map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tabItem, activeTab === tab && styles.tabItemActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab === 'All' ? 'All Items' : tab === 'Borrow' ? '🤝 For Borrowing' : '🏷️ For Sale'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Search */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search drill, bicycle, books, table..."
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Grid of Items */}
        <View style={styles.grid}>
          {filteredItems.map(item => (
            <View key={item.id} style={styles.card}>
              <View style={[styles.itemPreviewBox, { backgroundColor: item.bg }]}>
                <Ionicons
                  name={item.type === 'Borrow' ? 'hand-right-outline' : 'pricetag-outline'}
                  size={36}
                  color={item.tagColor}
                />
                <View style={[styles.typeBadge, { backgroundColor: item.tagColor }]}>
                  <Text style={styles.typeBadgeText}>{item.type}</Text>
                </View>
              </View>

              <View style={styles.cardContent}>
                <Text style={styles.itemTitle} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.itemOwner}>{item.owner}</Text>

                <View style={styles.priceRow}>
                  <Text style={styles.priceText}>{item.price}</Text>
                  <TouchableOpacity
                    style={styles.contactBtn}
                    activeOpacity={0.7}
                    onPress={() => handleContactOwner(item)}
                  >
                    <Ionicons name="chatbubble-ellipses-outline" size={14} color={colors.primary} />
                    <Text style={styles.contactBtnText}>Ask</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* List Item Modal */}
      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>List an Item</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Ionicons name="close" size={24} color={colors.dark} />
              </TouchableOpacity>
            </View>

            <View style={styles.typeRow}>
              <TouchableOpacity
                style={[styles.typeSelectBtn, newType === 'Borrow' && styles.typeSelectActive]}
                onPress={() => { setNewType('Borrow'); setNewPrice('Free / Borrow'); }}
              >
                <Text style={[styles.typeSelectText, newType === 'Borrow' && styles.typeSelectTextActive]}>
                  🤝 Lend / Borrow
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.typeSelectBtn, newType === 'Sell' && styles.typeSelectActive]}
                onPress={() => { setNewType('Sell'); setNewPrice('₹500'); }}
              >
                <Text style={[styles.typeSelectText, newType === 'Sell' && styles.typeSelectTextActive]}>
                  🏷️ Sell to Neighbor
                </Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.modalInput}
              placeholder="What are you sharing? (e.g. Ironing board, vacuum cleaner, books...)"
              placeholderTextColor={colors.textMuted}
              value={newTitle}
              onChangeText={setNewTitle}
            />

            <TextInput
              style={styles.modalInput}
              placeholder={newType === 'Borrow' ? "Borrow conditions (e.g. Free for 2 days)" : "Expected price (e.g. ₹1,200)"}
              placeholderTextColor={colors.textMuted}
              value={newPrice}
              onChangeText={setNewPrice}
            />

            <TouchableOpacity
              style={[styles.submitBtn, !newTitle.trim() && { opacity: 0.5 }]}
              activeOpacity={0.8}
              onPress={handlePostItem}
              disabled={!newTitle.trim()}
            >
              <Text style={styles.submitBtnText}>Publish to Society Market</Text>
            </TouchableOpacity>
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backBtn: {
    padding: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.dark,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 1,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 4,
  },
  addBtnText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 12,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 12,
    padding: 3,
    marginBottom: 14,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabItemActive: {
    backgroundColor: colors.white,
    elevation: 2,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.dark,
    fontWeight: '700',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 13,
    color: colors.dark,
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
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  itemPreviewBox: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  typeBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  typeBadgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  cardContent: {
    padding: 12,
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.dark,
    lineHeight: 18,
    height: 36,
  },
  itemOwner: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 4,
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: 8,
  },
  priceText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  contactBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  contactBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primaryDark,
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.dark,
  },
  typeRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  typeSelectBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bg,
  },
  typeSelectActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  typeSelectText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  typeSelectTextActive: {
    color: colors.primaryDark,
    fontWeight: '700',
  },
  modalInput: {
    backgroundColor: colors.bg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    fontSize: 14,
    color: colors.dark,
    marginBottom: 12,
  },
  submitBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 6,
  },
  submitBtnText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 14,
  },
});
