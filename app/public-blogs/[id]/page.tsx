"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter, useParams } from "next/navigation";
import { useTheme } from "next-themes";

type Blog = {
  id: string;
  title: string;
  content: string;
  visibility: "public" | "private";
  created_at: string;
  user_id: string;
};

type User = {
  email: string;
};

const BlogDetailsPage = () => {
  const router = useRouter();
  const { id: blogId } = useParams();
  const supabase = createClient();
  const { theme } = useTheme();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [authorEmail, setAuthorEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.push("/sign-in");
          return;
        }

        const { data: blogData, error: blogError } = await supabase
          .from("blogs")
          .select("*")
          .eq("id", blogId)
          .eq("visibility", "public")
          .single();

        if (blogError) throw blogError;

        setBlog(blogData);

        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("email")
          .eq("id", blogData.user_id)
          .single();

        if (userError) throw userError;

        setAuthorEmail(userData.email);
        setLoading(false);
      } catch (err) {
        setError("Unable to fetch blog details. Please try again later.");
        setLoading(false);
      }
    };

    fetchBlog();
  }, [blogId, router, supabase]);

  const bgClass =
    theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-800";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500 dark:text-gray-400">Blog not found.</p>
      </div>
    );
  }

  return (
    <div className={`${bgClass}`}>
      <div className="max-w-3xl mx-auto p-6">
        <button
          onClick={() => router.push("/public-blogs")}
          className="mb-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition"
        >
          Back to Blogs
        </button>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
          <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
            Created at: {new Date(blog.created_at).toLocaleString()}
          </p>
          {authorEmail && (
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
              Author: {authorEmail}
            </p>
          )}
          <div
            className="prose prose-lg dark:prose-dark text-gray-800 dark:text-gray-200"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>
      </div>
    </div>
  );
};

export default BlogDetailsPage;
