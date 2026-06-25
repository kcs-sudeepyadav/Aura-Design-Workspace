import { useState, useMemo, useCallback, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { 
  User, Conversation, Message, SiteUpdate, 
  ChangeRequest, Issue, ProjectData, Notification 
} from './types';
import { useApiData } from '../../hooks/useApiData';
import { toast } from 'sonner';

const API_BASE = 'http://localhost:3001/api';
let socket: Socket;

export const useMessagingEngine = (currentUser: User | null) => {
  const { data: initialConversations, createItem: createConvApi } = useApiData('conversations');
  const { data: initialMessages, createItem: createMessageApi } = useApiData('messages');
  const { data: initialProjects } = useApiData('projects');

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [siteUpdates, setSiteUpdates] = useState<SiteUpdate[]>([]);
  const [changeRequests, setChangeRequests] = useState<ChangeRequest[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [projects, setProjects] = useState<ProjectData[]>([]);

  useEffect(() => {
    if (!currentUser?.id) return;
    
    // Connect Socket (disabled for prototype to prevent console spam)
    socket = io('http://localhost:3001', { autoConnect: true });
    
    socket.emit('join_user', currentUser.id);

    socket.on('receive_message', (msg: Message) => {
      setMessages(prev => {
        // Prevent duplicate messages
        if (prev.some(m => m.id === msg.id)) return prev;
        

        
        return [...prev, msg];
      });
      
      setConversations(prev => prev.map(c => 
        c.id === msg.conversationId ? { ...c, lastActivity: msg.timestamp } : c
      ));
    });

    socket.on('message_read', ({ messageId, readBy }) => {
      setMessages(prev => prev.map(m => 
        m.id === messageId ? { ...m, readBy } : m
      ));
    });

    socket.on('message_deleted', ({ messageId }) => {
      setMessages(prev => prev.map(m => m.id === messageId ? { ...m, isDeleted: true } : m));
    });

    return () => {
      socket.disconnect();
    };
  }, [currentUser?.id]);

  useEffect(() => {
    if (initialConversations?.length > 0 && conversations.length === 0) setConversations(initialConversations);
  }, [initialConversations, conversations.length]);

  useEffect(() => {
    if (initialMessages?.length > 0 && messages.length === 0) setMessages(initialMessages);
  }, [initialMessages, messages.length]);

  useEffect(() => {
    if (initialProjects?.length > 0 && projects.length === 0) setProjects(initialProjects);
  }, [initialProjects, projects.length]);

  // RBAC Helpers
  const isAdmin = currentUser?.role === 'admin';
  const isManager = currentUser?.role === 'manager';
  const isClient = currentUser?.role === 'customer';

  // Visible Projects
  const visibleProjects = useMemo(() => {
    if (!currentUser) return [];
    if (isAdmin) return projects;
    if (isManager) return projects.filter(p => p.managerId === currentUser.id);
    return projects.filter(p => p.clientId === currentUser.id);
  }, [isAdmin, isManager, currentUser?.id, projects]);

  // Visible Conversations
  const visibleConversations = useMemo(() => {
    if (!currentUser) return [];
    return conversations.filter(c => {
      if (isAdmin) return true;
      
      // Bulletproof participants check
      if (!c.participants) return false;
      
      let parts: any = c.participants;
      if (typeof parts === 'string') {
        try { parts = JSON.parse(parts); } catch (e) {}
      }
      
      if (Array.isArray(parts)) {
        return parts.some((p: any) => {
          if (typeof p === 'string') return p.toLowerCase() === currentUser.id.toLowerCase();
          if (p && p.id) return String(p.id).toLowerCase() === currentUser.id.toLowerCase();
          if (p && p.userId) return String(p.userId).toLowerCase() === currentUser.id.toLowerCase();
          return false;
        });
      }
      
      if (typeof parts === 'string') {
        return parts.toLowerCase().includes(currentUser.id.toLowerCase());
      }
      
      return false;
    }).sort((a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime());
  }, [conversations, isAdmin, currentUser?.id]);

  // Actions
  const createConversation = useCallback(async (payload: Partial<Conversation>) => {
    try {
      const newConv = await createConvApi({
        type: payload.type || '1-ON-1',
        title: payload.title || '',
        participants: payload.participants || [],
        projectId: payload.projectId || '',
        lastActivity: new Date().toISOString()
      });
      setConversations(prev => [...prev, newConv]);
      return newConv;
    } catch (err) {
      console.error('Failed to create conversation:', err);
      throw err;
    }
  }, [createConvApi]);

  const sendMessage = useCallback(async (conversationId: string, content: string, attachments: any[] = []) => {
    if (!currentUser) return;

    const payload = {
      conversationId,
      content,
      senderId: currentUser.id,
      timestamp: new Date().toISOString(),
      readBy: [{ userId: currentUser.id, timestamp: new Date().toISOString() }],
      attachments
    };

    try {
      const newMsg = await createMessageApi(payload);
      
      let updatedMessages: Message[] = [];
      setMessages(prev => {
        if (prev.some(m => m.id === newMsg.id)) {
          updatedMessages = prev;
          return prev;
        }
        updatedMessages = [...prev, newMsg];
        return updatedMessages;
      });
      
      setConversations(prev => prev.map(c => 
        c.id === conversationId ? { ...c, lastActivity: newMsg.timestamp } : c
      ));

      window.dispatchEvent(new CustomEvent('aura-messages-updated', { detail: updatedMessages }));
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  }, [currentUser?.id, createMessageApi]);

  const markAsRead = useCallback(async (messageId: string) => {
    if (!currentUser) return;
    // Optimistic update
    setMessages(prev => prev.map(m => {
      if (m.id === messageId) {
        const isRead = m.readBy.some(r => r.userId === currentUser.id);
        if (!isRead) {
          return {
            ...m,
            readBy: [...m.readBy, { userId: currentUser.id, timestamp: new Date().toISOString() }]
          };
        }
      }
      return m;
    }));

    // Server update
    try {
      const token = localStorage.getItem('aura_token');
      if (token) {
        await fetch(`${API_BASE}/messages/${messageId}/read`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ userId: currentUser.id })
        });
      }
    } catch (err) {
      console.error('Failed to mark message as read:', err);
    }
  }, [currentUser?.id]);

  const deleteMessage = useCallback(async (messageId: string) => {
    // Optimistic update
    setMessages(prev => {
      const newMessages = prev.map(m => m.id === messageId ? { ...m, isDeleted: true } : m);
      // Persist to mock storage to prevent reappearing on reload during local testing
      if (localStorage.getItem('aura_mock_messages')) {
        localStorage.setItem('aura_mock_messages', JSON.stringify(newMessages));
      }
      return newMessages;
    });

    try {
      await fetch(`${API_BASE}/messages/${messageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('aura_token')}`
        }
      });
    } catch (err) {
      console.error('Failed to delete message:', err);
    }
  }, []);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('aura-messages-updated', { detail: messages }));
  }, [messages]);

  return {
    state: {
      visibleConversations,
      messages,
      siteUpdates,
      changeRequests,
      issues,
      notifications,
      visibleProjects
    },
    actions: {
      sendMessage,
      markAsRead,
      deleteMessage,
      createConversation,
      updateIssueStatus: async () => {}
    }
  };
};




