import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { Conversation, Message, User } from './types';
import { MessageBubble } from './MessageBubble';
import { Send, Paperclip, Image as ImageIcon, Smile, MoreVertical, MessageSquare, X, File as FileIcon, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import EmojiPicker from 'emoji-picker-react';

interface ChatWindowProps {
  conversation: Conversation | null;
  messages: Message[];
  currentUser: User;
  onSendMessage: (conversationId: string, content: string, attachments?: any[]) => void;
  onMarkAsRead: (messageId: string | string[]) => void;
  onDeleteMessage: (messageId: string) => void;
  allUsers: User[]; // to lookup sender details
  projects?: any[];
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ 
  conversation, messages, currentUser, onSendMessage, onMarkAsRead, onDeleteMessage, allUsers, projects = []
}) => {
  const [inputText, setInputText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [pendingAttachments, setPendingAttachments] = useState<File[]>([]);
  
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showParticipants, setShowParticipants] = useState(false);
  
  // Scroll and unread states
  const [isScrolledUp, setIsScrolledUp] = useState(false);
  const [unreadActiveChatCount, setUnreadActiveChatCount] = useState(0);
  const [initialUnreadMessageId, setInitialUnreadMessageId] = useState<string | null>(null);
  const [initialUnreadCount, setInitialUnreadCount] = useState<number>(0);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const lastConversationIdRef = useRef<string | null>(null);
  const lastMessagesLengthRef = useRef<number>(0);

  const handleScroll = () => {
    if (!messagesContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    const isUp = scrollHeight - scrollTop - clientHeight > 50;
    setIsScrolledUp(isUp);
    
    if (!isUp && unreadActiveChatCount > 0) {
      setUnreadActiveChatCount(0);
    }
  };

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
    setUnreadActiveChatCount(0);
  };

  useLayoutEffect(() => {
    if (!conversation) return;

    const isNewConversation = conversation.id !== lastConversationIdRef.current;
    const isNewMessage = messages.length > lastMessagesLengthRef.current;

    if (isNewConversation) {
      setUnreadActiveChatCount(0);
      const firstUnread = messages.find(msg => !msg.readBy.some(r => r.userId === currentUser.id) && msg.senderId !== currentUser.id);
      
      if (firstUnread) {
        setInitialUnreadMessageId(firstUnread.id);
        const el = document.getElementById(`msg-${firstUnread.id}`);
        if (el) el.scrollIntoView({ behavior: 'auto', block: 'center' });
      } else {
        setInitialUnreadMessageId(null);
        scrollToBottom('auto');
      }
    } else if (isNewMessage) {
      const latestMsg = messages[messages.length - 1];
      const isMyMessage = latestMsg?.senderId === currentUser.id;
      
      if (isMyMessage || !isScrolledUp) {
        // Use timeout here because smooth scrolling looks better if it happens slightly after DOM update
        setTimeout(() => scrollToBottom('smooth'), 50);
      } else {
        setUnreadActiveChatCount(prev => prev + 1);
      }
    }

    lastConversationIdRef.current = conversation.id;
    lastMessagesLengthRef.current = messages.length;
    
    // Mark messages as read
    messages.forEach(msg => {
      if (!msg.readBy.some(r => r.userId === currentUser.id)) {
        onMarkAsRead(msg.id);
      }
    });
  }, [messages, conversation, currentUser.id, onMarkAsRead, isScrolledUp]);

  if (!conversation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-white/30 h-full bg-[#0a0f1d] rounded-r-xl border border-amber-500/10 border-l-0">
        <MessageSquare size={48} className="mb-4 opacity-20" />
        <p className="font-medium" >Select a conversation</p>
      </div>
    );
  }

  const handleSend = () => {
    if (!inputText.trim() && pendingAttachments.length === 0) return;
    
    // Convert File objects to mock attachment structure
    const attachments = pendingAttachments.map(f => ({
      id: Math.random().toString(36).substr(2, 9),
      name: f.name,
      url: URL.createObjectURL(f),
      type: f.type.startsWith('image/') ? 'image' : 'document'
    }));

    onSendMessage(conversation.id, inputText.trim(), attachments);
    setInputText('');
    setPendingAttachments([]);
    setShowEmojiPicker(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setPendingAttachments(prev => {
        const combined = [...prev, ...newFiles];
        if (combined.length > 4) {
          toast.error('Maximum 4 files allowed at a time');
          return combined.slice(0, 4);
        }
        return combined;
      });
    }
    e.target.value = '';
  };

  const filteredMessages = messages.filter(m => {
    if (m.isDeleted && currentUser.role !== 'admin') return false;
    if (searchQuery && !m.content?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const getProjectName = () => {
    if (!conversation || conversation.type !== '1-ON-1' || currentUser.role !== 'admin') return null;
    const otherUserId = conversation.participants.find(id => id !== currentUser.id);
    if (!otherUserId) return null;
    const project = projects.find((p: any) => p.clientId === otherUserId);
    return project ? project.name : null;
  };

  const projectName = getProjectName();

  const getChatTitle = () => {
    if (!conversation) return '';
    if (conversation.type === '1-ON-1') {
      const otherUserId = conversation.participants.find(id => id !== currentUser.id);
      if (!otherUserId && currentUser.role === 'admin' && conversation.participants.length >= 2) {
        const p1 = allUsers.find(u => u.id === conversation.participants[0])?.name;
        const p2 = allUsers.find(u => u.id === conversation.participants[1])?.name;
        return `${p1} & ${p2}`;
      }
      
      const otherUser = allUsers.find(u => u.id === otherUserId);
      const otherName = otherUser?.name || 'Unknown User';

      if (currentUser.role === 'admin') {
        return projectName ? `${otherName} - ${projectName}` : otherName;
      }
      return otherName;
    }
    if (conversation.type === 'GROUP' && conversation.projectId) {
      const project = projects.find((p: any) => p.id === conversation.projectId);
      if (project) return project.name;
    }
    return conversation.title || 'Conversation';
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0a0f1d] border border-amber-500/10 border-l-0 overflow-hidden relative">
      {/* Header */}
      <div className="h-16 shrink-0 border-b border-amber-500/10 flex items-center justify-between px-6 bg-[#0f172a] relative z-20">
        <div className="flex flex-col">
          <h3 className="text-white font-medium text-sm tracking-wide" >
            {getChatTitle()}
          </h3>
          {projectName ? (
            <p className="text-amber-500/80 text-[10px] uppercase tracking-wider mt-0.5">
              {projectName}
            </p>
          ) : (
            <p className="text-white/40 text-[10px] uppercase tracking-wider mt-0.5">
              {conversation.type.replace('_', ' ')}
            </p>
          )}
        </div>
        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="text-white/40 hover:text-white transition-colors p-1"
          >
            <MoreVertical size={16} />
          </button>
          
          {showMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 top-full mt-2 w-48 bg-[#0f172a] border border-amber-500/20 rounded shadow-xl z-50 overflow-hidden">
                <button 
                  onClick={() => { setShowParticipants(true); setShowMenu(false); }}
                  className="w-full text-left px-4 py-2 text-sm text-white/80 hover:bg-white/5 hover:text-white transition-colors"
                >
                  View Participants
                </button>
                <button 
                  onClick={() => { setShowSearch(true); setShowMenu(false); }}
                  className="w-full text-left px-4 py-2 text-sm text-white/80 hover:bg-white/5 hover:text-white transition-colors border-t border-white/5"
                >
                  Search Messages
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Search Bar */}
      {showSearch && (
        <div className="bg-[#0f172a] border-b border-amber-500/10 p-2 flex items-center gap-2 relative z-10">
          <input 
            type="text" 
            placeholder="Search in this conversation..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="flex-1 bg-[#020617] border border-amber-500/20 text-white text-sm px-3 py-1.5 focus:outline-none focus:border-amber-500/50 transition-colors"
          />
          <button onClick={() => { setShowSearch(false); setSearchQuery(''); }} className="text-white/40 hover:text-white p-1">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Participants Modal */}
      {showParticipants && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowParticipants(false)} />
          <div className="bg-[#0f172a] border border-amber-500/20 rounded-lg shadow-2xl p-6 w-full max-w-sm relative z-10">
            <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
              <h3 className="text-white font-medium">Participants</h3>
              <button onClick={() => setShowParticipants(false)} className="text-white/40 hover:text-white">
                <X size={16} />
              </button>
            </div>
            <div className="space-y-3 max-h-64 overflow-y-auto estimator-scroll pr-2">
              {conversation.participants.map(pid => {
                const user = allUsers.find(u => u.id === pid);
                if (!user) return null;
                return (
                  <div key={pid} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold text-xs uppercase border border-amber-500/20">
                      {user.name.charAt(0)}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-white text-sm">{user.name}</span>
                      <span className="text-white/40 text-[10px] uppercase tracking-wider">{user.role}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div 
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-6 estimator-scroll relative"
      >
        <div className="flex flex-col justify-end min-h-full">
          {filteredMessages.length === 0 ? (
            <div className="text-center text-white/30 my-auto text-sm italic">
              No messages found.
            </div>
          ) : (
            filteredMessages.map(msg => (
              <React.Fragment key={msg.id}>
                {msg.id === initialUnreadMessageId && !searchQuery && (
                  <div className="flex items-center justify-center my-4">
                    <span className="bg-[#1e293b] text-[#f59e0b] text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-[#f59e0b]/20 shadow-lg">
                      {initialUnreadCount > 0 ? initialUnreadCount : 'Unread'} Messages
                    </span>
                  </div>
                )}
                <MessageBubble 
                  id={`msg-${msg.id}`}
                  message={msg} 
                  isMine={msg.senderId === currentUser.id} 
                  sender={allUsers.find(u => u.id === msg.senderId)}
                  onDelete={onDeleteMessage}
                />
              </React.Fragment>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Sticky Down Arrow */}
      {isScrolledUp && (
        <div className="absolute right-6 bottom-24 z-20">
          <button 
            onClick={() => scrollToBottom('smooth')}
            className="p-3 bg-[#1e293b] hover:bg-[#334155] rounded-full shadow-lg shadow-black/50 border border-white/10 text-white/80 hover:text-white transition-all group relative"
          >
            <ChevronDown size={20} className="group-hover:translate-y-0.5 transition-transform" />
            {unreadActiveChatCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#f59e0b] text-[#020617] text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md">
                {unreadActiveChatCount}
              </span>
            )}
          </button>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 bg-[#0f172a] border-t border-amber-500/10 relative">
        {showEmojiPicker && (
          <div className="absolute bottom-full right-4 mb-2 z-50 shadow-2xl">
            <EmojiPicker 
              theme={'dark' as any}
              onEmojiClick={(emojiData) => setInputText(prev => prev + emojiData.emoji)} 
            />
          </div>
        )}
        
        {/* Pending Attachments Preview */}
        {pendingAttachments.length > 0 && (
          <div className="flex gap-2 mb-3 overflow-x-auto pb-2 estimator-scroll">
            {pendingAttachments.map((file, i) => (
              <div key={i} className="flex items-center gap-2 bg-[#020617] border border-amber-500/20 px-3 py-1.5 rounded-lg shrink-0">
                {file.type.startsWith('image/') ? <ImageIcon size={14} className="text-[#f59e0b]" /> : <FileIcon size={14} className="text-[#f59e0b]" />}
                <span className="text-white/80 text-xs truncate max-w-[150px]">{file.name}</span>
                <button onClick={() => setPendingAttachments(p => p.filter((_, idx) => idx !== i))} className="text-white/40 hover:text-red-400 ml-1">
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-end gap-2 bg-[#020617] border border-amber-500/20 p-2 focus-within:border-amber-500/50 transition-colors">
          <input type="file" hidden ref={fileInputRef} onChange={handleFileSelect} multiple />
          <input type="file" hidden ref={imageInputRef} accept="image/*" onChange={handleFileSelect} multiple />
          
          <div className="flex gap-1 pb-1 px-1 text-white/40 shrink-0">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 hover:text-white hover:bg-white/5 transition-colors"
              title="Attach File"
            ><Paperclip size={18} /></button>
            <button 
              onClick={() => imageInputRef.current?.click()}
              className="p-1.5 hover:text-white hover:bg-white/5 transition-colors"
              title="Attach Image"
            ><ImageIcon size={18} /></button>
          </div>
          
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message... (Use @ to mention)"
            className="flex-1 bg-transparent border-none text-white text-sm focus:outline-none resize-none min-h-[40px] max-h-[120px] py-2.5 estimator-scroll"
            rows={1}
            
          />

          <div className="flex gap-1 pb-1 pl-1 shrink-0">
            <button 
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className={`p-1.5 hover:bg-white/5 transition-colors mr-1 ${showEmojiPicker ? 'text-[#f59e0b]' : 'text-white/40 hover:text-white'}`}
              title="Emoji"
            ><Smile size={18} /></button>
            <button 
              onClick={handleSend}
              disabled={!inputText.trim() && pendingAttachments.length === 0}
              className="p-1.5 bg-[#f59e0b] text-[#020617] hover:bg-[#fbbf24] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


