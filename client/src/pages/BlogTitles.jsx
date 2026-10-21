import React, { useState } from "react";
import { Copy } from "lucide-react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import Markdown from "react-markdown";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const blogCategories = [
  "General",
  "Technology",
  "Health",
  "Travel",
  "Finance",
  "Education",
];

const BlogTitles = () => {
  const [selectedCategory, setSelectedCategory] = useState(blogCategories[0]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const prompt = `Generate blog title for the keyword ${input} in the category ${selectedCategory}.`;
      const { data } = await axios.post(
        "/api/ai/generate-blog-title",
        { prompt },
        { headers: { Authorization: `Bearer ${await getToken()}` } },
      );
      if (data.success) {
        setContent(data.content);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  const copyContent = async () => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success("Copied");
    } catch {
      toast.error("Couldn't copy to clipboard");
    }
  };

  return (
    <div className="h-full overflow-y-auto p-6 sm:p-8 text-zinc-100">
      <h1 className="text-2xl font-semibold tracking-tight">Blog Titles</h1>
      <p className="mt-1 text-sm text-zinc-400">
        Generate title ideas from a keyword and category.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[26rem_minmax(0,1fr)] items-start">
        {/* Input */}
        <form
          onSubmit={onSubmitHandler}
          className="border border-zinc-800 rounded-md bg-zinc-900/40 p-5"
        >
          <label htmlFor="keyword" className="block text-sm text-zinc-300">
            Keyword
          </label>
          <input
            id="keyword"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Artificial intelligence"
            required
            className="mt-2 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-cyan-400"
          />

          <p className="mt-5 text-sm text-zinc-300">Category</p>
          <div
            className="mt-2 flex flex-wrap gap-2"
            role="group"
            aria-label="Blog category"
          >
            {blogCategories.map((item) => {
              const active = selectedCategory === item;
              return (
                <button
                  type="button"
                  key={item}
                  aria-pressed={active}
                  onClick={() => setSelectedCategory(item)}
                  className={`rounded-md border px-3 py-1.5 text-sm ${
                    active
                      ? "border-cyan-400 bg-zinc-900 text-zinc-100"
                      : "border-zinc-800 text-zinc-400 hover:text-zinc-100"
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full flex items-center justify-center gap-2 rounded-md bg-cyan-400 px-4 py-2.5 text-sm font-medium text-zinc-950 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading && (
              <span className="h-4 w-4 rounded-full border-2 border-zinc-950 border-t-transparent animate-spin" />
            )}
            {loading ? "Generating…" : "Generate titles"}
          </button>
        </form>

        {/* Output */}
        <section className="flex flex-col min-h-96 max-h-[600px] border border-zinc-800 rounded-md bg-zinc-900/40">
          <header className="flex items-center justify-between border-b border-zinc-800 px-5 py-3">
            <h2 className="text-sm font-medium">Output</h2>
            {content && (
              <button
                type="button"
                onClick={copyContent}
                className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-100"
              >
                <Copy className="h-3.5 w-3.5" />
                Copy
              </button>
            )}
          </header>

          {!content ? (
            <div className="flex-1 flex items-center justify-center p-6">
              <p className="text-sm text-zinc-500 text-center">
                Enter a keyword and generate to see titles here.
              </p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-5 text-sm text-zinc-300 prose prose-invert max-w-none">
              <div className="reset-tw">
                <Markdown>{content}</Markdown>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default BlogTitles;
