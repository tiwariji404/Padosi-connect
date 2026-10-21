import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import { useAuth } from '../contexts/AuthContext';
import { useAppData } from '../contexts/AppDataContext';

export default function ChatRoomScreen({ routeParams, onNavigate }) {
  const { groupId } = routeParams || { groupId: 'g1' };
  const { user } = useAuth();
  const { groups, chatMessages, sendMessage } = useAppData();
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef(null);

  const group = groups.find(g => g.id === groupId) || groups[0];
  const messages = chatMessages[group?.id] || [];

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages.length]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    sendMessage(group.id, {
      sender: user?.name || 'Resident',
      text: inputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mine: true
    });
    setInputText('');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        {/* Chat Room Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => onNavigate('chat')}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={22} color={colors.dark} />
          </TouchableOpacity>

          <View style={styles.headerAvatar}>
            <Ionicons
              name={group?.type === 'city' ? 'globe' : 'people'}
              size={18}
              color={colors.primary}
            />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.groupTitle} numberOfLines={1}>
              {group?.name || 'Chat Room'}
            </Text>
            <Text style={styles.groupSubtitle}>
              {group?.members || 1} members active
            </Text>
          </View>

          <TouchableOpacity style={styles.infoBtn} activeOpacity={0.7}>
            <Ionicons name="ellipsis-vertical" size={20} color={colors.dark} />
          </TouchableOpacity>
        </View>

        {/* Messages List */}
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.encryptedBanner}>
            <Ionicons name="lock-closed" size={12} color={colors.textMuted} />
            <Text style={styles.encryptedText}>
              Neighborhood private chat • Sunrise Apartments
            </Text>
          </View>

          {messages.map((msg, index) => {
            const isMine = msg.mine || msg.sender === user?.name;

            return (
              <View
                key={msg.id || index}
                style={[
                  styles.messageRow,
                  isMine ? styles.messageRowMine : styles.messageRowOther
                ]}
              >
                {!isMine && (
                  <View style={styles.senderAvatar}>
                    <Text style={styles.senderAvatarText}>
                      {msg.sender.charAt(0)}
                    </Text>
                  </View>
                )}

                <View
                  style={[
                    styles.bubble,
                    isMine ? styles.bubbleMine : styles.bubbleOther
                  ]}
                >
                  {!isMine && (
                    <Text style={styles.bubbleSender}>{msg.sender}</Text>
                  )}
                  <Text style={[styles.bubbleText, isMine && styles.bubbleTextMine]}>
                    {msg.text}
                  </Text>
                  <Text style={[styles.bubbleTime, isMine && styles.bubbleTimeMine]}>
                    {msg.time}
                  </Text>
                </View>
              </View>
            );
          })}
        </ScrollView>

        {/* Input Bar */}
        <View style={styles.inputBar}>
          <TouchableOpacity style={styles.attachBtn} activeOpacity={0.7}>
            <Ionicons name="add-circle-outline" size={24} color={colors.primary} />
          </TouchableOpacity>

          <TextInput
            style={styles.textInput}
            placeholder={`Message ${group?.name}...`}
            placeholderTextColor={colors.textMuted}
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={handleSend}
            multiline
          />

          <TouchableOpacity
            style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
            activeOpacity={0.8}
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
            <Ionicons name="send" size={16} color={colors.white} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
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
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 10,
  },
  backBtn: {
    padding: 6,
  },
  headerAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  groupTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.dark,
  },
  groupSubtitle: {
    fontSize: 11,
    color: colors.primaryDark,
    fontWeight: '500',
  },
  infoBtn: {
    padding: 6,
  },
  messagesList: {
    padding: 16,
    paddingBottom: 20,
  },
  encryptedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    marginBottom: 16,
  },
  encryptedText: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: '500',
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-end',
    gap: 8,
  },
  messageRowMine: {
    justifyContent: 'flex-end',
  },
  messageRowOther: {
    justifyContent: 'flex-start',
  },
  senderAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.secondaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  senderAvatarText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.secondary,
  },
  bubble: {
    maxWidth: '75%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },
  bubbleMine: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  bubbleOther: {
    backgroundColor: colors.white,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  bubbleSender: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 2,
  },
  bubbleText: {
    fontSize: 14,
    color: colors.dark,
    lineHeight: 19,
  },
  bubbleTextMine: {
    color: colors.white,
  },
  bubbleTime: {
    fontSize: 9,
    color: colors.textMuted,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  bubbleTimeMine: {
    color: 'rgba(255,255,255,0.7)',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 8,
  },
  attachBtn: {
    padding: 4,
  },
  textInput: {
    flex: 1,
    backgroundColor: colors.bg,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 14,
    maxHeight: 90,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.dark,
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnDisabled: {
    opacity: 0.4,
  },
});
