import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { type ChatMessage, type Conversation, type UserRole } from "@/data/schoolData";
import { getVisibleConversationsForUser, getVisibleMessagesForUser } from "@/lib/messagePrivacy";

interface MessagingContextType {
  conversations: Conversation[];
  messages: ChatMessage[];
  sendMessage: (conversationId: string, senderId: string, senderName: string, senderRole: UserRole, content: string) => void;
  startConversation: (participantIds: string[], participantNames: string[], participantRoles: UserRole[]) => Conversation;
  getConversationMessages: (conversationId: string) => ChatMessage[];
  updateConversationLastMessage: (conversationId: string, content: string) => void;
  getOrCreateConversation: (userId1: string, user1Name: string, user1Role: UserRole, userId2: string, user2Name: string, user2Role: UserRole) => Conversation;
}

const MessagingContext = createContext<MessagingContextType | null>(null);

const STORAGE_KEY = "messaging_data";
const POLL_INTERVAL = 500; // Poll every 500ms for real-time updates

function getStorageKey(userId: string) {
  return userId ? `${STORAGE_KEY}_${userId}` : STORAGE_KEY;
}

interface StoredMessagingData {
  conversations: Conversation[];
  messages: ChatMessage[];
  lastUpdated: number;
}

function getStoredData(userId: string): StoredMessagingData {
  try {
    const data = localStorage.getItem(getStorageKey(userId));
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error("Error reading messaging data from storage:", e);
  }
  return {
    conversations: [],
    messages: [],
    lastUpdated: Date.now(),
  };
}

function saveToStorage(data: StoredMessagingData, userId: string) {
  try {
    localStorage.setItem(getStorageKey(userId), JSON.stringify(data));
  } catch (e) {
    console.error("Error saving messaging data to storage:", e);
  }
}

