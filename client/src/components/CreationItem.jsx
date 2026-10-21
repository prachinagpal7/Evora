import React, { useState } from "react";
import Markdown from "react-markdown";
import { ChevronRight } from "lucide-react";

const CreationItem = ({ item }) => {
  // Click toggles the details: false -> true -> false ...
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        className="w-full flex items-center gap-4 py-3 text-left"
      >
        <ChevronRight
          className={`w-4 h-4 shrink-0 text-zinc-500 transition-transform duration-150 ${
            expanded ? "rotate-90" : ""
          }`}
        />
        <span className="w-28 shrink-0 font-mono text-xs text-zinc-500 truncate">
          {item.type}
        </span>
        <span className="flex-1 min-w-0 text-sm text-zinc-100 truncate">
          {item.prompt}
        </span>
        <span className="hidden sm:block shrink-0 font-mono text-xs text-zinc-500">
          {new Date(item.created_at).toLocaleDateString()}
        </span>
      </button>

      {expanded && (
        <div className="pb-4 pl-8">
          {item.type === "image" ? (
            <img
              src={item.content}
              alt={item.prompt}
              className="w-full max-w-md rounded-md border border-zinc-800"
            />
          ) : (
            <div className="max-h-96 overflow-y-auto text-sm text-zinc-300 prose prose-invert max-w-none">
              <div className="reset-tw">
                <Markdown>{item.content}</Markdown>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CreationItem;
