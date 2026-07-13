export interface MessagePrivacyConversation {
  id: string;
  participantIds: string[];
}

export interface MessagePrivacyMessage {
  id: string;
  conversationId: string;
  senderId: string;
}

export function canAccessConversation(userId: string, conversation: MessagePrivacyConversation) {
  return Boolean(userId && conversation.participantIds.includes(userId));
}

export function canAccessMessage(userId: string, conversation: MessagePrivacyConversation, message: MessagePrivacyMessage) {
  return Boolean(userId && conversation.id === message.conversationId && conversation.participantIds.includes(userId));
}

export function getVisibleConversationsForUser<T extends MessagePrivacyConversation>(conversations: T[], userId: string) {
  return conversations.filter((conversation) => canAccessConversation(userId, conversation));
}

export function getVisibleMessagesForUser<T extends MessagePrivacyConversation, M extends MessagePrivacyMessage>(
  messages: M[],
  conversations: T[],
  userId: string
) {
  const visibleConversationIds = new Set(
    getVisibleConversationsForUser(conversations, userId).map((conversation) => conversation.id)
  );

  return messages.filter((message) => visibleConversationIds.has(message.conversationId));
}
