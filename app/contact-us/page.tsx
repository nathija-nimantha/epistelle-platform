"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

const ContactUs = () => {
  const supabase = createClient();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const { name, email, message } = formData;

    if (!name || !email || !message) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.from("messages").insert([
        {
          name,
          email,
          message,
        },
      ]);

      if (error) {
        throw error;
      }

      setSuccess(true);
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      setError("Failed to send your message. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center mb-8">Contact Us</h1>
        <p className="text-center text-lg mb-8">
          Have questions or feedback? We'd love to hear from you. Please fill out the form below,
          and we'll get back to you as soon as possible.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">Message sent successfully!</p>}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Your Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1 p-3 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Your Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleInputChange}
              className="mt-1 p-3 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Your Message
            </label>
            <textarea
              id="message"
              rows={5}
              value={formData.message}
              onChange={handleInputChange}
              className="mt-1 p-3 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
              placeholder="Enter your message"
            ></textarea>
          </div>
          <button
            type="submit"
            className={`w-full py-3 px-6 ${
              loading ? "bg-blue-300" : "bg-blue-500"
            } text-white font-semibold rounded-md hover:bg-blue-600 transition`}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;
