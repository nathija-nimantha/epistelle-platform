"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import SideNavBar from "@/components/side-nav-bar";
import { useTheme } from "next-themes";

type Payment = {
  id: string;
  amount: number;
  status: string;
  created: number;
  currency: string;
};

const PaymntHistry = () => {
  const router = useRouter();
  const supabase = createClient();
  const { theme } = useTheme();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasPremium, setHasPremium] = useState(false);

  useEffect(() => {
    const fetchPaymntHistry = async () => {
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

        if (!userDetails?.is_premium) {
          router.push("/upgrade");
          return;
        }

        setHasPremium(userDetails.is_premium);

        const response = await fetch("/api/payment-history", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ customerId: user.id }),
        });

        const paymentData = await response.json();

        if (!response.ok) {
          throw new Error(paymentData.message || "Failed to fetch payment history");
        }

        setPayments(paymentData.payments || []);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || "Unable to fetch payment history.");
        setLoading(false);
      }
    };

    fetchPaymntHistry();
  }, [router, supabase]);

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
        <h1 className="text-3xl font-bold mb-6">Payment History</h1>

        {payments.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No payment history found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-gray-900 shadow-md rounded-lg">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    Payment ID
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    Currency
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    Created At
                  </th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                  >
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">
                      {payment.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      ${(payment.amount / 100).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {payment.currency.toUpperCase()}
                    </td>
                    <td
                      className={`px-6 py-4 text-sm font-semibold ${
                        payment.status === "succeeded"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {new Date(payment.created * 1000).toLocaleString()}
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

export default PaymntHistry;