export function MessagingProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [lastStorageUpdate, setLastStorageUpdate] = useState<number>(0);
  const currentUserId = user?.personId || "";

  // Initialize from storage on mount
  useEffect(() => {
    const data = getStoredData(currentUserId);
    setConversations(data.conversations);
    setMessages(data.messages);
    setLastStorageUpdate(data.lastUpdated);
  }, [currentUserId]);

  // Poll for updates from storage (for real-time sync across tabs)
  useEffect(() => {
    const interval = setInterval(() => {
      const data = getStoredData(currentUserId);
      
      // Only update if data in storage is newer than our last update
      if (data.lastUpdated > lastStorageUpdate) {
        setConversations(data.conversations);
        setMessages(data.messages);
        setLastStorageUpdate(data.lastUpdated);
      }
    }, POLL_INTERVAL);

    return () => clearInterval(interval);
  }, [lastStorageUpdate, currentUserId]);

  // Listen for storage changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === getStorageKey(currentUserId) && e.newValue) {
        try {
          const data = JSON.parse(e.newValue) as StoredMessagingData;
          setConversations(data.conversations);
          setMessages(data.messages);
          setLastStorageUpdate(data.lastUpdated);
        } catch (err) {
          console.error("Error parsing storage update:", err);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [currentUserId]);

  const sendMessage = useCallback((
    conversationId: string,
    senderId: string,
    senderName: string,
    senderRole: UserRole,
    content: string
  ) => {
    const conversation = conversations.find((entry) => entry.id === conversationId);
    if (!conversation || !conversation.participantIds.includes(senderId)) {
      return;
    }

    const participants = Array.from(new Set(conversation.participantIds.filter(Boolean)));
    const newMessage: ChatMessage = {
      id: `m${Date.now()}`,
      conversationId,
      senderId,
      senderName,
      senderRole,
      content,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      read: false,
    };

    participants.forEach((participantId) => {
      const participantStorage = getStoredData(participantId);
      const updatedMessages = [...participantStorage.messages, newMessage];
      const updatedConversations = participantStorage.conversations.some((entry) => entry.id === conversationId)
        ? participantStorage.conversations.map((entry) =>
            entry.id === conversationId ? { ...entry, lastMessageContent: content, lastMessageTime: "Just now" } : entry
          )
        : [{ ...conversation, lastMessageContent: content, lastMessageTime: "Just now" }, ...participantStorage.conversations];

      const updatedStorage = {
        conversations: updatedConversations,
        messages: updatedMessages,
        lastUpdated: Date.now(),
      };

      saveToStorage(updatedStorage, participantId);
    });

    if (participants.includes(currentUserId)) {
      const currentUserStorage = getStoredData(currentUserId);
      setMessages(currentUserStorage.messages);
      setConversations(currentUserStorage.conversations);
      setLastStorageUpdate(Date.now());
    }
  }, [conversations, currentUserId]);

  const startConversation = useCallback((
    participantIds: string[],
    participantNames: string[],
    participantRoles: UserRole[]
  ): Conversation => {
    const scopedParticipants = Array.from(new Set(participantIds.filter(Boolean)));
    if (scopedParticipants.length < 2) {
      return {
        id: `conv${Date.now()}`,
        participantIds: scopedParticipants,
        participantNames: participantNames.filter(Boolean),
        participantRoles: participantRoles.filter(Boolean),
        lastMessageContent: "Conversation started",
        lastMessageTime: "Just now",
      };
    }
    const newConv: Conversation = {
      id: `conv${Date.now()}`,
      participantIds: scopedParticipants,
      participantNames: participantNames.filter(Boolean),
      participantRoles: participantRoles.filter(Boolean),
      lastMessageContent: "Conversation started",
      lastMessageTime: "Just now",
    };

    const scopedParticipantIds = Array.from(new Set(newConv.participantIds.filter(Boolean)));
    scopedParticipantIds.forEach((participantId) => {
      const participantStorage = getStoredData(participantId);
      const updatedStorage = {
        conversations: [newConv, ...participantStorage.conversations.filter((entry) => entry.id !== newConv.id)],
        messages: participantStorage.messages,
        lastUpdated: Date.now(),
      };
      saveToStorage(updatedStorage, participantId);
    });

    if (scopedParticipantIds.includes(currentUserId)) {
      const currentUserStorage = getStoredData(currentUserId);
      setConversations(currentUserStorage.conversations);
      setMessages(currentUserStorage.messages);
      setLastStorageUpdate(Date.now());
    }

    return newConv;
  }, [currentUserId]);

  const updateConversationLastMessage = useCallback((
    conversationId: string,
    content: string
  ) => {
    setConversations((prevConvs) => {
      const updated = prevConvs.map((c) =>
        c.id === conversationId
          ? { ...c, lastMessageContent: content, lastMessageTime: "Just now" }
          : c
      );

      const participantIds = Array.from(new Set(updated.flatMap((entry) => entry.participantIds)));
      participantIds.forEach((participantId) => {
        const participantStorage = getStoredData(participantId);
        const updatedStorage = {
          conversations: updated.filter((entry) => entry.participantIds.includes(participantId)),
          messages: participantStorage.messages,
          lastUpdated: Date.now(),
        };
        saveToStorage(updatedStorage, participantId);
      });

      setLastStorageUpdate(Date.now());
      return updated;
    });
  }, []);

  const getConversationMessages = useCallback((conversationId: string): ChatMessage[] => {
    return getVisibleMessagesForUser(messages, conversations, currentUserId).filter((m) => m.conversationId === conversationId);
  }, [messages, conversations, currentUserId]);

  const getOrCreateConversation = useCallback((
    userId1: string,
    user1Name: string,
    user1Role: UserRole,
    userId2: string,
    user2Name: string,
    user2Role: UserRole
  ): Conversation => {
    if (!userId1 || !userId2 || userId1 === userId2) {
      return startConversation([userId1, userId2], [user1Name, user2Name], [user1Role, user2Role]);
    }
    // Find existing conversation
    const existing = conversations.find(
      (c) =>
        (c.participantIds.includes(userId1) &&
          c.participantIds.includes(userId2))
    );

    if (existing) {
      return existing;
    }

    // Create new conversation
    return startConversation(
      [userId1, userId2],
      [user1Name, user2Name],
      [user1Role, user2Role]
    );
  }, [conversations, startConversation]);

  const visibleConversations = getVisibleConversationsForUser(conversations, currentUserId);
  const visibleMessages = getVisibleMessagesForUser(messages, conversations, currentUserId);

  return (
    <MessagingContext.Provider
      value={{
        conversations: visibleConversations,
        messages: visibleMessages,
        sendMessage,
        startConversation,
        getConversationMessages,
        updateConversationLastMessage,
        getOrCreateConversation,
      }}
    >
      {children}
    </MessagingContext.Provider>
  );
}

export function useMessaging() {
  const context = useContext(MessagingContext);
  if (!context) {
    throw new Error("useMessaging must be used inside MessagingProvider");
  }
  return context;
}
