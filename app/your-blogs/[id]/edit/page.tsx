"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter, useParams } from "next/navigation";
import "quill/dist/quill.snow.css";
import { useTheme } from "next-themes";
import SideNavBar from "@/components/side-nav-bar";

const EditBlogPage = () => {
  const router = useRouter();
  const { id: blogId } = useParams();
  const supabase = createClient();
  const quillRef = useRef<any>(null);
  const quillContainerRef = useRef<HTMLDivElement | null>(null);
  const { theme } = useTheme();

  const [title, setTitle] = useState("");
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [hasPremium, setHasPremium] = useState(false);

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

        setTitle(data.title);
        setVisibility(data.visibility);
        setContent(data.content);
        setLoading(false);
        if (quillRef.current) {
          quillRef.current.root.innerHTML = data.content;
        }
      } catch (err) {
        setError("Unable to fetch blog details. Please try again later.");
        setLoading(false);
      }
    };

    const initQuill = async () => {
      const Quill = (await import("quill")).default;
      if (quillContainerRef.current) {
        quillRef.current = new Quill(quillContainerRef.current, {
          theme: "snow",
          placeholder: "Edit your blog content...",
        });
        quillRef.current.root.innerHTML = content;
      }
    };

    fetchBlog();
    initQuill();
  }, [blogId, router, supabase, content]);

  const handleUpdateBlog = async () => {
    const updatedContent = quillRef.current?.root.innerHTML;

    if (!title || !updatedContent || updatedContent === "<p><br></p>") {
      setError("All fields are required.");
      return;
    }

    try {
      const { error } = await supabase
        .from("blogs")
        .update({
          title,
          content: updatedContent,
          visibility,
        })
        .eq("id", blogId);

      if (error) throw error;

      alert("Blog updated successfully!");
      router.push(`/your-blogs/${blogId}`);
    } catch (err) {
      console.error(err);
      setError("An error occurred while updating the blog.");
    }
  };

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

  return (
    <div className={`${bgClass}`}>
      <SideNavBar hasPremium={hasPremium} />
      <div className="flex-grow p-6">
        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-6">Edit Blog</h1>

          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Blog Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter blog title"
              className="mt-1 p-2 w-full border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Visibility
            </label>
            <div className="flex space-x-4 mt-2">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="visibility"
                  value="public"
                  checked={visibility === "public"}
                  onChange={() => setVisibility("public")}
                  className="form-radio text-blue-500"
                />
                <span>Public</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="visibility"
                  value="private"
                  checked={visibility === "private"}
                  onChange={() => setVisibility("private")}
                  className="form-radio text-red-500"
                />
                <span>Private</span>
              </label>
            </div>
          </div>
          <div className="mb-6">
            <label
              htmlFor="quill-editor"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Blog Content
            </label>
            <div
              id="quill-editor"
              ref={quillContainerRef}
              className="mt-1 h-60 border rounded-md dark:bg-gray-800 dark:border-gray-700"
            ></div>
          </div>
          <button
            onClick={handleUpdateBlog}
            className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition"
          >
            Update Blog
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditBlogPage;
