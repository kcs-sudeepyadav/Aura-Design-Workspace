import React, { useState } from 'react';
import { Conversation, User, Message } from './types';
import { Users, User as UserIcon, AlertCircle, RefreshCw, Hash, Plus, X } from 'lucide-react';

interface ConversationListProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelect: (id: string) => void;
  currentUser: User;
  allUsers: User[];
  messages: Message[];
  projects?: any[];
  onCreateConversation?: (payload: any) => Promise<any>;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations, activeConversationId, onSelect, currentUser, allUsers, messages, projects = [], onCreateConversation
}) => {
  const [showNewChat, setShowNewChat] = useState(false);
  const [chatType, setChatType] = useState<'GROUP' | '1-ON-1'>('GROUP');
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedManager, setSelectedManager] = useState('');
  const getIcon = (type: string) => {
    switch (type) {
      case 'GROUP': return <Users size={16} />;
      case '1-ON-1': return <UserIcon size={16} />;
      case 'ISSUE_THREAD': return <AlertCircle size={16} className="text-red-400" />;
      case 'CR_THREAD': return <RefreshCw size={16} className="text-blue-400" />;
      default: return <Hash size={16} />;
    }
  };

  const getTitle = (c: Conversation) => {
    if (c.type === '1-ON-1') {
      const otherUserId = c.participants.find(id => id !== currentUser.id);
      if (!otherUserId && currentUser.role === 'admin' && c.participants.length >= 2) {
        // Admin viewing a 1-on-1 between two other people
        const p1 = allUsers.find(u => u.id === c.participants[0])?.name;
        const p2 = allUsers.find(u => u.id === c.participants[1])?.name;
        return `${p1} & ${p2}`;
      }
      
      const otherUser = allUsers.find(u => u.id === otherUserId);
      const otherName = otherUser?.name || 'Unknown User';

      if (currentUser.role === 'admin') {
        const project = projects.find((p: any) => p.clientId === otherUserId);
        const siteName = project ? project.name : '';
        return siteName ? `${otherName} - ${siteName}` : otherName;
      }
      return otherName;
    }
    return c.title || 'Conversation';
  };

  const getLastMessage = (convId: string) => {
    const convMsgs = messages.filter(m => m.conversationId === convId);
    if (convMsgs.length === 0) return null;
    return convMsgs[convMsgs.length - 1];
  };

  const getUnreadCount = (convId: string) => {
    const convMsgs = messages.filter(m => m.conversationId === convId);
    return convMsgs.filter(m => !m.readBy.some(r => r.userId === currentUser.id) && m.senderId !== currentUser.id).length;
  };

  const getProjectName = (conv: Conversation) => {
    if (conv.type !== '1-ON-1' || currentUser.role !== 'admin') return null;
    const otherUserId = conv.participants.find(id => id !== currentUser.id);
    if (!otherUserId) return null;
    const project = projects.find((p: any) => p.clientId === otherUserId);
    return project ? project.name : null;
  };

  const handleCreateChat = async () => {
    if (!onCreateConversation) return;
    if (chatType === 'GROUP' && (!selectedManager || !selectedClient || !selectedProject)) return;
    if (chatType === '1-ON-1' && !selectedClient) return;

    let payload: any = {};
    if (chatType === 'GROUP') {
      const proj = projects.find(p => p.id === selectedProject);
      payload = {
        type: 'GROUP',
        title: proj ? `${proj.name} Group` : 'Project Group',
        participants: [currentUser.id, selectedManager, selectedClient],
        projectId: selectedProject
      };
    } else {
      payload = {
        type: '1-ON-1',
        title: 'Direct Message',
        participants: [currentUser.id, selectedClient],
      };
    }

    try {
      const newConv = await onCreateConversation(payload);
      setShowNewChat(false);
      onSelect(newConv.id);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="w-80 h-full bg-[#0a0f1d] border border-amber-500/10 flex flex-col shrink-0 relative">
      <div className="h-16 shrink-0 border-b border-amber-500/10 flex items-center justify-between px-6 bg-[#0f172a]">
        <h2 className="text-white font-medium tracking-wide" >Messages</h2>
        {currentUser.role === 'admin' && (
          <button 
            onClick={() => setShowNewChat(true)}
            className="text-amber-500 hover:text-amber-400 p-1 bg-amber-500/10 hover:bg-amber-500/20 rounded transition-colors"
          >
            <Plus size={16} />
          </button>
        )}
      </div>

      {showNewChat && (
        <div className="absolute inset-x-0 top-16 z-50 bg-[#0f172a] border-b border-amber-500/20 p-4 shadow-2xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white font-medium text-sm">New Chat</h3>
            <button onClick={() => setShowNewChat(false)} className="text-white/40 hover:text-white">
              <X size={16} />
            </button>
          </div>
          
          <div className="flex gap-2 mb-4">
            <button 
              onClick={() => setChatType('GROUP')}
              className={`flex-1 py-1 text-xs border ${chatType === 'GROUP' ? 'border-amber-500 text-amber-500 bg-amber-500/10' : 'border-white/10 text-white/40'}`}
            >Group</button>
            <button 
              onClick={() => setChatType('1-ON-1')}
              className={`flex-1 py-1 text-xs border ${chatType === '1-ON-1' ? 'border-amber-500 text-amber-500 bg-amber-500/10' : 'border-white/10 text-white/40'}`}
            >Direct</button>
          </div>

          <div className="space-y-3 mb-4">
            {chatType === 'GROUP' && (
              <div>
                <label className="text-[10px] uppercase text-white/40 mb-1 block">Project</label>
                <select 
                  value={selectedProject} 
                  onChange={e => setSelectedProject(e.target.value)}
                  className="w-full bg-[#020617] border border-white/10 text-white text-xs p-2 focus:border-amber-500 outline-none"
                >
                  <option value="">Select Project</option>
                  {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
            )}
            
            {chatType === 'GROUP' && (
              <div>
                <label className="text-[10px] uppercase text-white/40 mb-1 block">Manager</label>
                <select 
                  value={selectedManager} 
                  onChange={e => setSelectedManager(e.target.value)}
                  className="w-full bg-[#020617] border border-white/10 text-white text-xs p-2 focus:border-amber-500 outline-none"
                >
                  <option value="">Select Manager</option>
                  {allUsers.filter(u => u.role === 'manager').map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
              </div>
            )}

            <div>
              <label className="text-[10px] uppercase text-white/40 mb-1 block">Client</label>
              <select 
                value={selectedClient} 
                onChange={e => setSelectedClient(e.target.value)}
                className="w-full bg-[#020617] border border-white/10 text-white text-xs p-2 focus:border-amber-500 outline-none"
              >
                <option value="">Select Client</option>
                {allUsers.filter(u => u.role === 'customer').map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
            </div>
          </div>

          <button 
            onClick={handleCreateChat}
            className="w-full bg-amber-500 text-[#020617] font-semibold text-xs py-2 uppercase tracking-wider hover:bg-amber-400"
          >
            Create Chat
          </button>
        </div>
      )}
      
      <div className="flex-1 overflow-y-auto estimator-scroll p-3 space-y-1">
        {conversations.map(conv => {
          const lastMsg = getLastMessage(conv.id);
          const unreadCount = getUnreadCount(conv.id);
          const isActive = activeConversationId === conv.id;
          const projectName = getProjectName(conv);

          return (
            <button
              key={conv.id}
              onClick={() => onSelect(conv.id)}
              className={`w-full text-left p-3 transition-colors flex gap-3 items-start ${
                isActive ? 'bg-[#f59e0b]/10 border border-[#f59e0b]/20' : 'hover:bg-white/5 border border-transparent'
              }`}
            >
              <div className={`mt-0.5 p-2 shrink-0 ${isActive ? 'bg-[#f59e0b] text-[#020617]' : 'bg-black/40 text-white/40'}`}>
                {getIcon(conv.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h4 className={`text-sm truncate font-medium ${isActive ? 'text-[#f59e0b]' : 'text-white/80'}`} >
                    {getTitle(conv)}
                  </h4>
                  {lastMsg && (
                    <span className="text-[10px] text-white/30 shrink-0 ml-2 mt-0.5">
                      {new Date(lastMsg.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  )}
                </div>
                {projectName && (
                  <p className="text-[10px] text-amber-500/80 truncate mb-1">
                    {projectName}
                  </p>
                )}
                <div className="flex justify-between items-center gap-2">
                  <p className="text-xs text-white/40 truncate flex-1">
                    {lastMsg ? lastMsg.content : 'No messages yet'}
                  </p>
                  {unreadCount > 0 && (
                    <span className="shrink-0 bg-[#f59e0b] text-[#020617] text-[10px] font-bold px-1.5 py-0.5">
                      {unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
