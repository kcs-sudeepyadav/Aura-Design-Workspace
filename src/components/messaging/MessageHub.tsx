import React, { useState, useMemo, useEffect } from 'react';
import { useMessagingEngine } from './useMessagingEngine';
import { ConversationList } from './ConversationList';
import { ChatWindow } from './ChatWindow';
import { User } from './types';

interface MessageHubProps {
  currentUser: User;
  allUsers: User[];
}

export const MessageHub: React.FC<MessageHubProps> = ({ currentUser, allUsers }) => {
  const { state, actions } = useMessagingEngine(currentUser);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser) return;
    if (!activeConversationId && state.visibleConversations.length > 0) {
      const unreadConv = state.visibleConversations.find(c => {
        const msgs = state.messages.filter(m => m.conversationId === c.id);
        return msgs.some(m => !m.readBy.some(r => r.userId === currentUser.id) && m.senderId !== currentUser.id);
      });
      if (unreadConv) {
        setActiveConversationId(unreadConv.id);
      } else {
        setActiveConversationId(state.visibleConversations[0].id);
      }
    }
  }, [state.visibleConversations, state.messages, activeConversationId, currentUser?.id]);

  // Derive the currently selected conversation and its messages
  const activeConversation = useMemo(() => 
    state.visibleConversations.find(c => c.id === activeConversationId) || null
  , [state.visibleConversations, activeConversationId]);

  const activeMessages = useMemo(() => 
    activeConversationId ? state.messages.filter(m => m.conversationId === activeConversationId) : []
  , [state.messages, activeConversationId]);

  if (!currentUser) {
    return <div className="flex items-center justify-center h-full w-full text-white/40 bg-[#020617]">Loading communications...</div>;
  }

  return (
    <div className="relative flex h-full w-full border border-amber-500/10 bg-[#020617] overflow-hidden">
      <ConversationList
        conversations={state.visibleConversations}
        activeConversationId={activeConversationId}
        onSelect={setActiveConversationId}
        currentUser={currentUser}
        allUsers={allUsers}
        messages={state.messages}
        projects={state.visibleProjects}
        onCreateConversation={actions.createConversation}
      />
      
      <ChatWindow
        conversation={activeConversation}
        messages={activeMessages}
        currentUser={currentUser}
        onSendMessage={actions.sendMessage}
        onMarkAsRead={actions.markAsRead}
        onDeleteMessage={actions.deleteMessage}
        allUsers={allUsers}
        projects={state.visibleProjects}
      />
    </div>
  );
};
