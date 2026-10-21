import React from "react";
import { useNavigate } from "react-router-dom";

// One row per layer of the app. Add your backend, database and AI provider here.
const sampleTitles = [
  "How Engineers Can Communicate Better With Non-Technical Teams",
  "7 Habits Engineers Use to Ship Faster",
  //"What Engineering Teams Get Wrong About Documentation",
];

const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="bg-zinc-950 text-zinc-100 px-4 sm:px-20 xl:px-32 pt-20 flex items-center">
      <div className="w-full grid lg:grid-cols-2 gap-12 lg:gap-20 items-center py-16">

        <div>
          <h1 className="text-xl sm:text-3xl font-semibold tracking-tight leading-[1.1]">
            An AI content workspace
          </h1>

          <p className="mt-6 max-w-md text-sm text-zinc-400 leading-relaxed">
            {/* Evora is a full stack app with authentication, a server API and AI models behind it. Sign in and start generating. */}
            Write articles and blog titles, generate images, remove backgrounds and objects, and get your resume reviewed. Sign in and start with any tool.
          </p>

          <button
            onClick={() => navigate("/ai")}
            className="mt-8 rounded-md bg-cyan-400 text-zinc-950 font-medium px-6 py-3 hover:bg-cyan-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 transition-colors"
          >
            Open workspace
          </button>
        </div>

        <div className="rounded-md border border-zinc-800 bg-zinc-900/50 text-sm overflow-hidden">
          <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-3">
            <span className="font-medium">Blog Titles</span>
            <span className="font-mono text-xs text-zinc-500">example</span>
          </div>

          <dl className="font-mono px-5 py-3 space-y-2 border-b border-zinc-800">
            <div className="flex gap-6">
              <dt className="w-20 shrink-0 text-zinc-500">keyword</dt>
              <dd className="text-zinc-200">Engineers</dd>
            </div>
            <div className="flex gap-6">
              <dt className="w-20 shrink-0 text-zinc-500">category</dt>
              <dd className="text-zinc-200">Technology</dd>
            </div>
          </dl>

          <ol className="px-5 py-4 space-y-3 text-zinc-300">
            {sampleTitles.map((title, i) => (
              <li key={title} className="flex gap-4">
                <span className="font-mono text-zinc-500">{i + 1}</span>
                <span>{title}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};
export default Hero;




      {/* Social proof */}
      {/* <div className="flex items-center gap-4 mt-10 mx-auto text-gray-400 relative z-10 hover:text-gray-300 transition-all duration-300 cursor-pointer group">
        <img src={assets.user_group} alt="" className="h-10 drop-shadow-lg group-hover:scale-110 transition-transform" />
        <div>
          <p className="font-semibold text-white group-hover:text-cyan-300 transition-colors">Trusted by 10K+ creators</p>
          <p className="text-sm text-gray-500 group-hover:text-gray-400 transition-colors">Join the creative revolution</p>
        </div>
      </div> */}