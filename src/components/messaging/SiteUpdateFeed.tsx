import React, { useState } from 'react';
import { SiteUpdate, User } from './types';
import { Camera, AlertTriangle, Package, CheckCircle, Clock } from 'lucide-react';

interface SiteUpdateFeedProps {
  updates: SiteUpdate[];
  currentUser: User;
  onPostUpdate: (projectId: string, update: Omit<SiteUpdate, 'id' | 'authorId' | 'timestamp'>) => void;
  activeProjectId: string;
}

export const SiteUpdateFeed: React.FC<SiteUpdateFeedProps> = ({ updates, currentUser, onPostUpdate, activeProjectId }) => {
  const [content, setContent] = useState('');
  const [type, setType] = useState<SiteUpdate['type']>('Daily');

  const getIcon = (updateType: string) => {
    switch (updateType) {
      case 'Issue': return <AlertTriangle className="text-red-400" size={18} />;
      case 'Delay': return <Clock className="text-[#f59e0b]" size={18} />;
      case 'Material Arrival': return <Package className="text-blue-400" size={18} />;
      case 'Work Completed': return <CheckCircle className="text-emerald-400" size={18} />;
      default: return <Camera className="text-white/60" size={18} />;
    }
  };

  const handlePost = () => {
    if (!content.trim()) return;
    onPostUpdate(activeProjectId, { type, content, projectId: activeProjectId });
    setContent('');
  };

  const projectUpdates = updates.filter(u => u.projectId === activeProjectId);

  return (
    <div className="flex flex-col h-full bg-[#0a0f1d] border border-amber-500/10 rounded-xl overflow-hidden">
      <div className="p-6 border-b border-amber-500/10 bg-[#0f172a]">
        <h2 className="text-white text-lg font-medium" >Site Updates Feed</h2>
        <p className="text-white/40 text-sm">Real-time progress, material arrivals, and issue logs.</p>
      </div>

      {currentUser.role !== 'customer' && (
        <div className="p-4 bg-[#020617] border-b border-amber-500/10 shrink-0">
          <div className="flex gap-3 mb-3">
            {(['Daily', 'Weekly', 'Work Completed', 'Material Arrival', 'Delay', 'Issue'] as const).map(t => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                  type === t ? 'bg-[#f59e0b] text-[#020617]' : 'bg-white/5 text-white/50 hover:bg-white/10'
                }`}
                
              >
                {t}
              </button>
            ))}
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Describe the update... (It will automatically cross-post to the project group chat)"
            className="w-full bg-[#0a0f1d] border border-amber-500/20 text-white rounded-lg p-3 text-sm focus:outline-none focus:border-[#f59e0b] min-h-[80px] resize-none estimator-scroll"
            
          />
          <div className="flex justify-end mt-2">
            <button 
              onClick={handlePost}
              disabled={!content.trim()}
              className="bg-[#f59e0b] text-[#020617] px-6 py-2 rounded font-semibold text-xs hover:bg-[#fbbf24] disabled:opacity-50 transition-colors"
              
            >
              Post Update
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto estimator-scroll p-6 space-y-6">
        {projectUpdates.length === 0 ? (
          <div className="text-center text-white/30 italic text-sm mt-10">No updates posted yet.</div>
        ) : (
          projectUpdates.map(update => (
            <div key={update.id} className="flex gap-4">
              <div className="shrink-0 w-10 h-10 rounded-full bg-black/40 border border-white/5 flex items-center justify-center">
                {getIcon(update.type)}
              </div>
              <div className="flex-1 bg-[#0f172a] border border-white/5 p-4 rounded-xl">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-[#f59e0b] text-xs font-semibold uppercase tracking-wider" >
                      {update.type}
                    </span>
                    <span className="text-white/40 text-[10px] ml-3">
                      {new Date(update.timestamp).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                    </span>
                  </div>
                </div>
                <p className="text-white/80 text-sm leading-relaxed" >
                  {update.content}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
