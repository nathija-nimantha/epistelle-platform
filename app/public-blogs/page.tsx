"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import SideNavBar from "@/components/side-nav-bar";

type Blog = {
  id: string;
  title: string;
  content: string;
  visibility: "public" | "private";
  created_at: string;
};

export default function PublicBlogs() {
  const supabase = createClient();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [hasPremium, setHasPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        window.location.href = "/sign-in";
        return;
      }

      const { data: blogs, error: blogsError } = await supabase
        .from("blogs")
        .select("*")
        .eq("visibility", "public");

      if (blogsError) {
        console.error("Error fetching blogs:", blogsError.message);
      } else {
        setBlogs(blogs || []);
      }

      const { data: userDetails, error: userDetailsError } = await supabase
        .from("users")
        .select("is_premium")
        .eq("id", session.user.id)
        .single();

      if (userDetailsError) {
        console.error("Error fetching user details:", userDetailsError.message);
      } else {
        setHasPremium(userDetails?.is_premium || false);
      }

      setLoading(false);
    };

    fetchBlogs();
  }, []);

  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex">
      <SideNavBar hasPremium={hasPremium} />

      <div className="flex-grow p-6">
        <h1 className="text-3xl font-bold mb-6">Public Blogs</h1>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search blogs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-700"
          />
        </div>

        {filteredBlogs.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No public blogs available.
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
                {filteredBlogs.map((blog: Blog) => (
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
                        <Link
                          href={`/public-blogs/${blog.id}`}
                          className="px-3 py-1 bg-blue-500 text-white rounded-md text-xs hover:bg-blue-600"
                        >
                          Read More
                        </Link>
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
}
