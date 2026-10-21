import React, { useState } from "react";
import { Copy } from "lucide-react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import Markdown from "react-markdown";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const articleLength = [
  { length: 800, label: "Short", range: "500–800 words" },
  { length: 1200, label: "Medium", range: "800–1200 words" },
  { length: 1600, label: "Long", range: "1200+ words" },
];

const WriteArticle = () => {
  const [selectedLength, setSelectedLength] = useState(articleLength[0]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const prompt = `Write an article about ${input} in ${selectedLength.label} (${selectedLength.range})`;
      const { data } = await axios.post(
        "/api/ai/generate-article",
        { prompt, length: selectedLength.length },
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

  const wordCount = content ? content.trim().split(/\s+/).length : 0;

  return (
    <div className="h-full overflow-y-auto p-6 sm:p-8 text-zinc-100">
      <h1 className="text-2xl font-semibold tracking-tight">Write Article</h1>
      <p className="mt-1 text-sm text-zinc-400">
        Generate a full article from a topic.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[26rem_minmax(0,1fr)] items-start">
        {/* Input */}
        <form
          onSubmit={onSubmitHandler}
          className="border border-zinc-800 rounded-md bg-zinc-900/40 p-5"
        >
          <label htmlFor="topic" className="block text-sm text-zinc-300">
            Topic
          </label>
          <input
            id="topic"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="The future of artificial intelligence"
            required
            className="mt-2 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-cyan-400"
          />

          <p className="mt-5 text-sm text-zinc-300">Length</p>
          <div className="mt-2 grid gap-2" role="group" aria-label="Article length">
            {articleLength.map((item) => {
              const active = selectedLength.length === item.length;
              return (
                <button
                  type="button"
                  key={item.length}
                  aria-pressed={active}
                  onClick={() => setSelectedLength(item)}
                  className={`flex items-center justify-between rounded-md border px-3 py-2 text-sm ${
                    active
                      ? "border-cyan-400 bg-zinc-900 text-zinc-100"
                      : "border-zinc-800 text-zinc-400 hover:text-zinc-100"
                  }`}
                >
                  <span>{item.label}</span>
                  <span className="font-mono text-xs text-zinc-500">
                    {item.range}
                  </span>
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
            {loading ? "Generating…" : "Generate article"}
          </button>
        </form>

        {/* Output */}
        <section className="flex flex-col min-h-96 max-h-[600px] border border-zinc-800 rounded-md bg-zinc-900/40">
          <header className="flex items-center justify-between border-b border-zinc-800 px-5 py-3">
            <h2 className="text-sm font-medium">Output</h2>
            {content && (
              <div className="flex items-center gap-4">
                <span className="font-mono text-xs text-zinc-500">
                  {wordCount} words
                </span>
                <button
                  type="button"
                  onClick={copyContent}
                  className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-100"
                >
                  <Copy className="h-3.5 w-3.5" />
                  Copy
                </button>
              </div>
            )}
          </header>

          {!content ? (
            <div className="flex-1 flex items-center justify-center p-6">
              <p className="text-sm text-zinc-500 text-center">
                Enter a topic and generate to see the article here.
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

export default WriteArticle;



