import React, { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { Heart } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const parsePrompt = (prompt) => {
  const match = prompt.match(/^Generate an image of (.*) in the style (.*)$/i);
  return match ? { subject: match[1], style: match[2] } : { subject: prompt, style: null };
};

const Community = () => {
  const [creations, setCreations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("latest");
  const { user } = useUser();
  const { getToken } = useAuth();

  const fetchCreations = async () => {
    try {
      const { data } = await axios.get("/api/user/get-published-creations", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      if (data.success) {
        setCreations(data.creations);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  const imageLikeToggle = async (id) => {
    try {
      const { data } = await axios.post(
        "/api/user/toggle-like-creations",
        { id },
        { headers: { Authorization: `Bearer ${await getToken()}` } },
      );
      if (data.success) {
        setCreations((prev) => prev.map((c) => c.id !== id ? c : { ...c, likes: c.likes.includes(user.id) ? c.likes.filter((uid) => uid !== user.id) : [...c.likes, user.id],},),);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (user) fetchCreations();
  }, [user?.id]);

  const sorted = sort === "liked" ? [...creations].sort((a, b) => b.likes.length - a.likes.length) : creations;

  return (
    <div className="h-full overflow-y-auto p-6 sm:p-8 text-zinc-100">
      <h1 className="text-2xl font-semibold tracking-tight">Community</h1>
      <p className="mt-1 text-sm text-zinc-400">
        {loading ? "Images published by Evora users." : `${creations.length} images published by Evora users.`}
      </p>

      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="h-5 w-5 rounded-full border-2 border-zinc-600 border-t-transparent animate-spin" />
        </div>
      ) : creations.length === 0 ? (
        <p className="mt-8 text-sm text-zinc-500">
          Nothing has been published yet.
        </p>
      ) : (
        <>
          <div className="mt-6 flex gap-4 border-b border-zinc-800 text-sm" role="group" aria-label="Sort">
            {[ ["latest", "Latest"], ["liked", "Most liked"],].map(([value, label]) => (
              <button key={value} type="button" aria-pressed={sort === value} onClick={() => setSort(value)}
                className={`-mb-px border-b-2 pb-2 ${ sort === value ? "border-cyan-400 text-zinc-100" : "border-transparent text-zinc-500 hover:text-zinc-100"}`}>
                {label}
              </button>
            ))}
          </div>

          <div className="mt-6 grid gap-x-4 gap-y-6 grid-cols-[repeat(auto-fill,minmax(14rem,1fr))]">
            {sorted.map((creation) => {
              const liked = creation.likes.includes(user.id);
              const { subject, style } = parsePrompt(creation.prompt);

              return (
                <figure key={creation.id} className="min-w-0">
                  <a
                    href={creation.content}
                    target="_blank"
                    rel="noreferrer"
                    className="block"
                  >
                    <img
                      src={creation.content}
                      alt={subject}
                      loading="lazy"
                      className="aspect-square w-full rounded-md border border-zinc-800 bg-zinc-900 object-cover"
                    />
                  </a>

                  <figcaption className="mt-2 flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p
                        title={subject}
                        className="truncate text-sm font-medium capitalize text-zinc-200"
                      >
                        {subject}
                      </p>

                      {style && (
                        <p
                          title={style}
                          className="mt-1 truncate font-mono text-[11px] text-zinc-500"
                        >
                          {style}
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => imageLikeToggle(creation.id)}
                      aria-pressed={liked}
                      aria-label={liked ? "Unlike" : "Like"}
                      className="flex shrink-0 items-center gap-1.5 text-zinc-500 hover:text-zinc-100"
                    >
                      <Heart
                        className={`h-4 w-4 ${
                          liked ? "fill-red-500 text-red-500" : ""
                        }`}
                      />
                      <span className="font-mono text-xs">
                        {creation.likes.length}
                      </span>
                    </button>
                  </figcaption>
                </figure>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default Community;


//this page shows a community gallary of images, each itmes displays image, shows prompt on hover, shows likes, highlights if you liked it

 {/*Overlay (hover behavior)
          This uses tailwind group and what group does is- parent classname contains group and child classname contains group:hover:block means qhen parent is hovered then child changes
          Hidden normally, appears on hover*/}