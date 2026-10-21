import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const RemoveObject = () => {
  const [image, setImage] = useState(null);
  const [objectName, setObjectName] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    // Validate before setLoading so the button can't get stuck in loading
    const name = objectName.trim();
    if (name.split(/\s+/).length > 1) {
      toast.error("Enter a single object name.");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("image", image);
      formData.append("object", name);
      const { data } = await axios.post(
        "/api/ai/generate-image-object",
        formData,
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

  return (
    <div className="h-full overflow-y-auto p-6 sm:p-8 text-zinc-100">
      <h1 className="text-2xl font-semibold tracking-tight">Remove Object</h1>
      <p className="mt-1 text-sm text-zinc-400">
        Erase one object from an image.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[26rem_minmax(0,1fr)] items-start">
        {/* Input */}
        <form
          onSubmit={onSubmitHandler}
          className="border border-zinc-800 rounded-md bg-zinc-900/40 p-5"
        >
          <label htmlFor="image" className="block text-sm text-zinc-300">
            Image
          </label>
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            required
            className="mt-2 w-full rounded-md border border-zinc-800 bg-zinc-950 p-2 text-sm text-zinc-400 outline-none focus:border-cyan-400 file:mr-3 file:rounded file:border-0 file:bg-zinc-800 file:px-3 file:py-1.5 file:text-sm file:text-zinc-200"
          />

          <label htmlFor="object" className="mt-5 block text-sm text-zinc-300">
            Object to remove
          </label>
          <input
            id="object"
            type="text"
            value={objectName}
            onChange={(e) => setObjectName(e.target.value)}
            placeholder="watch"
            required
            className="mt-2 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-cyan-400"
          />
          <p className="mt-2 text-xs text-zinc-500">One object name only, e.g. watch or spoon.</p>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full flex items-center justify-center gap-2 rounded-md bg-cyan-400 px-4 py-2.5 text-sm font-medium text-zinc-950 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading && (
              <span className="h-4 w-4 rounded-full border-2 border-zinc-950 border-t-transparent animate-spin" />
            )}
            {loading ? "Processing…" : "Remove object"}
          </button>
        </form>

        {/* Output */}
        <section className="flex flex-col h-[600px] overflow-hidden border border-zinc-800 rounded-md bg-zinc-900/40">
          <header className="flex items-center justify-between border-b border-zinc-800 px-5 py-3">
            <h2 className="text-sm font-medium">Output</h2>
            {content && (
              <a
                href={content}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-zinc-400 hover:text-zinc-100"
              >
                Open in new tab
              </a>
            )}
          </header>

          {!content ? (
            <div className="flex-1 flex items-center justify-center p-6">
              <p className="text-sm text-zinc-500 text-center">
                Upload an image and name an object to see the result here.
              </p>
            </div>
          ) : (
            <div className="flex-1 min-h-0 p-5 flex items-center justify-center">
              <img
                src={content}
                alt="Image with object removed"
                className="max-h-full max-w-full object-contain rounded-md border border-zinc-800"
              />
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default RemoveObject;
