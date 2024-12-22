"use client";

const AboutUs = () => {
  return (
    <div className="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center mb-8">About Us</h1>
        <p className="text-lg leading-relaxed mb-8 text-justify">
          Welcome to our blog platform! We are dedicated to providing a space where people can
          share their thoughts, ideas, and stories with the world. Our mission is to empower
          individuals to express themselves and connect with like-minded people across the globe.
        </p>
        <p className="text-lg leading-relaxed mb-8 text-justify">
          Our platform is built with simplicity and inclusivity in mind, allowing both seasoned
          writers and beginners to easily publish their work. We believe that every voice matters
          and aim to create a welcoming environment for everyone to be heard.
        </p>
        <p className="text-lg leading-relaxed mb-8 text-justify">
          Thank you for being a part of our journey. Whether you're here to read, write, or
          engage in discussions, we're glad to have you with us. If you have any questions or
          feedback, feel free to <a href="/contact-us" className="text-blue-500 hover:underline">contact us</a>.
        </p>
        <div className="flex justify-center mt-6">
          <a
            href="/contact-us"
            className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
