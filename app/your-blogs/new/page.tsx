"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import "quill/dist/quill.snow.css";
import SideNavBar from "@/components/side-nav-bar";
import { useTheme } from "next-themes";

const CreateBlog = () => {
  const router = useRouter();
  const supabase = createClient();
  const quillRef = useRef<any>(null);
  const { theme } = useTheme();

  const [title, setTitle] = useState("");
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [error, setError] = useState("");
  const [hasPremium, setHasPremium] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/sign-in");
        return;
      }

      const { data: userDetails, error } = await supabase
        .from("users")
        .select("is_premium")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error(error);
        return;
      }

      setHasPremium(userDetails.is_premium);
    };

    const initQuill = async () => {
      const Quill = (await import("quill")).default;

      quillRef.current = new Quill("#quill-editor", {
        theme: "snow",
        placeholder: "Write your blog content here...",
      });

      quillRef.current.root.innerHTML = "";
    };

    fetchUserDetails();
    initQuill();
  }, [router, supabase]);

  const handleCreateBlog = async () => {
    const bodyContent = quillRef.current?.root.innerHTML;

    if (!title || !bodyContent || bodyContent === "<p><br></p>") {
      setError("All fields are required.");
      return;
    }

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/sign-in");
        return;
      }

      const { error } = await supabase.from("blogs").insert([
        {
          title,
          content: bodyContent,
          visibility,
          user_id: user.id,
        },
      ]);

      if (error) throw error;

      alert("Blog created successfully!");
      router.push("/your-blogs");
    } catch (err) {
      console.error(err);
      setError("An error occurred while creating the blog.");
    }
  };

  const bgClass =
    theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-800";

  return (
    <div className={`${bgClass}`}>
      <SideNavBar hasPremium={hasPremium} />

      <div className="flex-grow p-6">
        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-6">Create New Blog</h1>

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
              className="mt-1 h-60 border rounded-md dark:bg-gray-800 dark:border-gray-700"
            ></div>
          </div>

          <button
            onClick={handleCreateBlog}
            className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition"
          >
            Create Blog
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateBlog;
