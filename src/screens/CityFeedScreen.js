import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, SafeAreaView, Share } from 'react-native';
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

export default function CityFeedScreen() {
  const { user } = useAuth();
  const { cityPosts, addCityPost, toggleLike, addComment } = useAppData();

  const [activeFilter, setActiveFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [expandedComments, setExpandedComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});

  const filters = ['All', 'Traffic & Alerts', 'Food & Events', 'Lost & Found'];

  const handlePost = () => {
    if (!postContent.trim()) return;
    addCityPost({
      author: user?.name || 'Resident',
      initials: (user?.name || 'R').split(' ').map(n => n[0]).join('').slice(0, 2),
      society: user?.society || 'Sunrise Apartments',
      city: user?.city || 'Raipur',
      content: postContent.trim()
    });
    setPostContent('');
    setShowModal(false);
  };

  const handleLike = (postId) => {
    toggleLike(postId, user?.id || 'u1', 'city');
  };

  const handleAddComment = (postId) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;
    addComment(postId, {
      author: user?.name || 'Resident',
      text
    }, 'city');
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
  };

  const handleShare = async (content) => {
    try {
      await Share.share({
        message: `PadosiConnect City Update (${user?.city}): ${content}`
      });
    } catch (_) {}
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.globeBox}>
            <Ionicons name="globe" size={24} color={colors.white} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{user?.city || 'Raipur'} City Hub</Text>
            <Text style={styles.subtitle}>
              Public city feed connecting all societies in {user?.city || 'Raipur'}
            </Text>
          </View>
        </View>

        {/* Filter Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
          <View style={styles.filterRow}>
            {filters.map(f => (
              <TouchableOpacity
                key={f}
                style={[styles.filterChip, activeFilter === f && styles.filterChipActive]}
                onPress={() => setActiveFilter(f)}
              >
                <Text style={[styles.filterText, activeFilter === f && styles.filterTextActive]}>
                  {f}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Composer Prompt */}
        <TouchableOpacity
          style={styles.composerBar}
          activeOpacity={0.8}
          onPress={() => setShowModal(true)}
        >
          <Ionicons name="chatbubbles-outline" size={20} color={colors.secondary} />
          <Text style={styles.composerPlaceholder}>
            What's happening around {user?.city || 'Raipur'}? Share news or tips...
          </Text>
          <View style={styles.postPill}>
            <Text style={styles.postPillText}>Post</Text>
          </View>
        </TouchableOpacity>

        {/* Feed List */}
        {cityPosts.map(post => {
          const isLiked = post.likes.includes(user?.id || 'u1');
          const isCommentsOpen = !!expandedComments[post.id];

          return (
            <View key={post.id} style={styles.postCard}>
              <View style={styles.postHeader}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{post.initials}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.authorRow}>
                    <Text style={styles.authorName}>{post.author}</Text>
                    <View style={styles.societyBadge}>
                      <Text style={styles.societyBadgeText}>{post.society}</Text>
                    </View>
                  </View>
                  <Text style={styles.metaText}>
                    {post.city} • {timeAgo(post.time)}
                  </Text>
                </View>
              </View>

              <Text style={styles.postContent}>{post.content}</Text>

              <View style={styles.postActions}>
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
                <View style={styles.commentsDrawer}>
                  {post.comments.map(c => (
                    <View key={c.id} style={styles.commentItem}>
                      <View style={styles.miniAvatar}>
                        <Text style={styles.miniAvatarText}>{c.author.charAt(0)}</Text>
                      </View>
                      <View style={styles.commentContent}>
                        <Text style={styles.commentAuthor}>{c.author}</Text>
                        <Text style={styles.commentText}>{c.text}</Text>
                      </View>
                    </View>
                  ))}

                  <View style={styles.commentInputRow}>
                    <TextInput
                      style={styles.commentInput}
                      placeholder="Comment on this city post..."
                      placeholderTextColor={colors.textMuted}
                      value={commentInputs[post.id] || ''}
                      onChangeText={(val) => setCommentInputs(prev => ({ ...prev, [post.id]: val }))}
                    />
                    <TouchableOpacity
                      style={styles.sendBtn}
                      activeOpacity={0.8}
                      onPress={() => handleAddComment(post.id)}
                    >
                      <Ionicons name="send" size={13} color={colors.white} />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>

      {/* City Post Modal */}
      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Post to {user?.city || 'Raipur'} Feed</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Ionicons name="close" size={24} color={colors.dark} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSub}>
              This update will be visible to all verified neighbors across {user?.city || 'Raipur'}
            </Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Share traffic alerts, event announcements, recommended doctors, or community news..."
              placeholderTextColor={colors.textMuted}
              multiline
              numberOfLines={5}
              value={postContent}
              onChangeText={setPostContent}
              autoFocus
            />

            <TouchableOpacity
              style={[styles.publishBtn, !postContent.trim() && { opacity: 0.5 }]}
              activeOpacity={0.8}
              onPress={handlePost}
              disabled={!postContent.trim()}
            >
              <Ionicons name="globe-outline" size={18} color={colors.white} />
              <Text style={styles.publishText}>Publish City Update</Text>
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
    gap: 12,
    marginBottom: 16,
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },
  globeBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.dark,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  filtersScroll: {
    marginBottom: 14,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  filterTextActive: {
    color: colors.white,
  },
  composerBar: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    gap: 10,
    marginBottom: 16,
  },
  composerPlaceholder: {
    flex: 1,
    fontSize: 13,
    color: colors.textMuted,
  },
  postPill: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  postPillText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  postCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.secondaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.secondary,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  authorName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.dark,
  },
  societyBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  societyBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  metaText: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 1,
  },
  postContent: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 12,
  },
  postActions: {
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
  commentsDrawer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  commentItem: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  miniAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  miniAvatarText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.dark,
  },
  commentContent: {
    flex: 1,
    backgroundColor: colors.bg,
    padding: 8,
    borderRadius: 8,
  },
  commentAuthor: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.dark,
  },
  commentText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 1,
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
  sendBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.secondary,
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
  publishBtn: {
    backgroundColor: colors.secondary,
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  publishText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 15,
  },
});
