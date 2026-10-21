import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import { useAuth } from '../contexts/AuthContext';
import { useAppData } from '../contexts/AppDataContext';

export default function ChatListScreen({ onNavigate }) {
  const { user } = useAuth();
  const { groups, createGroup } = useAppData();

  const [activeTab, setActiveTab] = useState('society');
  const [search, setSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');
  const [newGroupType, setNewGroupType] = useState('society');

  const filteredGroups = groups.filter(g => {
    const matchesTab = activeTab === 'society' ? g.type === 'society' : g.type === 'city';
    const matchesSearch = g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.lastMsg.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const societyUnread = groups.filter(g => g.type === 'society').reduce((acc, g) => acc + (g.unread || 0), 0);
  const cityUnread = groups.filter(g => g.type === 'city').reduce((acc, g) => acc + (g.unread || 0), 0);

  const handleCreate = () => {
    if (!newGroupName.trim()) return;
    const gid = createGroup({
      name: newGroupName.trim(),
      desc: newGroupDesc.trim(),
      type: newGroupType,
      society: newGroupType === 'society' ? (user?.society || 'Sunrise Apartments') : null,
      creatorName: user?.name || 'Resident'
    });
    setNewGroupName('');
    setNewGroupDesc('');
    setShowCreateModal(false);
    onNavigate('chatroom', { groupId: gid });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Neighborhood Chat</Text>
          <TouchableOpacity
            style={styles.addBtn}
            activeOpacity={0.8}
            onPress={() => setShowCreateModal(true)}
          >
            <Ionicons name="add" size={22} color={colors.white} />
          </TouchableOpacity>
        </View>

        {/* Tab Switcher */}
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'society' && styles.tabItemActive]}
            onPress={() => setActiveTab('society')}
          >
            <Ionicons
              name="business"
              size={16}
              color={activeTab === 'society' ? colors.primary : colors.textSecondary}
            />
            <Text style={[styles.tabText, activeTab === 'society' && styles.tabTextActive]}>
              Society ({user?.society?.split(' ')[0] || 'My Society'})
            </Text>
            {societyUnread > 0 && (
              <View style={styles.pillBadge}>
                <Text style={styles.pillBadgeText}>{societyUnread}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'city' && styles.tabItemActive]}
            onPress={() => setActiveTab('city')}
          >
            <Ionicons
              name="globe"
              size={16}
              color={activeTab === 'city' ? colors.secondary : colors.textSecondary}
            />
            <Text style={[styles.tabText, activeTab === 'city' && styles.tabTextActive]}>
              {user?.city || 'Raipur'} City
            </Text>
            {cityUnread > 0 && (
              <View style={[styles.pillBadge, { backgroundColor: colors.secondary }]}>
                <Text style={styles.pillBadgeText}>{cityUnread}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color={colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search conversations, members..."
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Chats List */}
        <ScrollView contentContainerStyle={styles.listContainer}>
          {filteredGroups.map(group => (
            <TouchableOpacity
              key={group.id}
              style={styles.chatRow}
              activeOpacity={0.7}
              onPress={() => onNavigate('chatroom', { groupId: group.id })}
            >
              <View style={[
                styles.avatar,
                { backgroundColor: group.type === 'city' ? colors.secondaryLight : colors.primaryLight }
              ]}>
                <Ionicons
                  name={group.type === 'city' ? 'globe' : 'people'}
                  size={22}
                  color={group.type === 'city' ? colors.secondary : colors.primary}
                />
              </View>

              <View style={styles.chatInfo}>
                <View style={styles.topRow}>
                  <Text style={styles.groupName}>{group.name}</Text>
                  <Text style={styles.timeText}>{group.time}</Text>
                </View>
                <View style={styles.bottomRow}>
                  <Text style={styles.lastMsg} numberOfLines={1}>
                    {group.lastMsg}
                  </Text>
                  {group.unread > 0 && (
                    <View style={styles.unreadCircle}>
                      <Text style={styles.unreadText}>{group.unread}</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.memberCount}>
                  {group.members} neighbors joined
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Create Group Modal */}
      <Modal
        visible={showCreateModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create New Group</Text>
              <TouchableOpacity onPress={() => setShowCreateModal(false)}>
                <Ionicons name="close" size={24} color={colors.dark} />
              </TouchableOpacity>
            </View>

            <View style={styles.typeSelector}>
              <TouchableOpacity
                style={[styles.typeBtn, newGroupType === 'society' && styles.typeBtnActive]}
                onPress={() => setNewGroupType('society')}
              >
                <Ionicons
                  name="business"
                  size={16}
                  color={newGroupType === 'society' ? colors.primary : colors.textSecondary}
                />
                <Text style={[styles.typeText, newGroupType === 'society' && styles.typeTextActive]}>
                  Society Only
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.typeBtn, newGroupType === 'city' && styles.typeBtnActive]}
                onPress={() => setNewGroupType('city')}
              >
                <Ionicons
                  name="globe"
                  size={16}
                  color={newGroupType === 'city' ? colors.secondary : colors.textSecondary}
                />
                <Text style={[styles.typeText, newGroupType === 'city' && styles.typeTextActive]}>
                  Entire City
                </Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.modalInput}
              placeholder="Group name (e.g. Cricket Team, Yoga Club...)"
              placeholderTextColor={colors.textMuted}
              value={newGroupName}
              onChangeText={setNewGroupName}
            />

            <TextInput
              style={[styles.modalInput, { height: 80 }]}
              placeholder="Short description (optional)..."
              placeholderTextColor={colors.textMuted}
              multiline
              value={newGroupDesc}
              onChangeText={setNewGroupDesc}
            />

            <TouchableOpacity
              style={[styles.submitBtn, !newGroupName.trim() && { opacity: 0.5 }]}
              activeOpacity={0.8}
              onPress={handleCreate}
              disabled={!newGroupName.trim()}
            >
              <Text style={styles.submitText}>Start Group Chat</Text>
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
  container: {
    flex: 1,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.dark,
  },
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 12,
    padding: 3,
  },
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: 10,
    gap: 6,
  },
  tabItemActive: {
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
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
  pillBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
  },
  pillBadgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 13,
    color: colors.dark,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  chatRow: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    padding: 14,
    borderRadius: 16,
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatInfo: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  groupName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.dark,
  },
  timeText: {
    fontSize: 11,
    color: colors.textMuted,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  lastMsg: {
    fontSize: 13,
    color: colors.textSecondary,
    flex: 1,
    marginRight: 8,
  },
  unreadCircle: {
    backgroundColor: colors.primary,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  memberCount: {
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
    padding: 20,
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
  typeSelector: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  typeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bg,
    gap: 6,
  },
  typeBtnActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  typeText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  typeTextActive: {
    color: colors.primaryDark,
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
  },
  submitText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 14,
  },
});
