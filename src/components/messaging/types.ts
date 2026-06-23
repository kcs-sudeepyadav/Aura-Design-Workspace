export type Role = 'admin' | 'manager' | 'customer';

export interface User {
  id: string;
  name: string;
  role: Role;
  avatar?: string;
  email?: string;
}

export interface Attachment {
  id: string;
  name: string;
  type: 'image' | 'video' | 'pdf' | 'excel' | 'doc';
  url: string;
  size: string;
  metadata?: any;
}

export interface ReadReceipt {
  userId: string;
  timestamp: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  timestamp: string;
  isEdited?: boolean;
  isDeleted?: boolean;
  isPinned?: boolean;
  replyToId?: string; // ID of the message being replied to
  attachments?: Attachment[];
  mentions?: string[]; // User IDs mentioned
  readBy: ReadReceipt[]; // Array of users who have read the message
}

export type ConversationType = '1-ON-1' | 'GROUP' | 'ISSUE_THREAD' | 'CR_THREAD';

export interface Conversation {
  id: string;
  projectId: string;
  type: ConversationType;
  title?: string; // Optional title for group chats or threads
  participants: string[]; // User IDs allowed to view/send (Admins bypass this)
  linkedItemId?: string; // If this is a thread, the ID of the Issue or CR
  lastActivity: string;
}

export interface SiteUpdate {
  id: string;
  projectId: string;
  authorId: string;
  type: 'Daily' | 'Weekly' | 'Work Completed' | 'Delay' | 'Material Arrival' | 'Issue';
  content: string;
  timestamp: string;
  attachments?: Attachment[];
  linkedMessageId?: string; // The message ID in the group chat
}

export interface ChangeRequest {
  id: string;
  projectId: string;
  authorId: string;
  title: string;
  description: string;
  costImpact: string;
  timelineImpact: string;
  status: 'Open' | 'Under Review' | 'Approved' | 'Rejected' | 'Completed';
  timestamp: string;
  attachments?: Attachment[];
  linkedConversationId?: string; // The dedicated thread for this CR
}

export interface Issue {
  id: string;
  projectId: string;
  authorId: string;
  type: 'Delay' | 'Quality' | 'Material' | 'Budget' | 'Site' | 'Other';
  title: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  timestamp: string;
  attachments?: Attachment[];
  linkedConversationId?: string; // The dedicated thread for this issue
}

export interface ProjectData {
  id: string;
  name: string;
  clientName: string;
  clientId: string;
  managerId: string;
  phase: string;
  health: 'green' | 'amber' | 'red';
  startDate: string;
  endDate: string;
}

// Analytics and Notification Interfaces
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'message' | 'mention' | 'update' | 'cr' | 'issue' | 'approval';
  linkUrl?: string; // Where to navigate
  read: boolean;
  timestamp: string;
}
