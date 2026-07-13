import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useMessaging } from "@/contexts/MessagingContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { getAllUsers, type Conversation, type UserRole } from "@/data/schoolData";
import { playMessageNotification } from "@/utils/notificationSound";
import {
  Search, Send, Phone, Video, Info, MoreVertical,
  Circle, CheckCheck, Menu, X, Plus, Shield, MessageCircleMore
} from "lucide-react";
import { toast } from "sonner";

export default function Messages() {
  const { user } = useAuth();
  const { conversations, messages, sendMessage, getOrCreateConversation, getConversationMessages } = useMessaging();
  const { sendNotification } = useNotifications();
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showUserSearch, setShowUserSearch] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [lastMessageCount, setLastMessageCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const allUsers = getAllUsers();
  
  // Admin View state
  const [adminViewUser, setAdminViewUser] = useState<string | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedConv]);

  // Listen for new messages and trigger notifications
  useEffect(() => {
    if (messages.length > lastMessageCount) {
      // Get the new messages
      const newMessages = messages.slice(lastMessageCount);
      
      newMessages.forEach(msg => {
        // Only notify if the message is not from the current user
        if (msg.senderId !== (user?.personId || "Admin")) {
          // Play notification sound
          playMessageNotification();
          
          // Send notification
          sendNotification(
            `New message from ${msg.senderName}: "${msg.content.substring(0, 50)}${msg.content.length > 50 ? '...' : ''}"`,
            "info",
            user?.role,
            user?.personId
          );
        }
      });
      
      setLastMessageCount(messages.length);
    }
  }, [messages, user, sendNotification, lastMessageCount]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConv || !user) return;

    sendMessage(
      selectedConv.id,
      user.personId || "Admin",
      user.name,
      user.role,
      newMessage
    );
    setNewMessage("");
    toast.success("Message sent!");
  };

  const startNewConversation = (targetUser: { id: string; name: string; role: UserRole }) => {
    const newConv = getOrCreateConversation(
      user?.personId || "Admin",
      user?.name || "Admin",
      user?.role || "Admin",
      targetUser.id,
      targetUser.name,
      targetUser.role
    );

    setSelectedConv(newConv);
    setShowUserSearch(false);
    setUserSearchQuery("");
    toast.success(`Conversation started with ${targetUser.name}`);
  };

  const filteredConversations = conversations.filter(c => {
    const otherMemberName = c.participantNames.find(n => n !== (user?.name || "Admin"));
    return otherMemberName?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const visibleChatMessages = selectedConv
    ? getConversationMessages(selectedConv.id)
    : [];

  const filteredUsers = allUsers.filter(u => 
    u.id !== (user?.personId || "Admin") && 
    (u.name.toLowerCase().includes(userSearchQuery.toLowerCase()) || 
     u.role.toLowerCase().includes(userSearchQuery.toLowerCase()))
  );

  const currentChatMessages = visibleChatMessages;

  const getOtherParticipant = (conv: Conversation) => {
    const idx = conv.participantIds.indexOf(user?.personId || "Admin");
    const otherIdx = idx === 0 ? 1 : 0;
    return {
      name: conv.participantNames[otherIdx],
      role: conv.participantRoles[otherIdx]
    };
  };

  return (
    <div className="flex overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_20px_60px_-20px_rgba(15,23,42,0.22)] h-[calc(100vh-160px)]">
      <div className="w-80 border-r border-slate-200/80 flex flex-col bg-[#f7f6f3]">
        <div className="border-b border-slate-200/80 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Messages</h2>
              <p className="text-[11px] text-slate-500">Your school conversations</p>
            </div>
            <button
              onClick={() => setShowUserSearch(true)}
              className="rounded-2xl bg-[#0f9d58]/10 p-2.5 text-[#0f9d58] transition-all hover:bg-[#0f9d58] hover:text-white"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search chats"
              className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-700 outline-none ring-0"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-[#f7f6f3]">
          {filteredConversations.map((conv) => {
            const other = getOtherParticipant(conv);
            const isActive = selectedConv?.id === conv.id;
            return (
              <button
                key={conv.id}
                onClick={() => setSelectedConv(conv)}
                className={`flex w-full items-center gap-3 border-l-4 p-4 text-left transition-all ${isActive ? "border-[#25d366] bg-white shadow-sm" : "border-transparent hover:bg-white/70"}`}
              >
                <div className="relative flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e9f8ee] font-semibold text-[#0f9d58]">
                    {other.name.charAt(0)}
                  </div>
                  <Circle className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-white fill-[#25d366] text-[#25d366]" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-start justify-between gap-2">
                    <p className={`truncate text-sm font-semibold ${isActive ? "text-slate-900" : "text-slate-700"}`}>{other.name}</p>
                    <span className={`text-[10px] ${isActive ? "text-slate-500" : "text-slate-400"}`}>{conv.lastMessageTime}</span>
                  </div>
                  <p className={`truncate text-xs ${isActive ? "text-slate-600" : "text-slate-500"}`}>{conv.lastMessageContent}</p>
                  <span className={`mt-1 inline-block text-[10px] font-medium uppercase tracking-[0.16em] ${isActive ? "text-[#25d366]" : "text-slate-400"}`}>{other.role}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-1 flex-col bg-[url('/whatsapp-chat-bg.svg')] bg-cover bg-center">
        {selectedConv ? (
          <>
            <div className="flex items-center justify-between border-b border-slate-200/80 bg-white/80 px-5 py-4 backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e9f8ee] font-semibold text-[#0f9d58]">
                  {getOtherParticipant(selectedConv).name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">{getOtherParticipant(selectedConv).name}</h3>
                  <p className="text-xs text-slate-500">{getOtherParticipant(selectedConv).role} • online</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="rounded-full bg-[#f2f2f2] p-2.5 text-slate-600 transition-all hover:bg-[#e9f8ee] hover:text-[#0f9d58]"><Phone className="h-4 w-4" /></button>
                <button className="rounded-full bg-[#f2f2f2] p-2.5 text-slate-600 transition-all hover:bg-[#e9f8ee] hover:text-[#0f9d58]"><Video className="h-4 w-4" /></button>
                <button className="rounded-full bg-[#f2f2f2] p-2.5 text-slate-600 transition-all hover:bg-[#e9f8ee] hover:text-[#0f9d58]"><Info className="h-4 w-4" /></button>
              </div>
            </div>

            {user?.role === "Admin" && (
              <div className="flex items-center justify-center gap-2 border-b border-amber-100 bg-amber-50/70 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-700">
                <Shield className="h-3.5 w-3.5" />
                Admin oversight active
              </div>
            )}

            <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 lg:px-8">
              <div className="mx-auto flex max-w-4xl flex-col gap-3">
                {currentChatMessages.map((msg) => {
                  const isMine = msg.senderId === (user?.personId || "Admin");
                  return (
                    <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[78%] rounded-2xl px-4 py-3 shadow-sm ${isMine ? "rounded-br-md bg-[#dcf8c6] text-slate-800" : "rounded-bl-md bg-white text-slate-800"}`}>
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                        <div className={`mt-1 flex items-center gap-1 text-[10px] ${isMine ? "justify-end text-slate-500" : "justify-start text-slate-400"}`}>
                          <span>{msg.time}</span>
                          {isMine && <CheckCheck className="h-3.5 w-3.5 text-[#34b7f1]" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="border-t border-slate-200/80 bg-white/80 px-4 py-4 backdrop-blur sm:px-6">
              <div className="mx-auto flex max-w-4xl items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 shadow-sm">
                <input
                  type="text"
                  placeholder="Type a message"
                  className="flex-1 bg-transparent px-2 py-1 text-sm text-slate-700 outline-none"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button
                  type="submit"
                  className="rounded-full bg-[#25d366] p-3 text-white transition-all hover:bg-[#1fa851]"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center bg-[url('/whatsapp-chat-bg.svg')] bg-cover bg-center p-12 text-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/80 text-slate-400 shadow-sm">
              <MessageCircleMore className="h-10 w-10" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">Select a conversation</h3>
            <p className="mt-2 max-w-xs text-sm text-slate-600">Choose a chat from the sidebar or start a new one to begin messaging.</p>
            <button
              onClick={() => setShowUserSearch(true)}
              className="mt-5 rounded-full bg-[#25d366] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#1fa851]"
            >
              Start New Chat
            </button>
          </div>
        )}
      </div>

      {showUserSearch && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
          onClick={() => setShowUserSearch(false)}
        >
          <div
            className="w-full max-w-md rounded-[2rem] bg-white p-7 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800">Start Conversation</h3>
              <button onClick={() => setShowUserSearch(false)} className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="relative mb-5">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Find someone"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm outline-none"
                value={userSearchQuery}
                onChange={(e) => setUserSearchQuery(e.target.value)}
                autoFocus
              />
            </div>

            <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
              {filteredUsers.map((u) => (
                <button
                  key={u.id}
                  onClick={() => startNewConversation(u)}
                  className="flex w-full items-center gap-3 rounded-2xl bg-[#f7f6f3] p-3 text-left transition-all hover:bg-[#e9f8ee]"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white font-semibold text-slate-500">
                    {u.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{u.name}</p>
                    <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-slate-400">{u.role}</span>
                  </div>
                </button>
              ))}
              {filteredUsers.length === 0 && (
                <p className="py-6 text-center text-sm text-slate-500">No users found for "{userSearchQuery}"</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
