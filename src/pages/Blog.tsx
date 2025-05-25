
import { useState } from "react";
import { Link } from "react-router-dom";
import MainLayout from "@/components/layouts/main-layout";
import { SiteHeader } from "@/components/site-header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredBlogs = blogPosts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout>
      <SiteHeader />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
              Blog
            </h1>
            <p className="text-muted-foreground">
              Thoughts, ideas, and updates about web development
            </p>
          </div>
          
          <div className="relative">
            <Input
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md mx-auto glass-effect"
            />
          </div>
          
          <div className="grid gap-6">
            {filteredBlogs.map((post) => (
              <Card key={post.id} className="hover-lift card-shadow overflow-hidden">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-xl hover:text-primary transition-colors">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 text-sm">
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.readTime} min read</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{post.excerpt}</p>
                </CardContent>
                <CardFooter>
                  <Link 
                    to={`/blog/${post.slug}`} 
                    className="text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-2"
                  >
                    Read more
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </Link>
                </CardFooter>
              </Card>
            ))}
            
            {filteredBlogs.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No articles found matching your search.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

// Sample blog post data
const blogPosts = [
  {
    id: 1,
    title: "Getting Started with React Hooks",
    slug: "getting-started-with-react-hooks",
    date: "April 15, 2025",
    readTime: 5,
    excerpt: "Learn how to use React Hooks to build more maintainable and concise components."
  },
  {
    id: 2,
    title: "Building Responsive Layouts with CSS Grid",
    slug: "building-responsive-layouts-with-css-grid",
    date: "April 10, 2025",
    readTime: 7,
    excerpt: "A comprehensive guide to creating flexible and responsive layouts using CSS Grid."
  },
  {
    id: 3,
    title: "Introduction to TypeScript for JavaScript Developers",
    slug: "introduction-to-typescript-for-javascript-developers",
    date: "April 5, 2025",
    readTime: 8,
    excerpt: "Discover how TypeScript can improve your JavaScript code with static typing."
  },
  {
    id: 4,
    title: "Web Performance Optimization Techniques",
    slug: "web-performance-optimization-techniques",
    date: "March 28, 2025",
    readTime: 6,
    excerpt: "Practical strategies to improve the loading speed and performance of your web applications."
  },
];

export default Blog;
