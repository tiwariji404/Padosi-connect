import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import { useAppData } from '../contexts/AppDataContext';

export default function NotificationsScreen({ onNavigate }) {
  const { notifications, markAllRead } = useAppData();

  const getIconForType = (type) => {
    switch (type) {
      case 'sos':
        return { name: 'warning', color: colors.danger, bg: colors.dangerLight };
      case 'blood':
        return { name: 'water', color: '#E11D48', bg: '#FFE4E6' };
      case 'announcement':
        return { name: 'megaphone', color: colors.secondary, bg: colors.secondaryLight };
      case 'like':
        return { name: 'heart', color: colors.danger, bg: '#FCE4EC' };
      case 'chat':
        return { name: 'chatbubbles', color: colors.primary, bg: colors.primaryLight };
      default:
        return { name: 'notifications', color: colors.primary, bg: colors.primaryLight };
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => onNavigate('home')}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={22} color={colors.dark} />
          </TouchableOpacity>
          <Text style={styles.title}>Notifications</Text>
          <TouchableOpacity
            style={styles.markReadBtn}
            onPress={markAllRead}
            activeOpacity={0.7}
          >
            <Text style={styles.markReadText}>Mark all read</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {notifications.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="notifications-off-outline" size={48} color={colors.textMuted} />
              <Text style={styles.emptyText}>No notifications yet</Text>
            </View>
          ) : (
            notifications.map(item => {
              const iconMeta = getIconForType(item.type);
              return (
                <View
                  key={item.id}
                  style={[styles.itemCard, !item.read && styles.itemCardUnread]}
                >
                  <View style={[styles.iconBox, { backgroundColor: iconMeta.bg }]}>
                    <Ionicons name={iconMeta.name} size={20} color={iconMeta.color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.itemText, !item.read && styles.itemTextUnread]}>
                      {item.text}
                    </Text>
                    <Text style={styles.itemTime}>{item.time}</Text>
                  </View>
                  {!item.read && <View style={styles.unreadDot} />}
                </View>
              );
            })
          )}
        </ScrollView>
      </View>
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
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.white,
    justifyContent: 'space-between',
  },
  backBtn: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.dark,
  },
  markReadBtn: {
    padding: 4,
  },
  markReadText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  scroll: {
    padding: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textMuted,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 14,
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  itemCardUnread: {
    borderColor: colors.primaryLight,
    backgroundColor: '#F0FDF4',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  itemTextUnread: {
    color: colors.dark,
    fontWeight: '600',
  },
  itemTime: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 4,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
});
