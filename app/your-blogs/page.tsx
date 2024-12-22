"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import SideNavBar from "@/components/side-nav-bar";
import { useTheme } from "next-themes";

type Blog = {
  id: string;
  title: string;
  content: string;
  visibility: "public" | "private";
  created_at: string;
};

const YourBlogs = () => {
  const router = useRouter();
  const supabase = createClient();
  const { theme } = useTheme();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQry, setSearchQry] = useState("");
  const [filter, setFilter] = useState<"all" | "public" | "private">("all");
  const [hasPremium, setHasPremium] = useState(false);

  useEffect(() => {
    const fetchUserAndBlogs = async () => {
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

        const { data: blogsData, error: blogsError } = await supabase
          .from("blogs")
          .select("*")
          .eq("user_id", user.id);

        if (blogsError) throw blogsError;

        setBlogs(blogsData || []);
        setFilteredBlogs(blogsData || []);
        setLoading(false);
      } catch (err) {
        setError("Unable to fetch blogs. Please try again later.");
        setLoading(false);
      }
    };

    fetchUserAndBlogs();
  }, [router, supabase]);

  useEffect(() => {
    let filtered = blogs;

    if (filter !== "all") {
      filtered = filtered.filter((blog) => blog.visibility === filter);
    }

    if (searchQry) {
      filtered = filtered.filter((blog) =>
        blog.title.toLowerCase().includes(searchQry.toLowerCase())
      );
    }

    setFilteredBlogs(filtered);
  }, [searchQry, filter, blogs]);

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

  const bgClass =
    theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-800";

  const canCreateBlog = hasPremium || blogs.length < 5;

  return (
    <div className={`${bgClass}`}>
      <SideNavBar hasPremium={hasPremium} />

      <div className="flex-grow p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Your Blogs</h1>
          {canCreateBlog && (
            <button
              onClick={() => router.push("/your-blogs/new")}
              className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition"
            >
              Create New Blog
            </button>
          )}
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-6">
          <input
            type="text"
            placeholder="Search blogs by title..."
            value={searchQry}
            onChange={(e) => setSearchQry(e.target.value)}
            className="flex-grow p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="flex space-x-2 mt-4 md:mt-0">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-md ${
                filter === "all"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 dark:bg-gray-700"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("public")}
              className={`px-4 py-2 rounded-md ${
                filter === "public"
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 dark:bg-gray-700"
              }`}
            >
              Public
            </button>
            <button
              onClick={() => setFilter("private")}
              className={`px-4 py-2 rounded-md ${
                filter === "private"
                  ? "bg-red-500 text-white"
                  : "bg-gray-200 dark:bg-gray-700"
              }`}
            >
              Private
            </button>
          </div>
        </div>

        {filteredBlogs.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No blogs found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-gray-900 shadow-md rounded-lg">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    Visibility
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    Created At
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredBlogs.map((blog) => (
                  <tr
                    key={blog.id}
                    className="hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                  >
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">
                      {blog.title}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          blog.visibility === "public"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                        }`}
                      >
                        {blog.visibility.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {new Date(blog.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => router.push(`/your-blogs/${blog.id}`)}
                          className="px-3 py-1 bg-blue-500 text-white rounded-md text-xs hover:bg-blue-600"
                        >
                          View
                        </button>
                        <button
                          onClick={() =>
                            router.push(`/your-blogs/${blog.id}/edit`)
                          }
                          className="px-3 py-1 bg-yellow-500 text-white rounded-md text-xs hover:bg-yellow-600"
                        >
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default YourBlogs;
