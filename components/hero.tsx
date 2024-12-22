import backgroundImage from "@/public/background.jpg";

export default function Hero() {
  return (
    <div
      className="relative w-full h-[70vh] flex flex-col items-center justify-center text-center text-white rounded-lg overflow-hidden"
      style={{
        backgroundImage: `url(${backgroundImage.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      <div className="relative z-10 px-6 max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight text-center">
          Welcome to{" "}
          <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text stroke-2 stroke-white">
            Epistelle
          </span>
        </h1>
        <p className="text-lg md:text-xl font-light mb-6">
          Discover insightful articles, stories from our amazing
          community of writers and readers.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <a
            href="/sign-in"
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-all"
          >
            Read Blogs
          </a>
        </div>
      </div>
    </div>
  );
}
