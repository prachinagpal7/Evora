import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Protect, useAuth } from "@clerk/clerk-react";
import axios from "axios";
import toast from "react-hot-toast";
import CreationItem from "../components/CreationItem";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const PREVIEW_COUNT = 10;

// Full class names so Tailwind can see them. Assigned by rank (most used first).
const typeColors = [
  "bg-cyan-400",
  "bg-cyan-600",
  "bg-zinc-400",
  "bg-zinc-600",
  "bg-zinc-700",
  "bg-zinc-800",
];

const Dashboard = () => {
  const [creations, setCreations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const { getToken } = useAuth();

  const getDashboardData = async () => {
    try {
      const { data } = await axios.get("/api/user/get-user-creations", {
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

  // Runs once on mount: fetch creations, then render them
  useEffect(() => {
    getDashboardData();
  }, []);

  const typeCounts = creations.reduce((acc, c) => {
    acc[c.type] = (acc[c.type] || 0) + 1;
    return acc;
  }, {});
  const breakdown = Object.entries(typeCounts).sort((a, b) => b[1] - a[1]);

  const visible = showAll ? creations : creations.slice(0, PREVIEW_COUNT);

  return (
    <div className="h-full overflow-y-auto p-6 sm:p-8 text-zinc-100">
      <div className="max-w-5xl">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Your plan and everything you've generated.
        </p>

        {/* Usage */}
        <section className="mt-8">
          <div className="flex flex-wrap gap-x-12 gap-y-4">
            <div>
              <p className="font-mono text-xs text-zinc-500">plan</p>
              <p className="mt-1 text-2xl font-semibold">
                <Protect plan="premium" fallback="Free">
                  Premium
                </Protect>
              </p>
            </div>
            <div>
              <p className="font-mono text-xs text-zinc-500">creations</p>
              <p className="mt-1 text-2xl font-semibold">
                {loading ? "–" : creations.length}
              </p>
            </div>
          </div>

          {breakdown.length > 0 && (
            <div className="mt-6">
              <div
                className="flex h-1.5 w-full gap-px overflow-hidden rounded-sm bg-zinc-900"
                role="img"
                aria-label={breakdown.map(([t, n]) => `${t}: ${n}`).join(", ")}
              >
                {breakdown.map(([type, count], i) => (
                  <div
                    key={type}
                    className={typeColors[i % typeColors.length]}
                    style={{ width: `${(count / creations.length) * 100}%` }}
                  />
                ))}
              </div>
              <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs text-zinc-400">
                {breakdown.map(([type, count], i) => (
                  <li key={type} className="flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-sm ${
                        typeColors[i % typeColors.length]
                      }`}
                    />
                    {type}
                    <span className="text-zinc-100">{count}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* Recent creations */}
        <h2 className="mt-12 mb-3 text-lg font-semibold tracking-tight">
          Recent creations
        </h2>

        {loading ? (
          <div className="py-10 flex justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-zinc-600 border-t-transparent" />
          </div>
        ) : creations.length === 0 ? (
          <div className="border-y border-zinc-800 py-8">
            <p className="text-sm text-zinc-400">
              You haven't created anything yet.
            </p>
            <Link
              to="/ai/write-article"
              className="mt-4 inline-block rounded-md bg-cyan-400 px-3 py-1.5 text-sm font-medium text-zinc-950"
            >
              Write an article
            </Link>
          </div>
        ) : (
          <>
            <div className="border-y border-zinc-800 divide-y divide-zinc-800">
              {visible.map((item) => (
                <CreationItem key={item.id} item={item} />
              ))}
            </div>
            {creations.length > PREVIEW_COUNT && (
              <button
                type="button"
                onClick={() => setShowAll(!showAll)}
                className="mt-3 text-sm text-zinc-400 hover:text-zinc-100"
              >
                {showAll ? "Show fewer" : `Show all ${creations.length}`}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;


//rendering- First render → empty data... useEffect → fetch/update... second render → show data
