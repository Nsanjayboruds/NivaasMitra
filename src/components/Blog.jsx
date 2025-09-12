"use client";

import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { listFeaturedBlogs, listBlogsByCategory, listBlogs } from "../data/blogs";

import "./Blog.css";

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const navigate = useNavigate();
  const featuredPosts = useMemo(() => listFeaturedBlogs(), []);
  const filteredPosts = useMemo(() => listBlogsByCategory(selectedCategory), [selectedCategory]);
  const regularPosts = useMemo(() => {
    if (selectedCategory === 'all') {
      return listBlogs().filter(p => !p.featured);
    }
    return filteredPosts.filter(p => !p.featured);
  }, [filteredPosts, selectedCategory]);

  const categories = [
    { id: "all", label: "All Posts" },
    { id: "buying", label: "Buying" },
    { id: "selling", label: "Selling" },
    { id: "investment", label: "Investment" },
    { id: "market", label: "Market Trends" },
    { id: "financing", label: "Financing" },
  ];

  return (
    <section className="blog-section">
      <div className="container">
        <div className="section-header">
          <div className="section-badge">
            <span>📝</span>
            Real Estate Insights
          </div>
          <h2>Latest News & Insights</h2>
          <p>Stay informed with the latest trends, tips, and market analysis</p>
        </div>
        <div className="blog-categories">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`category-btn ${
                selectedCategory === category.id ? "active" : ""
              }`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.label}
            </button>
          ))}
        </div>
        {selectedCategory === "all" && (
          <div className="featured-posts">
            <h3>Featured Articles</h3>
            <div className="featured-grid">
              {featuredPosts.map((post) => (
                <article key={post.id} className="featured-post">
                  <div className="post-image">
                    <img
                      src={post.image || "/placeholder.svg"}
                      alt={post.title}
                    />
                    <div className="featured-badge">Featured</div>
                  </div>
                  <div className="post-content">
                    <div className="post-meta">
                      <span className="post-category">
                        {
                          categories.find((cat) => cat.id === post.category)
                            ?.label
                        }
                      </span>
                      <span className="post-date">
                        {new Date(post.date).toLocaleDateString()}
                      </span>
                    </div>
                    <h4>{post.title}</h4>
                    <p>{post.excerpt}</p>
                    <div className="post-footer">
                      <div className="author-info">
                        <span>By {post.author}</span>
                        <span className="read-time">{post.readTime}</span>
                      </div>
                      <button 
                        className="read-more-btn"
                        onClick={() => navigate(`/blog/${post.id}`)}
                      >
                        Read More
                      </button>
                    </div>

                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
        <div className="blog-posts">
          {selectedCategory !== "all" && <h3>Latest Posts</h3>}
          <div className="posts-grid">
            {(selectedCategory === "all" ? regularPosts : filteredPosts).map(
              (post) => (
                <article key={post.id} className="blog-post">
                  <div className="post-image">
                    <img
                      src={post.image || "/placeholder.svg"}
                      alt={post.title}
                    />
                  </div>
                  <div className="post-content">
                    <div className="post-meta">
                      <span className="post-category">
                        {
                          categories.find((cat) => cat.id === post.category)
                            ?.label
                        }
                      </span>
                      <span className="post-date">
                        {new Date(post.date).toLocaleDateString()}
                      </span>
                    </div>
                    <h4>{post.title}</h4>
                    <p>{post.excerpt}</p>
                    <div className="post-footer">
                      <div className="author-info">
                        <span>By {post.author}</span>
                        <span className="read-time">{post.readTime}</span>
                      </div>
                      <button 
                        className="read-more-btn"
                        onClick={() => navigate(`/blog/${post.id}`)}
                      >
                        Read More
                      </button>
                    </div>
                  </div>
                </article>
              )
            )}
          </div>
        </div>
        <div className="blog-cta">
          <h3>Want to Stay Updated?</h3>
          <p>
            Subscribe to our newsletter for the latest real estate insights and
            market updates.
          </p>
          <div className="newsletter-signup">
            <input id="newsletter-email" type="email" placeholder="Enter your email address" />
            <button
              className="btn btn-primary"
              onClick={() => {
                const email = document.getElementById('newsletter-email').value;
                if (email) {
                  alert('Thank you for subscribing to our newsletter!');
                } else {
                  alert('Please enter a valid email address.');
                }
              }}
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Blog;
