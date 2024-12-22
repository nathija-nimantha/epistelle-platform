"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import SideNavBar from "@/components/side-nav-bar";

const UpgradePage = () => {
  const router = useRouter();
  const supabase = createClient();
  const [hasPremium, setHasPremium] = useState(false);
  const [loading, setLoading] = useState(true);
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
          .select("is_premium")
          .eq("id", user.id)
          .single();

        if (error) throw error;

        setHasPremium(userDetails.is_premium);
        setLoading(false);
      } catch (err) {
        setError("Unable to fetch user details.");
        setLoading(false);
      }
    };

    fetchUser();
  }, [router, supabase]);

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
    <div className="bg-gray-100 dark:bg-gray-900">
      <SideNavBar hasPremium={hasPremium} />

      <div className="flex-grow p-6">
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Upgrade to Premium
          </h1>

          {hasPremium ? (
            <div className="text-center">
              <p className="text-lg text-green-600 dark:text-green-400 font-medium">
                You are already a Premium user! 🎉
              </p>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Enjoy exclusive features and a superior experience as a premium member.
              </p>
            </div>
          ) : (
            <>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
                As a Premium user, you’ll get access to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-6">
                <li>Exclusive features tailored for premium users</li>
                <li>Unlimited access to premium blogs</li>
                <li>Priority customer support</li>
                <li>Ad-free experience</li>
              </ul>

              <div className="bg-blue-100 dark:bg-blue-900 rounded-lg p-4 mb-6">
                <h2 className="text-2xl font-semibold text-blue-700 dark:text-blue-300 mb-2">
                  Ready to Upgrade?
                </h2>
                <p className="text-gray-700 dark:text-gray-300">
                  Enjoy premium benefits for only <span className="font-bold">$4.99/month</span>.
                  Click the button below to complete your payment and start enjoying premium features today!
                </p>
              </div>

              <div className="text-center">
                <a
                  href="https://buy.stripe.com/test_28ocP0dur8YIeQwcMM"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 transition"
                >
                  Upgrade to Premium
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpgradePage;
