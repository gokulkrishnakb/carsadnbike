"use client";

import { Suspense, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Search, Send, ArrowLeft, Phone, Video, MoreVertical, Check, CheckCheck } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

// Dummy conversations data
const DUMMY_CONVERSATIONS = [
  {
    id: "1",
    other_user: { id: "u1", full_name: "Rajesh Kumar", email: "rajesh@example.com" },
    listing_id: "l1",
    listing_title: "2023 Toyota Camry XLE",
    listing_image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=200&q=80",
    last_message: { content: "Is the price negotiable?", sender_id: "u1", created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
    unread_count: 2,
    updated_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
  {
    id: "2",
    other_user: { id: "u2", full_name: "Priya Sharma", email: "priya@example.com" },
    listing_id: "l2",
    listing_title: "2022 Honda Civic Sport",
    listing_image: "https://images.unsplash.com/photo-1606611013016-969c19ba27bb?auto=format&fit=crop&w=200&q=80",
    last_message: { content: "Can I schedule a test drive for tomorrow?", sender_id: "u2", created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
    unread_count: 1,
    updated_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: "3",
    other_user: { id: "u3", full_name: "Amit Patel", email: "amit@example.com" },
    listing_id: "l3",
    listing_title: "2023 BMW 3 Series",
    listing_image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=200&q=80",
    last_message: { content: "Thanks for the information!", sender_id: "me", created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
    unread_count: 0,
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: "4",
    other_user: { id: "u4", full_name: "Sneha Reddy", email: "sneha@example.com" },
    listing_id: "l4",
    listing_title: "2021 Mercedes-Benz C-Class",
    listing_image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=200&q=80",
    last_message: { content: "What's the mileage on this car?", sender_id: "u4", created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
    unread_count: 0,
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: "5",
    other_user: { id: "u5", full_name: "Vikram Singh", email: "vikram@example.com" },
    listing_id: "l5",
    listing_title: "2023 Hyundai Creta SX",
    listing_image: "https://images.unsplash.com/photo-1619682817481-e994891cd1f5?auto=format&fit=crop&w=200&q=80",
    last_message: { content: "I'm interested in buying this vehicle", sender_id: "u5", created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString() },
    unread_count: 0,
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
];

// Dummy messages for each conversation
const DUMMY_MESSAGES: Record<string, Array<{ id: string; content: string; sender_id: string; created_at: string }>> = {
  "1": [
    { id: "m1", content: "Hi, I'm interested in your Toyota Camry!", sender_id: "u1", created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString() },
    { id: "m2", content: "Hello! Yes, it's still available. Would you like to know more details?", sender_id: "me", created_at: new Date(Date.now() - 1000 * 60 * 55).toISOString() },
    { id: "m3", content: "Yes please! What's the current mileage?", sender_id: "u1", created_at: new Date(Date.now() - 1000 * 60 * 50).toISOString() },
    { id: "m4", content: "The car has only 12,000 km. It's in excellent condition with full service history.", sender_id: "me", created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString() },
    { id: "m5", content: "That sounds great! Is the price negotiable?", sender_id: "u1", created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
  ],
  "2": [
    { id: "m1", content: "Hello! I saw your Honda Civic listing", sender_id: "u2", created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString() },
    { id: "m2", content: "Hi! Yes, it's a great car. Are you interested?", sender_id: "me", created_at: new Date(Date.now() - 1000 * 60 * 110).toISOString() },
    { id: "m3", content: "Very much! Can I schedule a test drive for tomorrow?", sender_id: "u2", created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
  ],
  "3": [
    { id: "m1", content: "Is the BMW still available?", sender_id: "u3", created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString() },
    { id: "m2", content: "Yes! It's a 2023 model with premium package.", sender_id: "me", created_at: new Date(Date.now() - 1000 * 60 * 170).toISOString() },
    { id: "m3", content: "Thanks for the information!", sender_id: "me", created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString() },
  ],
};

type Conversation = typeof DUMMY_CONVERSATIONS[0];
type Message = { id: string; content: string; sender_id: string; created_at: string };

function ChatPageInner() {
  const [conversations] = useState(DUMMY_CONVERSATIONS);
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const unreadTotal = conversations.reduce((acc, c) => acc + c.unread_count, 0);

  const handleSelect = (conv: Conversation) => {
    setSelectedConv(conv);
    setMessages(DUMMY_MESSAGES[conv.id] || []);
  };

  const handleBack = () => {
    setSelectedConv(null);
    setMessages([]);
  };

  const handleSend = () => {
    if (!draft.trim() || !selectedConv) return;
    const newMsg: Message = {
      id: `m${Date.now()}`,
      content: draft.trim(),
      sender_id: "me",
      created_at: new Date().toISOString(),
    };
    setMessages([...messages, newMsg]);
    setDraft("");
  };

  const filteredConversations = searchQuery
    ? conversations.filter(c =>
        c.other_user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.listing_title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : conversations;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="flex h-[calc(100dvh-10rem)] rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-xl">
        {/* Sidebar */}
        <div className={`flex-shrink-0 w-full sm:w-72 md:w-80 border-r border-gray-200 flex flex-col bg-white ${
          selectedConv ? "hidden sm:flex" : "flex"
        }`}>
          {/* Sidebar header */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 shrink-0 bg-gradient-to-r from-[#9b111e] to-[#7b0d18]">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <MessageCircle className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-white text-[15px]">Messages</span>
            {unreadTotal > 0 && (
              <span className="ml-auto px-2.5 py-1 rounded-full bg-white text-[#9b111e] text-[10px] font-bold leading-none">
                {unreadTotal}
              </span>
            )}
          </div>

          {/* Search conversations */}
          <div className="px-3 py-3 border-b border-gray-100 shrink-0">
            <div className="flex items-center gap-2.5 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus-within:border-[#9b111e] focus-within:ring-2 focus-within:ring-[#9b111e]/10 transition-all">
              <Search className="h-4 w-4 text-gray-400 shrink-0" />
              <input
                type="text"
                placeholder="Search messages…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
              />
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-16 text-center px-6">
                <div className="w-14 h-14 rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center mb-4">
                  <MessageCircle className="h-6 w-6 text-gray-300" />
                </div>
                <p className="text-gray-700 text-sm font-semibold mb-1">No conversations yet</p>
                <p className="text-gray-400 text-xs leading-relaxed">Contact a seller from a listing to start chatting</p>
              </div>
            ) : (
              <ul>
                {filteredConversations.map((conv, i) => {
                  const isActive = selectedConv?.id === conv.id;
                  const hasUnread = conv.unread_count > 0;
                  const initials = conv.other_user.full_name.charAt(0).toUpperCase();

                  return (
                    <motion.li
                      key={conv.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <button
                        onClick={() => handleSelect(conv)}
                        className={`w-full flex items-start gap-3 px-4 py-3.5 transition-all text-left border-b border-gray-100/80 last:border-0 ${
                          isActive
                            ? "bg-red-50 border-l-2 border-l-[#9b111e]"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        {/* Avatar */}
                        <div className="relative shrink-0 mt-0.5">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-base shadow-sm ${
                            isActive ? "bg-[#9b111e] text-white" : "bg-gradient-to-br from-gray-200 to-gray-300 text-gray-600"
                          }`}>
                            {initials}
                          </div>
                          {hasUnread && (
                            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#9b111e] text-white text-[9px] font-black flex items-center justify-center shadow-sm border border-white leading-none">
                              {conv.unread_count > 9 ? "9+" : conv.unread_count}
                            </span>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline justify-between gap-1 mb-0.5">
                            <span className={`text-sm truncate ${
                              hasUnread ? "font-bold text-gray-900" : "font-semibold text-gray-700"
                            }`}>
                              {conv.other_user.full_name}
                            </span>
                            <span className="text-[10px] text-gray-400 shrink-0 font-medium">
                              {formatDistanceToNow(new Date(conv.updated_at), { addSuffix: false })}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#9b111e] truncate font-semibold mb-0.5">{conv.listing_title}</p>
                          {conv.last_message && (
                            <p className={`text-[12px] truncate ${
                              hasUnread ? "text-gray-700 font-medium" : "text-gray-400"
                            }`}>
                              {conv.last_message.sender_id === "me" && (
                                <span className="text-gray-400 mr-1">You:</span>
                              )}
                              {conv.last_message.content}
                            </p>
                          )}
                        </div>
                      </button>
                    </motion.li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        {/* Chat area */}
        <div className={`flex-1 min-w-0 ${!selectedConv ? "hidden sm:flex" : "flex"} flex-col`}>
          {selectedConv ? (
            <div className="flex flex-col h-full bg-gray-50/50">
              {/* Header */}
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-200 bg-white shrink-0 shadow-sm">
                {handleBack && (
                  <button
                    onClick={handleBack}
                    className="sm:hidden text-gray-400 hover:text-gray-700 transition-colors p-1.5 rounded-xl hover:bg-gray-100 -ml-1"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                )}

                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#9b111e] to-[#7b0d18] flex items-center justify-center shrink-0 shadow-sm">
                  <span className="font-bold text-sm text-white">
                    {selectedConv.other_user.full_name.charAt(0).toUpperCase()}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-gray-900 truncate">{selectedConv.other_user.full_name}</p>
                  <p className="text-xs text-[#9b111e] truncate font-medium">{selectedConv.listing_title}</p>
                </div>

                <div className="flex items-center gap-1">
                  <button className="p-2 rounded-xl text-gray-400 hover:text-[#9b111e] hover:bg-red-50 transition-colors">
                    <Phone className="h-4 w-4" />
                  </button>
                  <button className="p-2 rounded-xl text-gray-400 hover:text-[#9b111e] hover:bg-red-50 transition-colors">
                    <Video className="h-4 w-4" />
                  </button>
                  <button className="p-2 rounded-xl text-gray-400 hover:text-[#9b111e] hover:bg-red-50 transition-colors">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Vehicle preview banner */}
              <div className="shrink-0 bg-red-50 border-b border-red-100 px-4 py-2.5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center shrink-0 overflow-hidden">
                  {selectedConv.listing_image ? (
                    <img src={selectedConv.listing_image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[#9b111e] text-xs font-bold">🚗</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-[#9b111e] font-semibold uppercase tracking-wider">Chatting about</p>
                  <p className="text-sm font-bold text-[#7b0d18] truncate">{selectedConv.listing_title}</p>
                </div>
                <Link href={`/main/listings/${selectedConv.listing_id}`} className="text-xs text-[#9b111e] hover:text-[#7b0d18] font-semibold shrink-0 hover:underline">
                  View Listing →
                </Link>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-5 space-y-3 scroll-smooth">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center py-12">
                    <div className="w-16 h-16 rounded-2xl bg-white border border-gray-200 flex items-center justify-center mb-4 shadow-sm">
                      <MessageCircle className="h-7 w-7 text-gray-300" />
                    </div>
                    <p className="text-gray-600 text-sm font-semibold mb-1">No messages yet</p>
                    <p className="text-gray-400 text-xs">
                      Start the conversation about {selectedConv.listing_title}
                    </p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMine = msg.sender_id === "me";
                    return (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                      >
                        <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl ${
                          isMine
                            ? "bg-[#9b111e] text-white rounded-br-md"
                            : "bg-white border border-gray-200 text-gray-900 rounded-bl-md shadow-sm"
                        }`}>
                          <p className="text-sm leading-relaxed">{msg.content}</p>
                          <div className={`flex items-center justify-end gap-1 mt-1 ${isMine ? "text-white/60" : "text-gray-400"}`}>
                            <span className="text-[10px]">
                              {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {isMine && <CheckCheck className="w-3 h-3" />}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>

              {/* Input bar */}
              <div className="shrink-0 border-t border-gray-200 bg-white px-4 py-3.5">
                {/* Quick replies */}
                {messages.length === 0 && (
                  <div className="shrink-0 pb-3 flex gap-2 flex-wrap">
                    {["Is this still available?", "What's your best price?", "Can I test drive?"].map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => setDraft(q)}
                        className="text-xs bg-white border border-gray-200 hover:border-[#9b111e] hover:text-[#9b111e] text-gray-600 px-3 py-1.5 rounded-full transition-colors font-medium"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                )}
                <div className="flex items-end gap-2.5">
                  <textarea
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder="Type a message…"
                    rows={1}
                    className="flex-1 resize-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#9b111e] focus:ring-2 focus:ring-[#9b111e]/10 transition-all leading-relaxed max-h-[120px] overflow-y-auto"
                  />
                  <motion.button
                    onClick={handleSend}
                    disabled={!draft.trim()}
                    whileTap={{ scale: 0.90 }}
                    className="shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-[#9b111e] hover:bg-[#7b0d18] text-white shadow-lg shadow-red-500/25 hover:shadow-red-500/35"
                  >
                    <Send className="h-4 w-4" />
                  </motion.button>
                </div>
                <p className="text-[10px] text-gray-300 mt-2 text-center font-medium">
                  Messages are end-to-end encrypted · Press Enter to send
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-10 bg-gradient-to-br from-gray-50 to-white">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-red-50 to-red-100 border border-red-200 flex items-center justify-center mb-6 shadow-sm">
                <MessageCircle className="h-11 w-11 text-[#9b111e]" />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2 tracking-tight">Your messages</h3>
              <p className="text-sm text-gray-500 max-w-xs leading-relaxed mb-6">
                Select a conversation to start chatting, or contact a seller from any listing.
              </p>
              <Link
                href="/main/listings"
                className="px-6 py-2.5 bg-[#9b111e] text-white text-sm font-bold rounded-xl hover:bg-[#7b0d18] transition-colors shadow-lg shadow-red-500/20"
              >
                Browse Listings
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense>
      <ChatPageInner />
    </Suspense>
  );
}
