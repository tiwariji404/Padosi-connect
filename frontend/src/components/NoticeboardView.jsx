import React, { useState } from 'react';

export default function NoticeboardView({ 
  posts, 
  user, 
  onLike, 
  onComment, 
  onOpenNewPost, 
  currentSociety 
}) {
  const [filter, setFilter] = useState('all');
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);
  const [commentText, setCommentText] = useState('');

  const filterTabs = [
    { id: 'all', label: 'All Updates' },
    { id: 'notices', label: '📢 Official Notices' },
    { id: 'carpool', label: '🚗 Carpooling' },
    { id: 'help', label: '🤝 Help & Queries' }
  ];

  const filteredPosts = posts.filter((p) => {
    if (filter === 'notices') return p.isPinned || p.content.includes('⚠️') || p.content.includes('📢');
    if (filter === 'carpool') return p.content.toLowerCase().includes('carpool') || p.content.toLowerCase().includes('ride');
    if (filter === 'help') return p.content.includes('?') || p.content.toLowerCase().includes('help') || p.content.toLowerCase().includes('need');
    return true;
  });

  const handleSendComment = (postId) => {
    if (!commentText.trim()) return;
    onComment(postId, user?.name || 'Resident', commentText.trim(), 'society');
    setCommentText('');
  };

  return (
    <div>
      {/* Header Row */}
      <div className="page-header-row">
        <div>
          <h1 className="page-title">
            <span>📢</span>
            <span>{currentSociety} Noticeboard</span>
          </h1>
          <p className="page-subtitle">
            Official circulars, maintenance schedules, and neighbor updates
          </p>
        </div>

        <button className="btn-primary-action" onClick={onOpenNewPost}>
          <span>✍️</span>
          <span>Post to Society</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs-row">
        {filterTabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${filter === tab.id ? 'active' : ''}`}
            onClick={() => setFilter(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Posts Stream */}
      <div className="posts-stream">
        {filteredPosts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px 20px', color: '#64748B' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>📭</div>
            <div style={{ fontSize: '16px', fontWeight: '600' }}>No updates matching this filter</div>
            <p style={{ fontSize: '13px', marginTop: '4px' }}>Be the first neighbor to post!</p>
          </div>
        ) : (
          filteredPosts.map((post) => {
            const isLiked = post.likes?.includes(user?.uid || 'u1');
            const showComments = activeCommentPostId === post.id;

            return (
              <article key={post.id} className={`post-card ${post.isPinned ? 'pinned' : ''}`}>
                {post.isPinned && (
                  <div className="pinned-badge">
                    <span>📌</span>
                    <span>Official Announcement</span>
                  </div>
                )}

                <div className="post-author-row">
                  <div className="author-info">
                    <div className="author-avatar">
                      {post.initials || (post.author ? post.author.substring(0, 2).toUpperCase() : 'R')}
                    </div>
                    <div>
                      <div className="author-name">{post.author}</div>
                      <div className="post-timestamp">
                        {post.society || currentSociety} • {typeof post.time === 'number' ? new Date(post.time).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recently'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="post-content-body">{post.content}</div>

                {/* Footer Actions */}
                <div className="post-footer-actions">
                  <button
                    className={`action-btn-pill ${isLiked ? 'liked' : ''}`}
                    onClick={() => onLike(post.id, user?.uid || 'u1', 'society')}
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

                  <button 
                    className="action-btn-pill"
                    onClick={() => {
                      if (navigator.clipboard) {
                        navigator.clipboard.writeText(post.content);
                        alert('Copied post to clipboard!');
                      }
                    }}
                  >
                    <span>🔗</span>
                    <span>Share</span>
                  </button>
                </div>

                {/* Comments Section */}
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
                        placeholder="Write a helpful neighborly reply..."
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
          })
        )}
      </div>
    </div>
  );
}
