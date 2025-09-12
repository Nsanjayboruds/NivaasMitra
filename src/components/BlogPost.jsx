import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useMemo } from "react";
import NotFound from "./NotFound";
import { getBlogById, getBlogBySlug, listBlogs } from "../data/blogs";
import { ArrowLeft, Calendar, Clock, User, Share2 } from "lucide-react";
import "./BlogPost.css";

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);
  const post = getBlogById(id) || getBlogBySlug(id);
  const randomRelated = useMemo(() => {
    if (!post) return [];
    const candidates = listBlogs().filter(b => b.id !== post.id && b.complete !== false);
    // Shuffle array
    for (let i = candidates.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
    }
    return candidates.slice(0, 3); // show up to 3 random articles
  }, [post]);
  if (!post || post.complete === false) {
    return (
      <NotFound 
        title="Blog Post Not Found" 
        message={post && post.complete === false ? "This blog post is coming soon. Please check back later." : "The blog article you are trying to access doesn't exist or may have been removed."} 
        backLabel="Back to Home" 
        to="/" 
      />
    );
  }

  const handleShare = async () => {
    const shareUrl = `https://makaanwala.vercel.app/blog/${id}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      // Create a temporary notification
      const notification = document.createElement('div');
      notification.textContent = 'Link copied to clipboard!';
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #38a169;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-weight: 500;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transition: all 0.3s ease;
      `;
      document.body.appendChild(notification);
      
      // Remove notification after 3 seconds
      setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 300);
      }, 3000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="blog-post-page">
      <div className="container">
        <div className="blog-post-header">
          <button className="back-button" onClick={() => navigate('/')}>
            <ArrowLeft size={20} />
            Back to Home
          </button>
          
          <div className="post-category-badge">
            {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
          </div>
          
          <h1 className="post-title">{post.title}</h1>
          
          <div className="post-meta">
            <div className="meta-item">
              <User size={16} />
              <span>By {post.author}</span>
            </div>
            <div className="meta-item">
              <Calendar size={16} />
              <span>{new Date(post.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
            <div className="meta-item">
              <Clock size={16} />
              <span>{post.readTime}</span>
            </div>
          </div>
          
          <div className="post-actions">
            <button className="action-button" onClick={handleShare}>
              <Share2 size={18} />
              Share
            </button>
          </div>
        </div>

        <div className="blog-post-content">
          <div className="post-image">
            <img src={post.image} alt={post.title} />
          </div>
          
          <div className="post-excerpt">
            <p>{post.excerpt}</p>
          </div>
          
          <div 
            className="post-body"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>

        <div className="blog-post-footer">
          <div className="post-tags">
            <span className="tag">Real Estate</span>
            <span className="tag">{post.category}</span>
            <span className="tag">India</span>
          </div>
          
          <div className="author-bio">
            <div className="author-info">
              <h4>About {post.author}</h4>
              <p>
                An experienced real estate professional with over 10 years in the Indian property market. 
                Specializing in helping clients make informed decisions about their property investments.
              </p>
            </div>
          </div>
        </div>

        <div className="related-posts">
          <h3>Related Articles</h3>
          <div className="related-posts-grid">
            {randomRelated.map(relatedPost => (
              <div
                key={relatedPost.id}
                className="related-post-card"
                onClick={() => navigate(`/blog/${relatedPost.id}`)}
              >
                <img src={relatedPost.image} alt={relatedPost.title} />
                <div className="related-post-content">
                  <h4>{relatedPost.title}</h4>
                  <p>{relatedPost.excerpt}</p>
                  <div className="related-post-meta">
                    <span>{relatedPost.author}</span>
                    <span>{relatedPost.readTime}</span>
                  </div>
                </div>
              </div>
            ))}
            {randomRelated.length === 0 && (
              <p className="no-related">No other articles available yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
