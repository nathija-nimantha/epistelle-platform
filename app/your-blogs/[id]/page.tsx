"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter, useParams } from "next/navigation";
import { useTheme } from "next-themes";
import SideNavBar from "@/components/side-nav-bar";

type Blog = {
  id: string;
  title: string;
  content: string;
  visibility: "public" | "private";
  created_at: string;
};

const BlogDetailsPage = () => {
  const router = useRouter();
  const { id: blogId } = useParams();
  const supabase = createClient();
  const { theme } = useTheme();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasPremium, setHasPremium] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.push("/sign-in");
          return;
        }

        const { data: userDetails, error: userDetailsError } = await supabase
          .from("users")
          .select("is_premium")
          .eq("id", user.id)
          .single();

        if (userDetailsError) throw userDetailsError;

        setHasPremium(userDetails.is_premium);

        const { data, error } = await supabase
          .from("blogs")
          .select("*")
          .eq("id", blogId)
          .eq("user_id", user.id)
          .single();

        if (error) throw error;

        setBlog(data);
        setLoading(false);
      } catch (err) {
        setError("Unable to fetch blog details. Please try again later.");
        setLoading(false);
      }
    };

    fetchUserData();
  }, [blogId, router, supabase]);

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this blog? This action cannot be undone."
    );

    if (!confirmDelete) return;

    try {
      const { error } = await supabase.from("blogs").delete().eq("id", blogId);

      if (error) {
        alert("Failed to delete the blog. Please try again.");
        return;
      }

      alert("Blog deleted successfully!");
      router.push("/your-blogs");
    } catch (err) {
      console.error(err);
      alert("An error occurred. Please try again.");
    }
  };

  const handleEdit = () => {
    router.push(`/your-blogs/${blogId}/edit`);
  };

  const bgClass =
    theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-800";

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className={`${bgClass}`}>
      <SideNavBar hasPremium={hasPremium} />
      <div className="flex-grow p-6">
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-4">{blog?.title}</h1>
          <p
            className={`text-sm mb-4 ${
              blog?.visibility === "public"
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            {blog?.visibility.toUpperCase()}
          </p>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Created at: {new Date(blog?.created_at || "").toLocaleString()}
          </p>
          <div
            className="prose dark:prose-dark leading-relaxed mb-6"
            dangerouslySetInnerHTML={{ __html: blog?.content || "" }}
          ></div>
          <div className="flex space-x-4">
            <button
              onClick={handleEdit}
              className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 transition"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailsPage;
