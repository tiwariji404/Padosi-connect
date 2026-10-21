import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, SafeAreaView, Platform, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import { useAuth } from '../contexts/AuthContext';
import { useAppData } from '../contexts/AppDataContext';

function timeAgo(timestamp) {
  const diff = Date.now() - timestamp;
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
}

export default function HomeScreen({ onNavigate }) {
  const { user } = useAuth();
  const {
    societyPosts,
    addSocietyPost,
    toggleLike,
    addComment,
    triggerSOS,
    unreadCount
  } = useAppData();

  const [showPostModal, setShowPostModal] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [expandedComments, setExpandedComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});

  const handleCreatePost = () => {
    if (!postContent.trim()) return;
    addSocietyPost({
      author: user?.name || 'Resident',
      initials: (user?.name || 'R').split(' ').map(n => n[0]).join('').slice(0, 2),
      society: user?.society || 'Sunrise Apartments',
      city: user?.city || 'Raipur',
      content: postContent.trim()
    });
    setPostContent('');
    setShowPostModal(false);
  };

  const handleLike = (postId) => {
    toggleLike(postId, user?.id || 'u1', 'society');
  };

  const handleAddComment = (postId) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;
    addComment(postId, {
      author: user?.name || 'Resident',
      text
    }, 'society');
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
  };

  const handleShare = async (content) => {
    try {
      await Share.share({
        message: `PadosiConnect Notice from ${user?.society}: ${content}`
      });
    } catch (_) {}
  };

  const handleSOSPress = () => {
    triggerSOS({
      senderName: user?.name || 'Resident',
      flat: user?.flat || 'B-402',
      society: user?.society || 'Sunrise Apartments',
      city: user?.city || 'Raipur',
      phone: user?.phone || '9876543210'
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Top Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerLeft}
            activeOpacity={0.8}
            onPress={() => onNavigate('profile')}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.name?.charAt(0).toUpperCase() || 'A'}
              </Text>
            </View>
            <View>
              <View style={styles.societyRow}>
                <Text style={styles.societyName}>{user?.society || 'Sunrise Apartments'}</Text>
                <Ionicons name="checkmark-circle" size={14} color={colors.primary} />
              </View>
              <View style={styles.locationRow}>
                <Ionicons name="location-outline" size={12} color={colors.textSecondary} />
                <Text style={styles.locationText}>
                  {user?.flat || 'B-402'} • {user?.city || 'Raipur'}
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconBtn}
            activeOpacity={0.7}
            onPress={() => onNavigate('notifications')}
          >
            <Ionicons name="notifications-outline" size={22} color={colors.dark} />
            {unreadCount > 0 && <View style={styles.notifDot} />}
          </TouchableOpacity>
        </View>

        {/* Emergency SOS Banner */}
        <TouchableOpacity
          style={styles.sosCard}
          activeOpacity={0.85}
          onPress={handleSOSPress}
        >
          <View style={styles.sosIconBox}>
            <Ionicons name="alert-circle" size={28} color={colors.white} />
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.sosTitleRow}>
              <Text style={styles.sosTitle}>EMERGENCY SOS</Text>
              <View style={styles.sosLivePill}>
                <Text style={styles.sosLiveText}>PANIC BUTTON</Text>
              </View>
            </View>
            <Text style={styles.sosSubtitle}>
              Tap to alert neighbors, guard desk & emergency contacts
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.7)" />
        </TouchableOpacity>

        {/* Quick Utilities Grid */}
        <View style={styles.quickGrid}>
          <TouchableOpacity
            style={[styles.quickCard, { backgroundColor: '#FEE2E2' }]}
            activeOpacity={0.75}
            onPress={() => onNavigate('blood')}
          >
            <View style={[styles.quickIconCircle, { backgroundColor: '#DC2626' }]}>
              <Ionicons name="water" size={18} color={colors.white} />
            </View>
            <Text style={[styles.quickTitle, { color: '#991B1B' }]}>Blood Donor</Text>
            <Text style={styles.quickDesc}>Urgent donors</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickCard, { backgroundColor: '#FEF3C7' }]}
            activeOpacity={0.75}
            onPress={() => onNavigate('marketplace')}
          >
            <View style={[styles.quickIconCircle, { backgroundColor: '#D97706' }]}>
              <Ionicons name="cart" size={18} color={colors.white} />
            </View>
            <Text style={[styles.quickTitle, { color: '#92400E' }]}>Marketplace</Text>
            <Text style={styles.quickDesc}>Buy & borrow</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickCard, { backgroundColor: '#DCFCE7' }]}
            activeOpacity={0.75}
            onPress={() => onNavigate('services')}
          >
            <View style={[styles.quickIconCircle, { backgroundColor: '#16A34A' }]}>
              <Ionicons name="construct" size={18} color={colors.white} />
            </View>
            <Text style={[styles.quickTitle, { color: '#166534' }]}>Services</Text>
            <Text style={styles.quickDesc}>Plumber, Elect.</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickCard, { backgroundColor: '#E0F2FE' }]}
            activeOpacity={0.75}
            onPress={() => setShowPostModal(true)}
          >
            <View style={[styles.quickIconCircle, { backgroundColor: '#0284C7' }]}>
              <Ionicons name="megaphone" size={18} color={colors.white} />
            </View>
            <Text style={[styles.quickTitle, { color: '#075985' }]}>New Notice</Text>
            <Text style={styles.quickDesc}>Announce</Text>
          </TouchableOpacity>
        </View>

        {/* Composer Bar */}
        <TouchableOpacity
          style={styles.composerBar}
          activeOpacity={0.8}
          onPress={() => setShowPostModal(true)}
        >
          <View style={styles.miniAvatar}>
            <Text style={styles.miniAvatarText}>
              {user?.name?.charAt(0).toUpperCase() || 'A'}
            </Text>
          </View>
          <Text style={styles.composerPlaceholder}>
            Post a question, notice or update for your society...
          </Text>
          <Ionicons name="create-outline" size={20} color={colors.primary} />
        </TouchableOpacity>

        {/* Section Title */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Society Notice Board & Feed</Text>
          <Text style={styles.sectionCount}>{societyPosts.length} updates</Text>
        </View>

        {/* Feed Posts */}
        {societyPosts.map((post) => {
          const isLiked = post.likes.includes(user?.id || 'u1');
          const isCommentsOpen = !!expandedComments[post.id];

          return (
            <View key={post.id} style={styles.postCard}>
              {post.isPinned && (
                <View style={styles.pinnedBanner}>
                  <Ionicons name="pin" size={12} color={colors.primaryDark} />
                  <Text style={styles.pinnedText}>PINNED SOCIETY NOTICE</Text>
                </View>
              )}

              <View style={styles.postHeader}>
                <View style={styles.postAvatar}>
                  <Text style={styles.postAvatarText}>{post.initials}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.postAuthor}>{post.author}</Text>
                  <Text style={styles.postMeta}>
                    {post.society} • {timeAgo(post.time)}
                  </Text>
                </View>
              </View>

              <Text style={styles.postContent}>{post.content}</Text>

              <View style={styles.postFooter}>
                <TouchableOpacity
                  style={styles.actionBtn}
                  activeOpacity={0.7}
                  onPress={() => handleLike(post.id)}
                >
                  <Ionicons
                    name={isLiked ? 'heart' : 'heart-outline'}
                    size={18}
                    color={isLiked ? colors.danger : colors.textSecondary}
                  />
                  <Text style={[styles.actionText, isLiked && { color: colors.danger, fontWeight: '700' }]}>
                    {post.likes.length}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionBtn}
                  activeOpacity={0.7}
                  onPress={() => setExpandedComments(prev => ({ ...prev, [post.id]: !prev[post.id] }))}
                >
                  <Ionicons name="chatbubble-outline" size={17} color={colors.textSecondary} />
                  <Text style={styles.actionText}>{post.comments.length}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionBtn, { marginLeft: 'auto' }]}
                  activeOpacity={0.7}
                  onPress={() => handleShare(post.content)}
                >
                  <Ionicons name="share-social-outline" size={17} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>

              {/* Comments drawer */}
              {isCommentsOpen && (
                <View style={styles.commentsBox}>
                  {post.comments.map(c => (
                    <View key={c.id} style={styles.commentItem}>
                      <View style={styles.commentAvatar}>
                        <Text style={styles.commentAvatarText}>{c.author.charAt(0)}</Text>
                      </View>
                      <View style={styles.commentBubble}>
                        <Text style={styles.commentAuthor}>{c.author}</Text>
                        <Text style={styles.commentText}>{c.text}</Text>
                      </View>
                    </View>
                  ))}

                  <View style={styles.commentInputRow}>
                    <TextInput
                      style={styles.commentInput}
                      placeholder="Write a helpful comment..."
                      placeholderTextColor={colors.textMuted}
                      value={commentInputs[post.id] || ''}
                      onChangeText={(val) => setCommentInputs(prev => ({ ...prev, [post.id]: val }))}
                    />
                    <TouchableOpacity
                      style={styles.commentSendBtn}
                      activeOpacity={0.8}
                      onPress={() => handleAddComment(post.id)}
                    >
                      <Ionicons name="send" size={14} color={colors.white} />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>

      {/* Create Post Modal */}
      <Modal
        visible={showPostModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPostModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Society Announcement</Text>
              <TouchableOpacity onPress={() => setShowPostModal(false)}>
                <Ionicons name="close" size={24} color={colors.dark} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSub}>
              Broadcasting to all residents in {user?.society || 'Sunrise Apartments'}
            </Text>

            <TextInput
              style={styles.modalInput}
              placeholder="What would you like to share with your society? (e.g. lift maintenance, water alert, items found...)"
              placeholderTextColor={colors.textMuted}
              multiline
              numberOfLines={5}
              value={postContent}
              onChangeText={setPostContent}
              autoFocus
            />

            <TouchableOpacity
              style={[styles.modalSubmitBtn, !postContent.trim() && { opacity: 0.5 }]}
              activeOpacity={0.8}
              onPress={handleCreatePost}
              disabled={!postContent.trim()}
            >
              <Ionicons name="paper-plane" size={18} color={colors.white} />
              <Text style={styles.modalSubmitText}>Publish Announcement</Text>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 18,
  },
  societyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  societyName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.dark,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 2,
  },
  locationText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    position: 'relative',
  },
  notifDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.danger,
    borderWidth: 1.5,
    borderColor: colors.white,
  },
  sosCard: {
    backgroundColor: colors.danger,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
    shadowColor: colors.danger,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  sosIconBox: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sosTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sosTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: colors.white,
    letterSpacing: 0.5,
  },
  sosLivePill: {
    backgroundColor: 'rgba(0,0,0,0.25)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  sosLiveText: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.white,
  },
  sosSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 2,
  },
  quickGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  quickCard: {
    flex: 1,
    padding: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  quickIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  quickTitle: {
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },
  quickDesc: {
    fontSize: 9,
    color: colors.textSecondary,
    marginTop: 1,
    textAlign: 'center',
  },
  composerBar: {
    backgroundColor: colors.white,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    gap: 10,
    marginBottom: 16,
  },
  miniAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  miniAvatarText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  composerPlaceholder: {
    flex: 1,
    fontSize: 13,
    color: colors.textMuted,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.dark,
  },
  sectionCount: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  postCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pinnedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    gap: 4,
    marginBottom: 10,
  },
  pinnedText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primaryDark,
    letterSpacing: 0.3,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  postAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.secondaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postAvatarText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.secondary,
  },
  postAuthor: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.dark,
  },
  postMeta: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 1,
  },
  postContent: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 14,
  },
  postFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: 10,
    gap: 16,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  commentsBox: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  commentItem: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  commentAvatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentAvatarText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.dark,
  },
  commentBubble: {
    flex: 1,
    backgroundColor: colors.bg,
    padding: 8,
    borderRadius: 10,
  },
  commentAuthor: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.dark,
  },
  commentText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  commentInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  commentInput: {
    flex: 1,
    backgroundColor: colors.bg,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 12,
    color: colors.dark,
    borderWidth: 1,
    borderColor: colors.border,
  },
  commentSendBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
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
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.dark,
  },
  modalSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    marginBottom: 14,
  },
  modalInput: {
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 14,
    fontSize: 14,
    color: colors.dark,
    textAlignVertical: 'top',
    height: 120,
    marginBottom: 16,
  },
  modalSubmitBtn: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  modalSubmitText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 15,
  },
});
