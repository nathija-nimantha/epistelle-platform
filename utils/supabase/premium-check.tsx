"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

type PremiumCheckProps = {
  onCheck: (isPremium: boolean) => void;
};

const PremiumCheck: React.FC<PremiumCheckProps> = ({ onCheck }) => {
  const [isPremium, setIsPremium] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPremiumStatus = async () => {
      setLoading(true);
      setError(null);

      try {
        const supabase = createClient();

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          setError("User not logged in.");
          setLoading(false);
          return;
        }

        const { data: userDetails, error: userDetailsError } = await supabase
          .from("users")
          .select("is_premium")
          .eq("id", user.id)
          .single();

        if (userDetailsError) {
          setError(userDetailsError.message);
          setLoading(false);
          return;
        }

        const hasPremium = userDetails?.is_premium || false;

        setIsPremium(hasPremium);
        onCheck(hasPremium);
        setLoading(false);
      } catch (error) {
        setError("An unexpected error occurred.");
        setLoading(false);
      }
    };

    fetchPremiumStatus();
  }, [onCheck]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2 className="text-lg font-bold">
        {isPremium
          ? "You are a Premium User 🎉"
          : "You are not a Premium User 🚀"}
      </h2>
    </div>
  );
};

export default PremiumCheck;
