export const blogs = [
  {
    id: 1,
    slug: 'first-time-home-buyers-india-2024',
  complete: true,
    title: '10 Tips for First-Time Home Buyers in India 2024',
    excerpt: 'Navigate the Indian home buying process with confidence using these expert tips and strategies.',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    category: 'buying',
    author: 'Hank Schrader',
    date: '2024-01-15',
    readTime: '5 min read',
    featured: true,
    content: `
      <p>Buying your first home in India can be an overwhelming experience, but with the right knowledge and preparation, it can be one of the most rewarding investments you'll ever make. Here are 10 essential tips to help you navigate the process successfully.</p>
      <h3>1. Assess Your Financial Readiness</h3>
      <p>Before you start house hunting, it's crucial to understand your financial position. Calculate your monthly income, existing debts, and expenses to determine how much you can afford for a home loan EMI.</p>
      <h3>2. Get Pre-approved for a Home Loan</h3>
      <p>Getting pre-approved for a home loan gives you a clear picture of your budget and makes you a serious buyer.</p>
      <h3>3. Research the Location Thoroughly</h3>
      <p>Location is one of the most important factors in real estate.</p>
      <h3>4. Understand Legal Documentation</h3>
      <p>Ensure all legal documents are in order and verified by a professional.</p>
      <h3>5. Check for Hidden Costs</h3>
      <p>Budget for registration fees, stamp duty, legal fees, brokerage, and potential renovation expenses.</p>
      <h3>Conclusion</h3>
      <p>Buying your first home is a milestone. Preparation helps you make an informed decision you'll be happy with for years.</p>
    `
  },
  {
    id: 2,
    slug: 'india-real-estate-market-trends-2024',
  complete: true,
    title: 'Indian Real Estate Market Trends: What to Expect This Year',
    excerpt: 'Comprehensive analysis of current market conditions and predictions for the Indian real estate sector.',
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80',
    category: 'market',
    author: 'Marie Schrader',
    date: '2024-01-12',
    readTime: '8 min read',
    featured: true,
    content: `
      <p>The Indian real estate market is experiencing significant transformations in 2024.</p>
      <h3>Current Market Overview</h3>
      <p>The sector has shown resilience with infrastructure growth and housing demand.</p>
      <h3>Key Trends</h3>
      <ul><li>Affordable housing momentum</li><li>PropTech adoption</li><li>Sustainable development</li><li>Tier 2 & 3 city growth</li></ul>
      <h3>Investment Opportunities</h3>
      <p>Commercial real estate, warehousing, and data centers show strong potential.</p>
      <h3>Conclusion</h3>
      <p>Understanding market dynamics helps buyers and investors make better decisions.</p>
    `
  },
  {
    id: 3,
    slug: 'maximize-property-value-before-selling',
  complete: true,
    title: "Maximizing Your Property's Value Before Selling",
    excerpt: "Simple improvements and staging tips that can significantly increase your home's market value in India.",
    image: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=800&q=80',
    category: 'selling',
    author: 'Mike Ehrmantraut',
    date: '2024-01-10',
    readTime: '6 min read',
    featured: false,
    content: `
      <p>Maximizing property value starts with first impressions and strategic updates.</p>
      <h3>Staging Essentials</h3>
      <p>Declutter, enhance natural light, and highlight focal points.</p>
      <h3>Cost-Effective Upgrades</h3>
      <p>Lighting, hardware changes, and landscaping offer strong ROI.</p>
      <h3>Conclusion</h3>
      <p>Focus on presentation and minor improvements over costly renovations.</p>
    `
  },
  {
    id: 4,
    slug: 'investment-properties-beginner-guide-india',
    complete: false,
    title: 'Investment Properties: A Beginner\'s Guide for Indians',
    excerpt: 'Everything you need to know about getting started in Indian real estate investment.',
    image: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80',
    category: 'investment',
    author: 'Walter White Jr.',
    date: '2024-01-08',
    readTime: '10 min read',
    featured: false,
    content: ''
  },
  {
    id: 5,
    slug: 'understanding-home-loan-options-india',
    complete: false,
    title: 'Understanding Home Loan Options in India',
    excerpt: 'Compare different home loan types and find the best financing option for your situation.',
    image: 'https://images.unsplash.com/photo-1523289333742-be1143f6b766?auto=format&fit=crop&w=800&q=80',
    category: 'financing',
    author: 'Saul Goodman',
    date: '2024-01-05',
    readTime: '7 min read',
    featured: false,
    content: ''
  },
];

export const getBlogById = (id) => blogs.find(b => b.id === Number(id));
export const getBlogBySlug = (slug) => blogs.find(b => b.slug === slug);
export const listBlogs = () => blogs.slice();
export const listFeaturedBlogs = () => blogs.filter(b => b.featured);
export const listBlogsByCategory = (cat) => cat === 'all' ? blogs : blogs.filter(b => b.category === cat);
export const searchBlogs = (q) => {
  if (!q) return [];
  const query = q.toLowerCase();
  return blogs.filter(b =>
    b.title.toLowerCase().includes(query) ||
    b.excerpt.toLowerCase().includes(query) ||
    b.category.toLowerCase().includes(query) ||
    (b.content && b.content.toLowerCase().includes(query))
  );
};

export default blogs;