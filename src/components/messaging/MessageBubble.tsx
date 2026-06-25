import React, { useState } from 'react';
import { Message, User } from './types';
import { Check, CheckCheck, Trash2 } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
  isMine: boolean;
  sender?: User;
  id?: string;
  onDelete?: (id: string) => void;
  hideName?: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isMine, sender, id, onDelete, hideName }) => {
  const [fullscreenAttachment, setFullscreenAttachment] = useState<any | null>(null);
  const time = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  // A message is read if readBy has elements besides the sender
  const isRead = message.readBy.some(r => r.userId !== message.senderId);

  return (
    <div id={id} className={`flex w-full ${isMine ? 'justify-end' : 'justify-start'} mb-4 group/bubble`}>
      <div className={`flex flex-col max-w-[75%] ${isMine ? 'items-end' : 'items-start'}`}>
        {!isMine && sender && !hideName && (
          <span className="text-[10px] text-white/40 ml-1 mb-1 font-medium tracking-wide">
            {sender.name || 'User'}
          </span>
        )}
        
        <div className={`
          relative px-4 py-3 flex flex-col group/inner
          ${isMine 
            ? 'bg-[#475569] text-white rounded-[20px] rounded-tr-[4px] border border-[#64748b] shadow-md' 
            : 'bg-[#1e293b] text-white rounded-[20px] rounded-tl-[4px] border border-amber-500/10 shadow-md'}
          ${message.isDeleted ? 'opacity-50' : ''}
        `}>
          {message.isDeleted && (
            <span className="absolute -top-2 right-2 bg-red-500/20 text-red-400 border border-red-500/20 text-[9px] font-bold px-2 rounded-full uppercase tracking-wider backdrop-blur-sm z-10">
              Deleted
            </span>
          )}
          {isMine && onDelete && !message.isDeleted && (
            <button 
              onClick={() => onDelete(message.id)}
              className="absolute -left-8 top-1/2 -translate-y-1/2 text-red-500 opacity-0 group-hover/bubble:opacity-100 transition-opacity hover:scale-110 p-1"
              title="Delete message"
            >
              <Trash2 size={14} />
            </button>
          )}
          {message.content && (
            <p className="text-[14px] leading-relaxed break-words" >
              {message.content}
            </p>
          )}

          {/* Attachments */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-2 space-y-2">
              {message.attachments.map(att => (
                <div key={att.id}>
                  {att.type === 'image' ? (
                    <div className="relative inline-block group/img">
                      <img 
                        src={att.url} 
                        alt={att.name} 
                        onClick={() => setFullscreenAttachment(att)}
                        className="max-w-[250px] max-h-[200px] rounded-lg object-contain border border-black/10 cursor-pointer hover:opacity-90 transition-opacity" 
                      />
                      {(att.metadata?.simulatedEdits || []).map((edit: any, idx: number) => {
                        const top = edit.top || edit.y || `${20 + (idx * 20)}%`;
                        const left = edit.left || edit.x || `${20 + (idx * 20)}%`;
                        return (
                        <div 
                          key={idx} 
                          className="absolute w-5 h-5 -translate-x-1/2 -translate-y-1/2 bg-amber-500 rounded-full flex items-center justify-center cursor-help hover:scale-110 transition-transform shadow-lg shadow-black/50 group/spot z-20 hover:z-50"
                          style={{ top, left }}
                        >
                          <div className="w-1.5 h-1.5 bg-slate-900 rounded-full animate-pulse" />
                          
                          {/* Tooltip */}
                          <div className="absolute opacity-0 group-hover/spot:opacity-100 bottom-full mb-1.5 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded w-max max-w-[120px] text-center leading-tight pointer-events-none transition-opacity border border-white/10 z-30 shadow-xl">
                            {edit.label || 'Design Edit'}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-[3px] border-transparent border-t-slate-900" />
                          </div>
                        </div>
                      )})}
                    </div>
                  ) : (
                    <div 
                      onClick={() => window.open(att.url, '_blank')}
                      className={`flex items-center gap-2 p-2 rounded cursor-pointer hover:opacity-80 transition-opacity ${isMine ? 'bg-black/10' : 'bg-black/20'} text-xs`}
                    >
                      <span className="truncate max-w-[150px]">{att.name}</span>
                      <span className="opacity-50 text-[10px]">{att.size}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className={`flex items-center gap-1 mt-1 justify-end ${
            message.content || (message.attachments && message.attachments.some(a => a.type !== 'image'))
              ? (isMine ? 'text-white/50' : 'text-white/30')
              : 'text-white/60 drop-shadow-md absolute bottom-2 right-3'
          }`}>
            <span className="text-[9px] font-medium">{time}</span>
            {isMine && (
              isRead ? <CheckCheck size={12} className="text-blue-400" /> : <Check size={12} className="text-white/30" />
            )}
          </div>
        </div>
      </div>
      
      {fullscreenAttachment && (
        <div 
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-8 backdrop-blur-sm cursor-zoom-out"
          onClick={() => setFullscreenAttachment(null)}
        >
          <div className="relative inline-block max-w-[90vw] max-h-[90vh]">
            <img 
              src={fullscreenAttachment.url} 
              alt="Fullscreen Attachment" 
              className="max-w-full max-h-[90vh] object-contain drop-shadow-2xl rounded-sm pointer-events-none" 
            />
            {(fullscreenAttachment.metadata?.simulatedEdits || []).map((edit: any, idx: number) => {
              const top = edit.top || edit.y || `${20 + (idx * 20)}%`;
              const left = edit.left || edit.x || `${20 + (idx * 20)}%`;
              return (
              <div 
                key={idx} 
                className="absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2 bg-amber-500 rounded-full flex items-center justify-center cursor-help hover:scale-110 transition-transform shadow-lg shadow-black/50 group/spot z-20 pointer-events-auto"
                style={{ top, left }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="w-2.5 h-2.5 bg-slate-900 rounded-full animate-pulse" />
                
                {/* Tooltip */}
                <div className="absolute opacity-0 group-hover/spot:opacity-100 bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-sm px-3 py-1.5 rounded whitespace-nowrap pointer-events-none transition-opacity border border-white/10 z-30 shadow-xl">
                  {edit.label || 'Design Edit'}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-[4px] border-transparent border-t-slate-900" />
                </div>
              </div>
            )})}
          </div>
        </div>
      )}
    </div>
  );
};

