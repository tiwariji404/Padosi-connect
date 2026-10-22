import React, { useState } from 'react';

export default function CityPulseView({ 
  posts, 
  user, 
  onLike, 
  onComment, 
  onOpenNewPost 
}) {
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);
  const [commentText, setCommentText] = useState('');

  const handleSendComment = (postId) => {
    if (!commentText.trim()) return;
    onComment(postId, user?.name || 'Resident', commentText.trim(), 'city');
    setCommentText('');
  };

  return (
    <div>
      <div className="page-header-row">
        <div>
          <h1 className="page-title">
            <span>🌆</span>
            <span>Raipur City Pulse</span>
          </h1>
          <p className="page-subtitle">
            Hyperlocal updates, traffic alerts, and neighborhood recommendations across Raipur
          </p>
        </div>

        <button className="btn-primary-action" onClick={onOpenNewPost}>
          <span>📢</span>
          <span>Broadcast to City</span>
        </button>
      </div>

      {/* Quick City Info Pills */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ background: 'rgba(6, 182, 212, 0.1)', border: '1px solid rgba(6, 182, 212, 0.3)', padding: '8px 14px', borderRadius: '12px', fontSize: '12px', color: '#67E8F9', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>🚦</span>
          <span>Traffic: Telibandha & VIP Road Heavy</span>
        </div>
        <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '8px 14px', borderRadius: '12px', fontSize: '12px', color: '#6EE7B7', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>🌦️</span>
          <span>Weather: 28°C Clear Sky</span>
        </div>
      </div>

      <div className="posts-stream">
        {posts.map((post) => {
          const isLiked = post.likes?.includes(user?.uid || 'u1');
          const showComments = activeCommentPostId === post.id;

          return (
            <article key={post.id} className="post-card">
              <div className="post-author-row">
                <div className="author-info">
                  <div className="author-avatar" style={{ background: 'linear-gradient(135deg, #0EA5E9, #3B82F6)' }}>
                    {post.initials || (post.author ? post.author.substring(0, 2).toUpperCase() : 'C')}
                  </div>
                  <div>
                    <div className="author-name">{post.author}</div>
                    <div className="post-timestamp">
                      {post.society ? `${post.society}, ` : ''}{post.city || 'Raipur'} • {typeof post.time === 'number' ? new Date(post.time).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recently'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="post-content-body">{post.content}</div>

              <div className="post-footer-actions">
                <button
                  className={`action-btn-pill ${isLiked ? 'liked' : ''}`}
                  onClick={() => onLike(post.id, user?.uid || 'u1', 'city')}
                >
                  <span>{isLiked ? '❤️' : '🤍'}</span>
                  <span>{post.likes?.length || 0} Likes</span>
                </button>

                <button
                  className="action-btn-pill"
                  onClick={() => setActiveCommentPostId(showComments ? null : post.id)}
                >
                  <span>💬</span>
                  <span>{post.comments?.length || 0} Comments</span>
                </button>
              </div>

              {showComments && (
                <div className="comments-container">
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#94A3B8' }}>
                    Replies ({post.comments?.length || 0})
                  </div>

                  {post.comments?.map((c) => (
                    <div key={c.id} className="comment-bubble">
                      <span className="comment-author">{c.author}:</span>
                      <span style={{ color: '#E2E8F0' }}>{c.text}</span>
                    </div>
                  ))}

                  <div className="comment-input-row">
                    <input
                      type="text"
                      className="comment-input-field"
                      placeholder="Reply to city post..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSendComment(post.id);
                      }}
                    />
                    <button
                      className="btn-primary-action"
                      style={{ padding: '6px 14px', fontSize: '13px' }}
                      onClick={() => handleSendComment(post.id)}
                    >
                      Reply
                    </button>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
