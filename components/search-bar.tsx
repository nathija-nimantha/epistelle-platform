"use client";

interface SearchBarProps {
  searchQry: string;
  setSearchQry: (query: string) => void;
  filter: "all" | "public" | "private";
  setFilter: (filter: "all" | "public" | "private") => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchQry,
  setSearchQry,
  filter,
  setFilter,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-6">
      <input
        type="text"
        placeholder="Search blogs by title..."
        value={searchQry}
        onChange={(e) => setSearchQry(e.target.value)}
        className="flex-grow p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="flex space-x-2 mt-4 md:mt-0">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-md ${
            filter === "all"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 dark:bg-gray-700"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("public")}
          className={`px-4 py-2 rounded-md ${
            filter === "public"
              ? "bg-green-500 text-white"
              : "bg-gray-200 dark:bg-gray-700"
          }`}
        >
          Public
        </button>
        <button
          onClick={() => setFilter("private")}
          className={`px-4 py-2 rounded-md ${
            filter === "private"
              ? "bg-red-500 text-white"
              : "bg-gray-200 dark:bg-gray-700"
          }`}
        >
          Private
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
