"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import SideNavBar from "@/components/side-nav-bar";

type UserDetails = {
  name: string | null;
  email: string;
  is_premium: boolean;
};

const ProfilePage = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const supabase = createClient();
  const [user, setUser] = useState<UserDetails | null>(null);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.push("/sign-in");
          return;
        }

        const { data: userDetails, error } = await supabase
          .from("users")
          .select("name, email, is_premium")
          .eq("id", user.id)
          .single();

        if (error) throw error;

        setUser(userDetails);
        setNewName(userDetails.name || "");
        setLoading(false);
      } catch (err) {
        setError("Unable to fetch user details.");
        setLoading(false);
      }
    };

    fetchUser();
  }, [router, supabase]);

  const handleUpdateName = async () => {
    setSuccess(false);
    setError("");

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/sign-in");
        return;
      }

      const { error } = await supabase
        .from("users")
        .update({ name: newName })
        .eq("id", user.id);

      if (error) throw error;

      setUser((prevUser) =>
        prevUser ? { ...prevUser, name: newName } : null
      );
      setSuccess(true);
    } catch (err) {
      setError("Unable to update name. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        User not found.
      </div>
    );
  }

  const bgClass =
    theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-800";
  const inputClass =
    theme === "dark"
      ? "bg-gray-700 text-white border-gray-600"
      : "bg-white text-gray-800 border-gray-300";

  return (
    <div className={`${bgClass}`}>
      <SideNavBar hasPremium={user.is_premium} />

      <div className="w-full max-w-lg p-8 rounded-lg shadow-lg bg-white dark:bg-gray-900">
        <h1 className="text-3xl font-bold mb-6 text-center">Profile</h1>

        <div className="space-y-6">
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md shadow-md">
            <h2 className="text-xl font-semibold">Name</h2>
            <p className="text-gray-700 dark:text-gray-300 mt-2">
              {user.name || "N/A"}
            </p>
          </div>

          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md shadow-md">
            <h2 className="text-xl font-semibold">Email</h2>
            <p className="text-gray-700 dark:text-gray-300 mt-2">
              {user.email}
            </p>
          </div>

          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md shadow-md">
            <h2 className="text-xl font-semibold">Premium Status</h2>
            <p
              className={`mt-2 ${
                user.is_premium
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {user.is_premium ? "Premium User" : "Free User"}
            </p>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Edit Name</h2>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className={`w-full p-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputClass}`}
            placeholder="Enter your new name"
          />
          <button
            onClick={handleUpdateName}
            className="mt-4 w-full py-3 px-6 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition"
          >
            Update Name
          </button>
        </div>

        {success && (
          <p className="mt-4 text-green-500 text-center">
            Name updated successfully!
          </p>
        )}
        {error && (
          <p className="mt-4 text-red-500 text-center">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
